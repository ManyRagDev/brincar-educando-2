import assert from "node:assert/strict";
import test from "node:test";
import {
  rankRecommendations,
  type RecommendationCandidate,
} from "../lib/journey/recommendation-engine.ts";

const base: RecommendationCandidate = {
  id: "a",
  slug: "atividade-a",
  titulo: "Atividade A",
  descricao: "",
  imagem_url: null,
  energia: "media",
  preparo_minutos: 4,
  duracao_minutos: 15,
  categoria: "criativa",
  local: "interno",
  materiais: ["papel"],
  beneficios: [],
  habilidades: [],
  idade_min_meses: 24,
  idade_max_meses: 48,
};

test("o ranking é determinístico para a mesma janela e contexto", () => {
  const input = {
    candidates: [base, { ...base, id: "b", slug: "atividade-b" }],
    childId: "child",
    ageMonths: 36,
    interests: [],
    context: null,
    history: [],
    now: new Date("2026-07-20T10:00:00.000Z"),
  };

  assert.deepEqual(rankRecommendations(input), rankRecommendations(input));
});

test("o contexto rápido prioriza atividade curta e de baixo preparo", () => {
  const slow = { ...base, id: "slow", slug: "slow", preparo_minutos: 15, duracao_minutos: 40 };
  const quick = { ...base, id: "quick", slug: "quick", preparo_minutos: 1, duracao_minutos: 5 };
  const result = rankRecommendations({
    candidates: [slow, quick],
    childId: "child",
    ageMonths: 36,
    interests: [],
    context: "quick",
    history: [],
    now: new Date("2026-07-20T10:00:00.000Z"),
  });

  assert.equal(result?.featured.id, "quick");
  assert.match(result?.featured.reason ?? "", /tempo curto/);
});

test("não recomenda atividade fora da faixa etária", () => {
  const result = rankRecommendations({
    candidates: [{ ...base, idade_min_meses: 60, idade_max_meses: 72 }],
    childId: "child",
    ageMonths: 36,
    interests: [],
    context: null,
    history: [],
    now: new Date("2026-07-20T10:00:00.000Z"),
  });

  assert.equal(result, null);
});

test("motivo sem materiais reduz prioridade temporariamente", () => {
  const alternative = { ...base, id: "b", slug: "b" };
  const result = rankRecommendations({
    candidates: [base, alternative],
    childId: "child",
    ageMonths: 36,
    interests: [],
    context: null,
    history: [
      {
        activityId: base.id,
        rating: null,
        occurredAt: "2026-07-19T10:00:00.000Z",
        swapReason: "no_materials",
      },
    ],
    now: new Date("2026-07-20T10:00:00.000Z"),
  });

  assert.equal(result?.featured.id, "b");
});
