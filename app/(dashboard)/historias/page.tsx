import { BookOpen, Sparkles, Heart, Star, Leaf, Palette } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histórias | Brincar Educando",
  description: "Histórias mágicas e educativas para ler junto com seus filhos.",
  robots: { index: false },
};

const temas = [
  { emoji: "🌿", label: "Natureza", color: "from-emerald-400 to-teal-400" },
  { emoji: "💛", label: "Emoções", color: "from-amber-400 to-orange-400" },
  { emoji: "🦁", label: "Valores", color: "from-yellow-400 to-yellow-500" },
  { emoji: "🎨", label: "Arte", color: "from-pink-400 to-rose-400" },
  { emoji: "🔍", label: "Cognitivo", color: "from-blue-400 to-indigo-400" },
  { emoji: "✨", label: "Magia", color: "from-purple-400 to-violet-400" },
];

export default function HistoriasPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <div className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
              Brincontos
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-black leading-tight text-[var(--color-foreground)] mb-4">
              Histórias mágicas para{" "}
              <span className="text-[var(--color-primary)] italic">sonhar juntos</span>
            </h1>
            <p className="text-[var(--color-muted-foreground)] text-lg">
              Contos encantadores que desenvolvem a imaginação, ensinam valores
              e criam momentos inesquecíveis entre pais e filhos.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14 max-w-2xl">
        {/* Card principal */}
        <div className="card-theme overflow-hidden">
          {/* Topo colorido */}
          <div className="h-2 w-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400" />

          <div className="p-8 md:p-12 flex flex-col items-center text-center">
            {/* Ícone animado */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-[var(--color-primary)]" />
              </div>
              <span className="absolute -top-1 -right-1 text-2xl">✨</span>
              <span className="absolute -bottom-1 -left-2 text-xl">📖</span>
            </div>

            {/* Mensagem */}
            <div className="mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-black uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              Em construção com carinho
            </div>

            <h2 className="font-serif text-3xl font-black text-[var(--color-foreground)] mb-4 leading-tight">
              As histórias estão sendo escritas
            </h2>

            <p className="text-[var(--color-muted-foreground)] text-base leading-relaxed mb-3 max-w-md">
              Cada Brinconto está sendo criado com muita atenção ao desenvolvimento
              infantil — histórias que encantam, acolhem e ensinam de verdade.
            </p>

            <p className="text-[var(--color-muted-foreground)] text-base leading-relaxed mb-8 max-w-md">
              Já imagina sentar com seu filho no colo, abrir uma história e viajar juntos?{" "}
              <span className="text-[var(--color-foreground)] font-semibold">
                Esse momento está chegando.
              </span>
            </p>

            {/* Divisor */}
            <div className="w-12 h-px bg-[var(--color-border)] mb-8" />

            {/* Temas em preview */}
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-5">
              Temas que você vai encontrar
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {temas.map((tema) => (
                <div
                  key={tema.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-muted)] text-sm font-semibold text-[var(--color-foreground)]"
                >
                  <span>{tema.emoji}</span>
                  {tema.label}
                </div>
              ))}
            </div>

            {/* Promessa */}
            <div className="w-full rounded-2xl bg-[var(--color-muted)] p-6 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                  Histórias com ilustrações pensadas para cada faixa etária, do bebê ao pré-escolar.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                  Cada história acompanhada de perguntas para estimular o diálogo depois da leitura.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Leaf className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                  Conteúdo desenvolvido com base em pedagogias ativas e desenvolvimento infantil.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Palette className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                  Arte, natureza, emoções, valores — um universo inteiro para explorar juntos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
