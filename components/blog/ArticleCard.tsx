import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/mdx";
import { formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  post: BlogPost;
  variant?: "default" | "horizontal" | "featured";
  className?: string;
}

const categoryColors: Record<string, string> = {
  Desenvolvimento: "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]",
  Brincar: "bg-emerald-100 text-emerald-800",
  Comportamento: "bg-purple-100 text-purple-800",
  Ciência: "bg-blue-100 text-blue-800",
  Saúde: "bg-rose-100 text-rose-800",
  Alimentação: "bg-orange-100 text-orange-800",
  Sono: "bg-indigo-100 text-indigo-800",
  Maternidade: "bg-pink-100 text-pink-800",
};

export function ArticleCard({ post, variant = "default", className }: ArticleCardProps) {
  const categoryClass =
    categoryColors[post.metadata.category] ??
    "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]";

  if (variant === "horizontal") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "card-theme group flex gap-4 p-4 overflow-hidden hover:no-underline",
          className
        )}
      >
        {/* Thumbnail */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-muted)]">
          <Image
            src={post.metadata.thumbnail}
            alt={post.metadata.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center min-w-0">
          <span className={cn("text-[10px] font-black uppercase tracking-wider mb-1 px-2 py-0.5 rounded-full inline-block w-fit", categoryClass)}>
            {post.metadata.category}
          </span>
          <h3 className="font-bold text-sm leading-snug mb-1 text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
            {post.metadata.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-[var(--color-muted-foreground)] font-medium">
            <Clock className="h-3 w-3" />
            {post.metadata.readTime}
            <span>·</span>
            <time dateTime={post.metadata.date}>{formatDateShort(post.metadata.date)}</time>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group relative flex-shrink-0 w-80 h-56 rounded-xl overflow-hidden shadow-xl block hover:no-underline",
          className
        )}
      >
        <Image
          src={post.metadata.thumbnail}
          alt={post.metadata.title}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-5 w-full">
          <span className={cn("text-[10px] font-black uppercase px-2 py-1 rounded-full mb-2 inline-block", categoryClass)}>
            {post.metadata.category}
          </span>
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
            {post.metadata.title}
          </h3>
        </div>
      </Link>
    );
  }

  // Default card (vertical)
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "card-theme group block overflow-hidden hover:no-underline",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[var(--color-muted)]">
        <Image
          src={post.metadata.thumbnail}
          alt={post.metadata.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className={cn(
          "absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
          categoryClass
        )}>
          {post.metadata.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-base leading-snug mb-2 text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {post.metadata.title}
        </h3>
        <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mb-4">
          {post.metadata.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)] font-medium">
            <Clock className="h-3 w-3" />
            {post.metadata.readTime}
          </div>
          <span className="flex items-center gap-1 text-[var(--color-primary)] font-bold text-xs group-hover:gap-2 transition-all">
            Ler <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
