"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock3, Eye, Pause, Play, RefreshCw, X } from "lucide-react";
import { recordRecommendationEvent } from "@/app/(dashboard)/actions";
import { ChildSelectionPrompt } from "@/components/dashboard/ChildSelectionPrompt";
import { useActiveChild } from "@/components/dashboard/ActiveChildProvider";
import { PostActivityReflection } from "@/components/journey/PostActivityReflection";
import { Button } from "@/components/ui/button";
import { useActiveSession } from "@/lib/journey/activeSessionStore";
import { isMomentContext } from "@/lib/journey/recommendation-engine";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

type EndReason = "concluida" | "perdeu_interesse" | "adaptada" | "adulto_cansou" | "crianca_cansou" | "outro";

type Activity = {
  id: string;
  slug: string;
  titulo: string;
  materiais: string[];
  preparacao: string[];
  passos: string[];
  prompts: string[];
  sinaisPausa: string[];
  encerramento: string[];
  supervisao: string;
  riscos: string[];
  simplificar: string;
};

function stringsFromJson(value: Json | null, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const nested = value[key];
  return Array.isArray(nested) ? nested.filter((item): item is string => typeof item === "string") : [];
}

function stringFromJson(value: Json | null, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  return typeof value[key] === "string" ? value[key] : "";
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function ActiveActivityPage() {
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const { activeChild, needsSelection } = useActiveChild();
  const { activityId, isPaused, elapsedSeconds, startSession, pauseSession, resumeSession, endSession, tick } = useActiveSession();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"prepare" | "play">("prepare");
  const [currentStep, setCurrentStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [showAdaptation, setShowAdaptation] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [endReason, setEndReason] = useState<EndReason>("concluida");
  const shouldTick = timerEnabled || Boolean(activityId);

  const recommendationKey = searchParams.get("rk");
  const ruleVersion = searchParams.get("rv");
  const position = Number(searchParams.get("pos") ?? "0");
  const rawContext = searchParams.get("ctx");
  const recommendationContext = isMomentContext(rawContext) ? rawContext : null;

  useEffect(() => {
    let cancelled = false;
    async function loadActivity() {
      if (!activeChild) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("atividades")
        .select("id, slug, titulo, materiais, preparacao, passos, prompts_interacao, sinais_adaptar_parar, encerramento, seguranca, variacoes")
        .eq("slug", slug)
        .eq("publicado", true)
        .single();
      if (cancelled) return;
      if (data) {
        const steps = Array.isArray(data.passos)
          ? data.passos.filter((item): item is string => typeof item === "string")
          : [];
        setActivity({
          id: data.id,
          slug: data.slug ?? slug,
          titulo: data.titulo,
          materiais: data.materiais ?? [],
          preparacao: data.preparacao,
          passos: steps,
          prompts: data.prompts_interacao,
          sinaisPausa: data.sinais_adaptar_parar,
          encerramento: data.encerramento,
          supervisao: stringFromJson(data.seguranca, "supervisao"),
          riscos: stringsFromJson(data.seguranca, "riscos"),
          simplificar: stringFromJson(data.variacoes, "simplificar"),
        });
      }
      setLoading(false);
    }
    void loadActivity();
    return () => { cancelled = true; };
  }, [activeChild, slug]);

  useEffect(() => {
    if (!shouldTick || isPaused) return;
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [isPaused, shouldTick, tick]);

  function begin() {
    if (!activity || !activeChild) return;
    setMode("play");
    startSession(activity.id, activity.slug);
    if (recommendationKey && ruleVersion && Number.isInteger(position)) {
      const storageKey = `recommendation-start:${recommendationKey}`;
      if (!window.sessionStorage.getItem(storageKey)) {
        window.sessionStorage.setItem(storageKey, "1");
        void recordRecommendationEvent({
          childId: activeChild.id,
          activityId: activity.id,
          type: "start",
          context: recommendationContext,
          recommendationKey,
          ruleVersion,
          position,
        });
      }
    }
  }

  function finish(reason: EndReason) {
    setEndReason(reason);
    pauseSession();
    setShowReflection(true);
  }

  function closeReflection() {
    setShowReflection(false);
    endSession();
    router.push("/dashboard");
  }

  if (loading) return <div className="p-8 text-center">Preparando a atividade…</div>;
  if (needsSelection) return <div className="min-h-screen p-6"><ChildSelectionPrompt /></div>;
  if (!activity || !activeChild) return <div className="p-8 text-center">Atividade não encontrada.</div>;

  const resumedSession = activityId === activity.id;
  const visibleMode = resumedSession ? "play" : mode;
  const visibleTimer = timerEnabled || resumedSession;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-4 py-3 backdrop-blur">
        <Link href={`/atividades/${slug}`} className="grid size-11 place-items-center rounded-full hover:bg-[var(--color-muted)]" aria-label="Sair do modo Brincar">
          <X className="size-5" aria-hidden="true" />
        </Link>
        <p className="max-w-[55vw] truncate font-black">{activity.titulo}</p>
        {visibleMode === "play" ? (
          <button
            type="button"
            onClick={() => {
              if (!visibleTimer) { setTimerEnabled(true); resumeSession(); }
              else if (isPaused) resumeSession();
              else pauseSession();
            }}
            className="min-h-11 rounded-full bg-[var(--color-muted)] px-3 font-mono text-sm font-bold tabular-nums"
            aria-label={visibleTimer ? (isPaused ? "Retomar cronômetro" : "Pausar cronômetro") : "Ativar cronômetro opcional"}
          >
            {visibleTimer ? formatTime(elapsedSeconds) : <><Clock3 className="mr-1 inline size-4" /> Cronômetro</>}
          </button>
        ) : <div className="size-11" />}
      </header>

      {visibleMode === "prepare" ? (
        <main className="mx-auto max-w-2xl px-5 py-8">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">Antes de começar</p>
          <h1 className="mt-1 text-3xl font-black">Prepare sem pressa</h1>
          <p className="mt-2 text-[var(--color-muted-foreground)]">A lista é um apoio, não uma obrigação. Adapte ao espaço e ao momento de vocês.</p>

          <section className="mt-6 rounded-3xl border border-[var(--color-border)] p-5">
            <h2 className="font-black">Checklist rápido</h2>
            <ul className="mt-3 space-y-3">
              {[...activity.preparacao, ...(activity.materiais.length ? [`Materiais: ${activity.materiais.join(", ")}`] : [])].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6"><span aria-hidden="true">□</span>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <h2 className="font-black">Segurança e supervisão</h2>
            <p className="mt-2 text-sm"><strong>Supervisão:</strong> {activity.supervisao}</p>
            {activity.riscos.length > 0 && <p className="mt-2 text-sm"><strong>Atenção a:</strong> {activity.riscos.join("; ")}.</p>}
          </section>

          <Button size="lg" className="mt-6 h-14 w-full rounded-2xl text-base font-black" onClick={begin}>
            Tudo pronto, começar <Play className="ml-2 size-5" aria-hidden="true" />
          </Button>
        </main>
      ) : (
        <main className="mx-auto max-w-2xl px-5 py-8">
          <div className="flex items-center justify-between text-sm font-bold text-[var(--color-muted-foreground)]">
            <span>Passo {currentStep + 1} de {activity.passos.length}</span>
            <button type="button" className="min-h-11 text-[var(--color-primary)]" onClick={() => setShowAll((value) => !value)}>
              <Eye className="mr-1 inline size-4" aria-hidden="true" /> {showAll ? "Um por vez" : "Mostrar todos"}
            </button>
          </div>

          {showAll ? (
            <ol className="mt-5 space-y-3">
              {activity.passos.map((step, index) => (
                <li key={step} className="flex gap-4 rounded-2xl border border-[var(--color-border)] p-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--color-primary)] font-black text-white">{index + 1}</span>
                  <p className="pt-1 leading-7">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <section className="mt-5 min-h-64 rounded-3xl bg-[var(--color-card)] p-6 shadow-lg md:p-8">
              <span className="grid size-10 place-items-center rounded-full bg-[var(--color-primary)] font-black text-white">{currentStep + 1}</span>
              <p className="mt-6 text-2xl font-black leading-9">{activity.passos[currentStep]}</p>
              <div className="mt-8 flex justify-between gap-3">
                <Button variant="outline" size="lg" disabled={currentStep === 0} onClick={() => setCurrentStep((step) => step - 1)}>
                  <ChevronLeft className="mr-1 size-5" /> Anterior
                </Button>
                {currentStep < activity.passos.length - 1 ? (
                  <Button size="lg" onClick={() => setCurrentStep((step) => step + 1)}>Próximo <ChevronRight className="ml-1 size-5" /></Button>
                ) : (
                  <Button size="lg" onClick={() => finish("concluida")}>Encerrar</Button>
                )}
              </div>
            </section>
          )}

          {activity.prompts.length > 0 && (
            <aside className="mt-4 rounded-3xl bg-emerald-50 p-5 text-emerald-950">
              <p className="text-xs font-black uppercase tracking-wide">Experimente dizer…</p>
              <p className="mt-1 text-lg font-bold">“{activity.prompts[currentStep % activity.prompts.length]}”</p>
            </aside>
          )}

          {showAdaptation && (
            <aside className="mt-4 rounded-3xl border border-violet-200 bg-violet-50 p-5 text-violet-950">
              <p className="font-black">Uma forma mais simples</p>
              <p className="mt-1 text-sm leading-6">{activity.simplificar}</p>
              <Button variant="outline" className="mt-3" onClick={() => setShowAdaptation(false)}>Continuar adaptado</Button>
            </aside>
          )}

          <section className="mt-6 border-t border-[var(--color-border)] pt-5" aria-label="Ações rápidas">
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" className="min-h-12" onClick={() => setShowAdaptation(true)}><RefreshCw className="mr-2 size-4" /> Adaptar</Button>
              <Button variant="outline" className="min-h-12" onClick={() => finish("perdeu_interesse")}>Perdeu o interesse</Button>
              {visibleTimer && <Button variant="outline" className="min-h-12" onClick={() => isPaused ? resumeSession() : pauseSession()}>{isPaused ? <Play className="mr-2 size-4" /> : <Pause className="mr-2 size-4" />}{isPaused ? "Retomar" : "Pausar"}</Button>}
              <Button className={cn("min-h-12", !visibleTimer && "sm:col-span-1")} onClick={() => finish("concluida")}>Encerrar brincadeira</Button>
            </div>
            <details className="mt-4 rounded-2xl bg-[var(--color-muted)] p-4">
              <summary className="cursor-pointer font-bold">Sinais de que pode ser hora de adaptar ou parar</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--color-muted-foreground)]">
                {activity.sinaisPausa.map((signal) => <li key={signal}>{signal}</li>)}
              </ul>
            </details>
          </section>
        </main>
      )}

      {showReflection && (
        <PostActivityReflection
          activityId={activity.id}
          childId={activeChild.id}
          activityName={activity.titulo}
          durationSeconds={elapsedSeconds}
          endReason={endReason}
          recommendationKey={recommendationKey}
          recommendationContext={recommendationContext}
          onClose={closeReflection}
        />
      )}
    </div>
  );
}
