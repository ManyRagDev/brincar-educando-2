"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Clock3, Leaf, PackageOpen, Sun, Zap, BatteryLow } from "lucide-react";
import { MOMENT_OPTIONS, type MomentContext } from "@/lib/journey/recommendation-engine";
import { cn } from "@/lib/utils";

const icons = { quick: Clock3, move: Zap, calm: Leaf, no_materials: PackageOpen, outside: Sun, tired_adult: BatteryLow } satisfies Record<MomentContext, typeof Clock3>;

export function MomentContextControl({ selected }: { selected: MomentContext | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = MOMENT_OPTIONS.find((option) => option.value === selected);

  // Fecha o dropdown ao clicar fora ou apertar Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative z-30 w-fit max-w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#e9d8ca] bg-white/90 dark:bg-[var(--color-card)]/90 backdrop-blur-sm px-4 py-2 text-sm font-bold text-[var(--color-foreground)] shadow-xs transition hover:border-[var(--color-primary)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      >
        <span className="text-[var(--color-primary)]">Ajustar ao momento</span>
        <span className="truncate text-[var(--color-muted-foreground)]">· {selectedOption?.label ?? "Nenhuma escolha"}</span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-13 sm:top-14 w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="mb-2.5 px-2">
            <p className="text-sm font-black text-[var(--color-foreground)]">O que combina com agora?</p>
            <p className="mt-0.5 text-xs leading-5 text-[var(--color-muted-foreground)]">Escolha uma pista, se ajudar. Nada fica salvo como rótulo.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MOMENT_OPTIONS.map((option) => {
              const Icon = icons[option.value];
              const active = option.value === selected;
              return (
                <Link
                  key={option.value}
                  href={`/dashboard?momento=${option.value}`}
                  replace
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative flex min-h-24 flex-col rounded-xl border p-3 text-left transition select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] active:scale-98",
                    active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-xs"
                      : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5",
                  )}
                >
                  <span className={cn("grid size-7 place-items-center rounded-lg", active ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]")}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="mt-2 text-xs font-black leading-tight text-[var(--color-foreground)]">{option.label}</span>
                  <span className="mt-1 text-[11px] leading-snug text-[var(--color-muted-foreground)]">{option.hint}</span>
                  {active && <Check className="absolute right-2 top-2 size-4 text-[var(--color-primary)]" aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
          {selected && (
            <Link
              href="/dashboard"
              replace
              onClick={() => setIsOpen(false)}
              className="mt-2.5 inline-flex min-h-10 items-center px-2 text-xs font-bold text-[var(--color-primary)] underline-offset-4 hover:underline"
            >
              Limpar escolha
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
