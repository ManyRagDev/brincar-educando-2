"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Play, Zap, Share2, Package, ListChecks, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { ActivityBadge } from "@/components/journey/ActivityBadge";

interface Activity {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  categoria: string;
  idade_min_meses: number;
  idade_max_meses: number;
  imagem_url: string | null;
  energia: "alta" | "media" | "baixa";
  preparo_minutos: number;
  duracao_minutos: number;
  dificuldade: string;
  local: string;
  materiais: string[] | null;
  passos: string[] | null;
  dicas: string[] | null;
  beneficios: string[] | null;
}

export default function AtividadeDetalhesPage() {
  const { slug } = useParams() as { slug: string };
  const { isAcolher } = useTheme();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .schema("brincareducando")
        .from("atividades")
        .select("*")
        .eq("slug", slug)
        .single();

      if (data) setActivity(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!activity) return <div className="p-8 text-center">Atividade não encontrada.</div>;

  const accentColor = isAcolher ? "text-[var(--color-primary)]" : "text-indigo-600";
  const sectionBg = isAcolher ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-100";

  return (
    <div className={cn("min-h-screen pb-24", isAcolher ? "bg-[#FFF9F5]" : "bg-white")}>
      {/* Header com Imagem */}
      <div className="relative h-64 md:h-80 w-full">
        {activity.imagem_url ? (
          <Image
            src={activity.imagem_url}
            alt={activity.titulo}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
            {activity.categoria === "sensorial" ? "🖐️" :
             activity.categoria === "criativa" ? "🎨" :
             activity.categoria === "cognitiva" ? "🧠" :
             activity.categoria === "movimento" ? "🏃" : "🌱"}
          </div>
        )}

        <Link href="/atividades" className="absolute top-6 left-6 z-10">
          <Button variant="secondary" size="icon" className="rounded-full shadow-md bg-white/90 hover:bg-white text-black">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Card principal */}
      <div className="px-6 -mt-8 relative z-10">
        <div className={cn(
          "bg-white rounded-3xl p-6 shadow-xl",
          isAcolher ? "shadow-[var(--color-primary)]/10" : "shadow-gray-200"
        )}>
          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 capitalize">
              {activity.categoria}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              {Math.floor(activity.idade_min_meses / 12)} a {Math.floor(activity.idade_max_meses / 12)} anos
            </Badge>
            {(activity.energia === "alta" || activity.energia === "media") && (
              <ActivityBadge type="energy_high" customText={`Energia ${activity.energia}`} />
            )}
            {activity.energia === "baixa" && (
              <ActivityBadge type="energy_low" />
            )}
            {activity.local === "ao ar livre" && (
              <ActivityBadge type="outdoor" />
            )}
          </div>

          <h1 className={cn(
            "text-3xl font-black mb-4 leading-tight",
            isAcolher ? "text-[var(--color-primary)]" : "text-gray-900"
          )}>
            {activity.titulo}
          </h1>

          <div className="flex items-center gap-6 text-sm font-bold text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{activity.preparo_minutos} min prep</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>{activity.duracao_minutos} min atividade</span>
            </div>
            {activity.dificuldade && (
              <div className="flex items-center gap-2">
                <span className="capitalize">{activity.dificuldade}</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {activity.descricao}
          </p>

          {/* Botão de Ação Principal */}
          <div className="space-y-3">
            <Link href={`/atividade-ativa/${activity.slug}`}>
              <Button size="lg" className={cn(
                "w-full h-14 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02]",
                isAcolher
                  ? "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90"
                  : "bg-indigo-600 hover:bg-indigo-700"
              )}>
                <Play className="w-5 h-5 mr-2 fill-current" />
                Começar Agora
              </Button>
            </Link>

            <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 text-gray-500 font-bold">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      {/* Seções de conteúdo */}
      <div className="px-6 mt-6 space-y-5 max-w-2xl mx-auto">

        {/* Materiais */}
        {activity.materiais && activity.materiais.length > 0 && (
          <div className={cn("rounded-2xl border p-5", sectionBg)}>
            <h3 className={cn("font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2", accentColor)}>
              <Package className="w-4 h-4" />
              Materiais necessários
            </h3>
            <ul className="space-y-2">
              {activity.materiais.map((material, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 text-sm">
                  <span className={cn("w-2 h-2 rounded-full flex-shrink-0", isAcolher ? "bg-[var(--color-primary)]" : "bg-indigo-500")} />
                  {material}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Passo a Passo */}
        {activity.passos && activity.passos.length > 0 && (
          <div className={cn("rounded-2xl border p-5", sectionBg)}>
            <h3 className={cn("font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2", accentColor)}>
              <ListChecks className="w-4 h-4" />
              Como fazer
            </h3>
            <ol className="space-y-4">
              {activity.passos.map((passo, i) => (
                <li key={i} className="flex gap-4">
                  <span className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 text-white",
                    isAcolher ? "bg-[var(--color-primary)]" : "bg-indigo-500"
                  )}>
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-gray-700 text-sm leading-relaxed">{passo}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Dicas */}
        {activity.dicas && activity.dicas.length > 0 && (
          <div className={cn("rounded-2xl border p-5", sectionBg)}>
            <h3 className={cn("font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2", accentColor)}>
              <Lightbulb className="w-4 h-4" />
              Dicas para aproveitar mais
            </h3>
            <ul className="space-y-3">
              {activity.dicas.map((dica, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                  <span className="text-base flex-shrink-0">💡</span>
                  <span className="leading-relaxed">{dica}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefícios/Habilidades */}
        {activity.beneficios && activity.beneficios.length > 0 && (
          <div className={cn("rounded-2xl border p-5", sectionBg)}>
            <h3 className={cn("font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2", accentColor)}>
              <Target className="w-4 h-4" />
              Habilidades desenvolvidas
            </h3>
            <div className="flex flex-wrap gap-2">
              {activity.beneficios.map((b, i) => (
                <span key={i} className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border",
                  isAcolher
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-100"
                )}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
