import Link from "next/link";
import { ArrowRight, BookmarkPlus } from "lucide-react";

export function MemoryPrompt() {
  return (
    <section className="dashboard-memory-prompt" aria-labelledby="memory-prompt-title">
      <div className="dashboard-memory-icon"><BookmarkPlus className="size-5" aria-hidden="true" /></div>
      <div className="min-w-0 flex-1">
        <h2 id="memory-prompt-title" className="font-black text-[var(--color-foreground)]">Algo para guardar de hoje?</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">Uma fala, descoberta ou cena — se quiser.</p>
      </div>
      <Link href="/diario/nova" className="dashboard-memory-action">
        Guardar um momento <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
