import { getAllPosts } from "@/lib/mdx-utils";

interface RelatedArticlesProps {
  currentTags?: string[];
  currentSlug: string;
  currentCategory?: string;
}

export async function RelatedArticles({
  currentTags = [],
  currentSlug,
  currentCategory,
}: RelatedArticlesProps) {
  const allPosts = getAllPosts();

  const normalizedCurrentTags = currentTags.map((t) => t.toLowerCase().replace("#", ""));

  const related = allPosts
    .filter((post) => {
      if (post.slug === currentSlug) return false;

      const postTags = (post.frontmatter.tags || []).map((t: string) =>
        t.toLowerCase().replace("#", ""),
      );
      const sharedTags =
        normalizedCurrentTags.length > 0 &&
        postTags.some((tag) => normalizedCurrentTags.includes(tag));

      const sameCategory =
        currentCategory && (post.frontmatter.category || "").toLowerCase() === currentCategory;

      return sharedTags || sameCategory;
    })
    .slice(0, 4);

  if (related.length === 0) {
    return (
      <section className="mt-12 border-t border-divider/20 pt-6">
        <h2 className="font-display font-bold text-xl tracking-tight text-foreground mb-4">
          Artículos relacionados
        </h2>
        <p className="text-xs text-caption">Próximamente más análisis relacionados.</p>
      </section>
    );
  }

  return (
    <RelatedArticlesList articles={related} title="Artículos relacionados" />
  );
}

function RelatedArticlesList({ articles, title }: { articles: any[]; title: string }) {
  return (
    <section className="mt-12 border-t border-divider/20 pt-6">
      <h2 className="font-display font-bold text-xl tracking-tight text-foreground mb-5">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className="group block border border-divider/20 p-4 hover:border-foreground/30 transition-colors"
          >
            <h3 className="font-display font-bold text-base tracking-tight text-foreground mb-2 line-clamp-2">
              {item.frontmatter.title}
              <span className="inline-flex ml-2 text-foreground/40 group-hover:text-foreground transition-all duration-200 go-icon text-xs">→</span>
            </h3>
            <div className="flex items-center justify-between mt-2">
              <time className="text-[10px] text-caption">{item.frontmatter.date}</time>
              {item.frontmatter.category && (
                <span className="text-[10px] font-medium text-caption uppercase tracking-[0.1em] border border-divider/20 px-1.5 py-0.5">
                  {item.frontmatter.category.replace("-", " ")}
                </span>
              )}
            </div>
            {item.excerpt && (
              <p className="text-xs text-body mt-2 line-clamp-2">
                {item.excerpt}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
