"use client";

import { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Star, Camera, PartyPopper, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Tipos para os dados da reflexão
interface ReflectionData {
    enjoyment: number | null; // 1-5
    autonomy: "alone" | "some_help" | "much_help" | null;
    note: string;
    photos: File[]; // Para upload futuro
}

interface PostActivityReflectionProps {
    activityId: string;
    childId: string;
    activityName: string;
    durationSeconds: number;
    onClose: () => void;
}

export function PostActivityReflection({
    activityId,
    childId,
    activityName,
    durationSeconds,
    onClose,
}: PostActivityReflectionProps) {
    const { isAcolher } = useTheme();
    const router = useRouter();
    const [step, setStep] = useState<"enjoyment" | "autonomy" | "capture" | "celebration">("enjoyment");
    const [data, setData] = useState<ReflectionData>({
        enjoyment: null,
        autonomy: null,
        note: "",
        photos: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Passo 1: Feedback Emocional (Emoji Scale)
    const handleEnjoymentSelect = (level: number) => {
        setData((prev) => ({ ...prev, enjoyment: level }));
    };

    // Passo 2: Autonomia
    const handleAutonomySelect = (level: "alone" | "some_help" | "much_help") => {
        setData((prev) => ({ ...prev, autonomy: level }));
    };

    // Envio final
    const handleSubmit = async () => {
        setIsSubmitting(true);
        const supabase = createClient();

        try {
            // 1. Upload de fotos (Simulado por enquanto)
            const photoUrls: string[] = [];

            // 2. Insert no banco
            const { error } = await supabase.schema("brincareducando").from("atividades_execucoes").insert({
                atividade_id: activityId,
                crianca_id: childId,
                avaliacao: data.enjoyment,
                notas: data.note,
                fotos_urls: photoUrls,
                duracao_minutos: Math.ceil(durationSeconds / 60),
                data_conclusao: new Date().toISOString(),
            });

            if (error) throw error;

            setStep("celebration");
        } catch (err) {
            console.error("Erro ao salvar reflexão:", err);
            // Tratar erro (toast)
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
            "transition-all duration-300"
        )}>
            <div className={cn(
                "w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden",
                isAcolher ? "bg-[#FFF9F5]" : "bg-white"
            )}>
                {/* Cabeçalho */}
                <div className="p-6 text-center border-b border-gray-100">
                    <h2 className={cn(
                        "text-2xl font-black mb-2",
                        isAcolher ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)]"
                    )}>
                        {step === "celebration" ? "Parabéns!" : "Missão Cumprida! 🎉"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {activityName}
                    </p>
                </div>

                {/* Corpo do Passo */}
                <div className="p-6 min-h-[300px] flex flex-col items-center justify-center">

                    {step === "enjoyment" && (
                        <div className="w-full space-y-8">
                            <p className="text-center text-lg font-medium text-gray-700">
                                Como foi a experiência?
                            </p>
                            <div className="flex justify-between gap-2">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => handleEnjoymentSelect(level)}
                                        className={cn(
                                            "w-12 h-12 rounded-full text-2xl flex items-center justify-center transition-all",
                                            data.enjoyment === level
                                                ? (isAcolher ? "bg-[var(--color-primary)] text-white scale-110" : "bg-yellow-400 text-white scale-110 shadow-lg")
                                                : "bg-gray-100 grayscale hover:grayscale-0"
                                        )}
                                    >
                                        {["😫", "😐", "🙂", "😊", "🤩"][level - 1]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === "autonomy" && (
                        <div className="w-full space-y-4">
                            <p className="text-center text-lg font-medium text-gray-700">
                                Como foi a participação da criança?
                            </p>
                            <Button
                                variant="outline"
                                className={cn("w-full h-14 justify-start text-lg", data.autonomy === "alone" && "border-[var(--color-primary)] bg-[var(--color-primary)]/10")}
                                onClick={() => handleAutonomySelect("alone")}
                            >
                                🦸 Fez tudo sozinha
                            </Button>
                            <Button
                                variant="outline"
                                className={cn("w-full h-14 justify-start text-lg", data.autonomy === "some_help" && "border-[var(--color-primary)] bg-[var(--color-primary)]/10")}
                                onClick={() => handleAutonomySelect("some_help")}
                            >
                                🤝 Precisou de uma ajudinha
                            </Button>
                            <Button
                                variant="outline"
                                className={cn("w-full h-14 justify-start text-lg", data.autonomy === "much_help" && "border-[var(--color-primary)] bg-[var(--color-primary)]/10")}
                                onClick={() => handleAutonomySelect("much_help")}
                            >
                                👶 Fizemos juntos passo a passo
                            </Button>
                        </div>
                    )}

                    {step === "capture" && (
                        <div className="w-full space-y-6">
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                                <Camera className="w-12 h-12 mb-2" />
                                <span className="text-sm font-medium">Adicionar foto do momento</span>
                            </div>
                            <Textarea
                                placeholder="Escreva uma nota rápida sobre o que mais gostaram..."
                                value={data.note}
                                onChange={(e) => setData({ ...data, note: e.target.value })}
                                className="resize-none h-24 rounded-xl"
                            />
                        </div>
                    )}

                    {step === "celebration" && (
                        <div className="text-center space-y-6 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Memória guardada!
                                </h3>
                                <p className="text-gray-600">
                                    Mais uma atividade para o diário de crescimento.
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Rodapé com Ações */}
                <div className="p-6 bg-gray-50 flex justify-between items-center">
                    {step === "celebration" ? (
                        <Button
                            className={cn(
                                "w-full h-12 rounded-xl text-lg font-bold",
                                isAcolher ? "bg-[var(--color-primary)]" : "bg-[var(--color-secondary)]"
                            )}
                            onClick={() => {
                                onClose();
                                router.push("/diario");
                            }}
                        >
                            Ver no Diário
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                Pular
                            </Button>

                            <Button
                                disabled={
                                    (step === "enjoyment" && !data.enjoyment) ||
                                    (step === "autonomy" && !data.autonomy) ||
                                    isSubmitting
                                }
                                onClick={() => {
                                    if (step === "enjoyment") setStep("autonomy");
                                    else if (step === "autonomy") setStep("capture");
                                    else if (step === "capture") handleSubmit();
                                }}
                                className={cn(
                                    "px-8 rounded-xl font-bold gap-2",
                                    isAcolher
                                        ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                                        : "bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent)]/80"
                                )}
                            >
                                {isSubmitting ? "Salvando..." : (step === "capture" ? "Concluir" : "Próximo")}
                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
