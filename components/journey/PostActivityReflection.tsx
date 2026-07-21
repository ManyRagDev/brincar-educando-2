"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { saveActivityExecution } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const perceptions = [
  { value: "gostou", label: "Gostou", emoji: "😊" },
  { value: "mais_ou_menos", label: "Mais ou menos", emoji: "😐" },
  { value: "nao_era_o_momento", label: "Não era o momento", emoji: "🌿" },
] as const;

const observedOptions = [
  { value: "movimento", label: "Movimento" },
  { value: "sons_palavras", label: "Sons e palavras" },
  { value: "texturas", label: "Texturas" },
  { value: "imaginar", label: "Imaginar" },
  { value: "fazer_junto", label: "Fazer junto" },
  { value: "outro", label: "Outro" },
] as const;

type Perception = (typeof perceptions)[number]["value"];
type ObservedSignal = (typeof observedOptions)[number]["value"];
type EndReason = "concluida" | "perdeu_interesse" | "adaptada" | "adulto_cansou" | "crianca_cansou" | "outro";

export function PostActivityReflection({
  activityId,
  childId,
  activityName,
  durationSeconds,
  endReason,
  recommendationKey,
  recommendationContext,
  onClose,
}: {
  activityId: string;
  childId: string;
  activityName: string;
  durationSeconds: number;
  endReason: EndReason;
  recommendationKey: string | null;
  recommendationContext: string | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [perception, setPerception] = useState<Perception | null>(null);
  const [observedSignals, setObservedSignals] = useState<ObservedSignal[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function toggleSignal(signal: ObservedSignal) {
    setObservedSignals((current) =>
      current.includes(signal) ? current.filter((item) => item !== signal) : [...current, signal],
    );
  }

  async function submit() {
    setIsSubmitting(true);
    setSubmitError(null);
    const result = await saveActivityExecution({
      activityId,
      childId,
      perception,
      observedSignals,
      endReason,
      note,
      durationMinutes: Math.ceil(durationSeconds / 60),
      recommendationKey,
      recommendationContext,
    });
    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    setSaved(true);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reflection-title"
        className="w-full max-w-lg rounded-3xl bg-[var(--color-card)] p-6 shadow-2xl md:p-8"
      >
        {saved ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-16 text-emerald-600" aria-hidden="true" />
            <h2 id="reflection-title" className="mt-4 text-2xl font-black">Experiência guardada</h2>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              O registro ajuda vocês a lembrar preferências e momentos — não é uma avaliação da criança.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button variant="outline" onClick={onClose}>Voltar para Hoje</Button>
              <Button onClick={() => { onClose(); router.push("/diario"); }}>Ver no Diário</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">Reflexão opcional</p>
            <h2 id="reflection-title" className="mt-1 text-2xl font-black">Como foi para vocês?</h2>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{activityName}. Encerrar cedo também é válido.</p>

            <fieldset className="mt-6">
              <legend className="font-bold">O clima da experiência</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {perceptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={perception === option.value}
                    onClick={() => setPerception(option.value)}
                    className={cn(
                      "min-h-20 rounded-2xl border p-2 text-sm font-bold",
                      perception === option.value
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                        : "border-[var(--color-border)]",
                    )}
                  >
                    <span className="block text-2xl" aria-hidden="true">{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="font-bold">O que chamou atenção?</legend>
              <p className="text-xs text-[var(--color-muted-foreground)]">Marque quantos quiser ou deixe em branco.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {observedOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={observedSignals.includes(option.value)}
                    onClick={() => toggleSignal(option.value)}
                    className={cn(
                      "min-h-10 rounded-full border px-3 text-sm font-bold",
                      observedSignals.includes(option.value)
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                        : "border-[var(--color-border)]",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-6 block font-bold" htmlFor="reflection-note">Algo que vocês querem lembrar?</label>
            <Textarea
              id="reflection-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={2000}
              placeholder="Uma fala, uma descoberta, um jeito diferente de brincar…"
              className="mt-2 min-h-24 resize-y rounded-xl"
            />
            <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
              Você também pode guardar uma foto privada depois, no Diário.
            </p>
            {submitError && <p role="alert" className="mt-3 text-sm font-bold text-red-700">{submitError}</p>}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={onClose}>Agora não</Button>
              <Button onClick={submit} disabled={isSubmitting}>{isSubmitting ? "Guardando…" : "Guardar memória"}</Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
