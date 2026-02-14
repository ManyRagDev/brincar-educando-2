"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { Infinity, Sparkles } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps) {
  const { theme, toggleTheme, isAcolher } = useTheme();

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className={cn(
              "theme-toggle select-none group relative",
              className
            )}
            aria-label={
              isAcolher 
                ? "Ativar modo Vibrante (mais estímulos visuais)" 
                : "Ativar modo Acolher (baixo estímulo, ideal para neurodivergentes)"
            }
            title={isAcolher ? "Mudar para Vibrante" : "Mudar para Acolher (baixo estímulo)"}
          >
            {/* Ícone de infinito - símbolo de neurodiversidade */}
            <div className="relative">
              <Infinity 
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isAcolher 
                    ? "text-[var(--color-primary)]" 
                    : "text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)]"
                )} 
                strokeWidth={2.5}
              />
              {/* Indicador sutil quando ativo */}
              {isAcolher && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
              )}
            </div>

            {showLabel && (
              <span className="hidden sm:inline text-sm">
                {isAcolher ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-[var(--color-primary)] font-medium">Modo Acolher</span>
                    <Sparkles className="h-3 w-3 text-[var(--color-primary)]" />
                  </span>
                ) : (
                  <span className="text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors">
                    Modo Acolher
                  </span>
                )}
              </span>
            )}

            {/* Toggle track */}
            <span
              className="relative flex h-5 w-10 items-center rounded-full px-0.5 transition-colors duration-300"
              style={{
                backgroundColor: isAcolher
                  ? "var(--color-primary)"
                  : "var(--color-border)",
              }}
            >
              <span
                className="h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300"
                style={{
                  transform: isAcolher ? "translateX(20px)" : "translateX(0)",
                }}
              />
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="max-w-xs bg-[var(--color-card)] border-[var(--color-border)] p-4"
        >
          <div className="space-y-2">
            <p className="font-semibold text-[var(--color-foreground)]">
              {isAcolher ? "Modo Acolher Ativo ✨" : "Conheça o Modo Acolher"}
            </p>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
              {isAcolher 
                ? "Cores mais suaves, menos estímulos visuais e uma experiência mais tranquila. Ideal para pessoas neurodivergentes ou que preferem menos distrações."
                : "Ative para uma experiência com menos estímulos visuais, cores suaves e interface mais tranquila. Pensado especialmente para pessoas neurodivergentes."
              }
            </p>
            <p className="text-xs text-[var(--color-primary)] font-medium">
              Clique para {isAcolher ? "voltar ao modo Vibrante" : "ativar o modo Acolher"}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
