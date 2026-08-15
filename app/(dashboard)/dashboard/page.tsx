import Link from "next/link";
import { Calendar, ArrowRight, Compass } from "lucide-react";
import type { Metadata } from "next";
import { differenceInYears, differenceInMonths, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getAllBlogPosts } from "@/lib/mdx";
import { getContextualDashboardPost } from "@/lib/editorial/dashboard-reading";
import { getDashboardSuggestions } from "@/lib/journey/suggestions";
import { isMomentContext } from "@/lib/journey/recommendation-engine";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";
import { QuietBackdrop } from "@/components/experience/QuietBackdrop";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { HeaderChildSwitcher } from "@/components/dashboard/ChildSwitcher";
import { ActiveSessionResume } from "@/components/dashboard/ActiveSessionResume";
import { MomentContextChips } from "@/components/dashboard/MomentContextChips";
import { PhaseTeaser } from "@/components/dashboard/PhaseTeaser";
import { ContextualReadingCard } from "@/components/dashboard/ContextualReadingCard";
import { MemoryPrompt } from "@/components/dashboard/MemoryPrompt";
import { JourneySuggestions } from "@/components/journey/JourneySuggestions";
import { repairMojibake } from "@/lib/text/repair-mojibake";

export const metadata: Metadata = {
  title: "Hoje | Brincar Educando",
  robots: { index: false },
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ momento?: string | string[] }> }) {
  const { supabase, user } = await requireAppUser();
  const params = await searchParams;
  const momentValue = Array.isArray(params.momento) ? params.momento[0] : params.momento;
  const momentContext = isMomentContext(momentValue) ? momentValue : null;
  const { activeChild: child, needsSelection } = await getActiveChild(supabase, user.id);
  const firstName = repairMojibake(user.user_metadata?.nome?.split(" ")[0] ?? user.user_metadata?.full_name?.split(" ")[0] ?? "família");
  const hour = Number(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", hourCycle: "h23" }).format(new Date()));
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

  const suggestions = child && childAgeMonths !== null
    ? await getDashboardSuggestions(supabase, { childId: child.id, childAgeMonths, interests: child.interesses, context: momentContext })
    : null;
  const posts = getAllBlogPosts();
  const contextualPost = getContextualDashboardPost(posts, { childAgeMonths, momentContext });
  const todayDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const todayDateCapitalized = todayDate.charAt(0).toUpperCase() + todayDate.slice(1);

  return (
    <QuietBackdrop className="dashboard-page min-h-screen">
      <header className="dashboard-header">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-[var(--color-foreground)] sm:text-2xl">
            <span aria-hidden="true">{greetingEmoji}</span> {greeting}, {firstName}!
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[var(--color-muted-foreground)]">
            {child ? <HeaderChildSwitcher ageText={childAgeString} /> : <p className="font-semibold text-[var(--color-primary)]">Crie um perfil para receber ideias personalizadas.</p>}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-[var(--color-muted-foreground)] sm:ml-auto sm:pl-6">
          <p className="flex items-center gap-1.5 whitespace-nowrap"><Calendar className="size-3.5" aria-hidden="true" /> <span className="capitalize">{todayDateCapitalized}</span></p>
          <span className="hidden items-center gap-2 lg:flex"><Compass className="size-4" aria-hidden="true" /> Um momento de cada vez</span>
        </div>
      </header>

      <div className="dashboard-content">
        {needsSelection && <ChildSelectionPrompt />}

        {child && !needsSelection && (
          <MomentContextChips selected={momentContext} />
        )}

        <ActiveSessionResume />

        {!needsSelection && child && suggestions?.result ? (
          <JourneySuggestions recommendations={suggestions.result} childId={child.id} context={momentContext} />
        ) : !needsSelection ? (
          <section className="dashboard-empty-state" aria-labelledby="dashboard-empty-title">
            <div className="grid size-12 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><Compass className="size-6" aria-hidden="true" /></div>
            <div>
              <h2 id="dashboard-empty-title" className="text-lg font-black text-[var(--color-foreground)]">{suggestions?.status === "error" ? "As sugestões não carregaram desta vez." : child ? "Ainda não há um convite seguro para esta faixa." : "Comece pelo perfil da criança."}</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--color-muted-foreground)]">{suggestions?.status === "error" ? "Você ainda pode explorar brincadeiras publicadas ou guardar uma memória." : "Quando fizer sentido, encontre uma ideia no catálogo e volte para continuar daqui."}</p>
              <Link href={child ? "/atividades" : "/onboarding"} className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-black text-[var(--color-primary)] underline-offset-4 hover:underline">{child ? "Encontrar uma brincadeira" : "Começar o perfil"} <ArrowRight className="size-4" aria-hidden="true" /></Link>
            </div>
          </section>
        ) : null}

        {child && !needsSelection && (
          <div className="grid gap-4 lg:grid-cols-2">
            <PhaseTeaser childName={child.nome} childAgeMonths={childAgeMonths} />
            <ContextualReadingCard post={contextualPost} />
          </div>
        )}

        {child && !needsSelection && <MemoryPrompt />}
      </div>
    </QuietBackdrop>
  );
}
