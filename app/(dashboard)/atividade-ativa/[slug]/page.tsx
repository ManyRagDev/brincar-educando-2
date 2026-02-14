"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Pause, Play, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useActiveSession } from "@/lib/journey/activeSessionStore";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { PostActivityReflection } from "@/components/journey/PostActivityReflection";

interface Activity {
    id: string;
    slug: string;
    titulo: string;
    descricao: string;
    passos: string[] | null;
    imagem_url: string | null;
    preparo_minutos: number;
}

function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const PASSOS_FALLBACK = [
    "Prepare o ambiente e chame a criança.",
    "Mostre os materiais e deixe ela explorar livremente primeiro.",
    "Siga a atividade, mas lembre-se: a diversão é mais importante que o resultado!",
];

export default function ActiveActivityPage() {
    const { slug } = useParams() as { slug: string };
    const { isAcolher } = useTheme();

    const {
        isPaused,
        elapsedSeconds,
        startSession,
        pauseSession,
        resumeSession,
        endSession,
        tick
    } = useActiveSession();

    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [showReflection, setShowReflection] = useState(false);
    const [childId, setChildId] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            const supabase = createClient();

            const [activityRes, criancaRes] = await Promise.all([
                supabase
                    .schema("brincareducando")
                    .from("atividades")
                    .select("id, slug, titulo, descricao, passos, imagem_url, preparo_minutos")
                    .eq("slug", slug)
                    .single(),
                supabase
                    .schema("brincareducando")
                    .from("criancas")
                    .select("id")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle(),
            ]);

            if (activityRes.data) {
                setActivity(activityRes.data);
                startSession(activityRes.data.id);
            }
            if (criancaRes.data) {
                setChildId(criancaRes.data.id);
            }
            setLoading(false);
        }
        loadData();
    }, [slug, startSession]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isPaused) {
            interval = setInterval(tick, 1000);
        }
        return () => clearInterval(interval);
    }, [isPaused, tick]);

    if (loading) return null;
    if (!activity) return <div>Atividade não encontrada</div>;

    const passos = (activity.passos && activity.passos.length > 0)
        ? activity.passos
        : PASSOS_FALLBACK;

    return (
        <div className={cn(
            "min-h-screen flex flex-col",
            isAcolher ? "bg-[#FFF9F5]" : "bg-white"
        )}>

            {/* Header Focado */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                <Link
                    href={`/atividades/${slug}`}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                    <X className="w-6 h-6" />
                </Link>

                <div className={cn(
                    "px-4 py-1 rounded-full font-mono font-bold text-lg tabular-nums flex items-center gap-2",
                    isAcolher ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "bg-gray-100 text-gray-700"
                )}>
                    <Clock className="w-4 h-4" />
                    {formatTime(elapsedSeconds)}
                </div>

                <div className="w-10" />
            </header>

            {/* Conteúdo Principal */}
            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 flex flex-col">

                <div className="flex-1 space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className={cn(
                            "text-3xl font-black leading-tight",
                            isAcolher ? "text-[var(--color-primary)]" : "text-gray-900"
                        )}>
                            {activity.titulo}
                        </h1>
                        {activity.imagem_url && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm">
                                <Image
                                    src={activity.imagem_url}
                                    alt={activity.titulo}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Passo a Passo */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold uppercase tracking-wider text-gray-400 text-center">
                            Instruções
                        </h2>
                        <ul className="space-y-4">
                            {passos.map((passo, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white",
                                        isAcolher ? "bg-[var(--color-primary)]" : "bg-gray-700"
                                    )}>
                                        {i + 1}
                                    </span>
                                    <span className={cn("pt-1 leading-relaxed", isAcolher ? "text-gray-700" : "text-gray-600")}>
                                        {passo}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Controles do Rodapé */}
                <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-8 mt-8 flex flex-col gap-4">
                    <div className="flex justify-center">
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-14 h-14 rounded-full border-2"
                            onClick={() => isPaused ? resumeSession() : pauseSession()}
                        >
                            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                        </Button>
                    </div>

                    <Button
                        size="lg"
                        className={cn(
                            "w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:scale-[1.02] transition-transform",
                            isAcolher
                                ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                                : "bg-green-600 hover:bg-green-700"
                        )}
                        onClick={() => {
                            pauseSession();
                            setShowReflection(true);
                        }}
                    >
                        <CheckCircle2 className="w-6 h-6 mr-2" />
                        Concluir Atividade
                    </Button>
                </div>

            </main>

            {/* Modal de Reflexão */}
            {showReflection && (
                <PostActivityReflection
                    activityId={activity.id}
                    activityName={activity.titulo}
                    durationSeconds={elapsedSeconds}
                    childId={childId ?? ""}
                    onClose={() => {
                        endSession();
                    }}
                />
            )}
        </div>
    );
}
