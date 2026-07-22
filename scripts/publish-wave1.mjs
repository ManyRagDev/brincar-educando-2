import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const apply = process.argv.includes("--apply");
const confirmation = process.argv.find((argument) => argument.startsWith("--confirm="))?.split("=")[1];
const expectedConfirmation = "PUBLICAR-ONDA-1";
const draftDir = path.join(root, "content", "activities", "drafts", "wave-1");
const files = ["0-5-months.json", "6-11-months.json", "12-17-months.json", "18-23-months.json"];
const drafts = files.flatMap((file) => JSON.parse(fs.readFileSync(path.join(draftDir, file), "utf8")));
const codes = drafts.map((draft) => draft.code);
const reviewedAt = "2026-07-22T12:00:00.000-03:00";
const nextReview = "2026-10-22";
const reviewer = "Responsável do projeto — piloto integral pós-deploy";
const approvalNote = "Aprovada pelo responsável do projeto para publicação e validação integral no dashboard com outras famílias. O piloto prévio foi dispensado de forma explícita; feedback pós-deploy não será usado para inferência clínica ou comparação entre crianças.";

if (drafts.length !== 24 || new Set(codes).size !== 24) throw new Error("Publicação exige exatamente 24 atividades únicas da Onda 1.");
console.log("Publicação preparada: 24 atividades; próxima revisão editorial em 2026-10-22.");
if (!apply) {
  console.log(`Dry run concluído. Para publicar, use --apply --confirm=${expectedConfirmation}.`);
  process.exit(0);
}
if (confirmation !== expectedConfirmation) throw new Error(`Confirmação inválida. Use --confirm=${expectedConfirmation}.`);

const envPath = path.join(root, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.");
const supabase = createClient(supabaseUrl, serviceRoleKey, { db: { schema: "brincareducando" }, auth: { persistSession: false, autoRefreshToken: false } });

const existingResult = await supabase.from("atividades").select("id,codigo_externo,slug,status_editorial,publicado,revisado_em,proxima_revisao").in("codigo_externo", codes);
if (existingResult.error) throw existingResult.error;
if (existingResult.data?.length !== 24) throw new Error(`Banco contém ${existingResult.data?.length ?? 0} das 24 atividades esperadas.`);
if (existingResult.data.some((activity) => !activity.slug)) throw new Error("Todas as atividades precisam de slug antes da publicação.");

const activityIds = existingResult.data.map((activity) => activity.id);
const [adaptationsResult, sourcesResult] = await Promise.all([
  supabase.from("atividades_adaptacoes").select("*", { count: "exact", head: true }).in("atividade_id", activityIds),
  supabase.from("atividades_fontes").select("*", { count: "exact", head: true }).in("atividade_id", activityIds),
]);
if (adaptationsResult.error) throw adaptationsResult.error;
if (sourcesResult.error) throw sourcesResult.error;
if (adaptationsResult.count !== 48) throw new Error(`Publicação bloqueada: esperado 48 adaptações, encontrado ${adaptationsResult.count}.`);
if (sourcesResult.count !== 61) throw new Error(`Publicação bloqueada: esperado 61 vínculos de fontes, encontrado ${sourcesResult.count}.`);

const unpublishedIds = existingResult.data.filter((activity) => !activity.publicado || activity.status_editorial !== "publicado").map((activity) => activity.id);
if (unpublishedIds.length) {
  const { error } = await supabase.from("atividades").update({ publicado: true, status_editorial: "publicado", revisado_por: reviewer, revisado_em: reviewedAt, proxima_revisao: nextReview, updated_at: new Date().toISOString() }).in("id", unpublishedIds);
  if (error) throw error;
}

const { error: approvePendingError } = await supabase.from("revisoes_conteudo").update({ status: "aprovado", revisor: reviewer, parecer: approvalNote, revisado_em: reviewedAt, proxima_revisao: nextReview }).in("atividade_id", activityIds).eq("tipo", "editorial").eq("status", "pendente");
if (approvePendingError) throw approvePendingError;

const approvedResult = await supabase.from("revisoes_conteudo").select("atividade_id").in("atividade_id", activityIds).eq("tipo", "editorial").eq("status", "aprovado");
if (approvedResult.error) throw approvedResult.error;
const approvedIds = new Set((approvedResult.data ?? []).map((review) => review.atividade_id));
const missingApprovals = activityIds.filter((activityId) => !approvedIds.has(activityId));
if (missingApprovals.length) {
  const { error } = await supabase.from("revisoes_conteudo").insert(missingApprovals.map((activityId) => ({ atividade_id: activityId, tipo: "editorial", status: "aprovado", revisor: reviewer, parecer: approvalNote, revisado_em: reviewedAt, proxima_revisao: nextReview })));
  if (error) throw error;
}

const [publishedResult, finalApprovalsResult] = await Promise.all([
  supabase.from("atividades").select("id,codigo_externo,slug,status_editorial,publicado,revisado_por,revisado_em,proxima_revisao").in("codigo_externo", codes),
  supabase.from("revisoes_conteudo").select("atividade_id", { count: "exact" }).in("atividade_id", activityIds).eq("tipo", "editorial").eq("status", "aprovado"),
]);
if (publishedResult.error) throw publishedResult.error;
if (finalApprovalsResult.error) throw finalApprovalsResult.error;
if (publishedResult.data?.length !== 24 || publishedResult.data.some((activity) => !activity.publicado || activity.status_editorial !== "publicado" || !activity.revisado_em || activity.proxima_revisao !== nextReview)) throw new Error("Auditoria pós-publicação falhou no estado das atividades.");
if (new Set((finalApprovalsResult.data ?? []).map((review) => review.atividade_id)).size !== 24) throw new Error("Auditoria pós-publicação não encontrou aprovação para todas as atividades.");

console.log(`Publicação concluída: ${publishedResult.data.length}/24 atividades visíveis no catálogo autenticado.`);
console.log(`Auditoria aprovada: 48 adaptações, 61 vínculos de fontes, 24 aprovações e revisão em ${nextReview}.`);
