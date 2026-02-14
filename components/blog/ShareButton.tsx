"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-muted)] text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-border)] transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500" />
          Link copiado!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Compartilhar
        </>
      )}
    </button>
  );
}
