import Link from "next/link";
import { BatteryLow, Check, Clock3, Leaf, PackageOpen, Sun, Zap } from "lucide-react";
import { MOMENT_OPTIONS, type MomentContext } from "@/lib/journey/recommendation-engine";
import { cn } from "@/lib/utils";

const MOMENT_ICONS = {
  quick: Clock3,
  move: Zap,
  calm: Leaf,
  no_materials: PackageOpen,
  outside: Sun,
  tired_adult: BatteryLow,
} satisfies Record<MomentContext, typeof Clock3>;

export function MomentCheckIn({ selected }: { selected: MomentContext | null }) {
  return (
    <section aria-labelledby="moment-check-in-title" className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-[var(--color-primary)]">Opcional</p>
          <h2 id="moment-check-in-title" className="text-lg font-black text-[var(--color-foreground)]">
            O que combina com agora?
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Escolha o que mais importa neste momento. Nada fica salvo como rótulo.
          </p>
        </div>
        {selected && (
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center rounded-xl px-2 text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 hover:underline"
          >
            Limpar escolha
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="list" aria-label="Contextos do momento">
        {MOMENT_OPTIONS.map((option) => {
          const active = selected === option.value;
          const Icon = MOMENT_ICONS[option.value];

          return (
            <Link
              key={option.value}
              href={`/dashboard?momento=${option.value}`}
              replace
              role="listitem"
              aria-current={active ? "true" : undefined}
              className={cn(
                "relative flex min-h-24 flex-col rounded-2xl border p-3 text-left transition-[background-color,border-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 active:scale-[0.98] md:min-h-28 md:p-4",
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-sm ring-1 ring-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-xl",
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
                )}
                aria-hidden="true"
              >
                <Icon className="size-4" strokeWidth={2.4} />
              </span>
              {active && (
                <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-white" aria-hidden="true">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              )}
              <span className="mt-2 text-sm font-black leading-tight text-[var(--color-foreground)]">
                {option.label}
              </span>
              <span className="mt-1 text-xs leading-snug text-[var(--color-muted-foreground)]">
                {option.hint}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
