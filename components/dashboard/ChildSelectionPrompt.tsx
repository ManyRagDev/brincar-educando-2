"use client";

import { useRef } from "react";
import { Users } from "lucide-react";
import { setActiveChild } from "@/app/(dashboard)/actions";
import { useActiveChild } from "@/components/dashboard/ActiveChildProvider";

export function ChildSelectionPrompt() {
  const formRef = useRef<HTMLFormElement>(null);
  const { children } = useActiveChild();

  if (children.length < 2) return null;

  return (
    <section className="card-theme p-6" aria-labelledby="child-selection-title">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Users className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h2 id="child-selection-title" className="font-serif text-xl font-black">
            De quem vamos cuidar agora?
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Escolha uma criança para manter sugestões, memórias e observações separadas.
          </p>
          <form ref={formRef} action={setActiveChild} className="mt-4">
            <label htmlFor="active-child-prompt" className="sr-only">
              Criança ativa
            </label>
            <select
              id="active-child-prompt"
              name="childId"
              defaultValue=""
              required
              onChange={() => formRef.current?.requestSubmit()}
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 font-bold"
            >
              <option value="" disabled>
                Selecione uma criança
              </option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.nome}
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>
    </section>
  );
}

