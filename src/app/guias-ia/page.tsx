import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getAllPosts, getFeaturedImage } from "@/lib/mdx-utils";
import { SectionBanner } from "@/components/layout/SectionBanner";
import { PostImage } from "@/components/ui/PostImage";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guías IA",
  description: "Guías y protocolos sobre inteligencia artificial.",
  keywords: ["Guías IA", "regulación IA", "jurisprudencia IA", "noticias IA"],
  alternates: {
    canonical: "/guias-ia",
    languages: {
      "es-ES": "/guias-ia",
      "en-US": "/en/ai-news",
    },
  },
  openGraph: {
    type: "website",
    title: "Guías IA",
    description: "Guías y protocolos sobre inteligencia artificial.",
    url: "/guias-ia",
    locale: "es_ES",
    images: [{ url: "/images/heroes/guias-ia-hero.jpg" }],
  },
};

const AUTOMATED_AUTHOR_PATTERNS = ["claude", "secretaría general", "secretaria general", "automatiz"];

export default async function ActualidadIAPage() {
  const posts = getAllPosts();

  const formatDateEs = (ms?: number | null) => {
    if (!ms || Number.isNaN(ms)) return null;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const allGuidePosts = posts
    .filter((p) => 
      p.frontmatter.section === "guias" || 
      p.frontmatter.category === "guias-ia" ||
      (p.frontmatter.category === "recursos" && p.frontmatter.subcategory === "guias")
    )
    .filter((p) => {
      const author = String(p.frontmatter.author || "").toLowerCase();
      return !AUTOMATED_AUTHOR_PATTERNS.some((pattern) => author.includes(pattern));
    })
    .map((p) => {
      const d = new Date(p.frontmatter.date).getTime();
      const dateLabel = formatDateEs(d);
      const metaParts = [dateLabel, p.frontmatter.author].filter(Boolean);
      return {
        id: `mdx-guide-${p.slug}`,
        href: p.url,
        title: p.frontmatter.title,
        description: p.excerpt,
        badge: "Guías y Protocolos",
        meta: metaParts.join(" · "),
        dateMs: d || 0,
        displayDateMs: d || 0,
        image: getFeaturedImage(p) ?? undefined,
      };
    })
    .sort((a, b) => (b.displayDateMs ?? b.dateMs) - (a.displayDateMs ?? a.dateMs));

  const featuredGuides = allGuidePosts.length > 0 ? [allGuidePosts[0]] : [];
  const remainingGuides = allGuidePosts.length > 0 ? allGuidePosts.slice(1) : [];

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      { name: "Derecho Artificial", url: "https://derechoartificial.com" },
      { name: "Guías IA", url: "https://derechoartificial.com/guias-ia" },
    ],
  });

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Guías IA", href: "/guias-ia" }]} />

      <main className="pb-16 md:pb-24">
        <SectionBanner title="Guías IA" image="/images/heroes/guias-ia-hero.jpg" />

        <div className="container mx-auto px-4 py-8">
          <p className="lead text-left max-w-3xl">
            Guías y protocolos propios sobre inteligencia artificial para profesionales jurídicos. Solo se muestran
            publicaciones editoriales de elaboración propia y con enlace interno activo.
          </p>
        </div>

        <div className="container-editorial">
          {featuredGuides.map((item) => (
            <section key={item.id} className="mb-12">
              <Link
                href={item.href}
                className="block card-elevated p-8 hover:border-foreground/30 transition-all duration-300"
              >
                {item.image && (
                  <PostImage
                    src={item.image}
                    alt={item.title}
                    sizes="(max-width: 768px) 100vw, 896px"
                    aspectClassName="aspect-[16/7]"
                    priority
                    className="mb-6"
                  />
                )}
                <div className="flex flex-col gap-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary font-bold">
                    Destacado
                  </p>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground leading-tight tracking-tight">
                    {item.title}
                  </h2>
                  {item.description && (
                    <p className="text-lg text-body leading-relaxed max-w-4xl">
                      {item.description}
                    </p>
                  )}
                  {item.meta && (
                    <div className="text-sm text-caption mt-2">
                      {item.meta}
                    </div>
                  )}
                  <div className="mt-4">
                    <span className="text-primary font-medium inline-flex items-center gap-2">
                      Leer guía completa <span className="text-xl">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          ))}

          <section className="grid gap-6 md:grid-cols-2">
            {remainingGuides.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="card-elevated p-6 hover:border-primary/20 transition-all duration-300"
              >
                {item.image && (
                  <PostImage
                    src={item.image}
                    alt={item.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    aspectClassName="aspect-[16/9]"
                    className="mb-5"
                  />
                )}
                <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">{item.badge}</p>
                <h2 className="font-display font-bold text-2xl text-foreground mb-4 tracking-tight">{item.title}</h2>
                {item.description && <p className="text-body mb-6">{item.description}</p>}
                {item.meta && <div className="text-sm text-caption">{item.meta}</div>}
              </Link>
            ))}
          </section>

          {allGuidePosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay guías propias disponibles en este momento.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
