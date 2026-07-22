"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const AUTO_HIDE_DELAY_MS = 5_000;

export function EducationalScopeNotice() {
  const [expanded, setExpanded] = useState(true);
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    autoHideTimer.current = setTimeout(() => setExpanded(false), AUTO_HIDE_DELAY_MS);
    return () => {
      if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    };
  }, []);

  function toggleNotice() {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
    setExpanded((current) => !current);
  }

  if (!expanded) {
    return (
      <aside
        aria-label="Escopo do Brincar Educando recolhido"
        className="flex h-8 items-center justify-center border-b border-amber-200/70 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/20"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleNotice}
          className="h-7 gap-1 px-3 text-xs font-bold text-amber-950 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/40"
          aria-expanded="false"
          title="Mostrar aviso importante"
        >
          <ChevronDown className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Ver aviso importante</span>
        </Button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Escopo do Brincar Educando"
      className="border-b border-amber-200/70 bg-amber-50 px-5 py-3 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 lg:pl-4">
        <HeartHandshake className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <p className="flex-1 text-sm leading-relaxed">
          O Brincar Educando oferece ideias para brincar, observar e fortalecer vínculos. Ele não avalia o
          desenvolvimento nem substitui o acompanhamento de profissionais. Se algo preocupa sua família, veja{" "}
          <Link href="/orientacoes" className="font-bold underline underline-offset-2">
            como buscar apoio
          </Link>
          .
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleNotice}
          className="-mr-2 -mt-1 size-8 shrink-0 text-amber-950 hover:bg-amber-100 dark:text-amber-100 dark:hover:bg-amber-900/40"
          aria-label="Ocultar aviso importante"
          aria-expanded="true"
          title="Ocultar aviso importante"
        >
          <ChevronUp className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </aside>
  );
}
