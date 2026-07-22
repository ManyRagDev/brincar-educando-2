"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChildSwitcher } from "@/components/dashboard/ChildSwitcher";
import { accountNavigation, discoveryNavigation, isNavigationItemActive, primaryDashboardNavigation } from "@/lib/navigation";

const navGroups = [
  { label: "Para agora", items: primaryDashboardNavigation },
  { label: "Descobrir", items: discoveryNavigation },
  { label: "Sua conta", items: accountNavigation },
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

      <ChildSwitcher />

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Navegação principal">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-4 pb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">{group.label}</p>
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon, badge, description }) => {
                const isActive = isNavigationItemActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={description}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                        : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest", isActive ? "bg-white/20 text-white" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]")}>
                        {badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-3 w-3 opacity-70" aria-hidden="true" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
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
