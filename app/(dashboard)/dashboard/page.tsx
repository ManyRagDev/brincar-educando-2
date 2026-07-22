import Link from "next/link";
import { ArrowRight, BookMarked, Calendar, Dumbbell, Plus, Sprout } from "lucide-react";
import { getAllBlogPosts } from "@/lib/mdx";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { JourneySuggestions } from "@/components/journey/JourneySuggestions";
import { getDashboardSuggestions } from "@/lib/journey/suggestions";
import { differenceInYears, differenceInMonths, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Metadata } from "next";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { HeaderChildSwitcher } from "@/components/dashboard/ChildSwitcher";
import { MomentCheckIn } from "@/components/journey/MomentCheckIn";
import { isMomentContext } from "@/lib/journey/recommendation-engine";
import { QuietBackdrop } from "@/components/experience/QuietBackdrop";
import { FirstVisitGuide } from "@/components/dashboard/FirstVisitGuide";
import { ActiveSessionResume } from "@/components/dashboard/ActiveSessionResume";

export const metadata: Metadata = {
  title: "Hoje | Brincar Educando",
  robots: { index: false },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ momento?: string | string[] }>;
}) {
  const { supabase, user } = await requireAppUser();
  const params = await searchParams;
  const momentValue = Array.isArray(params.momento) ? params.momento[0] : params.momento;
  const momentContext = isMomentContext(momentValue) ? momentValue : null;
  const { activeChild: child, needsSelection } = await getActiveChild(supabase, user.id);
  const firstName =
    user.user_metadata?.nome?.split(" ")[0] ??
    user.user_metadata?.full_name?.split(" ")[0] ??
    "família";
  const hour = Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date()),
  );
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const greetingEmoji = hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙";
  let childAgeMonths: number | null = null;
  let childAgeString = "";

  if (child) {
    const birthDate = parseISO(child.data_nascimento);
    const years = differenceInYears(new Date(), birthDate);
    const months = differenceInMonths(new Date(), birthDate) % 12;
    childAgeMonths = differenceInMonths(new Date(), birthDate);

    if (years > 0) childAgeString += `${years} ${years === 1 ? "ano" : "anos"}`;
    if (years > 0 && months > 0) childAgeString += " e ";
    if (months > 0 || years === 0) childAgeString += `${months} ${months === 1 ? "mês" : "meses"}`;

  }

  // 2. Buscar Sugestões (Server Side) — filtradas pela faixa etária da criança
  const suggestions = child && childAgeMonths !== null
    ? await getDashboardSuggestions(supabase, {
        childId: child.id,
        childAgeMonths,
        interests: child.interesses,
        context: momentContext,
      })
    : null;

  // Latest 3 blog posts for suggested reading
  const posts = getAllBlogPosts().slice(0, 3);

  const quickLinks = [
    { href: "/atividades", label: "Brincar", icon: Dumbbell, desc: "Encontrar outras ideias" },
    { href: "/diario", label: "Memórias", icon: BookMarked, desc: "Guardar ou rever momentos" },
    { href: "/jornada", label: "Jornada", icon: Sprout, desc: "Ver o repertório vivido" },
  ];

  const todayDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const todayDateCapitalized = todayDate.charAt(0).toUpperCase() + todayDate.slice(1);

  return (
    <QuietBackdrop className="min-h-screen">
      {/* Header Personalizado */}
      <header className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-6 pb-6 pt-8">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[var(--color-foreground)] flex items-center gap-2">
            {greetingEmoji} {greeting}, {firstName}!
          </h1>
          <div className="text-sm text-[var(--color-muted-foreground)] space-y-0.5">
            <p className="capitalize text-gray-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {todayDateCapitalized}
            </p>
            {child ? <HeaderChildSwitcher ageText={childAgeString} /> : (
              <p className="text-[var(--color-primary)] font-medium">Crie o perfil da sua criança para sugestões personalizadas.</p>
            )}
          </div>
        </div>
        <Link href="/perfil" className="min-h-11 rounded-xl px-3 py-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5">
          Perfil
        </Link>
      </header>

      <div className="px-6 pb-8 space-y-10">

        {needsSelection && <ChildSelectionPrompt />}

        {child && !needsSelection && <MomentCheckIn selected={momentContext} />}

        {suggestions?.status === "first_visit" && (
          <FirstVisitGuide />
        )}

        <ActiveSessionResume />

        {/* Journey Suggestions (Hero + alternatives) */}
        {!needsSelection && child && suggestions?.result ? (
          <JourneySuggestions
            recommendations={suggestions.result}
            childId={child.id}
            context={momentContext}
          />
        ) : !needsSelection ? (
          <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center text-gray-400">
            <p className="text-2xl mb-2" aria-hidden="true">🧸</p>
            <p className="font-bold text-gray-600 text-sm">
              {suggestions?.status === "error"
                ? "As sugestões não carregaram desta vez"
                : child
                  ? "Ainda não há um convite seguro para esta faixa"
                  : "Crie o primeiro perfil infantil"}
            </p>
            <p className="mx-auto mt-1 max-w-md text-xs">
              {suggestions?.status === "error" && "Você ainda pode explorar atividades publicadas ou guardar uma memória. "}
              <Link href={child ? "/atividades" : "/onboarding"} className="underline hover:text-gray-700">
                {child ? "Ver opções disponíveis" : "Começar o perfil"}
              </Link>
            </p>
          </div>
        ) : null}

        {child && !needsSelection && (
          <section className="rounded-3xl bg-amber-50 p-5 md:p-6" aria-labelledby="phase-tip-title">
            <p className="text-xs font-black uppercase tracking-wide text-amber-800">Dica da fase</p>
            <h2 id="phase-tip-title" className="mt-1 text-lg font-black text-amber-950">
              {childAgeMonths !== null && childAgeMonths < 24
                ? "Siga o olhar, o gesto ou o som e responda: essa troca já é uma brincadeira inteira."
                : "Nomeie o que vocês veem e acompanhe a iniciativa; não é preciso transformar tudo em pergunta."}
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Interações responsivas e brincadeiras compartilhadas apoiam vínculo e aprendizagem inicial, sem exigir desempenho.
            </p>
            <a
              href="https://developingchild.harvard.edu/science/key-concepts/serve-and-return/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-black text-amber-950 underline underline-offset-4"
            >
              Saiba por quê — Center on the Developing Child
            </a>
          </section>
        )}

        {/* Intent links */}
        <section>
          <h2 className="mb-2 pl-1 text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)]">
            Outros jeitos de continuar
          </h2>
          <p className="mb-4 pl-1 text-sm text-[var(--color-muted-foreground)]">O que cada espaço faz, sem precisar decorar a navegação.</p>
          <div className="grid gap-3 md:grid-cols-3">
            {quickLinks.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="card-theme group flex min-h-32 flex-col gap-3 p-5 transition-all hover:bg-gray-50 hover:no-underline"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-black text-[var(--color-foreground)]">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--color-muted-foreground)]">{desc}</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-[var(--color-muted-foreground)] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        {/* New diary entry CTA */}
        <section>
          <Link
            href="/diario/nova"
            className="group flex items-center gap-4 rounded-2xl border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/8 p-5 transition-all hover:bg-[var(--color-primary)]/12 hover:no-underline"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-card)] text-[var(--color-primary)]">
              <Plus className="size-5" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="font-black text-base text-[var(--color-foreground)]">Guardar um momento</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">Uma fala, descoberta ou cena para lembrar — se quiser.</p>
            </div>
            <ArrowRight className="size-5 text-[var(--color-primary)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </section>

        {/* Blog suggestions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="pl-1 text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Para ler com calma
            </h2>
            <Link
              href="/blog"
              className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              Ver mais <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </QuietBackdrop>
  );
}
