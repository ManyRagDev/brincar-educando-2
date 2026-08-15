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
      className="dashboard-alternative group rounded-2xl bg-[var(--color-card)] p-4 border border-[var(--color-border)] shadow-xs transition hover:border-[var(--color-primary)]/50"
    >
      <span className="dashboard-eyebrow text-[var(--color-primary)]">{label}</span>
      <span className="mt-1 line-clamp-1 text-sm font-black text-[var(--color-foreground)]">{activity.titulo}</span>
      <span className="mt-1.5 flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
        <span>{activity.duracao_minutos} min</span>
        <span>Preparo {activity.preparo_minutos} min</span>
        <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1 text-[var(--color-primary)]" aria-hidden="true" />
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
    <section aria-labelledby="plan-now-title" className="space-y-3.5">
      <div className="flex items-center justify-between">
        <p className="dashboard-eyebrow flex items-center gap-1.5 text-[var(--color-primary)]">
          <Sparkles className="size-3.5" aria-hidden="true" /> Brincadeira para agora
        </p>
      </div>

      <article className="dashboard-hero overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-md transition-shadow">
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(18rem,40%)]">
          <div className="order-2 flex min-w-0 flex-col p-3.5 sm:p-5 md:order-1 md:p-7">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[var(--color-primary)]">Sugestão de Hoje</span>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--color-muted-foreground)]">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="size-3 text-[var(--color-primary)]" aria-hidden="true" /> {featured.duracao_minutos} min
                </span>
                <span>•</span>
                <span>Preparo {featured.preparo_minutos} min</span>
              </div>
            </div>

            <h3 id="plan-now-title" className="mt-1 text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight text-[var(--color-foreground)]">{featured.titulo}</h3>
            <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm leading-relaxed text-[var(--color-muted-foreground)]">{featured.descricao}</p>

            <div className="mt-2 rounded-lg border border-[#f2cfc3] dark:border-neutral-800 bg-[#fff7f3] dark:bg-neutral-900/60 p-2 sm:p-2.5">
              <p className="text-[11px] sm:text-xs font-bold text-[var(--color-foreground)] leading-snug">Boa para agora: {reasonText.toLocaleLowerCase()}.</p>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href={recommendationHref(featured, context, currentIndex, recommendations.ruleVersion)}
                onClick={() => void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, "open", recommendations.ruleVersion))}
                className="inline-flex min-h-11 sm:min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-xs sm:text-sm font-black text-white shadow-md shadow-[var(--color-primary)]/20 transition hover:brightness-95 active:scale-98"
              >
                Ver como brincar <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              {recommendations.ranked.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowReasons((visible) => !visible)}
                  aria-expanded={showReasons}
                  aria-controls="swap-reasons"
                  className="inline-flex min-h-10 sm:min-h-11 items-center justify-center gap-1.5 rounded-xl px-2.5 text-xs font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] active:scale-95"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" /> {isPending ? "Trocando…" : "Quero outra ideia"}
                </button>
              )}
            </div>

            {showReasons && (
              <div id="swap-reasons" className="mt-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-2.5">
                <p className="text-xs font-bold text-[var(--color-foreground)]">Se quiser, conte o motivo:</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {swapReasons.map((reason) => (
                    <button
                      key={reason.value}
                      type="button"
                      disabled={isPending}
                      onClick={() => swap(reason.value)}
                      className="min-h-7 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 text-[10px] font-bold hover:border-[var(--color-primary)] active:scale-95 disabled:opacity-50"
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-[var(--color-muted-foreground)]">Para você:</span>
              <button
                type="button"
                aria-pressed={feedback === "more_like_this"}
                onClick={() => sendFeedback("more_like_this")}
                className="inline-flex min-h-6 items-center gap-1 rounded-full border border-[var(--color-border)] px-2 text-[10px] font-bold hover:border-[var(--color-primary)] active:scale-95"
              >
                <ThumbsUp className="size-2.5" aria-hidden="true" /> Mais como esta
              </button>
              <button
                type="button"
                aria-pressed={feedback === "less_like_this"}
                onClick={() => sendFeedback("less_like_this")}
                className="inline-flex min-h-6 items-center gap-1 rounded-full border border-[var(--color-border)] px-2 text-[10px] font-bold hover:border-[var(--color-primary)] active:scale-95"
              >
                <ThumbsDown className="size-2.5" aria-hidden="true" /> Menos como esta
              </button>
              {feedback && <span className="text-[10px] text-[var(--color-muted-foreground)]">Salvo!</span>}
            </div>
          </div>

          <div className="relative order-1 h-28 sm:h-36 md:order-2 md:h-full md:min-h-full bg-[#f7eee5] dark:bg-neutral-900 overflow-hidden">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={`Imagem da brincadeira ${featured.titulo}`}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full min-h-28 items-center justify-center bg-gradient-to-br from-[#fff2ce] via-[#e8f1d9] to-[#d8f0df] px-4 text-center">
                <p className="text-2xl" aria-hidden="true">🧩</p>
              </div>
            )}
          </div>
        </div>
      </article>

      {(simple || different) && (
        <div className="grid gap-2.5 sm:grid-cols-2 pt-1">
          {simple && <CompactAlternative activity={simple} label="Mais rápida / simples" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />}
          {different && <CompactAlternative activity={different} label="Outro clima" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />}
        </div>
      )}
    </section>
  );
}
