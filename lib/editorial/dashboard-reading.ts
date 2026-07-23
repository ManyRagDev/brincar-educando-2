import type { BlogPost } from "@/lib/mdx";
import type { MomentContext } from "@/lib/journey/recommendation-engine";

const contextKeywords: Partial<Record<MomentContext, string[]>> = {
  calm: ["sono", "calma", "rotina", "acolh"],
  move: ["brincar", "movimento", "energia", "natureza"],
  outside: ["natureza", "fora", "brincar"],
  no_materials: ["brincar", "rotina", "birra", "comportamento"],
  tired_adult: ["rotina", "sono", "acolh", "birra"],
  quick: ["brincar", "rotina", "birra"],
};

function searchable(post: BlogPost) {
  return `${post.slug} ${post.metadata.title} ${post.metadata.category} ${post.metadata.tags?.join(" ") ?? ""}`.toLocaleLowerCase();
}

export function getContextualDashboardPost(posts: BlogPost[], options: { childAgeMonths: number | null; momentContext: MomentContext | null }) {
  const valid = posts.filter((post) => !post.metadata.noindex && post.metadata.thumbnail);
  if (!valid.length) return null;

  const ageTerms = options.childAgeMonths !== null && options.childAgeMonths < 24
    ? ["bebe", "bebê", "primeira infância", "desenvolvimento"]
    : ["crian", "birra", "desenvolvimento", "brincar"];
  const contextTerms = options.momentContext ? contextKeywords[options.momentContext] ?? [] : [];

  const ranked = valid.map((post, index) => {
    const text = searchable(post);
    const ageScore = ageTerms.reduce((score, term) => score + (text.includes(term) ? 2 : 0), 0);
    const contextScore = contextTerms.reduce((score, term) => score + (text.includes(term) ? 1 : 0), 0);
    return { post, score: ageScore + contextScore, index };
  });

  ranked.sort((left, right) => right.score - left.score || left.index - right.index);
  return ranked[0]?.post ?? valid[0];
}
