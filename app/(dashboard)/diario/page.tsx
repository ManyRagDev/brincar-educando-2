import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Download, Lightbulb, MessageCircle, PenLine, Plus, Smile, Sparkles } from "lucide-react";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { UnifiedDiaryTimeline, type UnifiedDiaryItem } from "@/components/diario/UnifiedDiaryTimeline";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";

export const metadata: Metadata = { title: "Diário | Brincar Educando", robots: { index: false } };

const quickEntries = [
  { type: "fala", label: "Uma frase que ela disse", icon: MessageCircle },
  { type: "descoberta", label: "Uma descoberta", icon: Lightbulb },
  { type: "desafio", label: "Um desafio de hoje", icon: Sparkles },
  { type: "riso", label: "Algo que fez rir", icon: Smile },
  { type: "foto", label: "Uma foto", icon: Camera },
  { type: "livre", label: "Escrever livremente", icon: PenLine },
] as const;

export default async function DiaryPage() {
  const { supabase, user } = await requireAppUser();
  const { activeChild, needsSelection } = await getActiveChild(supabase, user.id);
  if (needsSelection) return <div className="min-h-screen px-6 pt-8"><ChildSelectionPrompt /></div>;
  if (!activeChild) return <div className="p-8 text-center"><p className="font-black">Crie um perfil para começar o diário.</p><Link href="/onboarding" className="mt-4 inline-flex min-h-11 items-center text-[var(--color-primary)] underline">Criar perfil</Link></div>;

  const [entriesResult, executionsResult, storiesResult, storySessionsResult] = await Promise.all([
    supabase.from("diario_entradas")
      .select("id, titulo, conteudo, humor, tags, tipo_registro, data_entrada, diario_midias(id, storage_path)")
      .eq("crianca_id", activeChild.id).order("data_entrada", { ascending: false }),
    supabase.from("atividades_execucoes")
      .select("id, data_conclusao, duracao_minutos, percepcao, observacoes_sinais, notas, motivo_encerramento, atividade:atividade_id(titulo, categoria)")
      .eq("crianca_id", activeChild.id).order("data_conclusao", { ascending: false }),
    supabase.from("historico")
      .select("id, updated_at, created_at, concluido, progresso_segundos, historia:historia_id(titulo)")
      .eq("crianca_id", activeChild.id).order("updated_at", { ascending: false }),
    supabase.from("historias_sessoes")
      .select("id, atualizada_em, concluida, pagina_atual")
      .eq("crianca_id", activeChild.id).order("atualizada_em", { ascending: false }),
  ]);

  const entries = entriesResult.data ?? [];
  const signedUrls = new Map<string, string>();
  await Promise.all(entries.flatMap((entry) => entry.diario_midias.map(async (media) => {
    const { data } = await supabase.storage.from("brincareducando-diario-privado").createSignedUrl(media.storage_path, 600);
    if (data?.signedUrl) signedUrls.set(media.id, data.signedUrl);
  })));

  const items: UnifiedDiaryItem[] = [
    ...entries.map((entry) => ({
      kind: "memory" as const,
      id: entry.id,
      childId: activeChild.id,
      date: entry.data_entrada,
      title: entry.titulo,
      content: entry.conteudo,
      mood: entry.humor,
      tags: entry.tags ?? [],
      registrationType: entry.tipo_registro,
      imageUrl: entry.diario_midias.map((media) => signedUrls.get(media.id)).find(Boolean) ?? null,
    })),
    ...(executionsResult.data ?? []).map((execution) => ({
      kind: "activity" as const,
      id: execution.id,
      childId: activeChild.id,
      date: execution.data_conclusao ?? new Date(0).toISOString(),
      title: execution.atividade?.titulo ?? "Brincadeira registrada",
      category: execution.atividade?.categoria ?? "experiência",
      durationMinutes: execution.duracao_minutos,
      perception: execution.percepcao,
      observedSignals: execution.observacoes_sinais,
      note: execution.notas,
      endReason: execution.motivo_encerramento,
    })),
    ...(storiesResult.data ?? []).map((story) => ({
      kind: "story" as const,
      id: story.id,
      childId: activeChild.id,
      date: story.updated_at ?? story.created_at ?? new Date(0).toISOString(),
      title: "História em família",
      completed: story.concluido ?? false,
      progressSeconds: story.progresso_segundos,
    })),
    ...(storySessionsResult.data ?? []).map((story) => ({
      kind: "story" as const,
      id: `sessao-${story.id}`,
      childId: activeChild.id,
      date: story.atualizada_em,
      title: "História em família",
      completed: story.concluida,
      progressSeconds: story.pagina_atual > 0 ? story.pagina_atual : null,
    })),
  ].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());

  return (
    <div className="min-h-screen px-5 pb-20 pt-8 md:px-6">
      <header className="mx-auto max-w-3xl">
        <p className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">Memórias de {activeChild.nome}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div><h1 className="font-serif text-4xl font-black">Diário</h1><p className="mt-2 text-sm text-[var(--color-muted-foreground)]">Falas, descobertas, histórias e brincadeiras numa só linha do tempo.</p></div>
          <a href="/api/diario/export" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 text-sm font-bold"><Download className="size-4" />Exportar</a>
        </div>
      </header>

      <section className="mx-auto mt-7 max-w-3xl" aria-labelledby="quick-entry-title">
        <div className="flex items-center justify-between"><h2 id="quick-entry-title" className="text-lg font-black">Guardar um momento</h2><Link href="/diario/nova" className="text-sm font-bold text-[var(--color-primary)]"><Plus className="mr-1 inline size-4" />Nova entrada</Link></div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {quickEntries.map(({ type, label, icon: Icon }) => <Link key={type} href={`/diario/nova?tipo=${type}`} className="flex min-h-20 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-sm font-bold hover:border-[var(--color-primary)]/50"><Icon className="size-5 shrink-0 text-[var(--color-primary)]" />{label}</Link>)}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl" aria-labelledby="timeline-title">
        <h2 id="timeline-title" className="text-lg font-black">Linha do tempo</h2>
        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">Fotos usam links privados que expiram em 10 minutos. Excluir uma memória também exclui sua mídia.</p>
        <UnifiedDiaryTimeline items={items} />
      </section>
    </div>
  );
}
