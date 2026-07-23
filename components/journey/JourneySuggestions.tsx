"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Clock3, PackageOpen, RefreshCw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { recordRecommendationEvent, type RecommendationEventInput } from "@/app/(dashboard)/actions";
import type { MomentContext, RecommendationResult, RankedRecommendation } from "@/lib/journey/recommendation-engine";
import { getActivityImagePath } from "@/lib/activities/activity-images";

const swapReasons: Array<{ value: NonNullable<RecommendationEventInput["reason"]>; label: string }> = [
  { value: "no_time", label: "Pouco tempo" },
  { value: "no_materials", label: "Sem os materiais" },
  { value: "wrong_mood", label: "Outro clima" },
  { value: "already_did", label: "Já fizemos recentemente" },
  { value: "just_browsing", label: "Só quero outra" },
];

function eventInput(
  activity: RankedRecommendation,
  childId: string,
  context: MomentContext | null,
  position: number,
  type: RecommendationEventInput["type"],
  ruleVersion: string,
  reason?: RecommendationEventInput["reason"],
): RecommendationEventInput {
  return {
    childId,
    activityId: activity.id,
    type,
    context,
    reason,
    recommendationKey: activity.recommendationKey,
    ruleVersion,
    position,
  };
}

function recommendationHref(activity: RankedRecommendation, context: MomentContext | null, position: number, ruleVersion: string) {
  const params = new URLSearchParams({ rk: activity.recommendationKey, rv: ruleVersion, pos: String(position) });
  if (context) params.set("ctx", context);
  return `/atividades/${activity.slug}?${params.toString()}`;
}

