"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function MobileTableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Extract headings from DOM after render
  useEffect(() => {
    const article = document.querySelector("article.prose");
    if (!article) return;

    const elements = article.querySelectorAll<HTMLHeadingElement>("h2, h3");
    const items: TocItem[] = [];

    elements.forEach((el) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 60) ?? `heading-${items.length}`;
      }
      items.push({
        id: el.id,
        text: el.textContent ?? "",
        level: parseInt(el.tagName.charAt(1)),
      });
    });

    setHeadings(items);
  }, []);

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  if (headings.length < 2) return null;

  return (
    <div className="xl:hidden mb-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-card)] border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
          >
            <List className="h-4 w-4" />
            <span>Ver índice do artigo</span>
            <span className="ml-2 text-xs text-[var(--color-muted-foreground)] bg-[var(--color-muted)] px-2 py-0.5 rounded-full">
              {headings.length}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh] bg-[var(--color-background)] border-t border-[var(--color-border)]">
          <SheetTitle className="sr-only">Índice do artigo</SheetTitle>
          <div className="flex items-center justify-between mb-4">
            <p className="font-black uppercase tracking-widest text-[10px] text-[var(--color-muted-foreground)]">
              Neste artigo
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="overflow-y-auto h-[calc(70vh-80px)]">
            <ul className="space-y-1">
              {headings.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => handleClick(h.id)}
                    className={cn(
                      "w-full text-left py-2 px-3 rounded-lg transition-colors duration-150 leading-snug",
                      h.level === 3 ? "pl-6 text-sm" : "text-base font-medium",
                      activeId === h.id
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold"
                        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                    )}
                  >
                    {h.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
