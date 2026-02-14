"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, BookOpen, BookMarked, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/atividades", label: "Atividades", icon: Dumbbell },
  { href: "/diario", label: "Diário", icon: BookMarked },
  { href: "/historias", label: "Histórias", icon: BookOpen, badge: true },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-card)]/95 backdrop-blur-xl border-t border-[var(--color-border)]">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-0",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)]"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                {badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-2 ring-[var(--color-card)]" />
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
