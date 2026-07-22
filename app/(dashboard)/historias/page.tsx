import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookHeart, BookOpen, Clock3, Feather, MessageCircle, Sparkles } from "lucide-react";
import { differenceInMonths, parseISO } from "date-fns";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";

export const metadata: Metadata = { title: "BrinContos — Em breve | Brincar Educando", robots: { index: false } };

const BRINCONTOS_LIBRARY_ENABLED = false;

function BrinContosComingSoon() {
  return (
    <div className="relative min-h-[calc(100vh-7rem)] overflow-hidden px-5 pb-24 pt-10 md:px-8 md:pt-16">
      <div
        className="pointer-events-none absolute -left-16 top-20 size-48 rounded-full bg-[var(--color-primary)]/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-24 size-64 rounded-full bg-[var(--color-secondary)]/10 blur-3xl"
        aria-hidden="true"
      />

      <main className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
          <Sparkles className="size-4" aria-hidden="true" />
          BrinContos · Em preparação
        </div>

        <div className="relative mt-9 flex size-24 items-center justify-center rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm md:size-28">
          <BookHeart className="size-11 md:size-12" strokeWidth={1.8} aria-hidden="true" />
          <span className="absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-[var(--color-secondary)] text-white shadow-sm">
            <Feather className="size-4" aria-hidden="true" />
          </span>
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-secondary)]">
          Um cantinho que merece tempo e carinho
        </p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-black leading-tight text-[var(--color-foreground)] sm:text-5xl">
          Histórias incríveis estão sendo preparadas para vocês.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-[var(--color-muted-foreground)] md:text-lg md:leading-8">
          Estamos criando cada BrinConto com imaginação e cuidado, para que a leitura vire encontro,
          conversa e brincadeira entre crianças e quem cuida delas.
        </p>

        <div className="mt-8 w-full max-w-xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]/90 p-5 shadow-sm md:p-6">
          <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
            Em breve, este espaço vai se encher de personagens, descobertas e pequenos momentos para
            viver juntos. Por enquanto, seguimos escrevendo com calma — como toda boa história merece.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para o início
        </Link>
      </main>
    </div>
  );
}

export default async function HistoriasPage() {
  if (!BRINCONTOS_LIBRARY_ENABLED) return <BrinContosComingSoon />;

  const { supabase, user } = await requireAppUser();
  const { activeChild, needsSelection } = await getActiveChild(supabase, user.id);
  if (needsSelection) return <div className="min-h-screen px-6 pt-8"><ChildSelectionPrompt /></div>;
  if (!activeChild) return <div className="p-8 text-center"><Link className="font-bold text-[var(--color-primary)]" href="/onboarding">Crie um perfil para escolher histórias.</Link></div>;
  const ageMonths = differenceInMonths(new Date(), parseISO(activeChild.data_nascimento));
  const { data: stories } = await supabase.from("historias").select("id, slug, titulo, descricao, tema, momento, duracao_minutos, faixa_etaria_min, faixa_etaria_max, proposta_familiar").eq("publicado", true).lte("faixa_etaria_min", ageMonths).gte("faixa_etaria_max", ageMonths).order("momento").order("titulo");
  return <div className="min-h-screen px-5 pb-20 pt-8 md:px-6"><header className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)]">Brincontos</p><h1 className="mt-1 font-serif text-4xl font-black">Histórias para viver juntos</h1><p className="mt-3 max-w-2xl text-[var(--color-muted-foreground)]">Leituras curtas, autorais e abertas à conversa. Não há resposta certa, lição para cumprir ou meta de leitura.</p></header><section className="mx-auto mt-8 max-w-5xl"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(stories ?? []).map(story => <Link key={story.id} href={`/historias/${story.slug}/ler`} className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40"><div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><BookOpen className="size-5" /></div><p className="mt-5 text-xs font-black uppercase tracking-wide text-[var(--color-primary)] capitalize">{story.tema ?? "História"} · {story.momento.replaceAll("_", " ")}</p><h2 className="mt-2 font-serif text-2xl font-black">{story.titulo}</h2><p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{story.descricao}</p><div className="mt-5 flex items-center gap-4 text-xs font-bold text-[var(--color-muted-foreground)]"><span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{story.duracao_minutos ?? 5} min</span><span>{story.faixa_etaria_min}–{story.faixa_etaria_max} meses</span></div><p className="mt-4 border-t border-[var(--color-border)] pt-4 text-xs leading-5 text-[var(--color-muted-foreground)]"><MessageCircle className="mr-1 inline size-3" />{story.proposta_familiar}</p></Link>)}</div>{stories?.length === 0 && <p className="rounded-3xl border border-dashed p-8 text-center text-sm text-[var(--color-muted-foreground)]">Ainda não há uma história publicada para esta fase.</p>}</section></div>;
}
