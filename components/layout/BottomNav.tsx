"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { isNavigationItemActive, mobileMoreItem, mobileMoreNavigation, primaryDashboardNavigation } from "@/lib/navigation";

const tabs = [...primaryDashboardNavigation, mobileMoreItem];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-card)]/95 backdrop-blur-xl border-t border-[var(--color-border)]">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/mais"
            ? pathname === "/mais" || mobileMoreNavigation.some((item) => isNavigationItemActive(pathname, item.href))
            : isNavigationItemActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-0",
                isActive
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-muted-foreground)]"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
