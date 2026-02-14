import { Info as InfoIcon, Lightbulb, CheckSquare, AlertTriangle, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockProps {
  children: React.ReactNode;
  className?: string;
}

export function Info({ children, className }: BlockProps) {
  return (
    <div className={cn(
      "my-6 flex gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900",
      className
    )}>
      <InfoIcon className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function Tip({ children, className }: BlockProps) {
  return (
    <div className={cn(
      "my-6 flex gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900",
      className
    )}>
      <Lightbulb className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-500" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function Warning({ children, className }: BlockProps) {
  return (
    <div className={cn(
      "my-6 flex gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900",
      className
    )}>
      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function Callout({ children, className }: BlockProps) {
  return (
    <blockquote className={cn(
      "my-8 p-6 rounded-xl border-l-4 border-[var(--color-primary)] bg-[var(--color-muted)]",
      className
    )}>
      <div className="text-base leading-relaxed text-[var(--color-foreground)] italic">
        {children}
      </div>
    </blockquote>
  );
}

interface ChecklistProps {
  items: string[];
  className?: string;
}

export function Checklist({ items, className }: ChecklistProps) {
  return (
    <ul className={cn("my-6 space-y-2", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <CheckSquare className="h-5 w-5 mt-0.5 flex-shrink-0 text-[var(--color-primary)]" />
          <span className="text-sm leading-relaxed text-[var(--color-foreground)]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
