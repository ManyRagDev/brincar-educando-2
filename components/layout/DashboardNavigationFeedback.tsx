"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";

const FEEDBACK_TIMEOUT_MS = 12_000;

type PendingNavigation = {
  fromPath: string;
  toPath: string;
  label: string;
};

function readableLinkLabel(anchor: HTMLAnchorElement) {
  const label = anchor.getAttribute("aria-label") || anchor.textContent || "";
  return label.replace(/\s+/g, " ").trim().slice(0, 60);
}

export function DashboardNavigationFeedback() {
  const pathname = usePathname();
  const [pending, setPending] = useState<PendingNavigation | null>(null);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeNavigation = pending && pending.fromPath === pathname && pending.toPath !== pathname ? pending : null;

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download") || anchor.getAttribute("aria-disabled") === "true") return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;

      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      setPending({
        fromPath: window.location.pathname,
        toPath: destination.pathname,
        label: readableLinkLabel(anchor),
      });
      fallbackTimer.current = setTimeout(() => setPending(null), FEEDBACK_TIMEOUT_MS);
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
  }, []);

  if (!activeNavigation) return null;

  return (
    <div className="fixed inset-0 z-[100] cursor-progress" aria-live="polite" aria-busy="true">
      <div className="absolute inset-0 bg-[var(--color-background)]/5" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-[var(--color-primary)]/15" aria-hidden="true">
        <div className="h-full w-full origin-left animate-pulse bg-[var(--color-primary)] motion-reduce:animate-none" />
      </div>
      <div className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-bold text-[var(--color-foreground)] shadow-lg">
        <LoaderCircle className="size-4 animate-spin text-[var(--color-primary)] motion-reduce:animate-none" aria-hidden="true" />
        <span>{activeNavigation.label ? `Abrindo ${activeNavigation.label}…` : "Abrindo…"}</span>
      </div>
    </div>
  );
}
