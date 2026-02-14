import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { ExternalLink, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja | Brincar Educando",
  description: "Seleção curada de brinquedos educativos e recursos para o desenvolvimento infantil.",
};

const products = [
  { title: "Kit Blocos Lógicos Montessori", price: "R$ 89,90", category: "Cognitivo", ageRange: "2-6 anos", emoji: "🧩", href: "#" },
  { title: "Tinta Guache Atóxica (12 cores)", price: "R$ 35,00", category: "Arte", ageRange: "1+ ano", emoji: "🎨", href: "#" },
  { title: "Massinha de Modelar Natural", price: "R$ 42,00", category: "Sensorial", ageRange: "1+ ano", emoji: "🌈", href: "#" },
  { title: "Livro: O Poder do Brincar", price: "R$ 58,00", category: "Livros", ageRange: "Pais", emoji: "📚", href: "#" },
  { title: "Xilofone Infantil Colorido", price: "R$ 65,00", category: "Música", ageRange: "1-4 anos", emoji: "🎵", href: "#" },
  { title: "Tapete Sensorial Tátil", price: "R$ 120,00", category: "Sensorial", ageRange: "0-3 anos", emoji: "🌿", href: "#" },
];

export default function LojaPage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">
        <div className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <div className="container mx-auto px-4 py-12">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
              Produtos selecionados
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-black text-[var(--color-foreground)] mb-3">
              Loja
            </h1>
            <p className="text-[var(--color-muted-foreground)] max-w-lg">
              Seleção curada de brinquedos educativos e livros para apoiar o desenvolvimento infantil.
              Links com parceiros de confiança.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <div key={i} className="card-theme overflow-hidden group">
                <div className="aspect-square bg-[var(--color-muted)] flex items-center justify-center">
                  <span className="text-7xl">{p.emoji}</span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-secondary)] mb-2 block">
                    {p.category} · {p.ageRange}
                  </span>
                  <h3 className="font-bold text-base text-[var(--color-foreground)] mb-2">{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-lg text-[var(--color-primary)]">{p.price}</span>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] text-xs font-bold hover:no-underline"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Comprar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[var(--color-muted-foreground)] text-center mt-12">
            * Links de afiliado. Comprando por aqui você apoia o Brincar Educando sem custo adicional.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
