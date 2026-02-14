import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Dumbbell, BookMarked, BookOpen, User, ArrowRight, Bell, Plus, Calendar } from "lucide-react";
import { getAllBlogPosts } from "@/lib/mdx";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { JourneySuggestions } from "@/components/journey/JourneySuggestions";
import { getDashboardSuggestions } from "@/lib/journey/suggestions";
import { ChildAgeCard } from "@/components/dashboard/ChildAgeCard";
import { differenceInYears, differenceInMonths, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início | Brincar Educando",
  robots: { index: false },
};

import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const firstName = user.user_metadata?.full_name?.split(" ")[0] ?? "Pai/Mãe";

  // 1. Buscar Perfil da Criança para Contexto
  // TODO: Migrate to brincareducando.perfis_criancas when onboarding is updated
  const { data: criancas } = await supabase
    .schema("brincareducando")
    .from("criancas")
    .select("id, nome, data_nascimento, avatar_id, cor_favorita")
    .order("created_at", { ascending: false })
    .limit(1);

  const child = criancas?.[0];
  let childContext = "Crie o perfil da sua criança para sugestões personalizadas.";
  let childAgeMonths: number | null = null;
  let childAgeString = "";

  if (child) {
    const birthDate = parseISO(child.data_nascimento);
    const years = differenceInYears(new Date(), birthDate);
    const months = differenceInMonths(new Date(), birthDate) % 12;
    childAgeMonths = differenceInMonths(new Date(), birthDate);

    if (years > 0) childAgeString += `${years} ${years === 1 ? "ano" : "anos"}`;
    if (years > 0 && months > 0) childAgeString += " e ";
    if (months > 0 || years === 0) childAgeString += `${months} ${months === 1 ? "mês" : "meses"}`;

    childContext = `${child.nome} está com ${childAgeString}`;
  }

  // 2. Buscar Sugestões (Server Side) — filtradas pela faixa etária da criança
  const suggestions = await getDashboardSuggestions(supabase, childAgeMonths);

  // Latest 3 blog posts for suggested reading
  const posts = getAllBlogPosts().slice(0, 3);

  const quickLinks = [
    { href: "/atividades", label: "Atividades", icon: Dumbbell, color: "bg-[var(--color-primary)]", desc: "Explorar atividades" },
    { href: "/diario", label: "Diário", icon: BookMarked, color: "bg-[var(--color-secondary)]", desc: "Registrar memória" },
    { href: "/historias", label: "Histórias", icon: BookOpen, color: "bg-emerald-500", desc: "Ler uma história" },
    { href: "/perfil", label: "Perfil", icon: User, color: "bg-amber-500", desc: "Ver desenvolvimento" },
  ];

  const todayDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const todayDateCapitalized = todayDate.charAt(0).toUpperCase() + todayDate.slice(1);

  return (
    <div className="min-h-screen">
      {/* Header Personalizado */}
      <header className="px-6 pt-8 pb-6 flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-[var(--color-foreground)] flex items-center gap-2">
            🌤️ Boa tarde, {firstName}!
          </h1>
          <div className="text-sm text-[var(--color-muted-foreground)] space-y-0.5">
            <p className="capitalize text-gray-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {todayDateCapitalized}
            </p>
            {child ? (
              <ChildAgeCard
                nome={child.nome}
                idadeTexto={childAgeString}
                avatarId={child.avatar_id}
                corFavorita={child.cor_favorita}
              />
            ) : (
              <p className="text-[var(--color-primary)] font-medium">
                {childContext}
              </p>
            )}
          </div>
        </div>
        <button className="p-2.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm relative">
          <Bell className="h-5 w-5 text-[var(--color-foreground)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-primary)] rounded-full" />
        </button>
      </header>

      <div className="px-6 pb-8 space-y-10">

        {/* Journey Suggestions (Hero + Grid) */}
        {suggestions ? (
          <JourneySuggestions
            featured={suggestions.featured}
            others={suggestions.others}
          />
        ) : (
          <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center text-gray-400">
            <p className="text-2xl mb-2">🎯</p>
            <p className="font-bold text-gray-600 text-sm">Nenhuma atividade encontrada</p>
            <p className="text-xs mt-1">
              <a href="/atividades" className="underline hover:text-gray-700">Explorar atividades</a>
            </p>
          </div>
        )}

        {/* Quick links 2x2 grid */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4 pl-1">
            Acessar Rápido
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickLinks.map(({ href, label, icon: Icon, color, desc }) => (
              <Link
                key={href}
                href={href}
                className="card-theme group flex flex-col gap-3 p-5 hover:no-underline transition-all hover:bg-gray-50"
              >
                <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black text-sm text-[var(--color-foreground)]">{label}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New diary entry CTA */}
        <section>
          <Link
            href="/diario/nova"
            className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all hover:no-underline group"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Plus className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-black text-base">Registrar memória</p>
              <p className="text-sm opacity-80">Adicione uma nova entrada no diário</p>
            </div>
            <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {/* Blog suggestions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-muted-foreground)] pl-1">
              Leitura sugerida
            </h2>
            <Link
              href="/blog"
              className="text-xs font-bold text-[var(--color-primary)] hover:underline flex items-center gap-1"
            >
              Ver mais <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
