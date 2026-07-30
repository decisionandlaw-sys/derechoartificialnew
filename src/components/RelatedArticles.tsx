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
      <section className="mt-12 pt-8 border-t border-[hsl(var(--divider)/0.3)]">
        <h2 className="font-display font-bold text-xl tracking-tight text-foreground mb-4">
          Artículos relacionados
        </h2>
        <p className="text-xs text-[hsl(var(--text-caption))]">Próximamente más análisis relacionados.</p>
      </section>
    );
  }

  return (
    <RelatedArticlesList articles={related} title="Artículos relacionados" />
  );
}

function RelatedArticlesList({ articles, title }: { articles: any[]; title: string }) {
  return (
    <section className="mt-12 pt-8 border-t border-[hsl(var(--divider)/0.3)]">
      <h2 className="font-display font-bold text-xl tracking-tight text-foreground mb-6">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((item) => (
          <a
            key={item.url}
            href={item.url}
            className="group block no-underline border border-[hsl(var(--divider)/0.3)] hover:border-[hsl(var(--accent))] transition-colors"
          >
            <div className="h-[2px] bg-[hsl(var(--accent))]" />
            <div className="p-5">
              <h3 className="font-display font-bold text-base leading-[0.95] tracking-tight text-foreground group-hover:text-[hsl(var(--accent))] group-hover:underline underline-offset-2 transition-colors mb-3 line-clamp-2">
                {item.frontmatter.title}
                <span className="inline-flex ml-2 text-foreground/30 group-hover:text-foreground transition-all duration-200 go-icon text-xs">→</span>
              </h3>
              <div className="flex items-center justify-between gap-2">
                <time className="text-[11px] text-[hsl(var(--text-caption))] shrink-0">
                  {(item.frontmatter.date || "").replace(/-/g, "/")}
                </time>
                {item.frontmatter.category && (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] shrink-0">
                    {item.frontmatter.category.replace("-", " ")}
                  </span>
                )}
              </div>
              {item.excerpt && (
                <p className="text-xs text-[hsl(var(--text-body))] mt-3 line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
