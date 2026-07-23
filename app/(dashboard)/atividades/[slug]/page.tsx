"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpenCheck, Clock3, ExternalLink, HeartHandshake, Package, Play, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";
import { getActivityImageAlt, getActivityImagePath } from "@/lib/activities/activity-images";
import { repairMojibake, repairStringArray } from "@/lib/text/repair-mojibake";

type ActivityView = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  justificativaFase: string;
  imagemUrl: string | null;
  duracao: number;
  preparo: number;
  energia: string;
  energiaAdulto: string;
  bagunca: string;
  local: string;
  materiais: string[];
  preparacao: string[];
  passos: string[];
  prompts: string[];
  sinaisInteresse: string[];
  sinaisPausa: string[];
  encerramento: string[];
  variacoes: Json;
  adaptacoes: Json;
  seguranca: Json;
  revisadoPor: string | null;
  revisadoEm: string | null;
  proximaRevisao: string | null;
  versao: number;
};

type SourceView = {
  id: string;
  titulo: string;
  organizacao: string;
  url: string;
  tipo: string;
  resumo: string;
  claim: string;
};

function arrayFromJson(value: Json | null, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const nested = value[key];
  return Array.isArray(nested) ? nested.filter((item): item is string => typeof item === "string") : [];
}

function stringFromJson(value: Json | null, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  return typeof value[key] === "string" ? value[key] : "";
}

function ContentSection({ title, icon: Icon, children }: { title: string; icon: typeof Sparkles; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6">
      <h2 className="flex items-center gap-2 text-lg font-black"><Icon className="size-5 text-[var(--color-primary)]" aria-hidden="true" />{title}</h2>
      <div className="mt-3 text-sm leading-6 text-[var(--color-foreground)]">{children}</div>
    </section>
  );
}

