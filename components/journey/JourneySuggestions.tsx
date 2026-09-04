"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Clock3, PackageOpen, RefreshCw, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import { recordRecommendationEvent, type RecommendationEventInput } from "@/app/(dashboard)/actions";
import type { MomentContext, RecommendationResult, RankedRecommendation } from "@/lib/journey/recommendation-engine";
import { getActivityImagePath } from "@/lib/activities/activity-images";

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
  const materialCount = featured.materiais.length;
  const materialLabel = materialCount === 0
    ? "Sem materiais"
    : `${materialCount} ${materialCount === 1 ? "material" : "materiais"}`;

  useEffect(() => {
    const storageKey = `recommendation-impression:${featured.recommendationKey}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
    void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, "impression", recommendations.ruleVersion));
  }, [childId, context, currentIndex, featured, recommendations.ruleVersion]);

  function swap(reason: RecommendationEventInput["reason"]) {
    const event = eventInput(featured, childId, context, currentIndex, "swap", recommendations.ruleVersion, reason);
    setFeedback(null);
    startTransition(() => {
      setCurrentIndex((current) => (current + 1) % recommendations.ranked.length);
    });
    void recordRecommendationEvent(event);
  }

  function sendFeedback(type: "more_like_this" | "less_like_this") {
    setFeedback(type);
    void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, type, recommendations.ruleVersion));
  }

  return (
    <section aria-labelledby="plan-now-title" className="dashboard-now-section">
      <div className="dashboard-now-heading">
        <div>
          <p className="dashboard-eyebrow flex items-center gap-1.5 text-[var(--color-primary)]">
            <Sparkles className="size-3.5" aria-hidden="true" /> Para agora
          </p>
          <h2 id="plan-now-title">Uma brincadeira possível para vocês</h2>
        </div>
        <p>Escolhida para a fase e para o momento de vocês.</p>
      </div>

      <article className="dashboard-hero">
        <div className="dashboard-hero-grid">
          <div className="dashboard-hero-copy">
            <span className="dashboard-clay-label">Sugestão para este momento</span>
            <h3>{featured.titulo}</h3>
            <p className="dashboard-hero-description">{featured.descricao}</p>

            <div className="dashboard-signals" aria-label="Informações práticas">
              <span className="dashboard-signal"><Clock3 aria-hidden="true" /> {featured.duracao_minutos} min</span>
              <span className="dashboard-signal"><Clock3 aria-hidden="true" /> {featured.preparo_minutos} min de preparo</span>
              <span className="dashboard-signal"><PackageOpen aria-hidden="true" /> {materialLabel}</span>
            </div>

            <div className="dashboard-reason">
              <span className="dashboard-reason-mark"><Check aria-hidden="true" /></span>
              <p><strong>Boa para agora</strong> porque {reasonText.toLocaleLowerCase()}.</p>
            </div>

            <div className="dashboard-hero-actions">
              <Link
                href={recommendationHref(featured, context, currentIndex, recommendations.ruleVersion)}
                onClick={() => void recordRecommendationEvent(eventInput(featured, childId, context, currentIndex, "open", recommendations.ruleVersion))}
                className="dashboard-primary-action"
              >
                Ver como brincar <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              {recommendations.ranked.length > 1 && (
                <button
                  type="button"
                  onClick={() => swap("just_browsing")}
                  disabled={isPending}
                  className="dashboard-swap-action"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" /> {isPending ? "Trocando…" : "Quero outra ideia"}
                </button>
              )}
            </div>
          </div>

          <div className="dashboard-hero-media">
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
              <div className="dashboard-hero-fallback">
                <p className="text-2xl" aria-hidden="true">🧩</p>
              </div>
            )}
          </div>
        </div>
      </article>

      {(simple || different) && (
        <div className="dashboard-alternatives">
          {simple && <CompactAlternative activity={simple} label="Mais rápida / simples" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />}
          {different && <CompactAlternative activity={different} label="Outro clima" childId={childId} context={context} ruleVersion={recommendations.ruleVersion} />}
        </div>
      )}

      <div className="dashboard-preference-line">
        <span>Para as próximas sugestões:</span>
        <button type="button" aria-pressed={feedback === "more_like_this"} onClick={() => sendFeedback("more_like_this")}>
          <ThumbsUp aria-hidden="true" /> Mais como esta
        </button>
        <button type="button" aria-pressed={feedback === "less_like_this"} onClick={() => sendFeedback("less_like_this")}>
          <ThumbsDown aria-hidden="true" /> Menos como esta
        </button>
        {feedback && <span role="status">Preferência salva.</span>}
      </div>
    </section>
  );
}
