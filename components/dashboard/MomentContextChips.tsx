"use client";

import Link from "next/link";
import { Clock3, Leaf, PackageOpen, Sun, Zap, BatteryLow, Sparkles } from "lucide-react";
import { MOMENT_OPTIONS, type MomentContext } from "@/lib/journey/recommendation-engine";
import { cn } from "@/lib/utils";

const icons = {
  quick: Clock3,
  move: Zap,
  calm: Leaf,
  no_materials: PackageOpen,
  outside: Sun,
  tired_adult: BatteryLow,
} satisfies Record<MomentContext, typeof Clock3>;

const shortLabels: Record<MomentContext, string> = {
  quick: "5 minutos",
  move: "Gastar energia",
  calm: "Desacelerar",
  no_materials: "Sem materiais",
  outside: "Ao ar livre",
  tired_adult: "Pouca energia",
};

export function MomentContextChips({ selected }: { selected: MomentContext | null }) {
  return (
    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
      <div
        role="region"
        aria-label="Filtros de contexto da brincadeira"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth"
      >
        {/* Opção padrão: Para agora */}
        <Link
          href="/dashboard"
          replace
          scroll={false}
          aria-current={!selected ? "true" : undefined}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all select-none active:scale-95",
            !selected
              ? "bg-[var(--color-primary)] text-white shadow-xs font-black"
              : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-foreground)]"
          )}
        >
          <Sparkles className={cn("size-3.5", !selected ? "text-white" : "text-[var(--color-primary)]")} aria-hidden="true" />
          <span>Para agora</span>
        </Link>

        {/* Demais opções do MOMENT_OPTIONS */}
        {MOMENT_OPTIONS.map((option) => {
          const Icon = icons[option.value];
          const active = option.value === selected;
          const label = shortLabels[option.value] || option.label;

          return (
            <Link
              key={option.value}
              href={`/dashboard?momento=${option.value}`}
              replace
              scroll={false}
              aria-current={active ? "true" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all select-none active:scale-95",
                active
                  ? "bg-[var(--color-primary)] text-white shadow-xs font-black"
                  : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-foreground)]"
              )}
            >
              <Icon className={cn("size-3.5", active ? "text-white" : "text-[var(--color-primary)]")} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
