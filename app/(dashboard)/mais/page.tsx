import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookHeart, Info, Settings, Sparkles } from "lucide-react";
import { SectionIntroduction } from "@/components/experience/SectionIntroduction";
import { QuietBackdrop } from "@/components/experience/QuietBackdrop";
import { mobileMoreNavigation } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Mais | Brincar Educando",
  robots: { index: false },
};

const visualGroups = [
  {
    title: "Descobrir",
    description: "Conteúdo para entender melhor cada fase e imaginar próximos encontros.",
    items: mobileMoreNavigation.slice(0, 2),
  },
  {
    title: "Família e preferências",
    description: "Ajustes da conta e informações que ajudam a experiência a combinar com vocês.",
    items: mobileMoreNavigation.slice(2),
  },
];

export default function MaisPage() {
  return (
    <QuietBackdrop className="min-h-screen px-5 pb-24 pt-8 md:px-8 md:pt-12">
      <main className="mx-auto max-w-4xl">
        <SectionIntroduction
          eyebrow="Outros caminhos"
          title="Mais do Brincar Educando"
          description="Aqui ficam as áreas de consulta, histórias em preparação, perfil e preferências. Nada precisa ser visto antes de vocês encontrarem um convite para agora."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {visualGroups.map((group) => (
            <section key={group.title} className="card-theme p-5 md:p-6" aria-labelledby={`${group.title}-title`}>
              <h2 id={`${group.title}-title`} className="font-serif text-xl font-black">{group.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{group.description}</p>
              <div className="mt-5 space-y-2">
                {group.items.map(({ href, label, description, icon: Icon, badge }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex min-h-16 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-muted)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]" aria-hidden="true">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 font-black text-[var(--color-foreground)]">
                        {label}
                        {badge && <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-[var(--color-primary)]">{badge}</span>}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-[var(--color-muted-foreground)]">{description}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-5 rounded-3xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/5 p-5 md:p-6" aria-labelledby="how-it-works-title">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-card)] text-[var(--color-primary)]" aria-hidden="true"><Sparkles className="size-5" /></span>
            <div>
              <h2 id="how-it-works-title" className="font-serif text-xl font-black">Como cada área funciona</h2>
              <div className="mt-3 grid gap-3 text-sm leading-6 text-[var(--color-muted-foreground)] sm:grid-cols-3">
                <p><strong className="text-[var(--color-foreground)]">Brincar:</strong> encontrar e viver convites.</p>
                <p><strong className="text-[var(--color-foreground)]">Memórias:</strong> guardar o que quiser lembrar.</p>
                <p><strong className="text-[var(--color-foreground)]">Jornada:</strong> consultar uma síntese automática.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-white hover:brightness-95"><BookHeart className="size-4" />Voltar para Hoje</Link>
          <Link href="/privacidade" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--color-border)] px-4"><Info className="size-4" />Privacidade e dados</Link>
          <Link href="/configuracoes" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--color-border)] px-4"><Settings className="size-4" />Configurações</Link>
        </div>
      </main>
    </QuietBackdrop>
  );
}
