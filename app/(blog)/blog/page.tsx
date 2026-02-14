import { Suspense } from "react";
import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { getAllBlogPosts, getBlogCategories } from "@/lib/mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Brincar Educando",
  description:
    "Artigos sobre desenvolvimento infantil, parentalidade positiva, brincar educativo e ciência do comportamento para pais e educadores.",
  openGraph: {
    title: "Blog | Brincar Educando",
    description:
      "Artigos sobre desenvolvimento infantil, parentalidade positiva, brincar educativo e ciência do comportamento.",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { categoria } = await searchParams;
  const allPosts = getAllBlogPosts();
  const categories = getBlogCategories();

  const filtered = categoria
    ? allPosts.filter(
        (p) => p.metadata.category.toLowerCase() === categoria.toLowerCase()
      )
    : allPosts;

  const featured = allPosts.slice(0, 3);

  return (
    <>
      <PublicNav />
      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">
        {/* Page header */}
        <div className="bg-[var(--color-muted)] border-b border-[var(--color-border)]">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
              Brincar Educando
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl font-black leading-tight text-[var(--color-foreground)] mb-4">
              Blog
            </h1>
            <p className="text-[var(--color-muted-foreground)] max-w-lg">
              Dicas, ciência e histórias sobre desenvolvimento infantil,
              parentalidade positiva e o poder do brincar.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {/* Desktop: sidebar + grid. Mobile: chips + feed */}
          <div className="flex gap-10">
            {/* ── Sidebar (desktop) ─────────────────────────── */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-[132px] space-y-8">
                {/* Category list */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">
                    Categorias
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <Suspense>
                      <CategoryFilterSidebar
                        categories={categories}
                        currentCategory={categoria}
                      />
                    </Suspense>
                  </div>
                </div>

                {/* Featured posts */}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[var(--color-muted-foreground)] mb-4">
                    Mais lidos
                  </p>
                  <div className="space-y-3">
                    {featured.map((post) => (
                      <ArticleCard
                        key={post.slug}
                        post={post}
                        variant="horizontal"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Main feed ─────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              {/* Mobile category chips */}
              <div className="lg:hidden mb-6">
                <Suspense>
                  <CategoryFilter
                    categories={categories}
                    currentCategory={categoria}
                  />
                </Suspense>
              </div>

              {/* Count + heading */}
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                  {categoria ? categoria : "Todos os artigos"}
                </h2>
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  {filtered.length} artigo{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Article grid: 1-col mobile → 2-col md → 3-col xl */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((post) => (
                    <ArticleCard key={post.slug} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-[var(--color-muted-foreground)]">
                  <p className="text-lg font-semibold mb-2">
                    Nenhum artigo encontrado
                  </p>
                  <p className="text-sm">
                    Tente outra categoria ou{" "}
                    <Link
                      href="/blog"
                      className="text-[var(--color-primary)] font-semibold hover:underline"
                    >
                      veja todos
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Sidebar version of the category filter (server-rendered links)
function CategoryFilterSidebar({
  categories,
  currentCategory,
}: {
  categories: string[];
  currentCategory?: string;
}) {
  const items = [{ label: "Todos", value: "" }, ...categories.map((c) => ({ label: c, value: c }))];

  return (
    <>
      {items.map(({ label, value }) => {
        const isActive = value
          ? currentCategory === value
          : !currentCategory;
        return (
          <a
            key={label}
            href={value ? `/blog?categoria=${encodeURIComponent(value)}` : "/blog"}
            className={
              isActive
                ? "flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                : "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            }
          >
            {label}
          </a>
        );
      })}
    </>
  );
}
