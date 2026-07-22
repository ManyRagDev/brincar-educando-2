import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const apply = process.argv.includes("--apply");
const draftDir = path.join(root, "content", "activities", "drafts", "wave-1");
const draftFiles = ["0-5-months.json", "6-11-months.json", "12-17-months.json", "18-23-months.json"];

function loadLocalEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const categoryByDomain = {
  vinculo_presenca: "criativa",
  linguagem_narrativa: "criativa",
  musica_ritmo: "criativa",
  natureza_observacao: "ao ar livre",
  movimento_amplo: "movimento",
  coordenacao_maos: "movimento",
  imaginacao_faz_de_conta: "criativa",
  criatividade_expressao: "criativa",
  investigacao_problemas: "cognitiva",
  autonomia_cotidiana: "cognitiva",
  transicoes_rotina: "cognitiva",
  convivencia_cooperacao: "cognitiva",
};

const sources = [
  { slug: "aap-power-of-play", titulo: "The Power of Play: A Pediatric Role in Enhancing Development in Young Children", organizacao_autoria: "American Academy of Pediatrics", url: "https://publications.aap.org/pediatrics/article/142/3/e20182058/38649/The-Power-of-Play-A-Pediatric-Role-in-Enhancing", doi: "10.1542/peds.2018-2058", tipo_evidencia: "relatorio_clinico_reafirmado_2025", resumo_editorial: "Sustenta brincadeira apropriada à fase, agência, vínculo responsivo e descoberta prazerosa; não sustenta promessa individual por atividade." },
  { slug: "harvard-serve-and-return", titulo: "Serve and Return", organizacao_autoria: "Center on the Developing Child at Harvard University", url: "https://developingchild.harvard.edu/key-concept/serve-and-return/", doi: null, tipo_evidencia: "sintese_institucional", resumo_editorial: "Sustenta trocas responsivas em que o adulto nota, responde e dá tempo para nova iniciativa." },
  { slug: "ms-caderneta-crianca", titulo: "Caderneta da Criança — 7ª edição", organizacao_autoria: "Ministério da Saúde do Brasil", url: "https://www.gov.br/saude/pt-br/composicao/saps/publicacoes/cadernetas-e-cartoes", doi: null, tipo_evidencia: "orientacao_oficial_saude", resumo_editorial: "Orienta cuidado integral, desenvolvimento e prevenção de acidentes; o aplicativo não substitui acompanhamento profissional." },
  { slug: "who-under-five-movement-2019", titulo: "Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age", organizacao_autoria: "World Health Organization", url: "https://www.who.int/publications/i/item/9789241550536", doi: null, tipo_evidencia: "diretriz_internacional", resumo_editorial: "Sustenta oportunidades de movimento adequadas à idade, sem transformar atividades em meta ou garantia de aquisição motora." },
  { slug: "cps-outdoor-risky-play-2024", titulo: "Healthy childhood development through outdoor risky play", organizacao_autoria: "Canadian Paediatric Society", url: "https://cps.ca/en/documents/position/outdoor-risky-play", doi: null, tipo_evidencia: "position_statement", resumo_editorial: "Diferencia risco administrável de perigo e sustenta desenho externo adequado à capacidade e ao contexto." },
  { slug: "cast-udl-guidelines-3", titulo: "Universal Design for Learning Guidelines 3.0", organizacao_autoria: "CAST", url: "https://udlguidelines.cast.org/", doi: null, tipo_evidencia: "framework_acessibilidade", resumo_editorial: "Sustenta múltiplas formas de participação e expressão, sem presumir diagnóstico ou incapacidade." },
  { slug: "nurturing-care-framework", titulo: "Nurturing Care Framework", organizacao_autoria: "WHO, UNICEF e World Bank Group", url: "https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/child-health/nurturing-care", doi: null, tipo_evidencia: "framework_institucional", resumo_editorial: "Sustenta cuidado responsivo e oportunidades de aprendizagem em relações cotidianas." },
  { slug: "salley-shared-book-reading-2022", titulo: "Shared Book Reading Intervention for Parents of Infants and Toddlers", organizacao_autoria: "Salley et al.", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9455889/", doi: null, tipo_evidencia: "ensaio_piloto_randomizado", resumo_editorial: "Sustenta estratégias responsivas de leitura compartilhada; não sustenta promessa ampla de desfecho infantil." },
];

const sourceSlugsByEvidence = {
  "EVD-REL-001": ["harvard-serve-and-return", "nurturing-care-framework"],
  "EVD-REL-002": ["aap-power-of-play", "harvard-serve-and-return"],
  "EVD-PLAY-001": ["aap-power-of-play"],
  "EVD-PLAY-002": ["aap-power-of-play"],
  "EVD-PLAY-004": ["aap-power-of-play"],
  "EVD-SAFE-001": ["ms-caderneta-crianca"],
  "EVD-SAFE-002": ["ms-caderneta-crianca"],
  "EVD-SAFE-003": ["ms-caderneta-crianca"],
  "EVD-MOVE-002": ["who-under-five-movement-2019", "ms-caderneta-crianca"],
  "EVD-NATURE-001": ["cps-outdoor-risky-play-2024"],
  "EVD-INCL-001": ["cast-udl-guidelines-3"],
  "EVD-LANG-001": ["salley-shared-book-reading-2022", "aap-power-of-play"],
  "EVD-EMO-001": ["nurturing-care-framework"],
};

const drafts = draftFiles.flatMap((file) => JSON.parse(fs.readFileSync(path.join(draftDir, file), "utf8")));
if (drafts.length !== 24 || new Set(drafts.map((draft) => draft.code)).size !== 24) throw new Error("A Onda 1 precisa conter 24 códigos únicos.");

const activityRows = drafts.map((draft) => ({
  codigo_externo: draft.code,
  slug: slugify(draft.title),
  titulo: draft.title,
  descricao: draft.summary,
  resumo: draft.summary,
  justificativa_fase: draft.phase_rationale,
  categoria: categoryByDomain[draft.primary_domain] ?? "criativa",
  dominio_primario: draft.primary_domain,
  dominios_secundarios: draft.secondary_domains,
  energia: draft.child_energy === "ajustavel" ? "media" : draft.child_energy,
  energia_adulto: draft.adult_energy,
  preparo_minutos: draft.prep_minutes,
  duracao_minutos: draft.duration_minutes,
  tempo_estimado_minutos: draft.duration_minutes,
  idade_min_meses: draft.age_min_months,
  idade_max_meses: draft.age_max_months,
  dificuldade: "facil",
  local: draft.location.some((location) => location.startsWith("externo")) ? "ao ar livre" : "interno",
  nivel_bagunca: draft.mess === "nenhuma" ? "baixa" : draft.mess,
  participantes_min: draft.participants.min,
  participantes_max: draft.participants.max,
  materiais: draft.materials.map((material) => material.name),
  materiais_estruturados: draft.materials,
  beneficios: [],
  habilidades: draft.opportunity_tags,
  passos: draft.steps,
  dicas: draft.safety.guidance,
  preparacao: draft.preparation,
  encerramento: draft.closing,
  prompts_interacao: draft.interaction_prompts,
  sinais_interesse: draft.interest_signals,
  sinais_adaptar_parar: draft.adapt_or_stop_signals,
  variacoes: draft.variations,
  adaptacoes_inclusivas: draft.inclusive_adaptations.map((orientation) => ({ contexto: "participacao", orientacao: orientation })),
  seguranca: draft.safety,
  publicado: false,
  status_editorial: "rascunho",
  conteudo_versao: 1,
  revisado_por: null,
  revisado_em: null,
  proxima_revisao: null,
  updated_at: new Date().toISOString(),
}));

console.log(`Onda 1 preparada: ${activityRows.length} atividades; todas com publicado=false e status_editorial=rascunho.`);
if (!apply) {
  console.log("Dry run concluído. Use --apply somente para sincronizar no Supabase configurado.");
  process.exit(0);
}

loadLocalEnv();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.");

const supabase = createClient(supabaseUrl, serviceRoleKey, { db: { schema: "brincareducando" }, auth: { persistSession: false, autoRefreshToken: false } });

const existingActivitiesResult = await supabase.from("atividades").select("codigo_externo,status_editorial,publicado").in("codigo_externo", drafts.map((draft) => draft.code));
if (existingActivitiesResult.error) throw existingActivitiesResult.error;
const publishedExisting = (existingActivitiesResult.data ?? []).filter((activity) => activity.publicado || activity.status_editorial === "publicado");
if (publishedExisting.length) {
  throw new Error(`Sincronização de rascunhos recusada: ${publishedExisting.length} atividades já estão publicadas. Use o fluxo editorial de atualização; este comando nunca despublica conteúdo.`);
}

const { data: activities, error: activitiesError } = await supabase.from("atividades").upsert(activityRows, { onConflict: "codigo_externo" }).select("id,codigo_externo,status_editorial,publicado");
if (activitiesError) throw activitiesError;
if (!activities || activities.length !== 24) throw new Error(`Supabase retornou ${activities?.length ?? 0} atividades após o upsert.`);
if (activities.some((activity) => activity.publicado || activity.status_editorial !== "rascunho")) throw new Error("Falha de isolamento: atividade sincronizada fora do estado de rascunho.");

const existingSourcesResult = await supabase.from("conteudos_fontes").select("id,slug").in("slug", sources.map((source) => source.slug));
if (existingSourcesResult.error) throw existingSourcesResult.error;
const existingSlugs = new Set((existingSourcesResult.data ?? []).map((source) => source.slug));
const missingSources = sources.filter((source) => !existingSlugs.has(source.slug)).map((source) => ({ ...source, consultado_em: "2026-07-22", proxima_revisao: "2027-07-22" }));
if (missingSources.length) {
  const { error } = await supabase.from("conteudos_fontes").insert(missingSources);
  if (error) throw error;
}
const sourcesResult = await supabase.from("conteudos_fontes").select("id,slug").in("slug", sources.map((source) => source.slug));
if (sourcesResult.error) throw sourcesResult.error;
const sourceIdBySlug = new Map((sourcesResult.data ?? []).map((source) => [source.slug, source.id]));

const activityIdByCode = new Map(activities.map((activity) => [activity.codigo_externo, activity.id]));
const activityIds = activities.map((activity) => activity.id);

const { error: deleteAdaptationsError } = await supabase.from("atividades_adaptacoes").delete().in("atividade_id", activityIds);
if (deleteAdaptationsError) throw deleteAdaptationsError;
const adaptationRows = drafts.flatMap((draft) => draft.inclusive_adaptations.map((orientation, index) => ({ atividade_id: activityIdByCode.get(draft.code), contexto: "participacao", titulo: index === 0 ? "Participar de outro jeito" : "Outra adaptação possível", orientacao: orientation, ordem: index })));
const { error: adaptationsError } = await supabase.from("atividades_adaptacoes").insert(adaptationRows);
if (adaptationsError) throw adaptationsError;

const { error: deleteSourcesError } = await supabase.from("atividades_fontes").delete().in("atividade_id", activityIds);
if (deleteSourcesError) throw deleteSourcesError;
const sourceRows = drafts.flatMap((draft) => {
  const slugs = new Set(draft.evidence_ids.flatMap((evidenceId) => sourceSlugsByEvidence[evidenceId] ?? []));
  return [...slugs].map((slug) => ({ atividade_id: activityIdByCode.get(draft.code), fonte_id: sourceIdBySlug.get(slug), afirmacao_sustentada: `${draft.editorial_claim} Evidências editoriais: ${draft.evidence_ids.join(", ")}.` }));
});
if (sourceRows.some((row) => !row.atividade_id || !row.fonte_id)) throw new Error("Não foi possível resolver todas as relações de fontes.");
const { error: sourcesLinkError } = await supabase.from("atividades_fontes").insert(sourceRows);
if (sourcesLinkError) throw sourcesLinkError;

const { error: deleteReviewsError } = await supabase.from("revisoes_conteudo").delete().in("atividade_id", activityIds).eq("tipo", "editorial").eq("status", "pendente").eq("revisor", "Equipe editorial Brincar Educando — Onda 1");
if (deleteReviewsError) throw deleteReviewsError;
const reviewRows = activities.map((activity) => ({ atividade_id: activity.id, tipo: "editorial", status: "pendente", revisor: "Equipe editorial Brincar Educando — Onda 1", parecer: "Rascunho estruturado importado. Requer revisão editorial, segurança, acessibilidade e validação com cuidadores antes de publicação." }));
const { error: reviewsError } = await supabase.from("revisoes_conteudo").insert(reviewRows);
if (reviewsError) throw reviewsError;

console.log(`Sincronização concluída: ${activities.length} rascunhos, ${adaptationRows.length} adaptações, ${sourceRows.length} vínculos de fontes e ${reviewRows.length} revisões pendentes.`);

const [verifiedActivities, verifiedAdaptations, verifiedSources, verifiedReviews] = await Promise.all([
  supabase.from("atividades").select("id,codigo_externo,status_editorial,publicado").in("codigo_externo", drafts.map((draft) => draft.code)),
  supabase.from("atividades_adaptacoes").select("*", { count: "exact", head: true }).in("atividade_id", activityIds),
  supabase.from("atividades_fontes").select("*", { count: "exact", head: true }).in("atividade_id", activityIds),
  supabase.from("revisoes_conteudo").select("*", { count: "exact", head: true }).in("atividade_id", activityIds).eq("tipo", "editorial").eq("status", "pendente").eq("revisor", "Equipe editorial Brincar Educando — Onda 1"),
]);
for (const result of [verifiedActivities, verifiedAdaptations, verifiedSources, verifiedReviews]) {
  if (result.error) throw result.error;
}
if (verifiedActivities.data?.length !== 24 || verifiedActivities.data.some((activity) => activity.publicado || activity.status_editorial !== "rascunho")) throw new Error("Auditoria remota falhou no isolamento dos rascunhos.");
if (verifiedAdaptations.count !== adaptationRows.length) throw new Error(`Auditoria remota encontrou ${verifiedAdaptations.count} adaptações; esperado: ${adaptationRows.length}.`);
if (verifiedSources.count !== sourceRows.length) throw new Error(`Auditoria remota encontrou ${verifiedSources.count} vínculos de fontes; esperado: ${sourceRows.length}.`);
if (verifiedReviews.count !== reviewRows.length) throw new Error(`Auditoria remota encontrou ${verifiedReviews.count} revisões pendentes; esperado: ${reviewRows.length}.`);
console.log("Auditoria remota aprovada: 24/24 isoladas do catálogo e relações editoriais completas.");
