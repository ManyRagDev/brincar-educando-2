"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const pillars = [
  {
    number: "1",
    titleVibrant: "Foco Enérgico",
    titleAcolher: "Presença Gentil",
    textVibrant:
      "Atividades que canalizam a energia natural da criança para o aprendizado lúdico e sensorial.",
    textAcolher:
      "Momentos calmos que constroem vínculos seguros e estimulam o desenvolvimento no próprio ritmo.",
    colorClass: "bg-[var(--color-accent)]",
    textColorClass: "text-[var(--color-secondary)]",
  },
  {
    number: "2",
    titleVibrant: "Inclusão Radical",
    titleAcolher: "Acolhimento Total",
    textVibrant:
      "Design acessível e adaptável para que nenhuma criança fique de fora da brincadeira.",
    textAcolher:
      "Conteúdo pensado para diferentes perfis sensoriais, com modo de baixo estímulo disponível.",
    colorClass: "bg-[var(--color-secondary)]",
    textColorClass: "text-[var(--color-primary)]",
  },
  {
    number: "3",
    titleVibrant: "Conexão Ativa",
    titleAcolher: "Conexão Profunda",
    textVibrant:
      "Trocas reais entre pais e filhos impulsionadas por provocações criativas semanais.",
    textAcolher:
      "Diário familiar para registrar marcos e memórias preciosas com intenção e carinho.",
    colorClass: "bg-[var(--color-primary)]",
    textColorClass: "text-[var(--color-accent)]",
  },
];

export function PillarsSection() {
  const { isAcolher } = useTheme();

  return (
    <section className="py-24 px-4 bg-[var(--color-background)]">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16 max-w-lg">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2">
            Nossos Pilares
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-black leading-[1.1] text-[var(--color-foreground)]">
            O desenvolvimento é uma{" "}
            <span className="italic text-[var(--color-primary)]">jornada</span>
            {", "}não uma{" "}
            <span className="text-[var(--color-secondary)]">corrida</span>.
          </h2>
        </div>

        {/* Pillars: stacked mobile, 3-col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-4 p-6 rounded-[var(--radius-xl)] transition-all",
                isAcolher
                  ? "bg-[var(--color-card)] border border-[var(--color-border)] shadow-[var(--shadow-card)]"
                  : "bg-[var(--color-muted)]"
              )}
            >
              {/* Number circle */}
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl shadow-lg shrink-0",
                  pillar.colorClass,
                  "text-[var(--color-foreground)]"
                )}
                style={{
                  boxShadow: isAcolher
                    ? "none"
                    : `0 8px 20px ${
                        index === 0
                          ? "rgba(255,214,0,0.3)"
                          : index === 1
                          ? "rgba(124,77,255,0.3)"
                          : "rgba(255,111,97,0.3)"
                      }`,
                }}
              >
                {pillar.number}
              </div>

              <div>
                <h3
                  className={cn(
                    "font-black text-xl mb-2",
                    pillar.textColorClass
                  )}
                >
                  {isAcolher ? pillar.titleAcolher : pillar.titleVibrant}
                </h3>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                  {isAcolher ? pillar.textAcolher : pillar.textVibrant}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
