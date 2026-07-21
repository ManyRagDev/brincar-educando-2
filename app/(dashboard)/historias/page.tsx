import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock3, MessageCircle } from "lucide-react";
import { differenceInMonths, parseISO } from "date-fns";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { requireAppUser } from "@/lib/auth/require-app-user";
import { getActiveChild } from "@/lib/children/active-child";

export const metadata: Metadata = { title: "Brincontos | Brincar Educando", robots: { index: false } };

export default async function HistoriasPage() {
  const { supabase, user } = await requireAppUser();
  const { activeChild, needsSelection } = await getActiveChild(supabase, user.id);
  if (needsSelection) return <div className="min-h-screen px-6 pt-8"><ChildSelectionPrompt /></div>;
  if (!activeChild) return <div className="p-8 text-center"><Link className="font-bold text-[var(--color-primary)]" href="/onboarding">Crie um perfil para escolher histórias.</Link></div>;
  const ageMonths = differenceInMonths(new Date(), parseISO(activeChild.data_nascimento));
  const { data: stories } = await supabase.from("historias").select("id, slug, titulo, descricao, tema, momento, duracao_minutos, faixa_etaria_min, faixa_etaria_max, proposta_familiar").eq("publicado", true).lte("faixa_etaria_min", ageMonths).gte("faixa_etaria_max", ageMonths).order("momento").order("titulo");
  return <div className="min-h-screen px-5 pb-20 pt-8 md:px-6"><header className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)]">Brincontos</p><h1 className="mt-1 font-serif text-4xl font-black">Histórias para viver juntos</h1><p className="mt-3 max-w-2xl text-[var(--color-muted-foreground)]">Leituras curtas, autorais e abertas à conversa. Não há resposta certa, lição para cumprir ou meta de leitura.</p></header><section className="mx-auto mt-8 max-w-5xl"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(stories ?? []).map(story => <Link key={story.id} href={`/historias/${story.slug}/ler`} className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40"><div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><BookOpen className="size-5" /></div><p className="mt-5 text-xs font-black uppercase tracking-wide text-[var(--color-primary)] capitalize">{story.tema ?? "História"} · {story.momento.replaceAll("_", " ")}</p><h2 className="mt-2 font-serif text-2xl font-black">{story.titulo}</h2><p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{story.descricao}</p><div className="mt-5 flex items-center gap-4 text-xs font-bold text-[var(--color-muted-foreground)]"><span className="inline-flex items-center gap-1"><Clock3 className="size-3" />{story.duracao_minutos ?? 5} min</span><span>{story.faixa_etaria_min}–{story.faixa_etaria_max} meses</span></div><p className="mt-4 border-t border-[var(--color-border)] pt-4 text-xs leading-5 text-[var(--color-muted-foreground)]"><MessageCircle className="mr-1 inline size-3" />{story.proposta_familiar}</p></Link>)}</div>{stories?.length === 0 && <p className="rounded-3xl border border-dashed p-8 text-center text-sm text-[var(--color-muted-foreground)]">Ainda não há uma história publicada para esta fase.</p>}</section></div>;
}
