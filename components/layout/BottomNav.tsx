"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  isNavigationItemActive,
  mobileMoreItem,
  mobileMoreNavigation,
  primaryDashboardNavigation,
} from "@/lib/navigation";

const tabs = [...primaryDashboardNavigation, mobileMoreItem];

export function BottomNav() {
  const pathname = usePathname();

  // Em rotas de sessão ativa de brincadeira, focar 100% na experiência imersiva
  if (pathname?.startsWith("/atividade-ativa")) {
    return null;
  }

  return (
    <nav
      aria-label="Navegação principal móvel"
      className="lg:hidden fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-1/2 -translate-x-1/2 w-[calc(100%-1.25rem)] max-w-[420px] z-[9999] transition-all duration-300"
    >
      <div className="relative flex items-center justify-between gap-1 p-1.5 rounded-2xl sm:rounded-3xl bg-[var(--card)]/98 backdrop-blur-2xl border border-[var(--border)] shadow-[0_14px_40px_rgba(0,0,0,0.14)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.55)] transition-all duration-300">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/mais"
              ? pathname === "/mais" ||
                mobileMoreNavigation.some((item) => isNavigationItemActive(pathname, item.href))
              : isNavigationItemActive(pathname, href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex flex-1 flex-col items-center justify-center min-h-[50px] py-1 px-1 rounded-xl sm:rounded-2xl transition-all duration-150 select-none active:scale-95",
                !isActive && "hover:bg-[var(--muted)]/50"
              )}
            >
              {/* Pílula de seleção que desliza suavemente de uma aba para outra */}
              {isActive && (
                <motion.div
                  layoutId="dock-active-pill"
                  className="absolute inset-0 rounded-xl sm:rounded-2xl bg-[var(--primary)] shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                    mass: 0.8,
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Ícone e Texto sobrepostos */}
              <span
                className={cn(
                  "relative z-10 flex flex-col items-center justify-center transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-200",
                    isActive ? "scale-110 stroke-[2.5]" : "stroke-[2]"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "mt-0.5 text-[10px] uppercase tracking-wider truncate max-w-full leading-none transition-all duration-200",
                    isActive ? "font-black" : "font-bold"
                  )}
                >
                  {label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
