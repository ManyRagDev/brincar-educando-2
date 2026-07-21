import type { Metadata } from "next";
import Link from "next/link";
import { differenceInMonths, parseISO, subDays } from "date-fns";
import { ArrowRight, BookHeart, Compass, Download, Heart, Leaf, Sparkles } from "lucide-react";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";
import { getDashboardSuggestions } from "@/lib/journey/suggestions";

export const metadata: Metadata = {
  title: "Jornada | Brincar Educando",
  robots: { index: false },
};

export default async function JornadaPage() {
  const { supabase, user } = await requireAppUser();
  const { activeChild, needsSelection } = await getActiveChild(supabase, user.id);

  if (needsSelection) {
    return (
      <div className="min-h-screen px-6 pt-8">
        <ChildSelectionPrompt />
      </div>
    );
  }

  if (!activeChild) {
    return (
      <div className="min-h-screen px-6 py-12">
        <section className="card-theme mx-auto max-w-xl p-8 text-center">
          <h1 className="font-serif text-3xl font-black">A jornada começa conhecendo a criança</h1>
          <p className="mt-3 text-[var(--color-muted-foreground)]">
            O perfil permite organizar memórias e escolher convites adequados à fase.
          </p>
          <Link href="/onboarding" className="btn-primary-theme mt-6 inline-flex min-h-11 items-center rounded-xl px-5">
            Criar perfil
          </Link>
        </section>
      </div>
    );
  }

  const [executionsResult, memoriesResult, suggestions] = await Promise.all([
    supabase
      .from("atividades_execucoes")
      .select("id, data_conclusao, percepcao, observacoes_sinais, atividade:atividade_id(titulo, categoria)")
      .eq("crianca_id", activeChild.id)
      .order("data_conclusao", { ascending: false }),
    supabase
      .from("diario_entradas")
      .select("id, titulo, conteudo, data_entrada")
      .eq("crianca_id", activeChild.id)
      .order("data_entrada", { ascending: false })
      .limit(3),
    getDashboardSuggestions(supabase, {
      childId: activeChild.id,
      childAgeMonths: differenceInMonths(new Date(), parseISO(activeChild.data_nascimento)),
      interests: activeChild.interesses,
      context: null,
    }),
  ]);

  const executions = executionsResult.data ?? [];
  const memories = memoriesResult.data ?? [];
  const categoryCounts = executions.reduce<Record<string, number>>((counts, execution) => {
    const category = execution.atividade?.categoria ?? "Outras experiências";
    counts[category] = (counts[category] ?? 0) + 1;
    return counts;
  }, {});
  const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const recentCutoff = subDays(new Date(), 60).getTime();
  const positiveRecent = executions.filter((execution) =>
    execution.percepcao === "gostou" &&
    Boolean(execution.data_conclusao) &&
    new Date(execution.data_conclusao as string).getTime() >= recentCutoff,
  );
  const positiveCategories = positiveRecent.reduce<Record<string, number>>((counts, execution) => {
    const category = execution.atividade?.categoria ?? "outras experiências";
    counts[category] = (counts[category] ?? 0) + 1;
    return counts;
  }, {});
  const leadingPositive = Object.entries(positiveCategories).sort((a, b) => b[1] - a[1])[0];
  const hasPreferenceSignal = positiveRecent.length >= 3 && Boolean(leadingPositive) && leadingPositive[1] / positiveRecent.length >= 0.5;
  const observedSignalCounts = executions.flatMap((item) => item.observacoes_sinais ?? []).reduce<Record<string, number>>((counts, signal) => {
    counts[signal] = (counts[signal] ?? 0) + 1;
    return counts;
  }, {});
  const observedSignalLabels: Record<string, string> = {
    movimento: "movimento",
    sons_palavras: "sons e palavras",
    texturas: "texturas",
    imaginar: "imaginação",
    fazer_junto: "fazer junto",
  };
  const observedHighlights = Object.entries(observedSignalCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([signal]) => observedSignalLabels[signal] ?? signal);
  const invitations = suggestions.result
    ? [suggestions.result.featured, suggestions.result.simple, suggestions.result.differentMood]
        .filter((activity): activity is NonNullable<typeof activity> => Boolean(activity))
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen px-6 pb-12 pt-8">
      <header className="mx-auto mb-8 max-w-5xl">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
          A história de {activeChild.nome}
        </p>
        <h1 className="mt-1 font-serif text-4xl font-black">Jornada</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-muted-foreground)]">
          Um retrato das experiências que vocês registraram — não uma nota ou avaliação do desenvolvimento.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/diario" className="inline-flex min-h-11 items-center gap-2 text-[var(--color-primary)]">
            <BookHeart className="size-4" aria-hidden="true" /> Ver linha do tempo
          </Link>
          <a href="/api/diario/export" className="inline-flex min-h-11 items-center gap-2 text-[var(--color-muted-foreground)]">
            <Download className="size-4" aria-hidden="true" /> Exportar registros
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
        <section className="card-theme p-6" aria-labelledby="experiences-title">
          <div className="mb-4 flex items-center gap-3">
            <Compass className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 id="experiences-title" className="font-serif text-xl font-black">
              Experiências vividas
            </h2>
          </div>
          {executions.length > 0 ? (
            <>
              <p className="text-3xl font-black text-[var(--color-primary)]">{executions.length}</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                brincadeiras registradas pela família
              </p>
              <div className="mt-5 space-y-2">
                {categories.map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between rounded-xl bg-[var(--color-muted)]/50 px-4 py-3">
                    <span className="text-sm font-semibold capitalize">{category}</span>
                    <span className="text-sm font-black">{count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Quando vocês registrarem uma brincadeira, ela aparecerá aqui como parte do repertório vivido.
            </p>
          )}
        </section>

        <section className="card-theme p-6" aria-labelledby="interests-title">
          <div className="mb-4 flex items-center gap-3">
            <Leaf className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h2 id="interests-title" className="font-serif text-xl font-black">O que tem encantado</h2>
          </div>
          {hasPreferenceSignal && leadingPositive ? (
            <>
              <p className="leading-relaxed">
                Nos registros recentes, {activeChild.nome} pareceu se envolver mais com convites de <strong className="capitalize">{leadingPositive[0]}</strong>.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                É uma pista baseada em {positiveRecent.length} experiências marcadas como “gostou” nos últimos 60 dias. Preferências mudam e não definem a criança.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                Ainda há poucos registros consistentes para apontar uma preferência. Continue oferecendo variedade e observe sem pressionar.
              </p>
              <p className="mt-3 text-xs text-[var(--color-muted-foreground)]">
                Uma pista só aparece após ao menos 3 experiências positivas recentes, quando um tipo se repete em metade delas.
              </p>
            </>
          )}
          {observedHighlights.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--color-muted-foreground)]">Você observou</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {observedHighlights.map((signal) => <span key={signal} className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-bold capitalize">{signal}</span>)}
              </div>
            </div>
          )}
        </section>

        <section className="card-theme p-6" aria-labelledby="memories-title">
          <div className="mb-4 flex items-center gap-3">
            <BookHeart className="h-5 w-5 text-[var(--color-secondary)]" aria-hidden="true" />
            <h2 id="memories-title" className="font-serif text-xl font-black">
              Momentos para lembrar
            </h2>
          </div>
          {memories.length > 0 ? (
            <div className="space-y-3">
              {memories.map((memory) => (
                <article key={memory.id} className="rounded-2xl bg-[var(--color-muted)]/50 p-4">
                  <p className="font-bold">{memory.titulo ?? "Um momento de vocês"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
                    {memory.conteudo}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Falas, descobertas e cenas do cotidiano podem virar memórias sem precisar ser um “grande marco”.
            </p>
          )}
          <Link href="/diario/nova" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-[var(--color-primary)]">
            Registrar uma memória
          </Link>
        </section>

        <section className="rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6 md:col-span-2" aria-labelledby="next-invitations-title">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="next-invitations-title" className="font-serif text-xl font-black">Próximos convites</h2>
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                Possibilidades adequadas à fase, combinando familiaridade e variedade. São convites, nunca tarefas ou testes.
              </p>
              {invitations.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {invitations.map((activity) => (
                    <Link key={activity.id} href={`/atividades/${activity.slug}`} className="group rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-card)] p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)] capitalize">{activity.categoria}</p>
                      <h3 className="mt-1 font-black">{activity.titulo}</h3>
                      <p className="mt-2 line-clamp-2 text-xs text-[var(--color-muted-foreground)]">{activity.descricao}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-[var(--color-primary)]">Ver convite <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" /></span>
                    </Link>
                  ))}
                </div>
              ) : (
                <Link href="/atividades" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                  <Heart className="h-4 w-4" aria-hidden="true" /> Explorar convites
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
