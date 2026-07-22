import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ActivitySearch } from "@/components/journey/ActivitySearch";
import { ActivityGrid } from "@/components/journey/ActivityGrid";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { differenceInMonths, parseISO } from "date-fns";
import { getActiveChild } from "@/lib/children/active-child";

export const metadata: Metadata = {
  title: "Atividades | Brincar Educando",
  robots: { index: false },
};

export default async function AtividadesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const { supabase, user } = await requireAppUser();
  const { activeChild: child } = await getActiveChild(supabase, user.id);
  let childAgeMonths: number | null = null;
  let childAgeLabel: string | null = null;

  if (child) {
    childAgeMonths = differenceInMonths(new Date(), parseISO(child.data_nascimento));
    childAgeLabel = `Para a fase de ${child.nome}`;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 pb-6 pt-8">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)]">Brincar</p>
            <h1 className="text-2xl font-black text-[var(--color-foreground)]">Encontre uma brincadeira</h1>
          </div>
        </div>
        <p className="mb-6 max-w-2xl text-sm leading-6 text-[var(--color-muted-foreground)]">
          Explore convites para diferentes ritmos, espaços e níveis de preparo. Abrir uma ideia não inicia nada: vocês escolhem, adaptam e brincam quando fizer sentido.
        </p>

        {/* Busca e filtros — com dados da criança para filtro de idade */}
        <ActivitySearch
          childAgeLabel={childAgeLabel}
          childAgeMonths={childAgeMonths}
        />
      </header>

      {/* Grade de resultados */}
      <div className="px-6">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[280px] w-full bg-[var(--color-muted)]/30 rounded-2xl animate-pulse" />
            ))}
          </div>
        }>
          <ActivityGrid searchParams={resolvedSearchParams} childAgeMonths={childAgeMonths} />
        </Suspense>
      </div>
    </div>
  );
}
