import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre | Brincar Educando",
  description: "Conheça a missão e a história do Brincar Educando.",
};

export default function SobrePage() {
  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-3">
            Nossa história
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[var(--color-foreground)] mb-6">
            Sobre o Brincar Educando
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed mb-8">
            O Brincar Educando nasceu da paixão por unir a ciência do desenvolvimento
            infantil com a prática do brincar. Nossa missão é apoiar famílias na jornada
            da parentalidade positiva, oferecendo conteúdo baseado em evidências e
            ferramentas práticas para acompanhar o desenvolvimento saudável das crianças.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {[
              { emoji: "🧠", title: "Baseado em ciência", desc: "Todo conteúdo é fundamentado em pesquisas de neurociência e desenvolvimento infantil." },
              { emoji: "❤️", title: "Com carinho", desc: "Parentalidade positiva que respeita o ritmo de cada criança e família." },
              { emoji: "🌱", title: "Em crescimento", desc: "Comunidade em constante expansão de pais, educadores e especialistas." },
            ].map((item) => (
              <div key={item.title} className="card-theme p-6 text-center">
                <span className="text-4xl mb-3 block">{item.emoji}</span>
                <h3 className="font-bold text-base text-[var(--color-foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