function CompactAlternative({ activity, label, childId, context, ruleVersion }: { activity: RankedRecommendation; label: string; childId: string; context: MomentContext | null; ruleVersion: string }) {
  return (
    <Link
      href={recommendationHref(activity, context, 1, ruleVersion)}
      onClick={() => void recordRecommendationEvent(eventInput(activity, childId, context, 1, "open", ruleVersion))}
      className="dashboard-alternative group"
    >
      <span className="dashboard-eyebrow text-[var(--color-primary)]">{label}</span>
      <span className="mt-1 line-clamp-2 text-sm font-black text-[var(--color-foreground)]">{activity.titulo}</span>
      <span className="mt-2 flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
        <span>{activity.duracao_minutos} min</span>
        <span>Preparo {activity.preparo_minutos} min</span>
        <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function JourneySuggestions({ recommendations, childId, context }: { recommendations: RecommendationResult; childId: string; context: MomentContext | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReasons, setShowReasons] = useState(false);
  const [feedback, setFeedback] = useState<"more_like_this" | "less_like_this" | null>(null);
  const [isPending, startTransition] = useTransition();
  const featured = recommendations.ranked[currentIndex] ?? recommendations.featured;
  const remaining = recommendations.ranked.filter((activity) => activity.id !== featured.id);
  const simple = [...remaining].sort((left, right) => left.preparo_minutos + left.duracao_minutos - (right.preparo_minutos + right.duracao_minutos) || right.score - left.score)[0] ?? null;
  const different = remaining.find((activity) => activity.energia !== featured.energia && activity.id !== simple?.id) ?? remaining.find((activity) => activity.id !== simple?.id) ?? null;
  const imageSrc = featured.imagem_url || getActivityImagePath({ titulo: featured.titulo, categoria: featured.categoria });
  const reasonText = featured.reason
    .replace(/^boa para agora\s*/i, "")
    .replace(/^porque\s*/i, "")
    .replace(/[.\s]+$/, "");

  useEffect(() => {
    const storageKey = `recommendation-impression:${featured.recommendationKey}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
    void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, "impression", recommendations.ruleVersion));
  }, [childId, context, currentIndex, featured, recommendations.ruleVersion]);

  function swap(reason: RecommendationEventInput["reason"]) {
    startTransition(async () => {
      await recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, "swap", recommendations.ruleVersion, reason));
      setCurrentIndex((current) => (current + 1) % recommendations.ranked.length);
      setShowReasons(false);
    });
  }

  function sendFeedback(type: "more_like_this" | "less_like_this") {
    setFeedback(type);
    void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, type, recommendations.ruleVersion));
  }

  return (
    <section aria-labelledby="plan-now-title" className="space-y-4">
      <div>
        <p className="dashboard-eyebrow flex items-center gap-1.5 text-[var(--color-primary)]"><Sparkles className="size-4" aria-hidden="true" /> Para agora</p>
        <h2 id="plan-now-title" className="mt-1 text-2xl font-black tracking-tight text-[var(--color-foreground)] sm:text-3xl">Uma brincadeira possível para vocês</h2>
      </div>

      <article className="dashboard-hero overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(20rem,44%)]">
          <div className="order-2 flex min-w-0 flex-col p-5 sm:p-7 md:order-1 md:p-8">
            <p className="text-sm font-bold text-[var(--color-primary)]">Sugestão para este momento</p>
            <h3 className="mt-2 text-3xl font-black leading-[1.05] tracking-tight text-[var(--color-foreground)] sm:text-4xl">{featured.titulo}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-muted-foreground)]">{featured.descricao}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[var(--color-foreground)]">
              <span className="dashboard-signal"><Clock3 className="size-4 text-[var(--color-primary)]" aria-hidden="true" /> {featured.duracao_minutos} min</span>
              <span className="dashboard-signal"><Clock3 className="size-4 text-[var(--color-primary)]" aria-hidden="true" /> {featured.preparo_minutos} min de preparo</span>
              <span className="dashboard-signal"><PackageOpen className="size-4 text-[var(--color-primary)]" aria-hidden="true" /> {featured.materiais.length ? `${featured.materiais.length} materiais` : "Sem material específico"}</span>
            </div>

            <div className="mt-5 rounded-2xl border border-[#f2cfc3] bg-[#fff7f3] p-4">
              <p className="font-bold text-[var(--color-foreground)]">Boa para agora porque {reasonText.toLocaleLowerCase()}.</p>
              <p className="mt-2 flex items-start gap-2 text-sm leading-5 text-[var(--color-muted-foreground)]"><Check className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" /> Convite ao adulto: acompanhe a iniciativa da criança sem precisar conduzir cada passo.</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={recommendationHref(featured, context, currentIndex, recommendations.ruleVersion)} onClick={() => void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, "open", recommendations.ruleVersion))} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-black text-white shadow-[0_8px_20px_rgba(255,111,97,0.2)] transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2">Ver como brincar <ArrowRight className="size-4" aria-hidden="true" /></Link>
              {recommendations.ranked.length > 1 && (
                <button type="button" onClick={() => setShowReasons((visible) => !visible)} aria-expanded={showReasons} aria-controls="swap-reasons" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold text-[var(--color-foreground)] underline-offset-4 hover:bg-[var(--color-muted)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                  <RefreshCw className="size-4" aria-hidden="true" /> {isPending ? "Trocando…" : "Quero outra ideia"}
                </button>
              )}
            </div>

            {showReasons && (
              <div id="swap-reasons" className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white p-4">
                <p className="text-sm font-bold text-[var(--color-foreground)]">Se quiser, conte o motivo</p>
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">Isso ajuda a próxima sugestão; escolha só se fizer sentido.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {swapReasons.map((reason) => <button key={reason.value} type="button" disabled={isPending} onClick={() => swap(reason.value)} className="min-h-10 rounded-full border border-[var(--color-border)] bg-white px-3 text-xs font-bold hover:border-[var(--color-primary)] disabled:opacity-50">{reason.label}</button>)}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[var(--color-muted-foreground)]">Para próximas sugestões:</span>
              <button type="button" aria-pressed={feedback === "more_like_this"} onClick={() => sendFeedback("more_like_this")} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-[var(--color-border)] px-3 text-[11px] font-bold hover:border-[var(--color-primary)]"><ThumbsUp className="size-3" aria-hidden="true" /> Mais como esta</button>
              <button type="button" aria-pressed={feedback === "less_like_this"} onClick={() => sendFeedback("less_like_this")} className="inline-flex min-h-9 items-center gap-1 rounded-full border border-[var(--color-border)] px-3 text-[11px] font-bold hover:border-[var(--color-primary)]"><ThumbsDown className="size-3" aria-hidden="true" /> Menos como esta</button>
              {feedback && <span className="text-[11px] text-[var(--color-muted-foreground)]">Preferência guardada.</span>}
            </div>
          </div>

          <div className="relative order-1 min-h-64 bg-[#f7eee5] md:order-2 md:min-h-full">
            {imageSrc ? <Image src={imageSrc} alt={`Imagem da brincadeira ${featured.titulo}`} fill priority sizes="(min-width: 768px) 44vw, 100vw" className="object-cover" /> : <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-[#fff2ce] via-[#e8f1d9] to-[#d8f0df] px-8 text-center"><div><p className="text-4xl" aria-hidden="true">✦</p><p className="mt-2 text-sm font-bold text-[#527449]">Uma ideia pronta para ganhar o jeito de vocês.</p></div></div>}
          </div>
        </div>
      </article>

      {(simple || different) && <div className="grid gap-3 sm:grid-cols-2">{simple && <CompactAlternative activity={simple} label="Mais simples" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />}{different && <CompactAlternative activity={different} label="Outro clima" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />}</div>}
    </section>
  );
}
