import assert from "node:assert/strict";
import test from "node:test";
import {
  validateActivityExecutionInput,
  validateChildProfileInput,
  validateDiaryEntryInput,
} from "../lib/validation/family-data.ts";

const childId = "42be5bb0-9d1f-4d5a-a5f2-ea283dbcda1d";
const activityId = "9dd17669-c94f-48b3-a7ab-66e1fd114c86";

test("normaliza perfil infantil e rejeita data futura", () => {
  const valid = validateChildProfileInput({
    name: "  Lia  ",
    birthDate: "2022-05-10",
    gender: "nao_informado",
    favoriteColor: "azul",
    interests: ["Natureza", "Natureza", "Música"],
    avatarId: "star",
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.data.name, "Lia");
    assert.deepEqual(valid.data.interests, ["Natureza", "Música"]);
  }

  assert.equal(
    validateChildProfileInput({
      name: "Lia",
      birthDate: "2999-01-01",
      gender: "nao_informado",
      favoriteColor: "azul",
      interests: [],
      avatarId: "star",
    }).ok,
    false,
  );
});

test("exige criança e conteúdo válidos no diário", () => {
  assert.equal(validateDiaryEntryInput({ childId, title: "", content: "Uma descoberta", mood: null, tags: [] }).ok, true);
  assert.equal(validateDiaryEntryInput({ childId: "outra-familia", content: "Texto" }).ok, false);
  assert.equal(validateDiaryEntryInput({ childId, content: "   " }).ok, false);
});

test("normaliza reflexão observacional e limita duração de uma execução", () => {
  const valid = validateActivityExecutionInput({
    activityId,
    childId,
    perception: "gostou",
    observedSignals: ["movimento", "movimento", "invalido"],
    endReason: "concluida",
    note: "Quis repetir.",
    durationMinutes: 900,
  });
  assert.equal(valid.ok, true);
  if (valid.ok) {
    assert.equal(valid.data.durationMinutes, 720);
    assert.deepEqual(valid.data.observedSignals, ["movimento"]);
  }

  assert.equal(validateActivityExecutionInput({ activityId, childId, perception: "nota_8", durationMinutes: 5 }).ok, false);
  assert.equal(validateActivityExecutionInput({ activityId, childId, endReason: "fracasso", durationMinutes: 5 }).ok, false);
});
