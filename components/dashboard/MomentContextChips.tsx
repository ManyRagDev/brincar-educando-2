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
    <div className="dashboard-context-scroller">
      <div
        role="region"
        aria-label="Filtros de contexto da brincadeira"
        className="dashboard-context-chips no-scrollbar"
      >
        <Link
          href="/dashboard"
          replace
          scroll={false}
          aria-current={!selected ? "true" : undefined}
          className={cn(
            "dashboard-context-chip",
            !selected && "is-active",
          )}
        >
          <span className="dashboard-context-chip-icon"><Sparkles aria-hidden="true" /></span>
          <span>Para agora</span>
        </Link>

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
                "dashboard-context-chip",
                active && "is-active",
              )}
            >
              <span className="dashboard-context-chip-icon"><Icon aria-hidden="true" /></span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
