"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

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

  if (headings.length < 2) return null;

  return (
    <nav
      className={cn(
        "text-sm",
        className
      )}
      aria-label="Índice do artigo"
    >
      <p className="font-black uppercase tracking-widest text-[10px] text-[var(--color-muted-foreground)] mb-3">
        Neste artigo
      </p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block py-1 transition-colors duration-150 leading-snug",
                h.level === 3 ? "pl-4 text-xs" : "text-sm font-medium",
                activeId === h.id
                  ? "text-[var(--color-primary)] font-bold border-l-2 border-[var(--color-primary)] pl-3"
                  : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
