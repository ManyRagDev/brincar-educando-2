"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Loader2, TrendingUp, Award, Calendar } from "lucide-react";

type StatData = {
    weeklyData: { name: string; count: number }[];
    categoryData: { name: string; value: number }[];
    totalActivities: number;
    streak: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function CrescimentoPage() {
    const { isAcolher } = useTheme();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<StatData>({
        totalActivities: 0,
        streak: 0,
        weeklyData: [],
        categoryData: [],
    });

    useEffect(() => {
        async function fetchStats() {
            const supabase = createClient();

            const { data: executions, error } = await supabase
                .schema("brincareducando")
                .from("atividades_execucoes")
                .select(`
          id,
          data_conclusao,
          atividade:atividade_id (
            categoria
          )
        `);

            if (!error && executions) {
                // 1. Total (Simples)
                const total = executions.length;

                // 2. Weekly Data — agrupa por dia da semana
                const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
                const weekly = days.map(day => ({ name: day, count: 0 }));

                executions.forEach(ex => {
                    const date = new Date(ex.data_conclusao);
                    const dayIndex = date.getDay();
                    weekly[dayIndex].count += 1;
                });

                // 3. Category Data
                const categories: Record<string, number> = {};
                executions.forEach((ex: any) => {
                    const cat = ex.atividade?.categoria || "Outros";
                    categories[cat] = (categories[cat] || 0) + 1;
                });

                const pieData = Object.entries(categories).map(([name, value]) => ({
                    name,
                    value
                }));

                // 4. Streak real — dias consecutivos com ao menos 1 execução
                const uniqueDays = Array.from(new Set(
                    executions.map(ex =>
                        new Date(ex.data_conclusao).toISOString().slice(0, 10)
                    )
                )).sort().reverse(); // mais recente primeiro

                let streak = 0;
                const today = new Date().toISOString().slice(0, 10);
                const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

                // Só conta streak se fez hoje ou ontem
                if (uniqueDays.length > 0 && (uniqueDays[0] === today || uniqueDays[0] === yesterday)) {
                    let expected = uniqueDays[0] === today ? today : yesterday;
                    for (const day of uniqueDays) {
                        if (day === expected) {
                            streak++;
                            const d = new Date(expected);
                            d.setDate(d.getDate() - 1);
                            expected = d.toISOString().slice(0, 10);
                        } else {
                            break;
                        }
                    }
                }

                setStats({
                    totalActivities: total,
                    streak,
                    weeklyData: weekly,
                    categoryData: pieData
                });
            }
            setLoading(false);
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen pb-20", isAcolher ? "bg-[#FFF9F5]" : "bg-gray-50")}>
            <header className="px-6 pt-8 pb-6">
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-1">
                    Seu progresso
                </p>
                <h1 className="font-serif text-3xl font-black text-[var(--color-foreground)]">
                    Crescimento
                </h1>
            </header>

            <div className="px-6 space-y-6 max-w-4xl mx-auto">

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
                            <Award className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black text-gray-900">{stats.totalActivities}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">Atividades</span>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black text-gray-900">{stats.streak} dias</span>
                        <span className="text-xs text-gray-500 font-bold uppercase">Sequência</span>
                    </div>
                </div>

                {/* Activity Frequency Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Atividades por Dia
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill={isAcolher ? "var(--color-primary)" : "#6366f1"}
                                    radius={[6, 6, 6, 6]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Categories Pie Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Categorias Favoritas</h3>
                    <div className="h-64 w-full flex items-center justify-center">
                        {stats.categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.categoryData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-gray-400 text-sm">Nenhum dado ainda</div>
                        )}
                    </div>

                    {/* Legend */}
                    {stats.categoryData.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {stats.categoryData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
