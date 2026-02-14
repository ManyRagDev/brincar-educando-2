import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ActivitySearch } from "@/components/journey/ActivitySearch";
import { ActivityGrid } from "@/components/journey/ActivityGrid";
import { createClient } from "@/lib/supabase/server";
import { differenceInMonths, parseISO } from "date-fns";

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

  // Buscar criança do usuário logado para filtro por faixa etária
  const supabase = await createClient();
  const { data: criancas } = await supabase
    .schema("brincareducando")
    .from("criancas")
    .select("id, nome, data_nascimento, genero")
    .order("created_at", { ascending: false })
    .limit(1);

  const child = criancas?.[0];
  let childAgeMonths: number | null = null;
  let childAgeLabel: string | null = null;

  if (child) {
    childAgeMonths = differenceInMonths(new Date(), parseISO(child.data_nascimento));
    // Artigo baseado no gênero declarado — inclusivo e suave
    const artigo =
      child.genero === "menino" ? "do"
      : child.genero === "menina" ? "da"
      : "de";
    childAgeLabel = `Para a idade ${artigo} ${child.nome}`;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Explorar
            </p>
            <h1 className="text-2xl font-black text-[var(--color-foreground)]">Atividades</h1>
          </div>
        </div>

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
