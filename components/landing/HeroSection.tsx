"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, Heart } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const { isAcolher } = useTheme();

  return (
    <section className="relative min-h-screen pt-[120px] overflow-hidden bg-[var(--color-background)]">
      {/* Background decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className={cn(
            "absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[80px] transition-colors duration-700",
            isAcolher
              ? "bg-[var(--color-primary)]/20"
              : "bg-[var(--color-accent)]/30"
          )}
        />
        <div
          className={cn(
            "absolute top-40 -left-20 w-64 h-64 rounded-full blur-[60px] transition-colors duration-700",
            isAcolher
              ? "bg-[var(--color-secondary)]/15"
              : "bg-[var(--color-secondary)]/20"
          )}
        />
        <div
          className={cn(
            "absolute bottom-20 right-1/3 w-40 h-40 rounded-full blur-[50px] transition-colors duration-700",
            isAcolher
              ? "bg-[var(--color-accent)]/10"
              : "bg-[var(--color-primary)]/15"
          )}
        />
      </div>

      {/* Hero content: stacked on mobile, side-by-side on desktop */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 min-h-[calc(100vh-4rem)] py-12 lg:py-0">

          {/* Text column */}
          <div className="flex-1 lg:max-w-[55%] text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 border text-xs font-extrabold uppercase tracking-[0.15em]",
                isAcolher
                  ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)]"
                  : "bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[#B8860B]"
              )}
            >
              {isAcolher ? "Cuidar Brincando" : "Brincar com Propósito"}
            </div>

            {/* Headline */}
            <h1
              className={cn(
                "font-serif leading-[1.1] mb-6 tracking-tight",
                "text-[40px] sm:text-5xl lg:text-6xl xl:text-7xl",
                isAcolher
                  ? "font-medium text-[var(--color-foreground)]"
                  : "font-black text-[var(--color-foreground)]"
              )}
            >
              Brincar{" "}
              <span className={cn("italic", isAcolher ? "text-[var(--color-primary)] font-semibold" : "text-[var(--color-secondary)]")}>
                é
              </span>{" "}
              <span className="text-[var(--color-primary)]">cuidar</span>.
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                "text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0",
                isAcolher
                  ? "text-[var(--color-muted-foreground)] italic font-normal"
                  : "text-[var(--color-muted-foreground)] font-medium"
              )}
            >
              {isAcolher
                ? "Um espaço para aprender que cada criança tem o seu ritmo — e que a sua presença já é o suficiente."
                : "Um espaço para descobrir que um momento de brincadeira sincera vale mais do que mil ferramentas perfeitas."}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/auth?mode=signup"
                className={cn(
                  "inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-lg transition-all duration-300",
                  "btn-primary-theme",
                  isAcolher
                    ? "hover:opacity-90"
                    : "hover:-translate-y-1 hover:shadow-2xl"
                )}
              >
                Começar a Jornada
                {isAcolher ? (
                  <Heart className="h-5 w-5" />
                ) : (
                  <Zap className="h-5 w-5" />
                )}
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
              >
                Ver o blog
              </Link>
            </div>

            {/* Social proof */}
            <p className="mt-6 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] font-bold">
              Mais de 5.000 famílias conosco
            </p>
          </div>

          {/* Illustration column */}
          <div className="flex-1 lg:max-w-[45%] flex justify-center items-center order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative w-full max-w-[340px] lg:max-w-[480px] aspect-square">
              {/* Glow background */}
              <div
                className={cn(
                  "absolute inset-0 rounded-full blur-[60px] scale-110 transition-colors duration-700",
                  isAcolher
                    ? "bg-[var(--color-primary)]/10"
                    : "bg-gradient-to-tr from-[var(--color-secondary)]/20 to-[var(--color-accent)]/20"
                )}
              />
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwivXMgFIYbbmE_ykeYST-qZmYeh-KnlJt5oanylldX0H2G4_Hbdvb5yGEeYGbt2_eVHXW0WplEKKUkrFuHdcGBoG79Aacf6eIQRzEtt5mcRAmJdwkymUif8opkxQWoblJxPViYta7g1D3cjCSgopQfMy48UKBLe_iH5kxPGdQRyIhc35TicWiAVjAkr6WshmLkFJSRc4oXJX352NkodMhOrBbMNa-x7aiZAIaIq03wJd5czB-snJJ-Hghs-Gy1qp2ucyy4SCkSC4"
                alt="Árvore do conhecimento — símbolo do desenvolvimento infantil"
                fill
                className={cn(
                  "object-contain drop-shadow-2xl z-10",
                  isAcolher
                    ? "[filter:sepia(0.2)_saturate(0.8)] animate-[float_6s_ease-in-out_infinite]"
                    : "animate-[softBounce_4s_ease-in-out_infinite]"
                )}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-[var(--color-border)]" />
        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
      </div>
    </section>
  );
}
