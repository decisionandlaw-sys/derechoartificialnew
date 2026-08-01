import type { Metadata } from "next";
import { getAllPosts, getFeaturedImage } from "@/lib/mdx-utils";
import { UnifiedSectionLayout, type UnifiedItem, type SectionConfig } from "@/components/layout/UnifiedSectionLayout";

export const metadata: Metadata = {
  title: "Ética IA",
  description:
    "Análisis sobre ética algorítmica, responsabilidad profesional y gobernanza de sistemas de IA.",
  alternates: { canonical: "/etica-ia" },
  openGraph: {
    type: "website",
    title: "Ética IA",
    description:
      "Análisis sobre ética algorítmica, responsabilidad profesional y gobernanza de sistemas de IA.",
    url: "/etica-ia",
    locale: "es_ES",
    images: [{ url: "/logo-principal.png" }],
  },
};

export default async function EticaIAPage() {
  // Mejorar el filtrado para incluir más variantes de categoría
  const mdxPosts = getAllPosts().filter(
    (post) => 
      (post.frontmatter.category || "").toLowerCase() === "etica-ia" ||
      (post.frontmatter.category || "").toLowerCase().replace(/-/g, ' ') === "etica ia" ||
      (post.frontmatter.section || "").toLowerCase() === "etica-ia"
  );

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const items: UnifiedItem[] = mdxPosts.map((post) => {
    const dateMs = post.dateMs;
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
    title: "Ética IA",
    description: "Análisis sobre ética algorítmica, responsabilidad profesional y gobernanza de sistemas de IA. Casos y guías sobre riesgos éticos, negligencia profesional y su impacto en derechos fundamentales.",
    heroImage: "/images/sections/etica-ia.png",
    heroAlt: "Ética IA",
    footerTitle: "Enfoque ético",
    footerDescription: "Exploramos las implicaciones morales y profesionales de la implementación de sistemas de IA. Analizamos casos reales de sesgo algorítmico, responsabilidad legal y los límites éticos de la automatización en el ámbito legal.",
    breadcrumbItems: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Ética IA",
        url: "https://derechoartificial.com/etica-ia",
      },
    ],
    metadata: metadata,
  };

  return <UnifiedSectionLayout config={config} items={items} />;
}
