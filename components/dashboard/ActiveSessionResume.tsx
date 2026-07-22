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
      className="rounded-3xl border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/8 p-5"
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
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-black text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            Retomar brincadeira <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
