"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, BookOpen, Home, ShoppingBag, Info } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard } from "lucide-react";

const navLinks = [
  { href: "/", label: "Início", icon: Home },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/loja", label: "Loja", icon: ShoppingBag, badge: "Em breve" },
  { href: "/sobre", label: "Sobre", icon: Info },
];

interface PublicNavProps {
  transparent?: boolean;
  user?: User | null;
}

export function PublicNav({ transparent = false, user }: PublicNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-[var(--color-background)]/90 backdrop-blur-lg border-b border-[var(--color-border)]"
      )}
    >
      <div className="container mx-auto flex h-[120px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logotipo.png"
            alt="Brincar Educando"
            width={420}
            height={144}
            className="h-[108px] w-auto object-contain group-hover:scale-105 transition-transform"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-[var(--color-muted)] flex items-center gap-2",
                pathname === link.href
                  ? "text-[var(--color-primary)] bg-[var(--color-muted)]"
                  : "text-[var(--color-foreground)]"
              )}
            >
              {link.label}
              {link.badge && (
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 leading-none">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle showLabel={false} />

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Button variant="default" size="sm" className="btn-primary-theme font-bold shadow-md" asChild>
                  <Link href="/dashboard" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Meu Painel</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-red-500"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth">Entrar</Link>
                </Button>
                <Button size="sm" className="btn-primary-theme" asChild>
                  <Link href="/auth?mode=signup">Começar grátis</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                aria-label="Abrir menu"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-[var(--color-background)] border-[var(--color-border)]"
            >
              <div className="flex flex-col gap-2 pt-6">
                <Link href="/" className="mb-6 block">
                  <Image
                    src="/logotipo.png"
                    alt="Brincar Educando"
                    width={360}
                    height={120}
                    className="h-24 w-auto object-contain"
                  />
                </Link>

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
                      pathname === link.href
                        ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                        : "hover:bg-[var(--color-muted)] text-[var(--color-foreground)]"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                    {link.badge && (
                      <span className="ml-auto text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 leading-none">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}

                <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="px-2 py-2 text-xs text-muted-foreground font-medium flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Conectado como {user.email}
                      </div>
                      <Button variant="default" className="w-full justify-start btn-primary-theme font-bold" asChild>
                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Acessar Meu Painel</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          handleSignOut();
                          setMobileOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair da conta
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/auth" onClick={() => setMobileOpen(false)}>
                          Entrar
                        </Link>
                      </Button>
                      <Button asChild className="w-full btn-primary-theme">
                        <Link
                          href="/auth?mode=signup"
                          onClick={() => setMobileOpen(false)}
                        >
                          Começar grátis
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
