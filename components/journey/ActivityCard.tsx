"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityBadge, BadgeType } from "./ActivityBadge";
import { Clock, Users, Brain, Move, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";

// Mapeamento de categoria → gradiente e emoji (mesmo padrão de JourneySuggestions)
const categoryVisual: Record<string, { gradient: string; emoji: string }> = {
    sensorial:  { gradient: "from-rose-400 to-orange-300",   emoji: "🖐️" },
    criativa:   { gradient: "from-purple-400 to-pink-300",   emoji: "🎨" },
    cognitiva:  { gradient: "from-blue-400 to-indigo-300",   emoji: "🧠" },
    movimento:  { gradient: "from-emerald-400 to-green-300", emoji: "🏃" },
};

function getCategoryVisual(categoria: string) {
    return categoryVisual[categoria] ?? { gradient: "from-amber-400 to-yellow-300", emoji: "✨" };
}

export interface Activity {
    id: string;
    slug: string;
    titulo: string;
    descricao: string;
    categoria: string;
    energia: string;
    preparo_minutos: number;
    duracao_minutos: number;
    idade_min_meses: number;
    idade_max_meses: number;
    dificuldade: string;
    local: string;
    materiais: string[];
}

interface ActivityCardProps {
    activity: Activity;
    index?: number;
}

export function ActivityCard({ activity, index = 0 }: ActivityCardProps) {
    const { isAcolher } = useTheme();
    const visual = getCategoryVisual(activity.categoria);

    // Map energy level to badge type
    const getEnergyBadge = (energy: string): BadgeType => {
        if (energy === "alta") return "energy_high";
        if (energy === "baixa") return "energy_low";
        return "energy_high"; // Default/Fallback
    };

    // Map category to icon/color (optional enhancement)
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "sensorial": return <Heart className="w-4 h-4 text-rose-500" />;
            case "cognitiva": return <Brain className="w-4 h-4 text-indigo-500" />;
            case "movimento": return <Move className="w-4 h-4 text-emerald-500" />;
            default: return <StarIcon className="w-4 h-4 text-yellow-500" />; // Fallback
        }
    };

    // Helper for Star Icon since it's not imported above in the snippet I wrote mentally? 
    // Wait, I didn't import Star. Let's stick to standard Lucide imports.
    const StarIcon = ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    );


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="h-full"
        >
            <Link href={`/atividades/${activity.slug}`}>
                <Card className={cn(
                    "h-full overflow-hidden border-2 transition-all duration-300 hover:shadow-lg cursor-pointer group flex flex-col justify-between",
                    isAcolher
                        ? "border-emerald-100 hover:border-emerald-300 bg-emerald-50/30"
                        : "border-border hover:border-primary/50"
                )}>
                    {/* Thumbnail visual por categoria */}
                    <div className={cn(
                        "h-20 w-full bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                        visual.gradient
                    )}>
                        <span className="text-3xl drop-shadow-sm select-none">{visual.emoji}</span>
                    </div>

                    <CardHeader className="p-5 pb-2 space-y-3">
                        <div className="flex justify-between items-start">
                            <ActivityBadge type={getEnergyBadge(activity.energia)} />
                            {activity.local === "ao ar livre" && (
                                <ActivityBadge type="outdoor" />
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className={cn(
                                "font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2",
                                isAcolher ? "text-emerald-900" : "text-foreground"
                            )}>
                                {activity.titulo}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {activity.duracao_minutos} min
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {activity.idade_min_meses}-{activity.idade_max_meses} meses
                                </span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-2 pb-4 flex-grow">
                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                            {activity.descricao}
                        </p>
                    </CardContent>

                    <CardFooter className="p-5 pt-0 flex flex-wrap gap-2">
                        <Badge variant="secondary" className={cn(
                            "capitalize px-2 py-0.5 text-xs font-semibold",
                            isAcolher ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""
                        )}>
                            {activity.categoria}
                        </Badge>
                        {activity.dificuldade === "facil" && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                                Fácil
                            </Badge>
                        )}
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
}
