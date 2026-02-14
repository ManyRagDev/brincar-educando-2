import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface BlogMetadata {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
  thumbnail: string;
  tags?: string[];
  noindex?: boolean;
  landing?: boolean;
  hideBack?: boolean;
  hideMeta?: boolean;
  hideShare?: boolean;
}

export interface BlogPost {
  metadata: BlogMetadata;
  content: string;
  slug: string;
}

export function getAllBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      return getBlogPost(slug);
    })
    .filter((post): post is BlogPost => post !== null);

  return posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() -
      new Date(a.metadata.date).getTime()
  );
}

export function getBlogPost(slug: string): BlogPost | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);

  let filePath: string;
  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: {
      title: data.title ?? "",
      slug: data.slug ?? slug,
      date: data.date ? String(data.date) : new Date().toISOString(),
      excerpt: data.excerpt ?? "",
      category: data.category ?? "Geral",
      readTime: data.readTime ?? "5 min",
      thumbnail: data.thumbnail ?? "/images/placeholder.png",
      tags: data.tags ?? [],
      noindex: data.noindex ?? false,
      landing: data.landing ?? false,
      hideBack: data.hideBack ?? false,
      hideMeta: data.hideMeta ?? false,
      hideShare: data.hideShare ?? false,
    },
    content,
  };
}

export function getBlogSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.mdx?$/, ""));
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getAllBlogPosts().filter(
    (post) =>
      post.metadata.category.toLowerCase() === category.toLowerCase()
  );
}

export function getBlogCategories(): string[] {
  const posts = getAllBlogPosts();
  const categories = new Set(posts.map((p) => p.metadata.category));
  return Array.from(categories).sort();
}
