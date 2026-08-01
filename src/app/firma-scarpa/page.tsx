import type { Metadata } from "next";
import Link from "next/link";
import type { ResolvedContentEntry } from "@/lib/content";
import { getContentEntry, listContentSlugs } from "@/lib/content";
import type { ResourceEntry } from "@/lib/resources";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getAllPosts, getFeaturedImage } from "@/lib/mdx-utils";
import { SectionBanner } from "@/components/layout/SectionBanner";
import { PostImage } from "@/components/ui/PostImage";

// Revalidación automática cada hora
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Firma Scarpa",
  description:
    "Textos y análisis firmados por el responsable editorial sobre Derecho e Inteligencia Artificial.",
  keywords: [
    "Ricardo Scarpa",
    "derecho artificial",
    "análisis jurídico IA",
    "opinión jurídica",
    "regulación IA",
    "AI Act",
    "cumplimiento",
  ],
  alternates: {
    canonical: "/firma-scarpa",
    languages: {
      "es-ES": "/firma-scarpa",
      "en-US": "https://decisionandlaw.com/",
    },
  },
  openGraph: {
    type: "website",
    title: "Firma Scarpa",
    description:
      "Textos y análisis firmados por el responsable editorial sobre Derecho e Inteligencia Artificial.",
    url: "/firma-scarpa",
    locale: "es_ES",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

export default async function FirmaScarpaPage() {
  const slugs = await listContentSlugs("firma-scarpa");
  const entries = await Promise.all(slugs.map((slug) => getContentEntry("firma-scarpa", slug)));
  const resolvedEntries = entries.filter((entry): entry is ResolvedContentEntry => Boolean(entry));
  const sortedEntries = resolvedEntries.sort((a, b) => {
    const aTime = typeof a.dateMs === "number" ? a.dateMs : 0;
    const bTime = typeof b.dateMs === "number" ? b.dateMs : 0;
    return bTime - aTime;
  });

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const resourceSlugs = await listSectionResourceSlugs("firma-scarpa");
  const resourceEntries = await Promise.all(
    resourceSlugs.map((slug) => getSectionResourceEntry("firma-scarpa", slug)),
  );
  const resolvedResourceEntries = resourceEntries.filter(
    (entry): entry is ResourceEntry => Boolean(entry),
  );

  const mdxPosts = getAllPosts().filter(post => {
    const category = (post.frontmatter.category || "").toLowerCase();
    const section = (post.frontmatter.section || "").toLowerCase();
    const categoryNormalized = category.replace(/-/g, ' ');
    const sectionNormalized = section.replace(/-/g, ' ');
    
    return (
      category === "firma-scarpa" ||
      categoryNormalized === "firma scarpa" ||
      categoryNormalized === "firma-scarpa" ||
      section === "firma-scarpa" ||
      sectionNormalized === "firma scarpa" ||
      sectionNormalized === "firma-scarpa"
    );
  });

  const mdxItems: UnifiedItem[] = mdxPosts.map(post => {
    const dateMs = new Date(post.frontmatter.date).getTime();
    return {
      id: `mdx-${post.slug}`,
      href: post.url,
      title: post.frontmatter.title,
      description: post.excerpt,
      badge: "Análisis",
      meta: `${formatDate(post.frontmatter.date)} · ${post.frontmatter.author || "Ricardo Scarpa"}`,
      dateMs: dateMs,
      displayDateMs: dateMs,
      image: getFeaturedImage(post) ?? undefined,
    };
  });

  type UnifiedItem = {
    id: string;
    href: string;
    title: string;
    description: string;
    badge: string;
    meta: string;
    dateMs: number;
    displayDateMs?: number;
    image?: string;
  };

  const contentItems: UnifiedItem[] = sortedEntries.map((entry) => {
    const safeTime = typeof entry.dateMs === "number" && !Number.isNaN(entry.dateMs) ? entry.dateMs : 0;
    const displayMs = (() => {
      const d = new Date(entry.datePublished).getTime();
      return Number.isNaN(d) ? undefined : d;
    })();
    const parts: string[] = [];
    parts.push(formatDate(entry.datePublished));
    if (entry.author) {
      parts.push(entry.author);
    }
    return {
      id: `content-${entry.slug}`,
      href: entry.urlPath,
      title: entry.title,
      description: entry.description,
      badge: "Análisis",
      meta: parts.join(" · "),
      dateMs: safeTime,
      displayDateMs: displayMs,
    };
  });

  const resourceItems: UnifiedItem[] = resolvedResourceEntries.map((entry) => {
    const time = entry.dateMs ?? 0;
    const safeTime = Number.isNaN(time) ? 0 : time;
    const date =
      entry.displayDateMs != null && !Number.isNaN(entry.displayDateMs) ? new Date(entry.displayDateMs) : null;
    const dateLabel =
      date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
        : null;
    const plainSummary = entry.description || (entry.summaryHtml
      ? entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200)
      : "");
    const parts: string[] = [];
    if (dateLabel) {
      parts.push(dateLabel);
    }
    if (entry.sourceUrl) {
      parts.push("Incluye descarga del documento original");
    }
    return {
      id: `resource-${entry.slug}`,
      href: `/firma-scarpa/${entry.slug}`,
      title: entry.title,
      description: plainSummary,
      badge: entry.slug === "caso-eeoc-v-itutorgroup" ? "Destacado" : "Análisis",
      meta: parts.join(" · "),
      dateMs: safeTime,
      displayDateMs: entry.displayDateMs ?? undefined,
    };
  });

  const items: UnifiedItem[] = [...mdxItems, ...contentItems, ...resourceItems].sort(
    (a, b) => (b.displayDateMs ?? b.dateMs) - (a.displayDateMs ?? a.dateMs),
  );

  // El artículo destacado es automáticamente el más reciente (primero en la lista ordenada)
  const featuredItems: UnifiedItem[] = items.length > 0 ? [items[0]] : [];
  const remainingItems = items.length > 0 ? items.slice(1) : [];

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Firma Scarpa",
        url: "https://derechoartificial.com/firma-scarpa",
      },
    ],
  });

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <main className="pb-16 md:pb-24">
        <SectionBanner title="Firma Scarpa" image="/images/sections/firma-scarpa.png" />
        <div className="container mx-auto px-4 py-8">
          <p className="lead text-left max-w-3xl">
            Columna editorial y ensayos jurídicos bajo la firma de Ricardo Scarpa. Un espacio de reflexión 
            profunda sobre la intersección entre tecnología y ley, abordando desde la ética del algoritmo 
            hasta las implicaciones prácticas del Reglamento de IA en el sector legal.
          </p>
        </div>
        <div className="container-editorial">
          {/* Artículos Destacados - Una por fila */}
          {featuredItems.map((item) => (
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
                    {item.badge}
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
                      Leer análisis completo <span className="text-xl">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          ))}

          <section className="grid gap-6 md:grid-cols-2">
            {remainingItems.map((item) => (
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
                <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Análisis</p>
                <h2 className="font-display font-bold text-2xl text-foreground mb-4 tracking-tight">{item.title}</h2>
                {item.description && <p className="text-body mb-6">{item.description}</p>}
                {item.meta && <div className="text-sm text-caption">{item.meta}</div>}
              </Link>
            ))}
          </section>

          <section className="mt-12 rounded-lg border border-divider bg-surface p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Enfoque editorial</p>
            <p className="text-body max-w-3xl">
              La firma aborda el impacto jurídico de la IA desde la práctica profesional: cumplimiento normativo,
              responsabilidad y diseño de garantías. Cada texto se construye a partir de fuentes verificables y
              experiencias de implementación en entornos regulatorios complejos.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

