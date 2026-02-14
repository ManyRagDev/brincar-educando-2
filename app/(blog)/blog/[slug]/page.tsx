import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, List } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlogPost, getBlogSlugs, getAllBlogPosts } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { FloatingMobileToC } from "@/components/blog/FloatingMobileToC";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { ShareButton } from "@/components/blog/ShareButton";
import { Image as MdxImage } from "@/components/ui/image";
import { Info, Tip, Warning, Callout, Checklist } from "@/components/ui/blocks";
import ProductEmbed from "@/components/ProductEmbed";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Static params for all 34 posts
export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

// Dynamic OG metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Artigo não encontrado" };

  const { title, excerpt, thumbnail, category } = post.metadata;
  const url = `https://brincareducando.com.br/blog/${slug}`;

  return {
    title: `${title} | Brincar Educando`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      url,
      type: "article",
      images: [{ url: thumbnail, width: 1200, height: 630, alt: title }],
      siteName: "Brincar Educando",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: [thumbnail],
    },
    alternates: { canonical: url },
    keywords: [category, "desenvolvimento infantil", "parentalidade", "brincar educativo"],
  };
}

// MDX components passed to the renderer
const components = {
  Image: MdxImage,
  Info,
  Tip,
  Warning,
  Callout,
  Checklist,
  ProductEmbed,
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { title, excerpt, thumbnail, category, readTime, date } = post.metadata;

  // Related posts (same category, exclude current)
  const related = getAllBlogPosts()
    .filter((p) => p.slug !== slug && p.metadata.category === category)
    .slice(0, 3);

  return (
    <>
      <PublicNav />
      <ReadingProgress />

      <main className="min-h-screen bg-[var(--color-background)] pt-[120px]">
        {/* Hero image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-black/20" />
        </div>

        <div className="container mx-auto px-4">
          {/* Back link */}
          <div className="py-4 max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar ao blog
            </Link>
          </div>

          {/* Main layout: centered content with ToC */}
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 pb-20 max-w-6xl mx-auto">
            {/* ── Article column ────────────────────────── */}
            <div className="flex-1 min-w-0 max-w-3xl mx-auto xl:mx-0">
              {/* Category + meta */}
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] text-[10px] font-black uppercase tracking-wider">
                  {category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
                  <Clock className="h-3 w-3" /> {readTime}
                </span>
                <time
                  dateTime={date}
                  className="flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]"
                >
                  <Calendar className="h-3 w-3" />
                  {formatDate(date)}
                </time>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-black leading-tight text-[var(--color-foreground)] mb-4">
                {title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed mb-8 border-l-4 border-[var(--color-primary)] pl-4">
                {excerpt}
              </p>

              {/* MDX content */}
              <article className="prose prose-stone max-w-none
                prose-headings:font-serif prose-headings:text-[var(--color-foreground)]
                prose-p:text-[var(--color-foreground)] prose-p:leading-relaxed
                prose-a:text-[var(--color-primary)] prose-a:font-semibold
                prose-strong:text-[var(--color-foreground)]
                prose-blockquote:border-[var(--color-primary)] prose-blockquote:bg-[var(--color-muted)] prose-blockquote:rounded-r-xl prose-blockquote:py-2
                prose-img:rounded-xl prose-img:shadow-lg
                prose-li:text-[var(--color-foreground)]">
                <MDXRemote source={post.content} components={components} />
              </article>

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--color-muted-foreground)]">
                  Gostou? Compartilhe!
                </p>
                <ShareButton title={title} />
              </div>

              {/* Floating ToC for Mobile */}
              <FloatingMobileToC />
            </div>

            {/* ── ToC sidebar (desktop only) ────────────── */}
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-[132px]">
                <TableOfContents />
              </div>
            </aside>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="pb-20 border-t border-[var(--color-border)] pt-12 max-w-6xl mx-auto">
              <h2 className="font-serif text-2xl font-black text-[var(--color-foreground)] mb-6">
                Artigos relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <ArticleCard key={p.slug} post={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
