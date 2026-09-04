"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Star } from "lucide-react";
import { setActiveChild } from "@/app/(dashboard)/actions";
import { useActiveChild } from "@/components/dashboard/ActiveChildProvider";
import { ChildAgeCard } from "@/components/dashboard/ChildAgeCard";
import { repairMojibake } from "@/lib/text/repair-mojibake";
import { calculateAge } from "@/lib/utils";

export function ChildSwitcher() {
  const formRef = useRef<HTMLFormElement>(null);
  const { activeChild, children } = useActiveChild();

  if (!activeChild) {
    return (
      <Link href="/onboarding" className="dashboard-shell-child-card">
        <span className="dashboard-shell-child-avatar"><Plus aria-hidden="true" /></span>
        <span className="min-w-0 flex-1">
          <strong className="block text-sm">Criar perfil</strong>
          <small className="block text-[11px] text-[var(--color-muted-foreground)]">Conhecer a criança</small>
        </span>
        <ChevronRight className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
      </Link>
    );
  }

  const childName = repairMojibake(activeChild.nome);

  if (children.length < 2) {
    return (
      <Link
        href="/perfil"
        className="dashboard-shell-child-card"
        aria-label={`Abrir o perfil de ${childName}`}
      >
        <span className="dashboard-shell-child-avatar"><Star fill="currentColor" aria-hidden="true" /></span>
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-sm">{childName}</strong>
          <small className="block text-[11px] text-[var(--color-muted-foreground)]">
            {calculateAge(activeChild.data_nascimento)}
          </small>
        </span>
        <ChevronRight className="h-4 w-4 text-[var(--color-primary)]" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <form ref={formRef} action={setActiveChild} className="dashboard-shell-child-card">
      <span className="dashboard-shell-child-avatar"><Star fill="currentColor" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">
        <label htmlFor="active-child" className="sr-only">Trocar criança ativa</label>
        <select
          id="active-child"
          name="childId"
          value={activeChild.id}
          onChange={() => formRef.current?.requestSubmit()}
          className="w-full bg-transparent text-sm font-bold text-[var(--color-foreground)] outline-none"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>{repairMojibake(child.nome)}</option>
          ))}
        </select>
        <small className="block text-[11px] text-[var(--color-muted-foreground)]">
          {calculateAge(activeChild.data_nascimento)}
        </small>
      </span>
    </form>
  );
}

export function HeaderChildSwitcher({ ageText }: { ageText: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { activeChild, children } = useActiveChild();

  if (!activeChild) return null;

  const childCard = (
    <ChildAgeCard
      nome={activeChild.nome}
      idadeTexto={ageText}
      avatarId={activeChild.avatar_id ?? undefined}
      corFavorita={activeChild.cor_favorita ?? undefined}
    />
  );

  if (children.length < 2) {
    return (
      <Link href="/perfil" aria-label={`Abrir o perfil de ${repairMojibake(activeChild.nome)}`} className="dashboard-child-link">
        {childCard}
      </Link>
    );
  }

  return (
    <form ref={formRef} action={setActiveChild} className="flex flex-wrap items-center gap-2">
      {childCard}
      <div className="relative">
        <label htmlFor="header-active-child" className="sr-only">Trocar criança ativa</label>
        <select
          id="header-active-child"
          name="childId"
          value={activeChild.id}
          onChange={() => formRef.current?.requestSubmit()}
          className="dashboard-child-select"
        >
          {children.map((child) => (
            <option key={child.id} value={child.id}>{repairMojibake(child.nome)}</option>
          ))}
        </select>
      </div>
    </form>
  );
}
