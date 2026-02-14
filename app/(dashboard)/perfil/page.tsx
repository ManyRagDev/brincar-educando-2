import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Star, Trophy, BookOpen, Heart, Edit3, Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { calculateAge } from "@/lib/utils";
import NextImage from "next/image";

export const metadata: Metadata = {
  title: "Perfil | Brincar Educando",
  robots: { index: false },
};

const developmentAreas = [
  { label: "Motor", value: 75, color: "bg-rose-400" },
  { label: "Cognitivo", value: 82, color: "bg-blue-400" },
  { label: "Social", value: 68, color: "bg-purple-400" },
  { label: "Linguagem", value: 90, color: "bg-emerald-400" },
  { label: "Emocional", value: 71, color: "bg-amber-400" },
];

const milestones = [
  { date: "Nov 2025", title: "Primeira palavra", emoji: "💬", achieved: true },
  { date: "Out 2025", title: "Andou sozinho", emoji: "🚶", achieved: true },
  { date: "Set 2025", title: "Reconheceu cores", emoji: "🎨", achieved: true },
  { date: "Ago 2025", title: "Primeiros passos", emoji: "👣", achieved: true },
  { date: "Em breve", title: "Frases de 2 palavras", emoji: "📢", achieved: false },
  { date: "Em breve", title: "Nomear pessoas", emoji: "👨‍👩‍👦", achieved: false },
];

export default async function PerfilPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: criancas } = await supabase
    .from("criancas")
    .select("*")
    .order("created_at", { ascending: false });

  const hasChildren = criancas && criancas.length > 0;
  const mainChild = hasChildren ? criancas[0] : null;
  const parentName = user.user_metadata?.nome ?? user.user_metadata?.full_name ?? "Usuário";

  const avatarMap: Record<string, string> = {
    boy: "/images/avatars/boy.png",
    girl: "/images/avatars/girl.png",
    star: "/images/avatars/star.png",
    fox: "/images/avatars/fox.png",
    dino: "/images/avatars/dino.png",
    boy2: "/images/avatars/boy2.png",
    default: "/images/avatars/boy.png"
  };

  const avatarSrc = avatarMap[mainChild?.avatar_id] || avatarMap.default;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--color-foreground)]" />
        </Link>
        <h1 className="font-serif text-xl font-black text-[var(--color-foreground)]">Perfil</h1>
        {hasChildren ? (
          <Link
            href="/onboarding"
            className="p-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]"
          >
            <Edit3 className="h-4 w-4 text-[var(--color-foreground)]" />
          </Link>
        ) : (
          <div className="w-8" />
        )}
      </header>

      <div className="px-6 pb-8">
        {!hasChildren ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-4xl">
              🧸
            </div>
            <div>
              <h2 className="text-xl font-black">Nenhuma criança cadastrada</h2>
              <p className="text-[var(--color-muted-foreground)]">Cadastre o perfil para começar!</p>
            </div>
            <Link href="/onboarding" className="btn-primary-theme px-6 py-2 rounded-full flex items-center gap-2">
              <Plus className="w-4 h-4" /> Cadastrar Agora
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* ── Column 1: Profile card ── */}
            <div className="space-y-4 mb-8 lg:mb-0">
              <div className="card-theme p-6 text-center">
                <div className="w-32 h-32 rounded-3xl bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl relative overflow-hidden">
                  <NextImage
                    src={avatarSrc}
                    alt="Avatar da criança"
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <h2 className="font-serif text-2xl font-black text-[var(--color-foreground)] mb-1">
                  {mainChild.nome}
                </h2>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  {calculateAge(mainChild.data_nascimento)}
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2">
                    <p className="font-black text-lg text-[var(--color-primary)]">0</p>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-medium">Atividades</p>
                  </div>
                  <div className="p-2">
                    <p className="font-black text-lg text-[var(--color-secondary)]">0</p>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-medium">Entradas</p>
                  </div>
                  <div className="p-2">
                    <p className="font-black text-lg text-emerald-500">0</p>
                    <p className="text-[10px] text-[var(--color-muted-foreground)] font-medium">Histórias</p>
                  </div>
                </div>
              </div>

              {/* Parent info */}
              <div className="card-theme p-5">
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-3">
                  Responsável
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[var(--color-foreground)]">{parentName}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Column 2: Development bars ── */}
            <div className="mb-8 lg:mb-0">
              <div className="card-theme p-6">
                <h3 className="font-serif text-lg font-black text-[var(--color-foreground)] mb-6">
                  Desenvolvimento
                </h3>
                <div className="space-y-5">
                  {developmentAreas.map((area) => (
                    <div key={area.label}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-[var(--color-foreground)]">{area.label}</span>
                        <span className="text-sm font-black text-[var(--color-primary)]">{area.value}%</span>
                      </div>
                      <div className="h-3 bg-[var(--color-muted)] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${area.color} rounded-full transition-all duration-700`}
                          style={{ width: `${area.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-4 text-center">
                  Baseado nas atividades registradas
                </p>
              </div>
            </div>

            {/* ── Column 3: Milestones timeline ── */}
            <div>
              <div className="card-theme p-6">
                <h3 className="font-serif text-lg font-black text-[var(--color-foreground)] mb-6">
                  Marcos de desenvolvimento
                </h3>
                <div className="space-y-4">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${m.achieved
                        ? "bg-[var(--color-primary)]/10"
                        : "bg-[var(--color-muted)] opacity-50"
                        }`}>
                        {m.emoji}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${m.achieved ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)]"}`}>
                          {m.title}
                        </p>
                        <p className={`text-xs ${m.achieved ? "text-[var(--color-primary)] font-semibold" : "text-[var(--color-muted-foreground)]"}`}>
                          {m.achieved ? `✓ ${m.date}` : m.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
