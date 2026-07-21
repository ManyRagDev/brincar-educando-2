"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Clock3, PackageOpen, RefreshCw, Sparkles, ThumbsDown, ThumbsUp, Zap } from "lucide-react";
import { recordRecommendationEvent, type RecommendationEventInput } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import type { MomentContext, RecommendationResult, RankedRecommendation } from "@/lib/journey/recommendation-engine";

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

function recommendationHref(
  activity: RankedRecommendation,
  context: MomentContext | null,
  position: number,
  ruleVersion: string,
) {
  const params = new URLSearchParams({
    rk: activity.recommendationKey,
    rv: ruleVersion,
    pos: String(position),
  });
  if (context) params.set("ctx", context);
  return `/atividades/${activity.slug}?${params.toString()}`;
}

function CompactAlternative({
  activity,
  label,
  childId,
  context,
  ruleVersion,
}: {
  activity: RankedRecommendation;
  label: string;
  childId: string;
  context: MomentContext | null;
  ruleVersion: string;
}) {
  return (
    <Link
      href={recommendationHref(activity, context, 1, ruleVersion)}
      onClick={() => void recordRecommendationEvent(eventInput(activity, childId, context, 1, "open", ruleVersion))}
      className="group rounded-2xl border border-[var(--color-border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-md"
    >
      <span className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">{label}</span>
      <h3 className="mt-1 line-clamp-2 font-black text-[var(--color-foreground)]">{activity.titulo}</h3>
      <p className="mt-2 flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
        <span>{activity.duracao_minutos} min</span>
        <span>Preparo {activity.preparo_minutos} min</span>
        <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </p>
    </Link>
  );
}

