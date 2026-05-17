import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acesso indisponivel | Brincar Educando",
  robots: { index: false },
};

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-black text-[var(--color-foreground)]">
            Acesso indisponivel
          </h1>
          <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
            Nao conseguimos ativar o Brincar Educando para sua Conta ManyLabs.
            Tente novamente ou fale com o suporte.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/auth" className="btn-primary-theme rounded-2xl px-5 py-3 font-bold">
            Voltar ao login
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-[var(--color-border)] px-5 py-3 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
          >
            Ir para a pagina inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
