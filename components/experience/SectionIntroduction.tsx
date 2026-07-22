interface SectionIntroductionProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function SectionIntroduction({ eyebrow, title, description, action }: SectionIntroductionProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 font-serif text-3xl font-black leading-tight text-[var(--color-foreground)] md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted-foreground)] md:text-base">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}
