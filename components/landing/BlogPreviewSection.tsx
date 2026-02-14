import Link from "next/link";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { getAllBlogPosts } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";

export async function BlogPreviewSection() {
  const allPosts = getAllBlogPosts();
  const posts = allPosts.slice(0, 3);

  return (
    <section className="py-20 px-4 bg-[var(--color-muted)]">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-secondary)] mb-2">
              Nosso Blog
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-black leading-tight text-[var(--color-foreground)]">
              Dicas e Descobertas
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-[var(--color-primary)] font-bold text-sm hover:gap-2 transition-all"
          >
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Cards grid: 1-col mobile, 2-col sm, 3-col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-theme group block overflow-hidden hover:no-underline"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-[var(--color-muted)] rounded-t-[var(--radius-lg)]">
                <img
                  src={post.metadata.thumbnail}
                  alt={post.metadata.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Category badge */}
                <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]">
                  {post.metadata.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg leading-tight mb-2 text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                  {post.metadata.title}
                </h3>
                <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mb-4">
                  {post.metadata.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)] font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.metadata.readTime}
                  </span>
                  <time dateTime={post.metadata.date}>
                    {formatDateShort(post.metadata.date)}
                  </time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
