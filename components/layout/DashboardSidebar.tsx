"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  BookMarked,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/atividades", label: "Atividades", icon: Dumbbell },
  { href: "/diario", label: "Diário", icon: BookMarked },
  { href: "/historias", label: "Histórias", icon: BookOpen, badge: "em breve" },
  { href: "/perfil", label: "Meu Perfil", icon: User },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-40 bg-[var(--color-card)] border-r border-[var(--color-border)]">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-[var(--color-border)]">
        <Link href="/" className="group">
          <Image
            src="/logotipo.png"
            alt="Brincar Educando"
            width={390}
            height={132}
            className="h-[108px] w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all group",
                isActive
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                  : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span
                  className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  )}
                >
                  {badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: theme + signout */}
      <div className="px-3 py-4 border-t border-[var(--color-border)] space-y-2">
        <div className="px-4 py-2">
          <ThemeToggle showLabel={true} />
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-semibold text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-destructive)] transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
