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
    <aside className="dashboard-shell-sidebar fixed inset-y-[18px] left-[18px] z-40 hidden w-[244px] flex-col overflow-hidden rounded-[34px] border border-white/60 bg-[var(--sidebar)] lg:flex">
      {/* Logo */}
      <div className="flex min-h-[92px] items-center justify-center border-b border-[var(--color-border)] px-5 py-3">
        <Link href="/" className="group">
          <Image
            src="/logotipo.png"
            alt="Brincar Educando"
            width={390}
            height={132}
            className="h-auto w-[176px] object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>
      </div>

      <ChildSwitcher />

      {/* Nav */}
      <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-3" aria-label="Navegação principal">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, badge, description }) => {
                const isActive = isNavigationItemActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    title={description}
                    className={cn(
                      "group flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-all",
                      isActive
                        ? "dashboard-shell-nav-active bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                        : "text-[var(--color-foreground)] hover:bg-[var(--color-muted)]",
                    )}
                  >
                    <span className={cn("dashboard-shell-nav-icon", isActive && "is-active")}>
                      <Icon className="h-4 w-4 flex-shrink-0" />
                    </span>
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
      <div className="space-y-1.5 border-t border-[var(--color-border)] px-3 py-3">
        <div>
          <ThemeToggle showLabel={true} />
        </div>
        <button
          onClick={handleSignOut}
          className="flex min-h-9 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--color-muted-foreground)] transition-all hover:bg-[var(--color-muted)] hover:text-[var(--color-destructive)]"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
