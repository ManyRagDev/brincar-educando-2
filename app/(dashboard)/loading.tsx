import { LoaderCircle } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle className="size-7 animate-spin text-[var(--color-primary)] motion-reduce:animate-none" aria-hidden="true" />
        <p className="text-sm font-bold text-[var(--color-foreground)]">Preparando a próxima tela…</p>
        <p className="text-xs text-[var(--color-muted-foreground)]">Só um instante.</p>
      </div>
    </div>
  );
}
