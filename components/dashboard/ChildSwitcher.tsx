"use client";

import { useRef } from "react";
import { setActiveChild } from "@/app/(dashboard)/actions";
import { useActiveChild } from "@/components/dashboard/ActiveChildProvider";
import { ChildAgeCard } from "@/components/dashboard/ChildAgeCard";

export function ChildSwitcher() {
  const formRef = useRef<HTMLFormElement>(null);
  const { activeChild, children } = useActiveChild();

  if (children.length < 2) return null;

  return (
    <form ref={formRef} action={setActiveChild} className="px-4 pb-3">
      <label
        htmlFor="active-child"
        className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-[var(--color-muted-foreground)]"
      >
        Jornada de
      </label>
      <select
        id="active-child"
        name="childId"
        defaultValue={activeChild?.id ?? ""}
        onChange={() => formRef.current?.requestSubmit()}
        className="h-10 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm font-bold text-[var(--color-foreground)]"
      >
        {!activeChild && <option value="">Escolha uma criança</option>}
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.nome}
          </option>
        ))}
      </select>
    </form>
  );
}

export function HeaderChildSwitcher({ ageText }: { ageText: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { activeChild, children } = useActiveChild();

  if (!activeChild) return null;

  return (
    <form ref={formRef} action={setActiveChild} className="flex flex-wrap items-center gap-2">
      <ChildAgeCard
        nome={activeChild.nome}
        idadeTexto={ageText}
        avatarId={activeChild.avatar_id ?? undefined}
        corFavorita={activeChild.cor_favorita ?? undefined}
      />
      {children.length > 1 && (
        <div className="relative">
          <label htmlFor="header-active-child" className="sr-only">Trocar criança ativa</label>
          <select
            id="header-active-child"
            name="childId"
            value={activeChild.id}
            onChange={() => formRef.current?.requestSubmit()}
            className="min-h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm font-bold text-[var(--color-foreground)]"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>{child.nome}</option>
            ))}
          </select>
        </div>
      )}
    </form>
  );
}
