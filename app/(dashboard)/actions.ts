"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ACTIVE_CHILD_COOKIE } from "@/lib/children/active-child";
import { requireAppUser } from "@/lib/auth/require-app-user";
import {
  validateActivityExecutionInput,
  validateChildProfileInput,
  validateDiaryEntryInput,
} from "@/lib/validation/family-data";

export type FamilyActionResult = { ok: true } | { ok: false; message: string };

const RECOMMENDATION_EVENT_TYPES = ["impression", "open", "swap", "start", "complete", "more_like_this", "less_like_this"] as const;
const RECOMMENDATION_CONTEXTS = ["quick", "move", "calm", "no_materials", "outside", "tired_adult"] as const;
const RECOMMENDATION_SWAP_REASONS = ["no_time", "no_materials", "wrong_mood", "already_did", "just_browsing"] as const;

export type RecommendationEventInput = {
  childId: string;
  activityId: string;
  type: (typeof RECOMMENDATION_EVENT_TYPES)[number];
  context?: (typeof RECOMMENDATION_CONTEXTS)[number] | null;
  reason?: (typeof RECOMMENDATION_SWAP_REASONS)[number] | null;
  recommendationKey: string;
  ruleVersion: string;
  position: number;
};

async function setActiveChildCookie(childId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_CHILD_COOKIE, childId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function setActiveChild(formData: FormData) {
  const childId = formData.get("childId");
  if (typeof childId !== "string" || !childId) return;

  const { supabase, user } = await requireAppUser();
  const { data: child } = await supabase
    .from("criancas")
    .select("id")
    .eq("id", childId)
    .eq("usuario_id", user.id)
    .maybeSingle();

  if (!child) return;

  await setActiveChildCookie(child.id);

  revalidatePath("/", "layout");
}

export async function saveChildProfile(input: unknown): Promise<FamilyActionResult> {
  const parsed = validateChildProfileInput(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const { supabase, user } = await requireAppUser();
  const profile = parsed.data;

  if (profile.id) {
    const { data, error } = await supabase
      .from("criancas")
      .update({
        nome: profile.name,
        data_nascimento: profile.birthDate,
        genero: profile.gender,
        cor_favorita: profile.favoriteColor,
        interesses: profile.interests,
        avatar_id: profile.avatarId,
      })
      .eq("id", profile.id)
      .eq("usuario_id", user.id)
      .select("id")
      .maybeSingle();

    if (error || !data) return { ok: false, message: "Não foi possível atualizar esse perfil." };
    await setActiveChildCookie(data.id);
  } else {
    const { data, error } = await supabase.rpc("upsert_child_with_profile", {
      p_nome: profile.name,
      p_data_nascimento: profile.birthDate,
      p_genero: profile.gender,
      p_cor_favorita: profile.favoriteColor,
      p_interesses: profile.interests,
      p_avatar_id: profile.avatarId,
    });

    const childId =
      data && typeof data === "object" && !Array.isArray(data) && typeof data.child_id === "string"
        ? data.child_id
        : null;

    if (error || !childId) return { ok: false, message: "Não foi possível criar o perfil." };
    await setActiveChildCookie(childId);
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function createDiaryEntry(input: unknown, photo?: File): Promise<FamilyActionResult> {
  const parsed = validateDiaryEntryInput(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const { supabase, user } = await requireAppUser();
  const entry = parsed.data;
  const { data: child } = await supabase
    .from("criancas")
    .select("id")
    .eq("id", entry.childId)
    .eq("usuario_id", user.id)
    .maybeSingle();

  if (!child) return { ok: false, message: "Essa criança não pertence à sua família." };

  if (photo && (photo.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(photo.type))) {
    return { ok: false, message: "A foto deve ser JPG, PNG ou WebP e ter no máximo 5 MB." };
  }

  const { data: diaryEntry, error } = await supabase.from("diario_entradas").insert({
    usuario_id: user.id,
    crianca_id: child.id,
    titulo: entry.title || null,
    conteudo: entry.content,
    humor: entry.mood,
    tags: entry.tags,
    tipo_registro: entry.registrationType,
  }).select("id").single();

  if (error || !diaryEntry) return { ok: false, message: "Não foi possível guardar essa memória." };

  if (photo) {
    const extension = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const storagePath = `${user.id}/${child.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("brincareducando-diario-privado")
      .upload(storagePath, photo, { contentType: photo.type, upsert: false });

    if (uploadError) {
      await supabase.from("diario_entradas").delete().eq("id", diaryEntry.id).eq("usuario_id", user.id);
      return { ok: false, message: "A foto não pôde ser guardada com segurança." };
    }

    const { error: mediaError } = await supabase.from("diario_midias").insert({
      usuario_id: user.id,
      crianca_id: child.id,
      diario_entrada_id: diaryEntry.id,
      storage_path: storagePath,
      mime_type: photo.type,
      tamanho_bytes: photo.size,
    });
    if (mediaError) {
      await supabase.storage.from("brincareducando-diario-privado").remove([storagePath]);
      await supabase.from("diario_entradas").delete().eq("id", diaryEntry.id).eq("usuario_id", user.id);
      return { ok: false, message: "A foto não pôde ser vinculada à memória." };
    }
  }
  revalidatePath("/diario");
  revalidatePath("/jornada");
  return { ok: true };
}

export async function updateDiaryEntry(entryId: string, input: unknown): Promise<FamilyActionResult> {
  if (typeof entryId !== "string" || entryId.length !== 36) return { ok: false, message: "Memória inválida." };
  const parsed = validateDiaryEntryInput(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };
  const { supabase, user } = await requireAppUser();
  const entry = parsed.data;
  const { data, error } = await supabase.from("diario_entradas").update({
    titulo: entry.title || null,
    conteudo: entry.content,
    humor: entry.mood,
    tags: entry.tags,
    tipo_registro: entry.registrationType,
  }).eq("id", entryId).eq("usuario_id", user.id).eq("crianca_id", entry.childId).select("id").maybeSingle();
  if (error || !data) return { ok: false, message: "Não foi possível editar essa memória." };
  revalidatePath("/diario");
  revalidatePath("/jornada");
  return { ok: true };
}

export async function deleteDiaryEntry(entryId: string, childId: string): Promise<FamilyActionResult> {
  if (typeof entryId !== "string" || typeof childId !== "string") return { ok: false, message: "Memória inválida." };
  const { supabase, user } = await requireAppUser();
  const { data: media } = await supabase.from("diario_midias").select("storage_path").eq("diario_entrada_id", entryId).eq("usuario_id", user.id);
  const paths = (media ?? []).map((item) => item.storage_path);
  if (paths.length > 0) await supabase.storage.from("brincareducando-diario-privado").remove(paths);
  const { data, error } = await supabase.from("diario_entradas").delete().eq("id", entryId).eq("usuario_id", user.id).eq("crianca_id", childId).select("id").maybeSingle();
  if (error || !data) return { ok: false, message: "Não foi possível excluir essa memória." };
  revalidatePath("/diario");
  revalidatePath("/jornada");
  return { ok: true };
}

export async function deleteActivityExecution(executionId: string, childId: string): Promise<FamilyActionResult> {
  if (typeof executionId !== "string" || typeof childId !== "string") return { ok: false, message: "Registro inválido." };
  const { supabase, user } = await requireAppUser();
  const { data, error } = await supabase.from("atividades_execucoes").delete().eq("id", executionId).eq("usuario_id", user.id).eq("crianca_id", childId).select("id").maybeSingle();
  if (error || !data) return { ok: false, message: "Não foi possível excluir esse registro." };
  revalidatePath("/diario");
  revalidatePath("/jornada");
  return { ok: true };
}

export async function saveActivityExecution(input: unknown): Promise<FamilyActionResult> {
  const parsed = validateActivityExecutionInput(input);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const { supabase, user } = await requireAppUser();
  const execution = parsed.data;
  const [childResult, activityResult] = await Promise.all([
    supabase
      .from("criancas")
      .select("id")
      .eq("id", execution.childId)
      .eq("usuario_id", user.id)
      .maybeSingle(),
    supabase
      .from("atividades")
      .select("id, conteudo_versao")
      .eq("id", execution.activityId)
      .eq("publicado", true)
      .maybeSingle(),
  ]);

  if (!childResult.data) return { ok: false, message: "Essa criança não pertence à sua família." };
  if (!activityResult.data) return { ok: false, message: "Essa atividade não está disponível." };

  const { error } = await supabase.from("atividades_execucoes").insert({
    usuario_id: user.id,
    atividade_id: activityResult.data.id,
    crianca_id: childResult.data.id,
    avaliacao:
      execution.perception === "gostou"
        ? 5
        : execution.perception === "mais_ou_menos"
          ? 3
          : execution.perception === "nao_era_o_momento"
            ? 2
            : null,
    percepcao: execution.perception,
    observacoes_sinais: execution.observedSignals,
    motivo_encerramento: execution.endReason,
    atividade_versao: activityResult.data.conteudo_versao,
    recomendacao_chave: execution.recommendationKey,
    contexto_recomendacao: execution.recommendationContext,
    notas: execution.note || null,
    fotos_urls: [],
    duracao_minutos: execution.durationMinutes,
    data_conclusao: new Date().toISOString(),
  });

  if (error) return { ok: false, message: "Não foi possível guardar essa experiência." };

  if (execution.recommendationKey) {
    await supabase.from("recomendacoes_eventos").insert({
      usuario_id: user.id,
      crianca_id: childResult.data.id,
      atividade_id: activityResult.data.id,
      tipo: "complete",
      contexto: execution.recommendationContext,
      recomendacao_chave: execution.recommendationKey,
      regra_versao: execution.recommendationKey.split(":")[0] || "v1",
    });
  }
  revalidatePath("/diario");
  revalidatePath("/jornada");
  return { ok: true };
}

export async function recordRecommendationEvent(input: RecommendationEventInput): Promise<void> {
  if (
    !input ||
    typeof input.childId !== "string" ||
    typeof input.activityId !== "string" ||
    !RECOMMENDATION_EVENT_TYPES.includes(input.type) ||
    (input.context !== undefined && input.context !== null && !RECOMMENDATION_CONTEXTS.includes(input.context)) ||
    (input.reason !== undefined && input.reason !== null && !RECOMMENDATION_SWAP_REASONS.includes(input.reason)) ||
    typeof input.recommendationKey !== "string" ||
    input.recommendationKey.length < 3 ||
    input.recommendationKey.length > 160 ||
    typeof input.ruleVersion !== "string" ||
    input.ruleVersion.length > 20 ||
    !Number.isInteger(input.position) ||
    input.position < 0 ||
    input.position > 100
  ) {
    return;
  }

  const { supabase, user } = await requireAppUser();
  const { data: child } = await supabase
    .from("criancas")
    .select("id")
    .eq("id", input.childId)
    .eq("usuario_id", user.id)
    .maybeSingle();

  if (!child) return;

  const { error } = await supabase.from("recomendacoes_eventos").insert({
    usuario_id: user.id,
    crianca_id: child.id,
    atividade_id: input.activityId,
    tipo: input.type,
    contexto: input.context ?? null,
    motivo: input.reason ?? null,
    recomendacao_chave: input.recommendationKey,
    regra_versao: input.ruleVersion,
    posicao: input.position,
  });

  if (error) console.error("[Recommendations] Não foi possível registrar o evento:", error.code);
}

export async function saveStorySession(input: {
  childId: string;
  storyId: string;
  page: number;
  completed: boolean;
  note?: string;
  signals?: string[];
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!input || !/^[0-9a-f-]{36}$/i.test(input.childId) || !/^[0-9a-f-]{36}$/i.test(input.storyId) || !Number.isInteger(input.page) || input.page < 0 || input.page > 100) {
    return { ok: false, message: "Dados da leitura inválidos." };
  }
  const allowedSignals = new Set(["pediu_mais", "comentou", "apontou", "fez_pergunta", "preferiu_pausa", "outro"]);
  const signals = [...new Set((input.signals ?? []).filter((signal) => allowedSignals.has(signal)))].slice(0, 6);
  const { supabase, user } = await requireAppUser();
  const [childResult, storyResult] = await Promise.all([
    supabase.from("criancas").select("id").eq("id", input.childId).eq("usuario_id", user.id).maybeSingle(),
    supabase.from("historias").select("id, conteudo_versao").eq("id", input.storyId).eq("publicado", true).maybeSingle(),
  ]);
  if (!childResult.data || !storyResult.data) return { ok: false, message: "Essa leitura não está disponível." };
  const { data: existing } = await supabase.from("historias_sessoes").select("id").eq("crianca_id", input.childId).eq("historia_id", input.storyId).eq("concluida", false).order("atualizada_em", { ascending: false }).limit(1).maybeSingle();
  const payload = { pagina_atual: input.page, concluida: input.completed, nota_familiar: input.note?.trim().slice(0, 2000) || null, sinais_observados: signals, conteudo_versao: storyResult.data.conteudo_versao };
  const { error } = existing
    ? await supabase.from("historias_sessoes").update(payload).eq("id", existing.id)
    : await supabase.from("historias_sessoes").insert({ ...payload, usuario_id: user.id, crianca_id: input.childId, historia_id: input.storyId });
  if (error) return { ok: false, message: "Não foi possível guardar a leitura agora." };
  revalidatePath("/diario"); revalidatePath("/jornada"); revalidatePath("/historias");
  return { ok: true };
}
