import { redirect } from "next/navigation";
import { AlertTriangle, BookOpen, ClipboardCheck, ShieldCheck } from "lucide-react";
import { requireAppUser } from "@/lib/auth/require-app-user";

export default async function QualityPage() {
  const { supabase, user } = await requireAppUser();
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!isAdmin) redirect("/dashboard");
  const { data } = await supabase.rpc("quality_snapshot");
  const snapshot = data?.[0];
  const cards = [
    { label: "Atividades publicadas", value: snapshot?.atividades_publicadas ?? 0, icon: ClipboardCheck },
    { label: "Histórias publicadas", value: snapshot?.historias_publicadas ?? 0, icon: BookOpen },
    { label: "Revisões pendentes", value: snapshot?.atividades_revisao_pendente ?? 0, icon: AlertTriangle },
    { label: "Revisões vencidas", value: (snapshot?.atividades_revisao_vencida ?? 0) + (snapshot?.historias_revisao_vencida ?? 0), icon: ShieldCheck },
  ];
  const renderMap = (value: unknown) => Object.entries((value && typeof value === "object" && !Array.isArray(value) ? value : {}) as Record<string, unknown>);
  return <main className="min-h-screen px-6 py-8"><header className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Administração editorial</p><h1 className="mt-1 font-serif text-4xl font-black">Cobertura e qualidade</h1><p className="mt-3 max-w-2xl text-sm text-[var(--color-muted-foreground)]">Este painel aponta lacunas de conteúdo e calendário de revisão. Não exibe perfis, dados pessoais ou inferências sobre crianças.</p></header><section className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(({label,value,icon:Icon})=><article key={label} className="card-theme p-5"><Icon className="size-5 text-[var(--color-primary)]"/><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{label}</p></article>)}</section><section className="mx-auto mt-6 grid max-w-5xl gap-5 md:grid-cols-2"><article className="card-theme p-6"><h2 className="font-serif text-xl font-black">Cobertura por fase</h2><p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Use estas contagens para priorizar revisão editorial; não para comparar crianças.</p><div className="mt-4 space-y-2">{renderMap(snapshot?.atividades_por_faixa).map(([k,v])=><div className="flex justify-between rounded-xl bg-[var(--color-muted)] p-3 text-sm" key={k}><span>{k}</span><strong>{String(v)}</strong></div>)}</div></article><article className="card-theme p-6"><h2 className="font-serif text-xl font-black">Cobertura por ambiente</h2><p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Ajuda a equilibrar opções possíveis para diferentes contextos.</p><div className="mt-4 space-y-2">{renderMap(snapshot?.atividades_por_contexto).map(([k,v])=><div className="flex justify-between rounded-xl bg-[var(--color-muted)] p-3 text-sm" key={k}><span className="capitalize">{k}</span><strong>{String(v)}</strong></div>)}</div></article></section><aside className="mx-auto mt-6 max-w-5xl rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950"><strong>Protocolo de revisão:</strong> toda alteração relevante passa por autoria, revisão editorial/pedagógica e segurança; a próxima revisão deve ser agendada no conteúdo. Avaliações de usabilidade e pareceres profissionais devem ser registrados fora deste painel antes de ampliar o catálogo.</aside></main>;
}
