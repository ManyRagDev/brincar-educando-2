"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useActiveChild } from "@/components/dashboard/ActiveChildProvider";
import { setActiveChild } from "@/app/(dashboard)/actions";
import { repairMojibake } from "@/lib/text/repair-mojibake";

export function DashboardMobileHeader() {
  const { activeChild, children } = useActiveChild();
  const formRef = useRef<HTMLFormElement>(null);
  const pathname = usePathname();

  // Em rotas de sessão ativa, não poluir o topo
  if (pathname.startsWith("/atividade-ativa")) {
    return null;
  }

  return (
    <header className="lg:hidden sticky top-0 z-30 bg-[var(--color-background)]/90 backdrop-blur-md border-b border-[var(--color-border)] transition-colors">
      <div className="pt-safe">
        <div className="flex h-14 items-center justify-between px-4 gap-2">
          {/* Logo oficial padronizado */}
          <Link href="/dashboard" className="flex items-center shrink-0" aria-label="Ir para início do Painel">
            <Image
              src="/logotipo.png"
              alt="Brincar Educando"
              width={260}
              height={80}
              priority
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </Link>

          {/* Área direita: Seletor de Criança e Tema */}
          <div className="flex items-center gap-2 min-w-0">
            {activeChild && (
              <div className="flex items-center min-w-0">
                {children.length > 1 ? (
                  <form ref={formRef} action={setActiveChild} className="relative">
                    <label htmlFor="mobile-header-active-child" className="sr-only">Trocar criança ativa</label>
                    <select
                      id="mobile-header-active-child"
                      name="childId"
                      value={activeChild.id}
                      onChange={() => formRef.current?.requestSubmit()}
                      className="h-8 max-w-[140px] truncate rounded-full border border-[var(--color-border)] bg-[var(--color-card)] pl-2.5 pr-6 text-xs font-black text-[var(--color-foreground)] shadow-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    >
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {repairMojibake(child.nome)}
                        </option>
                      ))}
                    </select>
                  </form>
                ) : (
                  <Link
                    href="/perfil"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-muted)] text-xs font-bold text-[var(--color-foreground)] truncate max-w-[130px]"
                    title={`Perfil de ${activeChild.nome}`}
                  >
                    <span className="size-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                    <span className="truncate">{repairMojibake(activeChild.nome)}</span>
                  </Link>
                )}
              </div>
            )}

            <ThemeToggle showLabel={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
