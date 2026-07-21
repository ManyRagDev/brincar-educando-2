import { NewEntryForm } from "@/components/diario/NewEntryForm";
import type { Metadata } from "next";
import { getActiveChild } from "@/lib/children/active-child";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import Link from "next/link";
import { requireAppUser } from "@/lib/auth/require-app-user";

export const metadata: Metadata = {
  title: "Nova entrada | Diário | Brincar Educando",
  robots: { index: false },
};

const allowedTypes = ["livre", "fala", "descoberta", "desafio", "riso", "foto"] as const;

export default async function NovaDiarioPage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const { tipo } = await searchParams;
  const registrationType = allowedTypes.find((item) => item === tipo) ?? "livre";
  const { supabase, user } = await requireAppUser();
  const { activeChild, needsSelection } = await getActiveChild(supabase, user.id);
  const childName = activeChild?.nome ?? null;
  const criancaId = activeChild?.id ?? null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-2xl px-6 py-8">
        {needsSelection ? (
          <ChildSelectionPrompt />
        ) : activeChild ? (
          <NewEntryForm childName={childName} criancaId={criancaId} registrationType={registrationType} />
        ) : (
          <div className="card-theme p-6 text-center">
            <h1 className="font-serif text-2xl font-black">Crie um perfil primeiro</h1>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Assim a memória fica guardada na jornada certa.
            </p>
            <Link href="/onboarding" className="btn-primary-theme mt-5 inline-flex min-h-11 items-center rounded-xl px-5">
              Criar perfil
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
