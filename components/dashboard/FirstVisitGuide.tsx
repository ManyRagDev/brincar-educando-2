"use client";

import { X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "brincar-educando-first-visit-guide-dismissed";

export function FirstVisitGuide() {
  const [dismissed, setDismissed] = useState(false);
  const storedDismissed = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem(STORAGE_KEY) === "true",
    () => false,
  );
  const visible = !dismissed && !storedDismissed;

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  }

  return (
    <aside className="relative rounded-3xl border border-emerald-200 bg-emerald-50 p-5 pr-12 md:p-6 md:pr-14" aria-label="Como funciona">
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-xl text-emerald-900 hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        aria-label="Fechar explicação"
        title="Fechar explicação"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
      <p className="text-xs font-black uppercase tracking-wide text-emerald-800">Um começo simples</p>
      <p className="mt-1 font-serif text-xl font-black text-emerald-950">Encontre um convite possível para agora.</p>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-900">Escolha uma pista, adapte ao ritmo de vocês e guarde somente o que quiser lembrar. Nada aqui é tarefa ou avaliação.</p>
      <ol className="mt-4 grid gap-2 text-sm text-emerald-900 sm:grid-cols-3">
        <li><strong>1.</strong> Conte o que combina com o momento.</li>
        <li><strong>2.</strong> Veja por que o convite combina.</li>
        <li><strong>3.</strong> Brinque ou volte quando quiser.</li>
      </ol>
    </aside>
  );
}
