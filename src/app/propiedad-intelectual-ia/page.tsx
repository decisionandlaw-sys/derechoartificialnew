import type { Metadata } from "next";
import { getAllPosts, getFeaturedImage } from "@/lib/mdx-utils";
import { UnifiedSectionLayout, type UnifiedItem, type SectionConfig } from "@/components/layout/UnifiedSectionLayout";

export const metadata: Metadata = {
  title: "Propiedad Intelectual IA",
  description:
    "Análisis y recursos sobre propiedad intelectual, derecho de autor e inteligencia artificial.",
  alternates: { canonical: "/propiedad-intelectual-ia" },
  openGraph: {
    type: "website",
    title: "Propiedad Intelectual IA",
    description:
      "Análisis y recursos sobre propiedad intelectual, derecho de autor e inteligencia artificial.",
    url: "/propiedad-intelectual-ia",
    locale: "es_ES",
    images: [{ url: "/logo-principal.png" }],
  },
};

export default async function PropiedadIntelectualIAPage() {
  // Mejorar el filtrado para incluir más variantes de categoría
  const mdxPosts = getAllPosts().filter(
    (post) => 
      (post.frontmatter.category || "").toLowerCase() === "propiedad-intelectual-ia" ||
      (post.frontmatter.category || "").toLowerCase().replace(/-/g, ' ') === "propiedad intelectual ia" ||
      (post.frontmatter.category || "").toLowerCase().replace(/-/g, ' ') === "propiedad intelectual" ||
      (post.frontmatter.category || "").toLowerCase() === "propiedad intelectual" ||
      (post.frontmatter.section || "").toLowerCase() === "propiedad-intelectual-ia"
  );

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const items: UnifiedItem[] = mdxPosts.map((post) => {
    const dateMs = new Date(post.frontmatter.date).getTime();
    return {
      id: `mdx-${post.slug}`,
      href: post.url,
      title: post.frontmatter.title,
      description: post.excerpt,
      badge: "Análisis",
      meta: `${formatDate(post.frontmatter.date)} · ${post.frontmatter.author || "Derecho Artificial"}`,
      dateMs: dateMs,
      displayDateMs: dateMs,
      image: getFeaturedImage(post) ?? undefined,
    };
  }).sort((a, b) => (b.displayDateMs ?? b.dateMs) - (a.displayDateMs ?? a.dateMs));

  const config: SectionConfig = {
    title: "Propiedad Intelectual IA",
    description: "Análisis exhaustivo sobre propiedad intelectual en la era de la inteligencia artificial. Derechos de autor, marcas, patentes y los nuevos desafíos legales que plantea la IA generativa.",
    heroImage: "/images/sections/propiedad-intelectual-ia.png",
    heroAlt: "Propiedad Intelectual IA",
    footerTitle: "Enfoque de propiedad intelectual",
    footerDescription: "Exploramos las tensiones entre la creatividad humana y la generación automatizada. Analizamos casos clave como Disney vs. Midjourney, Thomson Reuters vs. Ross Intelligence, y el futuro del copyright en sistemas de IA.",
    breadcrumbItems: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Propiedad Intelectual IA",
        url: "https://derechoartificial.com/propiedad-intelectual-ia",
      },
    ],
    metadata: metadata,
  };

  return <UnifiedSectionLayout config={config} items={items} />;
}
