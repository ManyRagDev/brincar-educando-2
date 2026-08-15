import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";
import {
  rankRecommendations,
  type MomentContext,
  type RankedRecommendation,
  type RecommendationCandidate,
  type RecommendationHistory,
} from "@/lib/journey/recommendation-engine";

type AppClient = SupabaseClient<Database, "brincareducando">;

export type ActivitySuggestion = RankedRecommendation;

import { repairMojibake, repairStringArray } from "@/lib/text/repair-mojibake";

function jsonStringArray(value: Json | null): string[] {
  if (!Array.isArray(value)) return [];
  return repairStringArray(value);
}

export async function getDashboardSuggestions(
  supabase: AppClient,
  input: {
    childId: string;
    childAgeMonths: number;
    interests: Json | null;
    context: MomentContext | null;
  },
) {
  const [activitiesResult, executionsResult, swapsResult] = await Promise.all([
    supabase
      .from("atividades")
      .select(
        "id, slug, titulo, descricao, imagem_url, energia, preparo_minutos, duracao_minutos, categoria, local, materiais, beneficios, habilidades, idade_min_meses, idade_max_meses",
      )
      .eq("publicado", true)
      .not("slug", "is", null)
      .order("codigo_externo", { ascending: true }),
    supabase
      .from("atividades_execucoes")
      .select("atividade_id, avaliacao, data_conclusao, created_at")
      .eq("crianca_id", input.childId)
      .order("data_conclusao", { ascending: false })
      .limit(50),
    supabase
      .from("recomendacoes_eventos")
      .select("atividade_id, tipo, motivo, created_at")
      .eq("crianca_id", input.childId)
      .in("tipo", ["swap", "more_like_this", "less_like_this"])
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  if (activitiesResult.error) {
    console.error("[Dashboard] Não foi possível carregar atividades publicadas:", activitiesResult.error);
    return { status: "error" as const, result: null };
  }

  const candidates = (activitiesResult.data ?? [])
    .filter((activity): activity is typeof activity & { slug: string } => typeof activity.slug === "string")
    .map<RecommendationCandidate>((activity) => ({
      id: activity.id,
      slug: activity.slug,
      titulo: repairMojibake(activity.titulo),
      descricao: repairMojibake(activity.descricao ?? ""),
      imagem_url: activity.imagem_url,
      energia: activity.energia ?? "media",
      preparo_minutos: activity.preparo_minutos ?? 0,
      duracao_minutos: activity.duracao_minutos ?? activity.preparo_minutos ?? 15,
      categoria: activity.categoria ?? "brincadeira",
      local: activity.local ?? "interno",
      materiais: repairStringArray(activity.materiais),
      beneficios: repairStringArray(activity.beneficios),
      habilidades: repairStringArray(activity.habilidades),
      idade_min_meses: activity.idade_min_meses ?? 0,
      idade_max_meses: activity.idade_max_meses ?? 72,
    }));

  const history: RecommendationHistory[] = [
    ...(executionsResult.data ?? []).map((entry) => ({
      activityId: entry.atividade_id,
      rating: entry.avaliacao,
      occurredAt: entry.data_conclusao ?? entry.created_at ?? new Date(0).toISOString(),
    })),
    ...(swapsResult.data ?? [])
      .filter((entry): entry is typeof entry & { atividade_id: string } => Boolean(entry.atividade_id))
      .map((entry) => ({
        activityId: entry.atividade_id,
        rating: entry.tipo === "more_like_this" ? 5 : entry.tipo === "less_like_this" ? 1 : null,
        occurredAt: entry.created_at,
        swapReason: entry.tipo === "swap" ? entry.motivo : null,
      })),
  ];

  const result = rankRecommendations({
    candidates,
    childId: input.childId,
    ageMonths: input.childAgeMonths,
    interests: jsonStringArray(input.interests),
    context: input.context,
    history,
  });

  return { status: result ? (history.length === 0 ? "first_visit" as const : "ready" as const) : "no_match" as const, result };
}
