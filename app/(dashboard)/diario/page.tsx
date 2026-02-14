"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, LayoutList, Loader2, BookMarked, Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format, isToday, isYesterday, parseISO, subDays, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { TimelineEntry } from "@/components/journey/TimelineEntry";
import { DiarioEntry } from "@/components/diario/DiarioEntry";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "week" | "month";
type TabType = "entradas" | "atividades";

type DiarioEntrada = {
  id: string;
  titulo: string | null;
  conteudo: string;
  humor: string | null;
  tags: string[] | null;
  data_entrada: string;
};

type Execution = {
  id: string;
  data_conclusao: string;
  duracao_minutos: number | null;
  avaliacao: number | null;
  notas: string | null;
  fotos_urls: string[] | null;
  habilidades_desbloqueadas: string[] | null;
  atividade: {
    titulo: string;
    categoria: string;
    imagem_url: string | null;
  };
};

const FILTER_LABELS: { key: FilterType; label: string }[] = [
  { key: "all", label: "Tudo" },
  { key: "week", label: "Esta Semana" },
  { key: "month", label: "Este Mês" },
];

function groupByDate<T>(items: T[], getDate: (item: T) => string): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const date = parseISO(getDate(item));
    let key: string;
    if (isToday(date)) key = "Hoje";
    else if (isYesterday(date)) key = "Ontem";
    else key = format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
    key = key.charAt(0).toUpperCase() + key.slice(1);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export default function DiarioPage() {
  const { isAcolher } = useTheme();
  const [tab, setTab] = useState<TabType>("entradas");
  const [filter, setFilter] = useState<FilterType>("all");

  const [entradas, setEntradas] = useState<DiarioEntrada[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const supabase = createClient();

      const since =
        filter === "week"
          ? subDays(new Date(), 7).toISOString()
          : filter === "month"
          ? subMonths(new Date(), 1).toISOString()
          : null;

      if (tab === "entradas") {
        let query = supabase
          .from("diario_entradas")
          .select("id, titulo, conteudo, humor, tags, data_entrada")
          .order("data_entrada", { ascending: false });
        if (since) query = query.gte("data_entrada", since);
        const { data } = await query;
        setEntradas((data as DiarioEntrada[]) ?? []);
      } else {
        let query = supabase
          .schema("brincareducando")
          .from("atividades_execucoes")
          .select(`
            *,
            atividade:atividade_id (
              titulo,
              categoria,
              imagem_url
            )
          `)
          .order("data_conclusao", { ascending: false });
        if (since) query = query.gte("data_conclusao", since);
        const { data } = await query;
        setExecutions((data as unknown as Execution[]) ?? []);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [tab, filter]);

  const groupedEntradas = groupByDate(entradas, (e) => e.data_entrada);
  const groupedExecutions = groupByDate(executions, (e) => e.data_conclusao);

  return (
    <div className={cn("min-h-screen pb-20", isAcolher ? "bg-[#FFF9F5]" : "bg-gray-50")}>
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-30 px-6 pt-8 pb-4 border-b transition-colors",
          isAcolher
            ? "bg-[#FFF9F5]/90 border-[var(--color-primary)]/10 backdrop-blur-md"
            : "bg-white/90 border-gray-100 backdrop-blur-md"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-1">
              Brincar Educando
            </p>
            <h1 className="font-serif text-3xl font-black text-[var(--color-foreground)]">
              Diário de{" "}
              <span
                className={cn(
                  "italic",
                  isAcolher ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)]"
                )}
              >
                Jornada
              </span>
            </h1>
          </div>
          {tab === "entradas" && (
            <Link href="/diario/nova">
              <Button
                size="icon"
                className={cn(
                  "rounded-full shadow-lg",
                  isAcolher ? "bg-[var(--color-primary)]" : "bg-[var(--color-secondary)]"
                )}
              >
                <Plus className="h-6 w-6" />
              </Button>
            </Link>
          )}
        </div>

        {/* Abas */}
        <div className="flex gap-1 mb-3 p-1 rounded-xl bg-gray-100 w-fit">
          <button
            onClick={() => setTab("entradas")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              tab === "entradas"
                ? isAcolher
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            )}
          >
            <BookMarked className="h-3.5 w-3.5" />
            Entradas
          </button>
          <button
            onClick={() => setTab("atividades")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              tab === "atividades"
                ? isAcolher
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "bg-white text-gray-900 shadow-sm"
                : "text-gray-500"
            )}
          >
            <Dumbbell className="h-3.5 w-3.5" />
            Atividades
          </button>
        </div>

        {/* Filtros de data */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                filter === key
                  ? isAcolher
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-black text-white"
                  : "bg-white border text-gray-500 hover:bg-gray-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Conteúdo */}
      <div className="px-6 py-6 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        ) : tab === "entradas" ? (
          entradas.length > 0 ? (
            Object.entries(groupedEntradas).map(([dateLabel, items]) => (
              <div key={dateLabel} className="mb-8">
                <h2
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider mb-6 pl-2",
                    isAcolher ? "text-[var(--color-primary)]/60" : "text-gray-400"
                  )}
                >
                  {dateLabel}
                </h2>
                {items.map((entry) => (
                  <DiarioEntry key={entry.id} entry={entry} />
                ))}
              </div>
            ))
          ) : (
            <div className="text-center py-20 opacity-60">
              <LayoutList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-700">
                {filter === "all" ? "O diário está vazio" : "Nenhuma entrada neste período"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {filter === "all"
                  ? "Registre o primeiro momento especial do seu filho!"
                  : "Tente selecionar um período maior."}
              </p>
              {filter === "all" && (
                <Link href="/diario/nova">
                  <Button variant="outline">Nova entrada</Button>
                </Link>
              )}
            </div>
          )
        ) : executions.length > 0 ? (
          Object.entries(groupedExecutions).map(([dateLabel, items]) => (
            <div key={dateLabel} className="mb-8">
              <h2
                className={cn(
                  "text-sm font-bold uppercase tracking-wider mb-6 pl-2",
                  isAcolher ? "text-[var(--color-primary)]/60" : "text-gray-400"
                )}
              >
                {dateLabel}
              </h2>
              {items.map((execution) => (
                <TimelineEntry key={execution.id} execution={execution} />
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-20 opacity-60">
            <LayoutList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-700">
              {filter === "all" ? "Nenhuma atividade registrada" : "Nenhuma atividade neste período"}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {filter === "all"
                ? "Complete sua primeira atividade para registrar aqui!"
                : "Tente selecionar um período maior."}
            </p>
            {filter === "all" && (
              <Link href="/atividades">
                <Button variant="outline">Explorar Atividades</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
