import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PhaseTeaser({ childName, childAgeMonths }: { childName: string; childAgeMonths: number | null }) {
  const message = childAgeMonths !== null && childAgeMonths < 24
    ? "Movimento, imitação e pequenas trocas podem virar brincadeira inteira."
    : "Movimento, imitação e pequenas escolhas ganham espaço no cotidiano.";

  return (
    <section className="dashboard-secondary-card dashboard-phase-card" aria-labelledby="phase-teaser-title">
      <div className="relative min-h-36 overflow-hidden rounded-2xl sm:min-h-40 sm:w-[42%]">
        <Image src="/images/dashboard/phase-path.webp" alt="Caminho ilustrado com broto, folhas e objetos para explorar" fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <p className="dashboard-eyebrow text-[#527449]">Enquanto {childName} vive esta fase</p>
        <h2 id="phase-teaser-title" className="mt-2 text-xl font-black leading-tight text-[var(--color-foreground)]">Movimento, imitação e pequenas escolhas</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{message} Nada aqui é checklist ou comparação.</p>
        <Link href="/orientacoes" className="mt-4 inline-flex min-h-10 w-fit items-center gap-1 text-sm font-black text-[#527449] underline-offset-4 hover:underline">
          Passear por esta fase <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
