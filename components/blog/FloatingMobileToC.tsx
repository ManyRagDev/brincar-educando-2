"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { X, List, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function FloatingMobileToC() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [currentSection, setCurrentSection] = useState("Índice");

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

  // Track active heading and show/hide button
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const article = document.querySelector("article.prose");
      
      if (article) {
        const rect = article.getBoundingClientRect();
        // Mostrar botão quando estiver dentro do artigo
        setShowButton(rect.top < 100 && rect.bottom > 200);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveId(id);
          // Atualiza o texto do botão com a seção atual
          const heading = headings.find(h => h.id === id);
          if (heading) {
            setCurrentSection(heading.text.slice(0, 25) + (heading.text.length > 25 ? "..." : ""));
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  const handleClick = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const scrollToTop = () => {
    if (headings.length > 0) {
      document.getElementById(headings[0].id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (headings.length < 2) return null;

  return (
    <>
      {/* Floating Button */}
      <div
        className={cn(
          "xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 transition-all duration-300",
          showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="flex items-center gap-2 pl-4 pr-2 py-2.5 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              aria-label="Abrir índice do artigo"
            >
              <span className="text-sm font-semibold max-w-[150px] truncate">
                {currentSection}
              </span>
              <span className="flex items-center justify-center w-7 h-7 bg-white/20 rounded-full">
                <List className="h-4 w-4" />
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] bg-[var(--color-background)] border-t border-[var(--color-border)] rounded-t-2xl">
            <SheetTitle className="sr-only">Índice do artigo</SheetTitle>
            <div className="flex items-center justify-between mb-4">
              <p className="font-black uppercase tracking-widest text-[10px] text-[var(--color-muted-foreground)]">
                Neste artigo ({headings.length} seções)
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
                {headings.map((h, index) => (
                  <li key={h.id}>
                    <button
                      onClick={() => handleClick(h.id)}
                      className={cn(
                        "w-full text-left py-3 px-4 rounded-xl transition-colors duration-150 flex items-center gap-3",
                        h.level === 3 ? "pl-8 text-sm" : "text-base font-medium",
                        activeId === h.id
                          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-bold"
                          : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                      )}
                    >
                      <span className={cn(
                        "w-6 h-6 rounded-full text-xs flex items-center justify-center flex-shrink-0",
                        activeId === h.id
                          ? "bg-white/20 text-white"
                          : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                      )}>
                        {index + 1}
                      </span>
                      <span className="line-clamp-2">{h.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 flex items-center justify-center bg-[var(--color-card)] text-[var(--color-foreground)] rounded-full shadow-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-all"
          aria-label="Voltar ao topo"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      {/* Spacer para não cobrir conteúdo no final */}
      <div className="xl:hidden h-20" />
    </>
  );
}
