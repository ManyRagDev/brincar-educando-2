import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { BlogPost } from "@/lib/mdx";

export function ContextualReadingCard({ post }: { post: BlogPost | null }) {
  if (!post) {
    return (
      <section className="dashboard-secondary-card flex min-h-52 flex-col justify-center p-6" aria-labelledby="reading-title">
        <p className="dashboard-eyebrow text-[#a16b19]">Uma leitura para esta fase</p>
        <h2 id="reading-title" className="mt-2 text-xl font-black text-[var(--color-foreground)]">Leituras cuidadosas, quando fizer sentido.</h2>
        <Link href="/blog" className="mt-4 inline-flex min-h-10 w-fit items-center gap-1 text-sm font-black text-[var(--color-primary)] underline-offset-4 hover:underline">Ver todas as leituras <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </section>
    );
  }

  return (
    <section className="dashboard-secondary-card dashboard-reading-card" aria-labelledby="reading-title">
      <div className="relative min-h-36 overflow-hidden rounded-2xl sm:min-h-40 sm:w-[42%]">
        <Image src={post.metadata.thumbnail} alt="" fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
        <p className="dashboard-eyebrow text-[#a16b19]">Uma leitura para esta fase</p>
        <h2 id="reading-title" className="mt-2 line-clamp-3 text-xl font-black leading-tight text-[var(--color-foreground)]">{post.metadata.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted-foreground)]">{post.metadata.excerpt}</p>
        <div className="mt-3 flex items-center gap-3 text-xs font-bold text-[var(--color-muted-foreground)]"><Clock3 className="size-4" aria-hidden="true" /> {post.metadata.readTime}</div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Link href={`/blog/${post.slug}`} className="inline-flex min-h-10 items-center gap-1 text-sm font-black text-[var(--color-primary)] underline-offset-4 hover:underline">Ler artigo <ArrowRight className="size-4" aria-hidden="true" /></Link>
          <Link href="/blog" className="text-xs font-bold text-[var(--color-muted-foreground)] underline-offset-4 hover:text-[var(--color-foreground)] hover:underline">Ver todas as leituras</Link>
        </div>
      </div>
    </section>
  );
}
