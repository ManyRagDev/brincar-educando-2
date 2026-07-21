import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  Heart,
  Brain,
  Leaf,
  BookOpen,
  Dumbbell,
  BookMarked,
  ShoppingBag,
  ArrowRight,
  Users,
  Sparkles,
  Shield,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre | Brincar Educando",
  description:
    "Conheça o Brincar Educando — uma plataforma criada para conectar a ciência do desenvolvimento infantil com o brincar de cada dia.",
};

const pilares = [
  {
    numero: "1",
    emoji: "🧠",
    titulo: "Baseado em ciência",
    texto:
      "Todo conteúdo é fundamentado em pesquisas de neurociência, desenvolvimento infantil e pedagogias ativas como Montessori e Disciplina Positiva.",
    cor: "bg-[var(--color-primary)]",
  },
  {
    numero: "2",
    emoji: "❤️",
    titulo: "Com carinho e respeito",
    texto:
      "Acreditamos que parentalidade positiva não é fraqueza — é ciência. Respeitamos o ritmo de cada criança e o cansaço real de cada família.",
    cor: "bg-[var(--color-secondary)]",
  },
  {
    numero: "3",
    emoji: "🌱",
    titulo: "Inclusão de verdade",
    texto:
      "Conteúdo pensado para diferentes perfis sensoriais. Temos um modo de baixo estímulo (Acolher) para quem precisa de uma experiência mais calma.",
    cor: "bg-emerald-500",
  },
];

const funcionalidades = [
  {
    icon: Dumbbell,
    titulo: "Atividades",
    desc: "Sugestões de atividades filtradas pela faixa etária da sua criança, com foco em desenvolvimento motor, cognitivo, sensorial e emocional.",
    cor: "bg-[var(--color-primary)]",
  },
  {
    icon: BookMarked,
    titulo: "Diário Familiar",
    desc: "Registre memórias, marcos e momentos preciosos. Um espaço para guardar a história do crescimento do seu filho.",
    cor: "bg-[var(--color-secondary)]",
  },
  {
    icon: BookOpen,
    titulo: "Histórias (em breve)",
    desc: "Brincontos — histórias mágicas e educativas para ler junto, com temas de emoções, natureza, valores e fantasia.",
    cor: "bg-emerald-500",
  },
  {
    icon: ShoppingBag,
    titulo: "Loja (em breve)",
    desc: "Curadoria de brinquedos, materiais e livros com respaldo em desenvolvimento infantil — sem achismo, só o que vale.",
    cor: "bg-amber-500",
  },
];

const temasDosBlog = [
  "Sono do bebê",
  "Disciplina Positiva",
  "Montessori em casa",
  "Birras e emoções",
  "Introdução alimentar",
  "Amamentação",
  "Brinquedos sensoriais",
  "Tempo de tela",
  "Contato com a natureza",
  "Saúde emocional",
  "Segurança infantil",
  "Vínculo e apego",
];

