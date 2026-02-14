import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewEntryForm } from "@/components/diario/NewEntryForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova entrada | Diário | Brincar Educando",
  robots: { index: false },
};

export default async function NovaDiarioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: criancas } = await supabase
    .from("criancas")
    .select("nome")
    .order("created_at", { ascending: false })
    .limit(1);

  const childName = criancas?.[0]?.nome ?? null;
  const criancaId = criancas?.[0]?.id ?? null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-2xl px-6 py-8">
        <NewEntryForm childName={childName} criancaId={criancaId} />
      </div>
    </div>
  );
}