export function JourneySuggestions({
  recommendations,
  childId,
  context,
}: {
  recommendations: RecommendationResult;
  childId: string;
  context: MomentContext | null;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReasons, setShowReasons] = useState(false);
  const [feedback, setFeedback] = useState<"more_like_this" | "less_like_this" | null>(null);
  const [isPending, startTransition] = useTransition();
  const featured = recommendations.ranked[currentIndex] ?? recommendations.featured;

  const remaining = recommendations.ranked.filter((activity) => activity.id !== featured.id);
  const simple = [...remaining].sort(
    (left, right) =>
      left.preparo_minutos + left.duracao_minutos - (right.preparo_minutos + right.duracao_minutos) ||
      right.score - left.score,
  )[0] ?? null;
  const different =
    remaining.find((activity) => activity.energia !== featured.energia && activity.id !== simple?.id) ??
    remaining.find((activity) => activity.id !== simple?.id) ??
    null;
  const alternatives = { simple, different };

  useEffect(() => {
    const storageKey = `recommendation-impression:${featured.recommendationKey}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
    void recordRecommendationEvent(
      eventInput(featured, childId, context, currentIndex, "impression", recommendations.ruleVersion),
    );
  }, [childId, context, currentIndex, featured, recommendations.ruleVersion]);

  function swap(reason: RecommendationEventInput["reason"]) {
    startTransition(async () => {
      await recordRecommendationEvent(
        eventInput(featured, childId, context, currentIndex, "swap", recommendations.ruleVersion, reason),
      );
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
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">
            <Sparkles className="size-4" aria-hidden="true" /> Plano para agora
          </p>
          <h2 id="plan-now-title" className="mt-1 text-2xl font-black text-[var(--color-foreground)]">
            Um convite possível, sem pressão
          </h2>
        </div>
      </div>

      <article className="overflow-hidden rounded-3xl border border-[var(--color-primary)]/20 bg-[var(--color-card)] shadow-lg shadow-[var(--color-primary)]/5">
        <div className="grid md:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="p-6 md:p-8">
            <p className="text-sm font-bold text-[var(--color-primary)]">Sugestão para este momento</p>
            <h3 className="mt-1 text-3xl font-black leading-tight text-[var(--color-foreground)] md:text-4xl">
              {featured.titulo}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted-foreground)]">
              {featured.descricao}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[var(--color-foreground)]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-muted)] px-3 py-2">
                <Clock3 className="size-4" aria-hidden="true" /> {featured.duracao_minutos} min + {featured.preparo_minutos} de preparo
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-muted)] px-3 py-2 capitalize">
                <Zap className="size-4" aria-hidden="true" /> Energia {featured.energia}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-muted)] px-3 py-2">
                <PackageOpen className="size-4" aria-hidden="true" /> {featured.materiais.length ? featured.materiais.slice(0, 3).join(", ") : "Sem material específico"}
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-[var(--color-primary)]/7 p-4">
              <p className="font-bold text-[var(--color-foreground)]">{featured.reason}</p>
              <p className="mt-2 flex items-start gap-2 text-sm text-[var(--color-muted-foreground)]">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                Convite ao adulto: observe o que chama a atenção e acompanhe a iniciativa da criança, sem precisar conduzir cada passo.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={recommendationHref(featured, context, currentIndex, recommendations.ruleVersion)}
                onClick={() => void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, "open", recommendations.ruleVersion))}
              >
                <Button size="lg" className="h-12 w-full rounded-xl px-7 font-black sm:w-auto">
                  Brincar agora <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Button>
              </Link>
              {recommendations.ranked.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="h-12 rounded-xl font-bold"
                  onClick={() => setShowReasons((visible) => !visible)}
                  aria-expanded={showReasons}
                  aria-controls="swap-reasons"
                >
                  <RefreshCw className="mr-2 size-4" aria-hidden="true" /> Trocar sugestão
                </Button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Preferência de sugestão">
              <span className="mr-1 text-xs text-[var(--color-muted-foreground)]">Para próximas sugestões:</span>
              <button type="button" aria-pressed={feedback === "more_like_this"} onClick={() => sendFeedback("more_like_this")} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-[var(--color-border)] px-3 text-xs font-bold hover:border-[var(--color-primary)]"><ThumbsUp className="size-3" />Mais como esta</button>
              <button type="button" aria-pressed={feedback === "less_like_this"} onClick={() => sendFeedback("less_like_this")} className="inline-flex min-h-10 items-center gap-1 rounded-full border border-[var(--color-border)] px-3 text-xs font-bold hover:border-[var(--color-primary)]"><ThumbsDown className="size-3" />Menos como esta</button>
              {feedback && <span className="text-xs text-[var(--color-muted-foreground)]">Preferência guardada; você pode mudar de ideia.</span>}
            </div>

            {showReasons && (
              <div id="swap-reasons" className="mt-4 rounded-2xl border border-[var(--color-border)] p-4">
                <p className="text-sm font-bold text-[var(--color-foreground)]">Se quiser, conte o motivo</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">Isso ajuda a próxima sugestão; escolha só se fizer sentido.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {swapReasons.map((reason) => (
                    <button
                      key={reason.value}
                      type="button"
                      disabled={isPending}
                      onClick={() => swap(reason.value)}
                      className="min-h-10 rounded-full border border-[var(--color-border)] bg-white px-3 text-sm font-bold hover:border-[var(--color-primary)] disabled:opacity-50"
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative min-h-56 bg-[var(--color-muted)] md:min-h-full">
            {featured.imagem_url ? (
              <Image src={featured.imagem_url} alt="" fill sizes="(min-width: 768px) 304px, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full min-h-56 items-center justify-center bg-gradient-to-br from-amber-100 to-emerald-100 text-6xl" aria-hidden="true">
                🧩
              </div>
            )}
          </div>
        </div>
      </article>

      {(alternatives.simple || alternatives.different) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {alternatives.simple && (
            <CompactAlternative activity={alternatives.simple} label="Mais simples" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />
          )}
          {alternatives.different && (
            <CompactAlternative activity={alternatives.different} label="Outro clima" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />
          )}
        </div>
      )}
    </section>
  );
}
