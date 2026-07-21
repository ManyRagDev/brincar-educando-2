"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Camera, MessageCircle } from "lucide-react";

interface TimelineEntryProps {
    execution: {
        id: string;
        data_conclusao: string;
        duracao_minutos: number | null;
        avaliacao: number | null;
        notas: string | null;
        fotos_urls: string[] | null;
        habilidades_desbloqueadas: string[] | null;
        atividade: {
            titulo: string;
            categoria: string;
            imagem_url: string | null;
        };
    };
}

export function TimelineEntry({ execution }: TimelineEntryProps) {
    const { isAcolher } = useTheme();
    const date = new Date(execution.data_conclusao);

    const categoryIcons: Record<string, string> = {
        arte: "🎨",
        cognitivo: "🧩",
        natureza: "🌿",
        linguagem: "🗣️",
        movimento: "🏃",
    };

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

            {/* Bolinha do tempo */}
            <div
                className={cn(
                    "absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 z-10 flex items-center justify-center bg-white",
                    isAcolher
                        ? "border-[var(--color-primary)]"
                        : "border-gray-300 group-hover:border-[var(--color-accent)] transition-colors"
                )}
            />

            {/* Container do Card */}
            <div
                className={cn(
                    "rounded-2xl border p-5 transition-all shadow-sm hover:shadow-md",
                    isAcolher
                        ? "bg-white border-transparent shadow-[var(--color-primary)]/5"
                        : "bg-white border-gray-100"
                )}
            >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl bg-gray-50 w-10 h-10 flex items-center justify-center rounded-lg">
                            {categoryIcons[execution.atividade.categoria] || "🎲"}
                        </span>
                        <div>
                            <h3 className={cn(
                                "font-bold text-lg leading-tight",
                                isAcolher ? "text-[var(--color-primary)]" : "text-gray-900"
                            )}>
                                {execution.atividade.titulo}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <Clock className="w-3 h-3" />
                                <span>{formattedTime}</span>
                                {execution.duracao_minutos && (
                                    <>
                                        <span>•</span>
                                        <span>{execution.duracao_minutos} min</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {execution.avaliacao && (
                        <span className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-semibold text-[var(--color-muted-foreground)]">
                            {execution.avaliacao >= 4
                                ? "Foi envolvente"
                                : execution.avaliacao === 3
                                  ? "Foi tranquilo"
                                  : "Não era o momento"}
                        </span>
                    )}
                </div>

                {/* Fotos */}
                {execution.fotos_urls && execution.fotos_urls.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
                        <div className="flex min-h-11 items-center gap-2 rounded-xl bg-gray-100 px-4 text-sm text-gray-500">
                            <Camera className="h-4 w-4" aria-hidden="true" />
                            {execution.fotos_urls.length} {execution.fotos_urls.length === 1 ? "foto guardada" : "fotos guardadas"}
                        </div>
                    </div>
                )}

                {/* Citação/Nota */}
                {execution.notas && (
                    <div className={cn(
                        "p-3 rounded-xl mb-4 text-sm italic relative",
                        isAcolher
                            ? "bg-[var(--color-primary)]/5 text-[var(--color-primary-foreground)]"
                            : "bg-gray-50 text-gray-600"
                    )}>
                        <MessageCircle className={cn(
                            "w-4 h-4 absolute -top-2 left-4 fill-white",
                            isAcolher ? "text-[var(--color-primary)]" : "text-gray-300"
                        )} />
                        &ldquo;{execution.notas}&rdquo;
                    </div>
                )}
            </div>
        </div>
    );
}
