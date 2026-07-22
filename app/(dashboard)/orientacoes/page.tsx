import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, HeartHandshake, ShieldCheck, Stethoscope } from "lucide-react";
import { QuietBackdrop } from "@/components/experience/QuietBackdrop";

export const metadata: Metadata = {
  title: "Orientações para a família | Brincar Educando",
  description: "Entenda o papel do Brincar Educando e saiba como buscar apoio diante de preocupações.",
  robots: { index: false },
};

const officialResources = [
  {
    label: "Caderneta da Criança — Ministério da Saúde",
    href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta/caderneta",
  },
  {
    label: "Desenvolvimento infantil — Ministério da Saúde",
    href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/primeira-infancia/desenvolvimento-infantil",
  },
  {
    label: "Cuidado responsivo e primeira infância — Organização Mundial da Saúde",
    href: "https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/child-health/nurturing-care",
  },
] as const;

export default function OrientacoesPage() {
  return (
    <QuietBackdrop className="min-h-screen px-6 pb-14 pt-8">
      <main className="mx-auto max-w-4xl">
        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">
            Entender esta fase
          </p>
          <h1 className="mt-2 font-serif text-4xl font-black">Orientação para a família</h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--color-muted-foreground)]">
            Brincar junto ajuda a conhecer a criança e cultivar vínculos. Aqui você encontra referências para compreender a fase e buscar apoio — não testes, notas ou diagnósticos.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="card-theme p-6" aria-labelledby="app-role-title">
            <HeartHandshake className="h-6 w-6 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 id="app-role-title" className="mt-4 font-serif text-2xl font-black">
              O que fazemos
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted-foreground)]">
              Oferecemos convites para brincar, perguntas abertas e um espaço para guardar observações. Cada criança
              tem seu ritmo, e uma atividade pode ser adaptada, repetida ou interrompida.
            </p>
          </section>

          <section className="card-theme p-6" aria-labelledby="app-limit-title">
            <ShieldCheck className="h-6 w-6 text-[var(--color-secondary)]" aria-hidden="true" />
            <h2 id="app-limit-title" className="mt-4 font-serif text-2xl font-black">
              O que não fazemos
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-muted-foreground)]">
              Não medimos inteligência, não comparamos crianças, não rastreamos atrasos e não substituímos consultas,
              avaliações ou orientações individualizadas de saúde e educação.
            </p>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)] dark:bg-black/20">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-black">Se você está preocupado</h2>
              <ol className="mt-4 space-y-3 text-[var(--color-muted-foreground)]">
                <li>
                  <strong className="text-[var(--color-foreground)]">1. Registre exemplos concretos.</strong> Anote o
                  que chamou sua atenção, quando acontece e em quais contextos.
                </li>
                <li>
                  <strong className="text-[var(--color-foreground)]">2. Converse com quem acompanha a criança.</strong>{" "}
                  Leve suas observações à pediatra, ao pediatra ou à equipe da Unidade Básica de Saúde.
                </li>
                <li>
                  <strong className="text-[var(--color-foreground)]">3. Não espere para tirar dúvidas.</strong> A
                  família conhece a criança de perto; preocupações merecem escuta profissional, sem culpa ou rótulos.
                </li>
              </ol>
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                Em uma situação urgente ou se houver risco imediato à criança, procure um serviço de urgência da sua
                região. Esta página oferece orientação geral e não determina a conduta para um caso individual.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 card-theme p-6 md:p-8" aria-labelledby="sources-title">
          <div className="flex items-center gap-3">
            <BookOpenCheck className="h-5 w-5 text-[var(--color-primary)]" aria-hidden="true" />
            <h2 id="sources-title" className="font-serif text-2xl font-black">Fontes confiáveis</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            Materiais públicos para acompanhar o cuidado, preparar conversas com profissionais e compreender a
            importância de interações responsivas na primeira infância.
          </p>
          <ul className="mt-5 space-y-3">
            {officialResources.map((resource) => (
              <li key={resource.href}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 font-bold text-[var(--color-primary)] underline-offset-4 hover:underline"
                >
                  {resource.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <Link href="/dashboard" className="mt-7 inline-flex min-h-11 items-center font-bold text-[var(--color-primary)]">
          Voltar para Hoje
        </Link>
      </main>
    </QuietBackdrop>
  );
}
