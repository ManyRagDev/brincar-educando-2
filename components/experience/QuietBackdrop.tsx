import { cn } from "@/lib/utils";

export function QuietBackdrop({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div className="pointer-events-none absolute -left-20 top-8 -z-10 size-56 rounded-full bg-[var(--color-primary)]/8 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-28 -z-10 size-72 rounded-full bg-[var(--color-secondary)]/7 blur-3xl" aria-hidden="true" />
      <div className="relative">{children}</div>
    </div>
  );
}
