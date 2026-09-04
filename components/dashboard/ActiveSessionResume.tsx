"use client";

import Link from "next/link";
import { ArrowRight, PauseCircle } from "lucide-react";
import { useActiveSession } from "@/lib/journey/activeSessionStore";

export function ActiveSessionResume() {
  const { activityId, activitySlug, elapsedSeconds, isPaused } = useActiveSession();

  if (!activityId || !activitySlug) return null;

  const minutes = Math.floor(elapsedSeconds / 60);
  const timeLabel = minutes > 0 ? `${minutes} min vividos` : "ainda no começo";

  return (
    <section
      className="dashboard-resume-card"
      aria-labelledby="resume-play-title"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[var(--color-card)] text-[var(--color-primary)]">
          <PauseCircle className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">
            {isPaused ? "Uma brincadeira pausada" : "Uma brincadeira está acontecendo"}
          </p>
          <h2 id="resume-play-title" className="mt-1 font-black">
            Querem continuar de onde pararam?
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {timeLabel}. Retomar é opcional; vocês também podem encerrar quando fizer sentido.
          </p>
          <Link
            href={`/atividade-ativa/${activitySlug}`}
            className="dashboard-resume-action"
          >
            Retomar brincadeira <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
