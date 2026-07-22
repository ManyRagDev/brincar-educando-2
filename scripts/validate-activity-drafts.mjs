import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const draftDir = path.join(root, "content", "activities", "drafts", "wave-1");
const matrixPath = path.join(root, "docs", "ciencia", "MATRIZ_DE_EVIDENCIAS.md");
const expectedFiles = ["0-5-months.json", "6-11-months.json", "12-17-months.json", "18-23-months.json"];
const errors = [];

function fail(code, message) {
  errors.push(`${code}: ${message}`);
}

function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

const records = [];
for (const file of expectedFiles) {
  const filePath = path.join(draftDir, file);
  if (!fs.existsSync(filePath)) {
    fail(file, "arquivo ausente");
    continue;
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(file, `JSON inválido: ${error.message}`);
    continue;
  }
  if (!Array.isArray(parsed) || parsed.length !== 6) fail(file, "deve conter exatamente 6 atividades");
  for (const record of parsed) records.push({ ...record, __file: file });
}

const requiredStrings = [
  "code", "title", "status", "summary", "phase_rationale", "format", "primary_domain",
  "child_energy", "adult_energy", "mess", "noise", "sensory_load", "editorial_claim",
];
const requiredArrays = [
  "opportunity_tags", "location", "preparation", "steps", "interaction_prompts", "interest_signals",
  "adapt_or_stop_signals", "closing", "participation_modes", "inclusive_adaptations", "evidence_ids",
];

for (const record of records) {
  const label = record.code ?? record.__file;
  for (const field of requiredStrings) {
    if (typeof record[field] !== "string" || !record[field].trim()) fail(label, `${field} ausente ou vazio`);
  }
  for (const field of requiredArrays) {
    if (!nonEmptyArray(record[field])) fail(label, `${field} precisa de ao menos um item`);
  }
  if (record.status !== "editorial_draft") fail(label, "status deve permanecer editorial_draft");
  if (!Number.isInteger(record.age_min_months) || !Number.isInteger(record.age_max_months) || record.age_min_months > record.age_max_months) fail(label, "faixa etária inválida");
  if (!Number.isInteger(record.prep_minutes) || record.prep_minutes < 0) fail(label, "prep_minutes inválido");
  if (!Number.isInteger(record.duration_minutes) || record.duration_minutes < 1) fail(label, "duration_minutes inválido");
  if (!record.participants || record.participants.min < 1 || record.participants.max < record.participants.min) fail(label, "participantes inválidos");
  if (!record.variations?.simplify || !record.variations?.repeat || !record.variations?.expand) fail(label, "variações incompletas");
  if ((record.participation_modes?.length ?? 0) < 2) fail(label, "deve permitir ao menos duas formas de participação");
  if (!record.safety?.supervision || !record.safety?.risk_level || !nonEmptyArray(record.safety?.risks) || !nonEmptyArray(record.safety?.guidance)) fail(label, "bloco de segurança incompleto");
  if (!Array.isArray(record.materials)) fail(label, "materials deve ser uma lista, mesmo quando vazia");
  if (/garante|aumenta a intelig|previne atraso|corrige atraso|regula emo|ativa o sistema|fortalece a musculatura/i.test(record.editorial_claim)) fail(label, "alegação editorial proibida");
}

const codes = records.map((record) => record.code);
if (new Set(codes).size !== codes.length) fail("global", "há códigos duplicados");
const titles = records.map((record) => record.title.toLocaleLowerCase("pt-BR"));
if (new Set(titles).size !== titles.length) fail("global", "há títulos duplicados");
for (let index = 1; index <= 24; index += 1) {
  const expected = `EXP-${String(index).padStart(3, "0")}`;
  if (!codes.includes(expected)) fail("global", `código ${expected} ausente`);
}

const expectedAgeByFile = {
  "0-5-months.json": [0, 5],
  "6-11-months.json": [6, 11],
  "12-17-months.json": [12, 17],
  "18-23-months.json": [18, 23],
};
for (const record of records) {
  const [min, max] = expectedAgeByFile[record.__file] ?? [];
  if (record.age_min_months !== min || record.age_max_months !== max) fail(record.code, `faixa não corresponde ao arquivo ${record.__file}`);
}

const matrix = fs.readFileSync(matrixPath, "utf8");
for (const evidenceId of new Set(records.flatMap((record) => record.evidence_ids ?? []))) {
  if (!matrix.includes(evidenceId)) fail("evidence", `${evidenceId} não existe na matriz canônica`);
}

if (errors.length) {
  console.error(`Rascunhos inválidos (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const riskCounts = records.reduce((counts, record) => {
  counts[record.safety.risk_level] = (counts[record.safety.risk_level] ?? 0) + 1;
  return counts;
}, {});
console.log(`Onda 1 válida: ${records.length} atividades, ${new Set(codes).size} códigos únicos.`);
console.log(`Faixas: 4 arquivos × 6 atividades. Risco editorial: ${JSON.stringify(riskCounts)}.`);
console.log("Status preservado: editorial_draft; nenhuma atividade foi publicada.");