export default function ActivityDetailsPage() {
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const [activity, setActivity] = useState<ActivityView | null>(null);
  const [sources, setSources] = useState<SourceView[]>([]);
  const [extraAdaptations, setExtraAdaptations] = useState<Array<{ id: string; titulo: string; orientacao: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("atividades")
        .select("id, slug, titulo, resumo, descricao, justificativa_fase, imagem_url, duracao_minutos, preparo_minutos, energia, energia_adulto, nivel_bagunca, local, materiais, preparacao, passos, prompts_interacao, sinais_interesse, sinais_adaptar_parar, encerramento, variacoes, adaptacoes_inclusivas, seguranca, revisado_por, revisado_em, proxima_revisao, conteudo_versao")
        .eq("slug", slug)
        .eq("publicado", true)
        .single();
      if (!data || cancelled) {
        setLoading(false);
        return;
      }

      const steps = Array.isArray(data.passos)
        ? data.passos.filter((item): item is string => typeof item === "string")
        : [];
      setActivity({
        id: data.id,
        slug: data.slug ?? slug,
        titulo: repairMojibake(data.titulo),
        resumo: repairMojibake(data.resumo ?? data.descricao ?? ""),
        justificativaFase: repairMojibake(data.justificativa_fase ?? ""),
        imagemUrl: data.imagem_url,
        duracao: data.duracao_minutos ?? 15,
        preparo: data.preparo_minutos ?? 0,
        energia: data.energia ?? "media",
        energiaAdulto: data.energia_adulto ?? "media",
        bagunca: data.nivel_bagunca ?? "baixa",
        local: data.local ?? "interno",
        materiais: repairStringArray(data.materiais),
        preparacao: repairStringArray(data.preparacao),
        passos: steps.map(repairMojibake),
        prompts: repairStringArray(data.prompts_interacao),
        sinaisInteresse: repairStringArray(data.sinais_interesse),
        sinaisPausa: repairStringArray(data.sinais_adaptar_parar),
        encerramento: repairStringArray(data.encerramento),
        variacoes: data.variacoes,
        adaptacoes: data.adaptacoes_inclusivas,
        seguranca: data.seguranca,
        revisadoPor: data.revisado_por,
        revisadoEm: data.revisado_em,
        proximaRevisao: data.proxima_revisao,
        versao: data.conteudo_versao,
      });

      const [linksResult, adaptationsResult] = await Promise.all([
        supabase.from("atividades_fontes").select("fonte_id, afirmacao_sustentada").eq("atividade_id", data.id),
        supabase.from("atividades_adaptacoes").select("id, titulo, orientacao").eq("atividade_id", data.id).order("ordem"),
      ]);
      if (cancelled) return;
      setExtraAdaptations(adaptationsResult.data ?? []);

      const links = linksResult.data ?? [];
      const sourceIds = links.map((link) => link.fonte_id);
      if (sourceIds.length > 0) {
        const { data: sourceRows } = await supabase
          .from("conteudos_fontes")
          .select("id, titulo, organizacao_autoria, url, tipo_evidencia, resumo_editorial")
          .in("id", sourceIds);
        if (!cancelled) {
          setSources((sourceRows ?? []).map((source) => ({
            id: source.id,
            titulo: source.titulo,
            organizacao: source.organizacao_autoria,
            url: source.url,
            tipo: source.tipo_evidencia,
            resumo: source.resumo_editorial,
            claim: links.find((link) => link.fonte_id === source.id)?.afirmacao_sustentada ?? "",
          })));
        }
      }
      setLoading(false);
    }
    void load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Carregando convite…</div>;
  if (!activity) return <div className="p-8 text-center">Atividade não encontrada ou em revisão.</div>;

  const recommendationParams = new URLSearchParams();
  for (const key of ["rk", "rv", "pos", "ctx"] as const) {
    const value = searchParams.get(key);
    if (value) recommendationParams.set(key, value);
  }
  const activeHref = `/atividade-ativa/${activity.slug}${recommendationParams.size ? `?${recommendationParams.toString()}` : ""}`;
  const safetyGuidance = arrayFromJson(activity.seguranca, "orientacoes");
  const risks = arrayFromJson(activity.seguranca, "riscos");
  const supervision = stringFromJson(activity.seguranca, "supervisao");
  const simplify = stringFromJson(activity.variacoes, "simplificar");
  const expand = stringFromJson(activity.variacoes, "ampliar");
  const repeat = stringFromJson(activity.variacoes, "repetir");
  const inlineAdaptations = Array.isArray(activity.adaptacoes)
    ? activity.adaptacoes.filter((item): item is { contexto?: Json; orientacao?: Json } => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    : [];

  return (
    <div className="min-h-screen pb-24">
      <header className="relative overflow-hidden bg-[var(--color-muted)]">
        {activity.imagemUrl || getActivityImagePath({ titulo: activity.titulo }) ? (
          <div className="relative h-64 md:h-96"><Image src={activity.imagemUrl || getActivityImagePath({ titulo: activity.titulo })} alt={getActivityImageAlt(activity.titulo)} fill priority sizes="100vw" className="object-cover" /></div>
        ) : (
          <div className="flex h-44 items-center justify-center bg-gradient-to-br from-amber-100 to-emerald-100 text-6xl" aria-hidden="true">🧩</div>
        )}
        <Link href="/atividades" className="absolute left-4 top-4 grid size-11 place-items-center rounded-full bg-white/90 shadow" aria-label="Voltar para atividades">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-7">
        <p className="text-xs font-black uppercase tracking-wide text-[var(--color-primary)]">Convite de brincadeira</p>
        <h1 className="mt-1 text-3xl font-black leading-tight md:text-4xl">{activity.titulo}</h1>
        <p className="mt-3 text-base leading-7 text-[var(--color-muted-foreground)]">{activity.resumo}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-[var(--color-muted)] px-3 py-2"><Clock3 className="mr-1 inline size-4" />{activity.duracao} min + {activity.preparo} de preparo</span>
          <span className="rounded-full bg-[var(--color-muted)] px-3 py-2">Energia da criança: {activity.energia}</span>
          <span className="rounded-full bg-[var(--color-muted)] px-3 py-2">Energia do adulto: {activity.energiaAdulto}</span>
          <span className="rounded-full bg-[var(--color-muted)] px-3 py-2">Bagunça: {activity.bagunca}</span>
          <span className="rounded-full bg-[var(--color-muted)] px-3 py-2">{activity.local}</span>
        </div>
        <Link href={activeHref} className="mt-6 block"><Button size="lg" className="h-14 w-full rounded-2xl text-base font-black"><Play className="mr-2 size-5" />Preparar para brincar</Button></Link>

        <div className="mt-8 space-y-4">
          <ContentSection title="O que vocês vão viver" icon={HeartHandshake}><p>{activity.resumo}</p></ContentSection>
          <ContentSection title="Por que combina com esta fase" icon={Sparkles}><p>{activity.justificativaFase}</p></ContentSection>
          <ContentSection title="Materiais e substituições" icon={Package}>
            {activity.materiais.length ? <ul className="list-disc space-y-1 pl-5">{activity.materiais.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Não exige material específico.</p>}
            <p className="mt-3 text-[var(--color-muted-foreground)]">Se faltar algo, use um item de função parecida, sem peças pequenas, pontas ou material quebrável.</p>
          </ContentSection>
          <ContentSection title="Segurança e supervisão" icon={ShieldCheck}>
            <p><strong>Supervisão:</strong> {supervision}</p>
            {risks.length > 0 && <p className="mt-2"><strong>Atenção a:</strong> {risks.join("; ")}.</p>}
            <ul className="mt-2 list-disc space-y-1 pl-5">{safetyGuidance.map((item) => <li key={item}>{item}</li>)}</ul>
          </ContentSection>
          <ContentSection title="Preparação do ambiente" icon={BookOpenCheck}><ol className="list-decimal space-y-2 pl-5">{activity.preparacao.map((item) => <li key={item}>{item}</li>)}</ol></ContentSection>
          <ContentSection title="Passos curtos" icon={Play}><ol className="list-decimal space-y-2 pl-5">{activity.passos.map((item) => <li key={item}>{item}</li>)}</ol></ContentSection>
          <ContentSection title="Frases que ajudam a interagir" icon={HeartHandshake}><ul className="space-y-2">{activity.prompts.map((item) => <li key={item}>“{item}”</li>)}</ul></ContentSection>
          <ContentSection title="O que observar — e quando parar" icon={ShieldCheck}>
            <p className="font-bold">Sinais de interesse</p><ul className="list-disc pl-5">{activity.sinaisInteresse.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="mt-3 font-bold">Sinais para adaptar ou encerrar</p><ul className="list-disc pl-5">{activity.sinaisPausa.map((item) => <li key={item}>{item}</li>)}</ul>
          </ContentSection>
          <ContentSection title="Variações" icon={Sparkles}><p><strong>Simplificar:</strong> {simplify}</p><p className="mt-2"><strong>Ampliar:</strong> {expand}</p><p className="mt-2"><strong>Repetir outro dia:</strong> {repeat}</p></ContentSection>
          <ContentSection title="Adaptações inclusivas" icon={HeartHandshake}>
            <ul className="space-y-2">
              {inlineAdaptations.map((item, index) => typeof item.orientacao === "string" && <li key={index}>{item.orientacao}</li>)}
              {extraAdaptations.map((item) => <li key={item.id}><strong>{item.titulo}:</strong> {item.orientacao}</li>)}
            </ul>
          </ContentSection>
          <details className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-black marker:hidden md:px-6">
              <span className="flex items-center gap-2"><BookOpenCheck className="size-5 text-[var(--color-primary)]" aria-hidden="true" />Fonte e revisão</span>
              <span className="text-xs text-[var(--color-muted-foreground)] transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
            </summary>
            <div className="border-t border-[var(--color-border)] px-5 pb-5 pt-4 md:px-6">
            <p>Conteúdo v{activity.versao}. {activity.revisadoPor ? `Revisão: ${activity.revisadoPor}.` : "Revisão pendente."}</p>
            {activity.proximaRevisao && <p>Próxima revisão editorial: {new Date(`${activity.proximaRevisao}T12:00:00`).toLocaleDateString("pt-BR")}.</p>}
            <div className="mt-4 space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="rounded-2xl bg-[var(--color-muted)] p-4">
                  <p className="font-bold">{source.titulo}</p><p className="text-xs text-[var(--color-muted-foreground)]">{source.organizacao} · {source.tipo.replaceAll("_", " ")}</p>
                  <p className="mt-2">{source.claim}</p>
                  <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center font-bold text-[var(--color-primary)] underline">Ler fonte <ExternalLink className="ml-1 size-4" /></a>
                </div>
              ))}
            </div>
            </div>
          </details>
        </div>
      </main>
    </div>
  );
}
