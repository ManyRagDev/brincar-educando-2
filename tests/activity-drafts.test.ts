import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const draftDir = path.join(root, "content", "activities", "drafts", "wave-1");
const files = ["0-5-months.json", "6-11-months.json", "12-17-months.json", "18-23-months.json"];

type Draft = {
  code: string;
  status: string;
  age_min_months: number;
  age_max_months: number;
  participation_modes: string[];
  safety: { supervision: string; risk_level: string };
};

const drafts = files.flatMap((file) => JSON.parse(fs.readFileSync(path.join(draftDir, file), "utf8")) as Draft[]);

test("a Onda 1 mantém 24 rascunhos isolados da publicação", () => {
  assert.equal(drafts.length, 24);
  assert.equal(new Set(drafts.map((draft) => draft.code)).size, 24);
  assert.ok(drafts.every((draft) => draft.status === "editorial_draft"));
  assert.deepEqual(drafts.map((draft) => draft.code), Array.from({ length: 24 }, (_, index) => `EXP-${String(index + 1).padStart(3, "0")}`));
});

test("todo rascunho possui participação alternativa e classificação de segurança", () => {
  assert.ok(drafts.every((draft) => draft.participation_modes.length >= 2));
  assert.ok(drafts.every((draft) => ["baixo", "moderado"].includes(draft.safety.risk_level)));
  assert.ok(drafts.every((draft) => ["alcance_imediato", "supervisao_ativa"].includes(draft.safety.supervision)));
});

test("cada faixa da Onda 1 contém seis atividades", () => {
  const counts = drafts.reduce<Record<string, number>>((result, draft) => {
    const key = `${draft.age_min_months}-${draft.age_max_months}`;
    result[key] = (result[key] ?? 0) + 1;
    return result;
  }, {});
  assert.deepEqual(counts, { "0-5": 6, "6-11": 6, "12-17": 6, "18-23": 6 });
});
