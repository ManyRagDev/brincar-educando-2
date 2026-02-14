"use client";

import Link from "next/link";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { RocketIcon, Heart, Zap } from "lucide-react";

export function NewsletterSection() {
  const { isAcolher } = useTheme();

  return (
    <section
      className={cn(
        "py-24 px-4 relative overflow-hidden transition-colors duration-500",
        isAcolher
          ? "bg-[var(--color-card)]"
          : "bg-[var(--color-secondary)] text-white"
      )}
    >
      {/* Background glow */}
      {!isAcolher && (
        <div
          aria-hidden
          className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-accent)] opacity-20 blur-3xl pointer-events-none"
        />
      )}

      <div className="container mx-auto relative z-10 max-w-2xl text-center">
        {/* Icon */}
        <div
          className={cn(
            "inline-flex items-center justify-center w-20 h-20 rounded-full mb-8",
            isAcolher
              ? "bg-[var(--color-primary)]/10"
              : "bg-white/10"
          )}
        >
          {isAcolher ? (
            <Heart className="h-8 w-8 text-[var(--color-primary)]" />
          ) : (
            <RocketIcon className="h-8 w-8 text-white" />
          )}
        </div>

        {/* Heading */}
        <h2
          className={cn(
            "font-serif text-3xl sm:text-4xl font-black mb-4 leading-tight",
            isAcolher
              ? "text-[var(--color-foreground)]"
              : "text-white"
          )}
        >
          {isAcolher
            ? "Tudo pronto para começar com calma?"
            : "Pronto para acelerar o desenvolvimento?"}
        </h2>

        <p
          className={cn(
            "mb-8 text-base leading-relaxed max-w-md mx-auto",
            isAcolher
              ? "text-[var(--color-muted-foreground)]"
              : "text-white/80"
          )}
        >
          {isAcolher
            ? "Junte-se a mais de 5.000 famílias que buscam um desenvolvimento consciente e sereno para seus filhos."
            : "Junte-se a mais de 5.000 famílias que transformaram a rotina com ferramentas baseadas em neurociência."}
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/auth?mode=signup"
            className={cn(
              "px-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center gap-3",
              isAcolher
                ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 shadow-lg"
                : "bg-white text-[var(--color-secondary)] hover:scale-105 hover:shadow-2xl"
            )}
          >
            {isAcolher ? "Iniciar Jornada Suave" : "Começar Agora!"}
            {isAcolher ? <Heart className="h-5 w-5 fill-current" /> : <Zap className="h-5 w-5 fill-current" />}
          </Link>
        </div>

        <p
          className={cn(
            "mt-8 text-[10px] font-bold uppercase tracking-widest",
            isAcolher
              ? "text-[var(--color-muted-foreground)]"
              : "text-white/60"
          )}
        >
          Acesso imediato e gratuito para começar hoje.
        </p>
      </div>
    </section>
  );
}