export default function SobrePage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">

        {/* Hero */}
        <div className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-3">
              Nossa história
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] text-[var(--color-foreground)] mb-6">
              Brincar{" "}
              <span className="italic text-[var(--color-secondary)]">é</span>{" "}
              <span className="text-[var(--color-primary)]">cuidar</span>.
            </h1>
            <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed max-w-2xl">
              O Brincar Educando nasceu da convicção de que um momento de brincadeira sincera
              vale mais do que mil ferramentas perfeitas — e que a presença atenta dos pais
              já é o suficiente para mudar o desenvolvimento de uma criança.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl">

          {/* Missão */}
          <section className="py-16 border-b border-[var(--color-border)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-3">
                  Missão
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-black text-[var(--color-foreground)] mb-5 leading-tight">
                  Ciência na medida certa,{" "}
                  <span className="italic text-[var(--color-primary)]">carinho sem limite</span>
                </h2>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                  A parentalidade moderna vem acompanhada de muita informação — e muita culpa.
                  Criamos o Brincar Educando para transformar pesquisa científica em orientação
                  prática, acolhedora e sem julgamento.
                </p>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                  Mais de{" "}
                  <span className="font-bold text-[var(--color-foreground)]">5.000 famílias brasileiras</span>{" "}
                  já usam a plataforma para acompanhar o desenvolvimento dos seus filhos com mais
                  leveza, intenção e alegria.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: "🧬", label: "Neurociência", sub: "Base de todo conteúdo" },
                  { emoji: "🌿", label: "Pedagogias ativas", sub: "Montessori, Reggio Emilia e mais" },
                  { emoji: "💛", label: "Parentalidade positiva", sub: "Sem culpa, com ciência" },
                  { emoji: "♿", label: "Acessibilidade", sub: "Modo Acolher para todos os perfis" },
                ].map((item) => (
                  <div key={item.label} className="card-theme p-4 flex flex-col gap-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="font-bold text-sm text-[var(--color-foreground)]">{item.label}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pilares */}
          <section className="py-16 border-b border-[var(--color-border)]">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-3">
              Nossos pilares
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[var(--color-foreground)] mb-10 leading-tight max-w-lg">
              O desenvolvimento é uma{" "}
              <span className="italic text-[var(--color-primary)]">jornada</span>, não uma corrida.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pilares.map((pilar) => (
                <div key={pilar.titulo} className="card-theme p-6 flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-xl ${pilar.cor} flex items-center justify-center shadow-sm`}>
                    <span className="text-xl">{pilar.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[var(--color-foreground)] mb-2">
                      {pilar.titulo}
                    </h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                      {pilar.texto}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Modo Acolher */}
          <section className="py-16 border-b border-[var(--color-border)]">
            <div className="rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)] mb-1">
                    Inclusão de verdade
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black text-[var(--color-foreground)] leading-tight">
                    Modo Acolher — para quem precisa de menos estímulo
                  </h2>
                </div>
              </div>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4 max-w-2xl">
                Sabemos que nem todo pai, mãe ou cuidador tem um dia tranquilo. Sabemos também que
                algumas crianças — e adultos — são mais sensíveis a cores fortes, movimentos e ruído visual.
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed max-w-2xl">
                Por isso criamos o{" "}
                <span className="font-bold text-[var(--color-foreground)]">Modo Acolher</span>:
                uma experiência de baixo estímulo, com paleta suave, tipografia calma e linguagem
                mais gentil — disponível para todos, a qualquer momento, com um clique.
              </p>
            </div>
          </section>

          {/* O que você encontra na plataforma */}
          <section className="py-16 border-b border-[var(--color-border)]">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-3">
              A plataforma
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[var(--color-foreground)] mb-10 leading-tight max-w-lg">
              Tudo o que você precisa,{" "}
              <span className="italic text-[var(--color-primary)]">num só lugar</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {funcionalidades.map(({ icon: Icon, titulo, desc, cor }) => (
                <div key={titulo} className="card-theme p-6 flex gap-4">
                  <div className={`w-10 h-10 ${cor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[var(--color-foreground)] mb-1">{titulo}</h3>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Blog */}
          <section className="py-16 border-b border-[var(--color-border)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-3">
                  Conteúdo gratuito
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-black text-[var(--color-foreground)] mb-5 leading-tight">
                  Um blog que vai direto ao{" "}
                  <span className="italic text-[var(--color-primary)]">ponto</span>
                </h2>
                <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                  Sem rodeios, sem terrorismo parental. Nossos artigos traduzem
                  pesquisas reais em orientações práticas que cabem na rotina.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-bold text-sm hover:no-underline hover:opacity-90 transition-opacity"
                >
                  Ver o blog <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">
                  Temas que abordamos
                </p>
                <div className="flex flex-wrap gap-2">
                  {temasDosBlog.map((tema) => (
                    <span
                      key={tema}
                      className="px-3 py-1.5 rounded-full bg-[var(--color-muted)] text-xs font-semibold text-[var(--color-foreground)]"
                    >
                      {tema}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Valores */}
          <section className="py-16 border-b border-[var(--color-border)]">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-3">
              Nossos valores
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-[var(--color-foreground)] mb-10 leading-tight max-w-lg">
              O que acreditamos de{" "}
              <span className="italic text-[var(--color-primary)]">verdade</span>
            </h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Brain,
                  color: "text-[var(--color-primary)]",
                  titulo: "Ciência antes de modismo",
                  texto:
                    "Não publicamos o que está na moda — publicamos o que tem embasamento. Toda orientação é revisada à luz de pesquisas confiáveis sobre desenvolvimento infantil.",
                },
                {
                  icon: Heart,
                  color: "text-rose-500",
                  titulo: "Parentalidade sem culpa",
                  texto:
                    "Você não precisa ser perfeito para ser um ótimo pai ou mãe. Nosso tom é de apoio, não de cobrança. Erramos juntos, crescemos juntos.",
                },
                {
                  icon: Leaf,
                  color: "text-emerald-500",
                  titulo: "Respeito pelo ritmo de cada criança",
                  texto:
                    "Marcos de desenvolvimento são referências, não cobranças. Cada criança tem o seu tempo — e isso é lindo, não um problema a resolver.",
                },
                {
                  icon: Users,
                  color: "text-[var(--color-secondary)]",
                  titulo: "Inclusão sem exceção",
                  texto:
                    "Famílias diversas, crianças com diferentes perfis sensoriais, neurodivergentes, pais solos — o Brincar Educando é para todos.",
                },
                {
                  icon: Sparkles,
                  color: "text-amber-500",
                  titulo: "Brincar é sério (de verdade)",
                  texto:
                    "O brincar livre e intencional é a principal ferramenta de aprendizado na primeira infância. Não é perda de tempo — é o trabalho mais importante que uma criança pode fazer.",
                },
              ].map(({ icon: Icon, color, titulo, texto }) => (
                <div key={titulo} className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--color-muted)]">
                  <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${color}`} />
                  <div>
                    <p className="font-black text-sm text-[var(--color-foreground)] mb-1">{titulo}</p>
                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-16">
            <div className="rounded-2xl bg-[var(--color-primary)] p-10 md:p-14 text-center">
              <span className="text-4xl mb-4 block">🌱</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[var(--color-primary-foreground)] mb-4 leading-tight">
                Comece a jornada hoje
              </h2>
              <p className="text-[var(--color-primary-foreground)]/80 text-base leading-relaxed mb-8 max-w-md mx-auto">
                Crie seu perfil gratuito, adicione o perfil da sua criança e receba sugestões
                de atividades personalizadas para a idade dela.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/auth?mode=signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-[var(--color-primary)] font-black text-sm hover:no-underline hover:bg-white/90 transition-colors"
                >
                  Criar conta grátis <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/30 text-[var(--color-primary-foreground)] font-bold text-sm hover:no-underline hover:bg-white/10 transition-colors"
                >
                  Explorar o blog
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
