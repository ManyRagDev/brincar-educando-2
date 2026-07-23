import Link from "next/link";
import { ArrowRight, BookmarkPlus } from "lucide-react";

export function MemoryPrompt() {
  return (
    <section className="dashboard-memory-prompt" aria-labelledby="memory-prompt-title">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-[var(--color-primary)] shadow-sm"><BookmarkPlus className="size-5" aria-hidden="true" /></div>
      <div className="min-w-0 flex-1">
        <h2 id="memory-prompt-title" className="font-black text-[var(--color-foreground)]">Algo para guardar de hoje?</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Uma fala, descoberta ou cena — se quiser.</p>
      </div>
      <Link href="/diario/nova" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-sm font-black text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2">
        Guardar um momento <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
