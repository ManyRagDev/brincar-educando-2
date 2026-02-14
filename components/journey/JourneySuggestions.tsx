"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

// Mapeamento de categoria → gradiente e emoji
const categoryVisual: Record<string, { gradient: string; emoji: string; darkGradient: string }> = {
    sensorial:  { gradient: "from-rose-400 to-orange-300",    darkGradient: "from-rose-500 to-orange-400",    emoji: "🖐️" },
    criativa:   { gradient: "from-purple-400 to-pink-300",    darkGradient: "from-purple-500 to-pink-400",    emoji: "🎨" },
    cognitiva:  { gradient: "from-blue-400 to-indigo-300",    darkGradient: "from-blue-500 to-indigo-400",    emoji: "🧠" },
    movimento:  { gradient: "from-emerald-400 to-green-300",  darkGradient: "from-emerald-500 to-green-400",  emoji: "🏃" },
};

function getCategoryVisual(categoria: string) {
    return categoryVisual[categoria] ?? { gradient: "from-amber-400 to-yellow-300", darkGradient: "from-amber-500 to-yellow-400", emoji: "✨" };
}

interface Activity {
    id: string;
    slug: string;
    titulo: string;
    descricao: string;
    imagem_url: string | null;
    energia: string;
    preparo_minutos: number;
    categoria: string;
    beneficios?: string[];
    context?: string;
}

interface JourneySuggestionsProps {
    featured: Activity;
    others: Activity[];
}

export function JourneySuggestions({ featured, others }: JourneySuggestionsProps) {
    const { isAcolher } = useTheme();
    const featuredVisual = getCategoryVisual(featured.categoria);

    return (
        <div className="space-y-8">
            {/* HERO CARD */}
            <div className={cn(
                "relative overflow-hidden rounded-3xl border shadow-lg transition-all group",
                isAcolher
                    ? "bg-[#FFF9F5] border-[var(--color-primary)]/20 shadow-[var(--color-primary)]/5"
                    : "bg-white border-gray-100 shadow-xl shadow-indigo-500/5"
            )}>
                {/* Decorative BG */}
                <div className={cn(
                    "absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 -mr-24 -mt-24 pointer-events-none",
                    isAcolher ? "bg-[var(--color-primary)]" : "bg-indigo-500"
                )} />

                <div className="p-6 md:p-8 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Content */}
                        <div className="flex-1 space-y-6">
                            {/* Context Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/50 backdrop-blur-sm border border-gray-100/50">
                                <Sparkles className={cn("w-3.5 h-3.5", isAcolher ? "text-[var(--color-primary)]" : "text-amber-500")} />
                                <span className="text-gray-700">Sugestão para agora</span>
                            </div>

                            {/* Title & Description */}
                            <div>
                                <h2 className={cn(
                                    "text-3xl md:text-4xl font-black mb-3 leading-tight",
                                    isAcolher ? "text-[var(--color-primary)] font-serif" : "text-gray-900"
                                )}>
                                    {featured.titulo}
                                </h2>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                                    <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{featured.preparo_minutos} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-md capitalize">
                                        <Zap className="w-3.5 h-3.5" />
                                        <span>Energia {featured.energia}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Why this activity? */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100/50">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    🤔 Por que essa atividade?
                                </h3>
                                <ul className="space-y-2">
                                    {featured.context && (
                                        <li className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>{featured.context}</span>
                                        </li>
                                    )}
                                    {featured.beneficios?.slice(0, 2).map((b, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span>{b}</span>
                                        </li>
                                    )) || (
                                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-green-500 mt-0.5">✓</span>
                                                <span>Estimula o desenvolvimento e a conexão.</span>
                                            </li>
                                        )}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="pt-2 flex items-center gap-4">
                                <Link href={`/atividades/${featured.slug}`} className="flex-1 sm:flex-none">
                                    <Button
                                        size="lg"
                                        className={cn(
                                            "w-full sm:w-auto rounded-xl font-bold text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-105",
                                            isAcolher
                                                ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white"
                                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                        )}
                                    >
                                        Começar agora
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="/atividades" className="text-sm font-bold text-gray-400 hover:text-gray-600 px-4">
                                    Ver outras opções
                                </Link>
                            </div>
                        </div>

                        {/* Thumbnail Right (Desktop) */}
                        <div className="hidden md:flex w-1/3 items-center justify-center">
                            {featured.imagem_url ? (
                                <div className="relative w-full h-full min-h-[200px]">
                                    <div className="absolute inset-0 bg-gray-100 rounded-2xl rotate-3 transform border-4 border-white shadow-sm" />
                                    <div className="relative h-full rounded-2xl overflow-hidden border-4 border-white shadow-md rotate-[-2deg] transition-transform group-hover:rotate-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={featured.imagem_url}
                                            alt={featured.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className={cn(
                                    "w-full min-h-[200px] rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center gap-3 rotate-[-2deg] transition-transform group-hover:rotate-0 border-4 border-white shadow-md",
                                    featuredVisual.gradient
                                )}>
                                    <span className="text-6xl drop-shadow-sm select-none">{featuredVisual.emoji}</span>
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-widest capitalize">
                                        {featured.categoria}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECONDARY GRID */}
            <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4 pl-1">
                    Outras sugestões para hoje
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {others.map((activity) => {
                        const visual = getCategoryVisual(activity.categoria);
                        return (
                            <Link
                                key={activity.id}
                                href={`/atividades/${activity.slug}`}
                                className="group bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <div className="aspect-square rounded-xl mb-3 overflow-hidden relative">
                                    {activity.imagem_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={activity.imagem_url} alt={activity.titulo} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={cn(
                                            "w-full h-full bg-gradient-to-br flex items-center justify-center",
                                            visual.gradient
                                        )}>
                                            <span className="text-3xl drop-shadow-sm select-none">{visual.emoji}</span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold">
                                        {activity.preparo_minutos}m
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-1">
                                    {activity.titulo}
                                </h4>
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
                                    {activity.categoria}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
