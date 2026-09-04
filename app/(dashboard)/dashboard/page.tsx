import type { Metadata } from "next";
import { differenceInMonths, differenceInYears, parseISO } from "date-fns";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";
import { getAllBlogPosts } from "@/lib/mdx";
import { getContextualDashboardPost } from "@/lib/editorial/dashboard-reading";
import { getDashboardSuggestions } from "@/lib/journey/suggestions";
import { isMomentContext } from "@/lib/journey/recommendation-engine";
import { repairMojibake } from "@/lib/text/repair-mojibake";
import { OfficialDashboardExperience } from "@/components/dashboard/OfficialDashboardExperience";

export const metadata: Metadata = {
  title: "Hoje | Brincar Educando",
  robots: { index: false },
};

function formatChildAge(birthDate: string) {
  const parsedDate = parseISO(birthDate);
  const now = new Date();
  const years = differenceInYears(now, parsedDate);
  const months = differenceInMonths(now, parsedDate) % 12;

  if (years > 0 && months > 0) {
    return `${years} ${years === 1 ? "ano" : "anos"} e ${months} ${months === 1 ? "mês" : "meses"}`;
  }
  if (years > 0) return `${years} ${years === 1 ? "ano" : "anos"}`;
  return `${months} ${months === 1 ? "mês" : "meses"}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ momento?: string | string[] }>;
}) {
  const { supabase, user } = await requireAppUser();
  const params = await searchParams;
  const momentValue = Array.isArray(params.momento) ? params.momento[0] : params.momento;
  const momentContext = isMomentContext(momentValue) ? momentValue : null;
  const { activeChild, needsSelection } = await getActiveChild(supabase, user.id);
  const firstName = repairMojibake(
    user.user_metadata?.nome?.split(" ")[0]
      ?? user.user_metadata?.full_name?.split(" ")[0]
      ?? "família",
  );
  const now = new Date();
  const hour = Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now),
  );
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const greetingEmoji = hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙";
  const childAgeMonths = activeChild
    ? differenceInMonths(now, parseISO(activeChild.data_nascimento))
    : null;
  const suggestions = activeChild && childAgeMonths !== null
    ? await getDashboardSuggestions(supabase, {
        childId: activeChild.id,
        childAgeMonths,
        interests: activeChild.interesses,
        context: momentContext,
      })
    : null;
  const contextualPost = getContextualDashboardPost(getAllBlogPosts(), {
    childAgeMonths,
    momentContext,
  });

  return (
    <OfficialDashboardExperience
      firstName={firstName}
      greeting={greeting}
      greetingEmoji={greetingEmoji}
      childName={activeChild?.nome ? repairMojibake(activeChild.nome) : null}
      childAge={activeChild ? formatChildAge(activeChild.data_nascimento) : null}
      childAgeMonths={childAgeMonths}
      childId={activeChild?.id ?? null}
      needsSelection={needsSelection}
      momentContext={momentContext}
      recommendations={suggestions?.result ?? null}
      recommendationFailed={suggestions?.status === "error"}
      contextualPost={contextualPost ? {
        slug: contextualPost.slug,
        title: contextualPost.metadata.title,
        excerpt: contextualPost.metadata.excerpt,
        thumbnail: contextualPost.metadata.thumbnail,
        readTime: contextualPost.metadata.readTime,
      } : null}
    />
  );
}
