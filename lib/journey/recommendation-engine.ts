export const RECOMMENDATION_RULE_VERSION = "v1";

export const MOMENT_OPTIONS = [
  { value: "quick", label: "Só temos 5 minutos", hint: "Rápido e simples" },
  { value: "move", label: "Gastar energia", hint: "Movimento e corpo" },
  { value: "calm", label: "Desacelerar", hint: "Algo mais tranquilo" },
  { value: "no_materials", label: "Sem materiais", hint: "Usar o que já temos" },
  { value: "outside", label: "Ir lá fora", hint: "Explorar outro ambiente" },
  { value: "tired_adult", label: "Adulto cansado", hint: "Fácil de conduzir" },
] as const;

export type MomentContext = (typeof MOMENT_OPTIONS)[number]["value"];

export type RecommendationCandidate = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  imagem_url: string | null;
  energia: string;
  preparo_minutos: number;
  duracao_minutos: number;
  categoria: string;
  local: string;
  materiais: string[];
  beneficios: string[];
  habilidades: string[];
  idade_min_meses: number;
  idade_max_meses: number;
};

export type RecommendationHistory = {
  activityId: string;
  rating: number | null;
  occurredAt: string;
  swapReason?: string | null;
};

export type RankedRecommendation = RecommendationCandidate & {
  score: number;
  reason: string;
  scoreReasons: string[];
  recommendationKey: string;
};

export type RecommendationResult = {
  featured: RankedRecommendation;
  simple: RankedRecommendation | null;
  differentMood: RankedRecommendation | null;
  ranked: RankedRecommendation[];
  ruleVersion: typeof RECOMMENDATION_RULE_VERSION;
};

