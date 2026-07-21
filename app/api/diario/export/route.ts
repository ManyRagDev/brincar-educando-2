import { NextResponse } from "next/server";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";

export async function GET() {
  const { supabase, user } = await requireAppUser();
  const { activeChild, needsSelection } = await getActiveChild(supabase, user.id);
  if (needsSelection || !activeChild) return NextResponse.json({ error: "Selecione uma criança." }, { status: 400 });

  const [entriesResult, executionsResult] = await Promise.all([
    supabase.from("diario_entradas")
      .select("id, titulo, conteudo, humor, tags, tipo_registro, data_entrada, updated_at, diario_midias(id, mime_type, tamanho_bytes, created_at)")
      .eq("crianca_id", activeChild.id).order("data_entrada"),
    supabase.from("atividades_execucoes")
      .select("id, data_conclusao, duracao_minutos, percepcao, observacoes_sinais, motivo_encerramento, notas, atividade:atividade_id(titulo, categoria)")
      .eq("crianca_id", activeChild.id).order("data_conclusao"),
  ]);

  const body = {
    formato: "brincar-educando-diario-v1",
    exportado_em: new Date().toISOString(),
    crianca: { nome: activeChild.nome, data_nascimento: activeChild.data_nascimento },
    privacidade: "Arquivos de foto não são incluídos neste JSON. O campo diario_midias contém somente metadados; fotos permanecem privadas na conta.",
    memorias: entriesResult.data ?? [],
    brincadeiras: executionsResult.data ?? [],
  };
  const safeName = activeChild.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "crianca";
  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="diario-${safeName}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
