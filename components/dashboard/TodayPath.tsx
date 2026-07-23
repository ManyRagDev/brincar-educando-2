import { BookmarkPlus, HandHeart, Sprout } from "lucide-react";

const steps = [
  { label: "Escolher o que cabe", icon: Sprout },
  { label: "Brincar do seu jeito", icon: HandHeart },
  { label: "Guardar se quiser", icon: BookmarkPlus },
];

export function TodayPath() {
  return (
    <section className="dashboard-path" aria-labelledby="today-path-title">
      <div className="flex items-center gap-2">
        <p id="today-path-title" className="dashboard-eyebrow text-[var(--color-foreground)]">
          O caminho de hoje
        </p>
        <span className="text-xs text-[var(--color-muted-foreground)]">Um convite, não uma tarefa.</span>
      </div>
      <div className="relative">
        <div className="dashboard-path-line" aria-hidden="true">
          <svg viewBox="0 0 800 76" preserveAspectRatio="none" role="presentation">
            <path d="M12 38 C130 4 230 70 350 36 S570 4 788 38" />
          </svg>
        </div>
        <ol className="relative mt-3 grid gap-3 sm:grid-cols-3 sm:gap-0">
        {steps.map(({ label, icon: Icon }, index) => (
          <li key={label} className="relative z-10 flex items-center gap-2 sm:flex-col sm:justify-center sm:gap-1 sm:text-center">
            <span className={`grid size-9 shrink-0 place-items-center rounded-full border-2 border-white shadow-sm ${index === 0 ? "bg-[#dfead0] text-[#527449]" : index === 1 ? "bg-[#fff0bd] text-[#a16b19]" : "bg-[#f8d8c9] text-[#a54d3c]"}`}>
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold text-[var(--color-foreground)] sm:mt-1">{label}</span>
          </li>
        ))}
        </ol>
      </div>
      <p className="sr-only">Escolher o que cabe, brincar do seu jeito e guardar se quiser. Nenhuma etapa é obrigatória.</p>
    </section>
  );
}
