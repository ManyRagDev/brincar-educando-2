"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  currentCategory?: string;
}

export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSelect(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("categoria", category);
    } else {
      params.delete("categoria");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const allItems = ["Tudo", ...categories];

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {allItems.map((cat) => {
        const value = cat === "Tudo" ? null : cat;
        const isActive = cat === "Tudo" ? !currentCategory : currentCategory === cat;

        return (
          <button
            key={cat}
            onClick={() => handleSelect(value)}
            className={cn(
              "flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 whitespace-nowrap",
              isActive
                ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-md"
                : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-border)]"
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
