export type ChildProfileInput = {
  id?: string;
  name: string;
  birthDate: string;
  gender: "menino" | "menina" | "nao_informado";
  favoriteColor: string;
  interests: string[];
  avatarId: string;
};

export type DiaryEntryInput = {
  childId: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[];
  registrationType: "livre" | "fala" | "descoberta" | "desafio" | "riso" | "foto";
};

export type ActivityExecutionInput = {
  activityId: string;
  childId: string;
  perception: "gostou" | "mais_ou_menos" | "nao_era_o_momento" | null;
  observedSignals: string[];
  endReason: "concluida" | "perdeu_interesse" | "adaptada" | "adulto_cansou" | "crianca_cansou" | "outro";
  note: string;
  durationMinutes: number;
  recommendationKey: string | null;
  recommendationContext: string | null;
};

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_GENDERS = new Set(["menino", "menina", "nao_informado"]);
const ALLOWED_COLORS = new Set(["rosa", "azul", "verde", "amarelo", "roxo", "laranja"]);
const ALLOWED_AVATARS = new Set(["boy", "girl", "star", "fox", "dino", "boy2"]);
const ALLOWED_PERCEPTIONS = new Set(["gostou", "mais_ou_menos", "nao_era_o_momento"]);
const ALLOWED_OBSERVED_SIGNALS = new Set(["movimento", "sons_palavras", "texturas", "imaginar", "fazer_junto", "outro"]);
const ALLOWED_END_REASONS = new Set(["concluida", "perdeu_interesse", "adaptada", "adulto_cansou", "crianca_cansou", "outro"]);
const ALLOWED_RECOMMENDATION_CONTEXTS = new Set(["quick", "move", "calm", "no_materials", "outside", "tired_adult"]);
const ALLOWED_DIARY_TYPES = new Set(["livre", "fala", "descoberta", "desafio", "riso", "foto"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isRealPastDate(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const today = new Date();
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getTime() <= today.getTime()
  );
}

export function validateChildProfileInput(value: unknown): ValidationResult<ChildProfileInput> {
  if (!isRecord(value)) return { ok: false, message: "Dados do perfil inválidos." };

  const id = cleanString(value.id, 36);
  const name = cleanString(value.name, 80);
  const birthDate = cleanString(value.birthDate, 10);
  const gender = cleanString(value.gender, 24);
  const favoriteColor = cleanString(value.favoriteColor, 24);
  const avatarId = cleanString(value.avatarId, 24);
  const interests = Array.isArray(value.interests)
    ? [...new Set(value.interests.map((item) => cleanString(item, 40)).filter(Boolean))].slice(0, 10)
    : [];

  if (id && !UUID_PATTERN.test(id)) return { ok: false, message: "Perfil inválido." };
  if (name.length < 2) return { ok: false, message: "Informe o nome da criança." };
  if (!isRealPastDate(birthDate)) return { ok: false, message: "Informe uma data de nascimento válida." };
  if (!ALLOWED_GENDERS.has(gender)) return { ok: false, message: "Selecione uma opção de gênero válida." };
  if (!ALLOWED_COLORS.has(favoriteColor)) return { ok: false, message: "Selecione uma cor válida." };
  if (!ALLOWED_AVATARS.has(avatarId)) return { ok: false, message: "Selecione um avatar válido." };

  return {
    ok: true,
    data: {
      ...(id ? { id } : {}),
      name,
      birthDate,
      gender: gender as ChildProfileInput["gender"],
      favoriteColor,
      interests,
      avatarId,
    },
  };
}

export function validateDiaryEntryInput(value: unknown): ValidationResult<DiaryEntryInput> {
  if (!isRecord(value)) return { ok: false, message: "Dados da memória inválidos." };

  const childId = cleanString(value.childId, 36);
  const title = cleanString(value.title, 120);
  const content = cleanString(value.content, 4000);
  const mood = value.mood === null ? null : cleanString(value.mood, 16) || null;
  const tags = Array.isArray(value.tags)
    ? [...new Set(value.tags.map((item) => cleanString(item, 30)).filter(Boolean))].slice(0, 10)
    : [];
  const registrationType = cleanString(value.registrationType, 20) || "livre";

  if (!UUID_PATTERN.test(childId)) return { ok: false, message: "Selecione uma criança válida." };
  if (!content) return { ok: false, message: "Conte o que aconteceu antes de salvar." };
  if (!ALLOWED_DIARY_TYPES.has(registrationType)) return { ok: false, message: "Tipo de registro inválido." };

  return {
    ok: true,
    data: {
      childId,
      title,
      content,
      mood,
      tags,
      registrationType: registrationType as DiaryEntryInput["registrationType"],
    },
  };
}

export function validateActivityExecutionInput(value: unknown): ValidationResult<ActivityExecutionInput> {
  if (!isRecord(value)) return { ok: false, message: "Dados da atividade inválidos." };

  const activityId = cleanString(value.activityId, 36);
  const childId = cleanString(value.childId, 36);
  const note = cleanString(value.note, 2000);
  const rawPerception = value.perception === null ? null : cleanString(value.perception, 32) || null;
  const observedSignals = Array.isArray(value.observedSignals)
    ? [...new Set(value.observedSignals.map((item) => cleanString(item, 32)).filter((item) => ALLOWED_OBSERVED_SIGNALS.has(item)))].slice(0, 6)
    : [];
  const endReason = cleanString(value.endReason, 32) || "concluida";
  const rawDuration = Number(value.durationMinutes);
  const recommendationKey = cleanString(value.recommendationKey, 160) || null;
  const recommendationContext = cleanString(value.recommendationContext, 32) || null;

  if (!UUID_PATTERN.test(activityId) || !UUID_PATTERN.test(childId)) {
    return { ok: false, message: "Atividade ou criança inválida." };
  }
  if (rawPerception !== null && !ALLOWED_PERCEPTIONS.has(rawPerception)) {
    return { ok: false, message: "Escolha como foi a experiência." };
  }
  if (!ALLOWED_END_REASONS.has(endReason)) return { ok: false, message: "Motivo de encerramento inválido." };
  if (recommendationContext && !ALLOWED_RECOMMENDATION_CONTEXTS.has(recommendationContext)) {
    return { ok: false, message: "Contexto de recomendação inválido." };
  }
  if (!Number.isFinite(rawDuration) || rawDuration < 0) {
    return { ok: false, message: "Duração inválida." };
  }

  return {
    ok: true,
    data: {
      activityId,
      childId,
      perception: rawPerception as ActivityExecutionInput["perception"],
      observedSignals,
      endReason: endReason as ActivityExecutionInput["endReason"],
      note,
      durationMinutes: Math.min(Math.round(rawDuration), 12 * 60),
      recommendationKey,
      recommendationContext,
    },
  };
}
