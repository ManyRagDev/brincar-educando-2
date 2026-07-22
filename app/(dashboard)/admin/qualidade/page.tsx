import { redirect } from "next/navigation";
import { AlertTriangle, ClipboardCheck, FileEdit, ShieldCheck } from "lucide-react";
import { requireAppUser } from "@/lib/auth/require-app-user";

function renderMap(value: unknown) {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.entries(record as Record<string, unknown>);
}

function ageLabel(min: number | null, max: number | null) {
  if (min === null || max === null) return "Faixa a revisar";
  return `${min}–${max} meses`;
}

export default async function QualityPage() {
  const { supabase, user } = await requireAppUser();
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!isAdmin) redirect("/dashboard");

  const [{ data }, draftsResult] = await Promise.all([
    supabase.rpc("quality_snapshot"),
    supabase
      .from("atividades")
      .select("id,codigo_externo,titulo,idade_min_meses,idade_max_meses,dominio_primario,status_editorial,publicado")
      .like("codigo_externo", "EXP-%")
      .order("idade_min_meses")
      .order("codigo_externo"),
  ]);

  const snapshot = data?.[0];
  const drafts = draftsResult.data ?? [];
  const cards = [
    { label: "Atividades publicadas", value: snapshot?.atividades_publicadas ?? 0, icon: ClipboardCheck },
    { label: "Atividades Onda 1", value: drafts.length, icon: FileEdit },
    { label: "Revisões pendentes", value: snapshot?.atividades_revisao_pendente ?? 0, icon: AlertTriangle },
    {
      label: "Revisões vencidas",
      value: (snapshot?.atividades_revisao_vencida ?? 0) + (snapshot?.historias_revisao_vencida ?? 0),
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen px-6 py-8">
      <header className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Administração editorial</p>
        <h1 className="mt-1 font-serif text-4xl font-black">Cobertura e qualidade</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--color-muted-foreground)]">
          Este painel aponta lacunas e calendário de revisão. Não exibe perfis, dados pessoais ou inferências sobre crianças.
        </p>
      </header>

      <section className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="card-theme p-5">
            <Icon className="size-5 text-[var(--color-primary)]" />
            <p className="mt-4 text-3xl font-black">{value}</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{label}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-6 grid max-w-5xl gap-5 md:grid-cols-2">
        <article className="card-theme p-6">
          <h2 className="font-serif text-xl font-black">Cobertura publicada por fase</h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Mede o catálogo, nunca o desenvolvimento da criança.</p>
          <div className="mt-4 space-y-2">
            {renderMap(snapshot?.atividades_por_faixa).map(([key, value]) => (
              <div className="flex justify-between rounded-xl bg-[var(--color-muted)] p-3 text-sm" key={key}>
                <span>{key}</span>
                <strong>{String(value)}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="card-theme p-6">
          <h2 className="font-serif text-xl font-black">Cobertura publicada por ambiente</h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Ajuda a equilibrar opções para diferentes contextos.</p>
          <div className="mt-4 space-y-2">
            {renderMap(snapshot?.atividades_por_contexto).map(([key, value]) => (
              <div className="flex justify-between rounded-xl bg-[var(--color-muted)] p-3 text-sm" key={key}>
                <span className="capitalize">{key}</span>
                <strong>{String(value)}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card-theme mx-auto mt-6 max-w-5xl p-6" aria-labelledby="wave-one-title">
        <div className="flex items-start gap-3">
          <FileEdit className="mt-1 size-5 text-[var(--color-primary)]" aria-hidden="true" />
          <div>
            <h2 id="wave-one-title" className="font-serif text-xl font-black">Onda 1</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Acompanhe aqui o estado editorial das atividades implementadas para 0–23 meses.
            </p>
          </div>
        </div>

        {draftsResult.error ? (
          <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">Não foi possível carregar os rascunhos.</p>
        ) : drafts.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-[var(--color-muted)] p-4 text-sm text-[var(--color-muted-foreground)]">
            A Onda 1 ainda não foi sincronizada neste ambiente.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <article key={draft.id} className="rounded-2xl border border-[var(--color-border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black text-[var(--color-primary)]">{draft.codigo_externo}</span>
                  <span className={draft.publicado
                    ? "rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-800"
                    : "rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black uppercase text-amber-800"}
                  >
                    {draft.status_editorial}
                  </span>
                </div>
                <h3 className="mt-2 font-black">{draft.titulo}</h3>
                <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
                  {ageLabel(draft.idade_min_meses, draft.idade_max_meses)} · {draft.dominio_primario?.replaceAll("_", " ") ?? "domínio a revisar"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <aside className="mx-auto mt-6 max-w-5xl rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <strong>Protocolo de revisão:</strong> rascunho não é conteúdo aprovado. Publicação exige revisão editorial, segurança,
        acessibilidade, validação com cuidadores, versão e próxima revisão.
      </aside>
    </main>
  );
}
