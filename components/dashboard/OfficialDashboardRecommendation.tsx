"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  PackageOpen,
  RefreshCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  recordRecommendationEvent,
  type RecommendationEventInput,
} from "@/app/(dashboard)/actions";
import { getActivityImagePath } from "@/lib/activities/activity-images";
import type {
  MomentContext,
  RankedRecommendation,
  RecommendationResult,
} from "@/lib/journey/recommendation-engine";
import styles from "./official-dashboard.module.css";

type RecommendationProps = {
  recommendations: RecommendationResult;
  childId: string;
  context: MomentContext | null;
};

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

function AlternativeCard({
  activity,
  label,
  childId,
  context,
  ruleVersion,
  position,
}: {
  activity: RankedRecommendation;
  label: string;
  childId: string;
  context: MomentContext | null;
  ruleVersion: string;
  position: number;
}) {
  return (
    <Link
      href={recommendationHref(activity, context, position, ruleVersion)}
      onClick={() => void recordRecommendationEvent(
        eventInput(activity, childId, context, position, "open", ruleVersion),
      )}
      className={styles.alternativeCard}
    >
      <span>{label}</span>
      <strong>{activity.titulo}</strong>
      <small>{activity.duracao_minutos} min · preparo {activity.preparo_minutos} min</small>
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}

export function OfficialDashboardRecommendation({
  recommendations,
  childId,
  context,
}: RecommendationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<"more_like_this" | "less_like_this" | null>(null);
  const [isPending, startTransition] = useTransition();
  const featured = recommendations.ranked[currentIndex] ?? recommendations.featured;
  const remaining = recommendations.ranked.filter((activity) => activity.id !== featured.id);
  const simple = [...remaining].sort((left, right) =>
    left.preparo_minutos + left.duracao_minutos - (right.preparo_minutos + right.duracao_minutos)
    || right.score - left.score,
  )[0] ?? null;
  const different = remaining.find((activity) => activity.energia !== featured.energia && activity.id !== simple?.id)
    ?? remaining.find((activity) => activity.id !== simple?.id)
    ?? null;
  const imageSrc = featured.imagem_url
    || getActivityImagePath({ titulo: featured.titulo, categoria: featured.categoria });
  const materialCount = featured.materiais.length;
  const materialLabel = materialCount === 0
    ? "Sem materiais"
    : `${materialCount} ${materialCount === 1 ? "material" : "materiais"}`;
  const reasonText = featured.reason
    .replace(/^boa para agora\s*/i, "")
    .replace(/^porque\s*/i, "")
    .replace(/[.\s]+$/, "");
  const ruleVersion = recommendations.ruleVersion;

  useEffect(() => {
    const storageKey = `recommendation-impression:${featured.recommendationKey}`;
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
    void recordRecommendationEvent(
      eventInput(featured, childId, context, currentIndex, "impression", ruleVersion),
    );
  }, [childId, context, currentIndex, featured, ruleVersion]);

  function swapRecommendation() {
    const event = eventInput(
      featured,
      childId,
      context,
      currentIndex,
      "swap",
      ruleVersion,
      "just_browsing",
    );
    setFeedback(null);
    startTransition(() => {
      setCurrentIndex((current) => (current + 1) % recommendations.ranked.length);
    });
    void recordRecommendationEvent(event);
  }

  function sendFeedback(type: "more_like_this" | "less_like_this") {
    setFeedback(type);
    void recordRecommendationEvent(
      eventInput(featured, childId, context, currentIndex, type, ruleVersion),
    );
  }

  return (
    <section className={styles.recommendationSection} aria-labelledby="dashboard-recommendation-title">
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}><Sparkles aria-hidden="true" /> Para agora</span>
          <h2 id="dashboard-recommendation-title">Uma brincadeira possível para vocês</h2>
        </div>
        <p>Escolhida para a fase e para o momento de vocês.</p>
      </div>

      <article className={styles.recommendationHero} aria-live="polite">
        <div className={styles.recommendationCopy}>
          <span className={styles.recommendationBadge}>Sugestão para este momento</span>
          <h3>{featured.titulo}</h3>
          <p className={styles.recommendationDescription}>{featured.descricao}</p>

          <div className={styles.practicalSignals} aria-label="Informações práticas">
            <span><Clock3 aria-hidden="true" /> {featured.duracao_minutos} min</span>
            <span><Clock3 aria-hidden="true" /> preparo {featured.preparo_minutos} min</span>
            <span><PackageOpen aria-hidden="true" /> {materialLabel}</span>
          </div>

          <div className={styles.recommendationReason}>
            <span><Check aria-hidden="true" /></span>
            <p><strong>Boa para agora</strong> porque {reasonText.toLocaleLowerCase()}.</p>
          </div>

          <div className={styles.recommendationActions}>
            <Link
              href={recommendationHref(featured, context, currentIndex, ruleVersion)}
              onClick={() => void recordRecommendationEvent(
                eventInput(featured, childId, context, currentIndex, "open", ruleVersion),
              )}
              className={styles.primaryButton}
            >
              <span><ArrowRight aria-hidden="true" /></span> Ver como brincar
            </Link>
            {recommendations.ranked.length > 1 ? (
              <button
                type="button"
                className={styles.swapButton}
                onClick={swapRecommendation}
                disabled={isPending}
              >
                <RefreshCw aria-hidden="true" /> {isPending ? "Trocando…" : "Quero outra ideia"}
              </button>
            ) : null}
          </div>
        </div>

        <div className={styles.recommendationMedia}>
          <Image
            src={imageSrc}
            alt={`Imagem da brincadeira ${featured.titulo}`}
            fill
            priority
            sizes="(max-width: 860px) 100vw, (max-width: 1200px) 42vw, 480px"
            className={styles.recommendationImage}
          />
          <span className={styles.mediaClayDot} aria-hidden="true" />
        </div>
      </article>

      {simple || different ? (
        <div className={styles.alternativesGrid} aria-label="Outras sugestões">
          {simple ? (
            <AlternativeCard
              activity={simple}
              label="Mais rápida e simples"
              childId={childId}
              context={context}
              ruleVersion={ruleVersion}
              position={Math.max(0, recommendations.ranked.findIndex((item) => item.id === simple.id))}
            />
          ) : null}
          {different ? (
            <AlternativeCard
              activity={different}
              label="Outro clima"
              childId={childId}
              context={context}
              ruleVersion={ruleVersion}
              position={Math.max(0, recommendations.ranked.findIndex((item) => item.id === different.id))}
            />
          ) : null}
        </div>
      ) : null}

      <div className={styles.preferenceLine}>
        <span>Para as próximas sugestões:</span>
        <button
          type="button"
          aria-pressed={feedback === "more_like_this"}
          onClick={() => sendFeedback("more_like_this")}
        >
          <ThumbsUp aria-hidden="true" /> Mais como esta
        </button>
        <button
          type="button"
          aria-pressed={feedback === "less_like_this"}
          onClick={() => sendFeedback("less_like_this")}
        >
          <ThumbsDown aria-hidden="true" /> Menos como esta
        </button>
        {feedback ? <span role="status">Preferência salva.</span> : null}
      </div>
    </section>
  );
}
