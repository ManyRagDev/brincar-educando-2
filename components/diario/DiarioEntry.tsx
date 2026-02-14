"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiarioEntryProps {
  entry: {
    id: string;
    titulo: string | null;
    conteudo: string;
    humor: string | null;
    tags: string[] | null;
    data_entrada: string;
  };
}

export function DiarioEntry({ entry }: DiarioEntryProps) {
  const { isAcolher } = useTheme();
  const date = new Date(entry.data_entrada);
  const formattedTime = format(date, "HH:mm", { locale: ptBR });

  return (
    <div className="relative pl-8 pb-12 group last:pb-0">
      {/* Linha vertical */}
      <div
        className={cn(
          "absolute left-[11px] top-6 bottom-0 w-[2px]",
          isAcolher ? "bg-[var(--color-primary)]/20" : "bg-gray-200"
        )}
      />

      {/* Dot */}
      <div
        className={cn(
          "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 z-10 bg-white",
          isAcolher
            ? "border-[var(--color-primary)]"
            : "border-gray-300 group-hover:border-[var(--color-accent)] transition-colors"
        )}
      />

      {/* Card */}
      <div
        className={cn(
          "rounded-2xl border p-5 transition-all shadow-sm hover:shadow-md",
          isAcolher
            ? "bg-white border-transparent shadow-[var(--color-primary)]/5"
            : "bg-white border-gray-100"
        )}
      >
        {/* Header: humor + hora */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {entry.humor && (
              <span className="text-2xl bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0">
                {entry.humor}
              </span>
            )}
            <div>
              {entry.titulo && (
                <h3
                  className={cn(
                    "font-bold text-base leading-tight",
                    isAcolher ? "text-[var(--color-primary)]" : "text-gray-900"
                  )}
                >
                  {entry.titulo}
                </h3>
              )}
              <p className="text-xs text-gray-400 font-medium">{formattedTime}</p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <p
          className={cn(
            "text-sm leading-relaxed mb-3",
            isAcolher ? "text-gray-700" : "text-gray-600"
          )}
        >
          {entry.conteudo}
        </p>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide",
                  isAcolher
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