export const RECOMMENDATION_WEIGHTS = Object.freeze({
  age: 30,
  context: 20,
  interests: 15,
  lowFriction: 15,
  variety: 10,
  feedback: 10,
});

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function stableFraction(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

function daysSince(isoDate: string, now: Date) {
  return Math.max(0, (now.getTime() - new Date(isoDate).getTime()) / 86_400_000);
}

function saoPauloWindow(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = Number(value("hour"));
  const date = `${value("year")}-${value("month")}-${value("day")}`;
  return {
    hour,
    key: `${date}:${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}`,
  };
}

function contextScore(candidate: RecommendationCandidate, context: MomentContext | null, hour: number) {
  if (context === "quick") {
    return candidate.duracao_minutos <= 10 && candidate.preparo_minutos <= 3 ? 20 : 0;
  }
  if (context === "move") return candidate.energia === "alta" ? 20 : candidate.energia === "media" ? 8 : 0;
  if (context === "calm") return candidate.energia === "baixa" ? 20 : candidate.energia === "media" ? 8 : 0;
  if (context === "no_materials") return candidate.materiais.length === 0 ? 20 : candidate.materiais.length <= 2 ? 8 : 0;
  if (context === "outside") return /extern|fora|ar livre/.test(normalize(candidate.local)) ? 20 : 0;
  if (context === "tired_adult") {
    return candidate.preparo_minutos <= 3 && candidate.energia !== "alta" ? 20 : candidate.preparo_minutos <= 5 ? 8 : 0;
  }

  const expectedEnergy = hour >= 18 || hour < 6 ? "baixa" : hour < 12 ? "alta" : "media";
  return candidate.energia === expectedEnergy ? 12 : candidate.energia === "media" ? 7 : 3;
}

function contextReason(context: MomentContext | null) {
  const messages: Record<MomentContext, string> = {
    quick: "cabe no tempo curto que vocês têm agora",
    move: "abre espaço para movimento e gasto de energia",
    calm: "propõe um ritmo mais calmo para este momento",
    no_materials: "pede poucos materiais e dá para começar com o que há por perto",
    outside: "combina com a vontade de aproveitar o lado de fora",
    tired_adult: "exige pouco preparo e menos condução do adulto",
  };
  return context ? messages[context] : null;
}

export function rankRecommendations(input: {
  candidates: RecommendationCandidate[];
  childId: string;
  ageMonths: number;
  interests: string[];
  context: MomentContext | null;
  history: RecommendationHistory[];
  now?: Date;
}): RecommendationResult | null {
  const now = input.now ?? new Date();
  const { hour, key: dateWindow } = saoPauloWindow(now);
  const normalizedInterests = input.interests.map(normalize).filter(Boolean);
  const eligible = input.candidates.filter(
    (candidate) =>
      candidate.idade_min_meses <= input.ageMonths &&
      candidate.idade_max_meses >= input.ageMonths,
  );

  if (eligible.length === 0) return null;

  const recentHistory = input.history.filter((entry) => daysSince(entry.occurredAt, now) <= 30);
  const recentCategories = new Set(
    recentHistory
      .map((entry) => eligible.find((candidate) => candidate.id === entry.activityId)?.categoria)
      .filter((category): category is string => Boolean(category)),
  );

  const ranked = eligible
    .map<RankedRecommendation>((candidate) => {
      let score = RECOMMENDATION_WEIGHTS.age;
      const scoreReasons = ["adequada para a faixa etária informada"];
      const currentContextScore = contextScore(candidate, input.context, hour);
      score += currentContextScore;
      if (currentContextScore >= 15) scoreReasons.push("combina com o contexto escolhido para agora");

      const searchable = normalize(
        [candidate.titulo, candidate.categoria, ...candidate.beneficios, ...candidate.habilidades].join(" "),
      );
      const interestMatch = normalizedInterests.some((interest) => searchable.includes(interest));
      if (interestMatch) {
        score += RECOMMENDATION_WEIGHTS.interests;
        scoreReasons.push("se aproxima dos interesses registrados");
      }

      const preparationPoints = candidate.preparo_minutos <= 3 ? 8 : candidate.preparo_minutos <= 7 ? 4 : 0;
      const durationPoints = candidate.duracao_minutos <= 15 ? 7 : candidate.duracao_minutos <= 25 ? 3 : 0;
      score += preparationPoints + durationPoints;
      if (preparationPoints + durationPoints >= 11) scoreReasons.push("tem baixo atrito para começar");

      if (!recentCategories.has(candidate.categoria)) {
        score += RECOMMENDATION_WEIGHTS.variety;
        scoreReasons.push("amplia o repertório recente de experiências");
      }

      const ownHistory = recentHistory.filter((entry) => entry.activityId === candidate.id);
      const lastPositive = ownHistory.find((entry) => (entry.rating ?? 0) >= 4);
      const lastNegative = ownHistory.find((entry) => (entry.rating ?? 5) <= 2);
      const recentlySeen = ownHistory.some((entry) => daysSince(entry.occurredAt, now) <= 7);
      const recentNoMaterials = ownHistory.some(
        (entry) => entry.swapReason === "no_materials" && daysSince(entry.occurredAt, now) <= 7,
      );

      if (lastPositive) {
        score += RECOMMENDATION_WEIGHTS.feedback;
        scoreReasons.push("uma repetição pode ser valiosa porque funcionou bem antes");
      } else if (lastNegative) {
        score -= RECOMMENDATION_WEIGHTS.feedback;
      }
      if (recentlySeen && !lastPositive) score -= 12;
      if (recentNoMaterials) score -= 20;

      score += stableFraction(`${input.childId}:${dateWindow}:${input.context ?? "auto"}:${candidate.id}`);

      const reason =
        (currentContextScore >= 15 ? contextReason(input.context) : null) ??
        (interestMatch ? "se conecta a interesses que vocês já registraram" : null) ??
        (preparationPoints + durationPoints >= 11 ? "é simples de preparar e começar" : null) ??
        "é adequada à fase e traz uma experiência possível para hoje";

      return {
        ...candidate,
        score,
        reason: `Boa para agora porque ${reason}.`,
        scoreReasons,
        recommendationKey: `${RECOMMENDATION_RULE_VERSION}:${dateWindow}:${input.context ?? "auto"}:${candidate.id}`,
      };
    })
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));

  const featured = ranked[0];
  const simple =
    [...ranked.slice(1)].sort(
      (left, right) =>
        left.preparo_minutos + left.duracao_minutos - (right.preparo_minutos + right.duracao_minutos) ||
        right.score - left.score,
    )[0] ?? null;
  const differentMood =
    ranked.slice(1).find(
      (candidate) => candidate.energia !== featured.energia && candidate.id !== simple?.id,
    ) ?? ranked.slice(1).find((candidate) => candidate.id !== simple?.id) ?? null;

  return {
    featured,
    simple,
    differentMood,
    ranked: ranked.slice(0, 8),
    ruleVersion: RECOMMENDATION_RULE_VERSION,
  };
}

export function isMomentContext(value: unknown): value is MomentContext {
  return MOMENT_OPTIONS.some((option) => option.value === value);
}
