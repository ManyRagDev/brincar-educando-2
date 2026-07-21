import Link from "next/link";
import { MOMENT_OPTIONS, type MomentContext } from "@/lib/journey/recommendation-engine";
import { cn } from "@/lib/utils";

export function MomentCheckIn({ selected }: { selected: MomentContext | null }) {
  return (
    <section aria-labelledby="moment-check-in-title" className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[var(--color-primary)]">Opcional</p>
          <h2 id="moment-check-in-title" className="text-lg font-black text-[var(--color-foreground)]">
            Como está o momento por aí?
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Escolha uma pista para ajustar o convite de agora. Nada fica salvo como rótulo.
          </p>
        </div>
        {selected && (
          <Link href="/dashboard" className="text-sm font-bold text-[var(--color-primary)] hover:underline">
            Limpar escolha
          </Link>
        )}
      </div>
      <div className="flex snap-x gap-2 overflow-x-auto pb-1" role="list" aria-label="Contextos do momento">
        {MOMENT_OPTIONS.map((option) => {
          const active = selected === option.value;
          return (
            <Link
              key={option.value}
              href={`/dashboard?momento=${option.value}`}
              replace
              role="listitem"
              aria-current={active ? "true" : undefined}
              className={cn(
                "min-h-11 shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)] bg-white text-[var(--color-foreground)] hover:border-[var(--color-primary)]/50",
              )}
              title={option.hint}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
