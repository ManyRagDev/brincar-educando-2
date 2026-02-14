import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { ShoppingBag, Sparkles, Heart, Star, Leaf, Palette } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja | Brincar Educando",
  description: "Em breve: seleção curada de brinquedos educativos e recursos para o desenvolvimento infantil.",
};

const categorias = [
  { emoji: "🧩", label: "Montessori" },
  { emoji: "🎨", label: "Arte" },
  { emoji: "📚", label: "Livros" },
  { emoji: "🌿", label: "Sensorial" },
  { emoji: "🎵", label: "Música" },
  { emoji: "✨", label: "Criatividade" },
];

export default function LojaPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">
        {/* Hero */}
        <div className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
                Produtos selecionados
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-black leading-tight text-[var(--color-foreground)] mb-4">
                A lojinha está sendo{" "}
                <span className="text-[var(--color-primary)] italic">preparada</span>
              </h1>
              <p className="text-[var(--color-muted-foreground)] text-lg">
                Estamos curadando com cuidado os melhores produtos para o desenvolvimento infantil.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-14 max-w-2xl">
          {/* Card principal */}
          <div className="card-theme overflow-hidden">
            {/* Topo colorido */}
            <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400" />

            <div className="p-8 md:p-12 flex flex-col items-center text-center">
              {/* Ícone */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-[var(--color-primary)]" />
                </div>
                <span className="absolute -top-1 -right-1 text-2xl">🛍️</span>
                <span className="absolute -bottom-1 -left-2 text-xl">✨</span>
              </div>

              {/* Badge */}
              <div className="mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-black uppercase tracking-widest">
                <Sparkles className="h-3 w-3" />
                Em breve
              </div>

              <h2 className="font-serif text-3xl font-black text-[var(--color-foreground)] mb-4 leading-tight">
                A lojinha está chegando
              </h2>

              <p className="text-[var(--color-muted-foreground)] text-base leading-relaxed mb-3 max-w-md">
                Estamos selecionando produtos com muito critério — brinquedos, materiais e livros
                que realmente fazem diferença no desenvolvimento do seu filho.
              </p>

              <p className="text-[var(--color-muted-foreground)] text-base leading-relaxed mb-8 max-w-md">
                Sem achismo, sem exagero.{" "}
                <span className="text-[var(--color-foreground)] font-semibold">
                  Só o que tem respaldo e vale cada real.
                </span>
              </p>

              {/* Divisor */}
              <div className="w-12 h-px bg-[var(--color-border)] mb-8" />

              {/* Categorias em preview */}
              <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-5">
                Categorias que você vai encontrar
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categorias.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-muted)] text-sm font-semibold text-[var(--color-foreground)]"
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </div>
                ))}
              </div>

              {/* Promessas */}
              <div className="w-full rounded-2xl bg-[var(--color-muted)] p-6 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                    Curadoria baseada em desenvolvimento infantil e pedagogias ativas.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                    Produtos selecionados por faixa etária, do bebê ao pré-escolar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                    Prioridade para materiais naturais, atóxicos e sustentáveis.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Palette className="h-5 w-5 text-pink-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--color-muted-foreground)] text-left">
                    Arte, música, sensorial, lógica — um universo para cada fase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
