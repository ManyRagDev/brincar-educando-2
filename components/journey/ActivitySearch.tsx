"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, X, Check } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";

interface ActivitySearchProps {
    /** Label personalizado para o filtro de faixa etária, ex: "Para a idade da Ana".
     *  Se null, o botão de filtro por idade não é exibido (sem criança cadastrada). */
    childAgeLabel?: string | null;
    /** Idade da criança em meses. Necessário para que a URL guarde o contexto correto. */
    childAgeMonths?: number | null;
}

export function ActivitySearch({ childAgeLabel = null, childAgeMonths = null }: ActivitySearchProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const { isAcolher } = useTheme();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    const handleFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            if (params.get(key) === value) {
                params.delete(key); // Toggle off if clicked again
            } else {
                params.set(key, value);
            }
        } else {
            params.delete(key);
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const currentFilter = (key: string) => searchParams.get(key);

    // Toggle do filtro de faixa etária
    const isAgeActive = currentFilter('idade_adequada') === '1';
    const handleAgeFilter = () => {
        const params = new URLSearchParams(searchParams);
        if (isAgeActive) {
            params.delete('idade_adequada');
        } else {
            params.set('idade_adequada', '1');
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const filters = [
        { key: 'energia', value: 'baixa', label: '⚡ Baixa Energia' },
        { key: 'energia', value: 'media', label: '⚡⚡ Média' },
        { key: 'energia', value: 'alta', label: '⚡⚡⚡ Alta' },
        { key: 'local', value: 'interno', label: '🏠 Casa' },
        { key: 'local', value: 'ao ar livre', label: '🌳 Ar Livre' },
        { key: 'categoria', value: 'sensorial', label: '🖐️ Sensorial' },
        { key: 'categoria', value: 'movimento', label: '🏃 Movimento' },
        { key: 'categoria', value: 'criativa', label: '🎨 Criativa' },
        { key: 'categoria', value: 'cognitiva', label: '🧠 Cognitiva' },
    ];

    const currentQuery = searchParams.get('q') ?? '';

    const suggestions = [
        { label: "☔ Dias de chuva", filter: { key: 'local', value: 'interno' } },
        { label: "⚡ Gastar energia", filter: { key: 'energia', value: 'alta' } },
        { label: "🌙 Para acalmar", filter: { key: 'energia', value: 'baixa' } },
        { label: "🌳 Ao ar livre", filter: { key: 'local', value: 'ao ar livre' } },
        { label: "🎨 Criatividade", filter: { key: 'categoria', value: 'criativa' } },
        { label: "🧠 Raciocínio", filter: { key: 'categoria', value: 'cognitiva' } },
    ];

    const hasAnyFilter = !!(currentQuery || currentFilter('energia') || currentFilter('local') || currentFilter('categoria') || currentFilter('idade_adequada'));

    return (
        <div className="space-y-4 w-full max-w-4xl mx-auto mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                    placeholder="Buscar brincadeira por nome, material ou objetivo..."
                    className={cn(
                        "pl-10 h-12 text-lg rounded-full shadow-sm border-2 transition-all focus-visible:ring-0",
                        isAcolher
                            ? "border-emerald-100 focus:border-emerald-400 bg-emerald-50/50"
                            : "border-muted focus:border-primary"
                    )}
                    defaultValue={currentQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* === FILTRO DE FAIXA ETÁRIA — destaque especial === */}
            {childAgeLabel && (
                <button
                    onClick={handleAgeFilter}
                    className={cn(
                        "w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all border-2",
                        isAgeActive
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg"
                            : cn(
                                "border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] hover:shadow-sm",
                                isAcolher
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-[var(--color-primary)]/5 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                            )
                    )}
                >
                    <span className="text-lg">🧒</span>
                    <span className="flex-1 text-left">{childAgeLabel}</span>
                    {isAgeActive ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                            Ativo
                        </span>
                    ) : (
                        <span className="text-xs font-medium opacity-60">Filtrar</span>
                    )}
                </button>
            )}

            {/* Chips de sugestão contextual — só aparece quando sem busca ativa */}
            {!currentQuery && !currentFilter('energia') && !currentFilter('local') && !currentFilter('categoria') && !isAgeActive && (
                <div className="flex flex-wrap gap-2 items-center justify-center">
                    <span className="text-xs text-muted-foreground font-medium mr-1">Explorar:</span>
                    {suggestions.map((s) => (
                        <button
                            key={s.label}
                            onClick={() => handleFilter(s.filter.key, s.filter.value)}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                                "bg-white border-dashed text-muted-foreground hover:border-solid hover:text-foreground hover:shadow-sm",
                                isAcolher ? "hover:border-emerald-400 hover:text-emerald-700" : "hover:border-primary/50"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap gap-2 items-center justify-center">
                {filters.map((filter) => {
                    const isActive = currentFilter(filter.key) === filter.value;
                    return (
                        <Button
                            key={`${filter.key}-${filter.value}`}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilter(filter.key, filter.value)}
                            className={cn(
                                "rounded-full transition-all text-xs sm:text-sm h-8 sm:h-9",
                                isActive
                                    ? "shadow-md scale-105"
                                    : "border-dashed text-muted-foreground hover:border-solid hover:text-foreground",
                                isAcolher && isActive ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                            )}
                        >
                            {filter.label}
                        </Button>
                    );
                })}

                {hasAnyFilter && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => replace(pathname)}
                        className="text-xs text-muted-foreground hover:text-destructive gap-1 px-2"
                    >
                        <X className="w-3 h-3" />
                        Limpar filtros
                    </Button>
                )}
            </div>
        </div>
    );
}
