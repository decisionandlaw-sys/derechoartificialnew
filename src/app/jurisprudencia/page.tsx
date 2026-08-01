import type { Metadata } from "next";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { getAllPosts, getFeaturedImage } from "@/lib/mdx-utils";
import { UnifiedSectionLayout, type UnifiedItem, type SectionConfig } from "@/components/layout/UnifiedSectionLayout";

export const metadata: Metadata = {
  title: "Jurisprudencia",
  description:
    "Selección y análisis de resoluciones relevantes sobre tecnología, datos e inteligencia artificial.",
  keywords: [
    "jurisprudencia IA",
    "derecho digital",
    "protección de datos",
    "RGPD",
    "decisiones judiciales",
    "algoritmos",
    "responsabilidad",
  ],
  alternates: {
    canonical: "/jurisprudencia",
    languages: {
      "es-ES": "/jurisprudencia",
      "en-US": "https://decisionandlaw.com/",
    },
  },
  openGraph: {
    type: "website",
    title: "Jurisprudencia",
    description:
      "Selección y análisis de resoluciones relevantes sobre tecnología, datos e inteligencia artificial.",
    url: "/jurisprudencia",
    locale: "es_ES",
    images: [
      {
        url: "/images/heroes/jurisprudencia-ia-hero.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

type SentenciaItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  meta: string;
  dateMs: number;
};

export default async function JurisprudenciaPage() {
  const resourceSlugs = await listSectionResourceSlugs("jurisprudencia");
  const resourceEntries = await Promise.all(
    resourceSlugs.map((slug) => getSectionResourceEntry("jurisprudencia", slug)),
  );
  const resolvedResourceEntries = resourceEntries.filter(
    (entry): entry is any => Boolean(entry),
  );

  // Mejorar el filtrado para incluir más variantes de categoría
  const mdxPosts = getAllPosts().filter(post => 
    post.frontmatter.category && 
    (post.frontmatter.category.toLowerCase().replace(/-/g, ' ') === 'jurisprudencia' ||
     post.frontmatter.category.toLowerCase().replace(/-/g, ' ') === 'jurisprudencia ia' ||
     post.frontmatter.category.toLowerCase() === 'jurisprudencia' ||
     post.frontmatter.category.toLowerCase() === 'jurisprudencia-ia' ||
     (post.frontmatter.section || "").toLowerCase() === 'jurisprudencia')
  );

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  // Items desde recursos
  const resourceItems: UnifiedItem[] = resolvedResourceEntries.map((entry) => {
    const time = entry.dateMs ?? 0;
    const safeTime = Number.isNaN(time) ? 0 : time;
    const displayMs = entry.displayDateMs != null && !Number.isNaN(entry.displayDateMs) ? entry.displayDateMs : undefined;
    const date = displayMs != null ? new Date(displayMs) : null;
    const dateLabel = date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
      : null;
    const plainSummary = entry.summaryHtml
      ? entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200)
      : "";
    const parts: string[] = [];
    if (dateLabel) {
      parts.push(dateLabel);
    }
    if (entry.sourceUrl) {
      parts.push("Incluye descarga del documento original");
    }
    const badge = entry.title?.toLowerCase().includes("aepd")
      ? "Resolución"
      : "Sentencia";
    return {
      id: `resource-${entry.slug}`,
      href: `/jurisprudencia/${entry.slug}`,
      title: entry.title,
      description: plainSummary,
      badge,
      meta: parts.join(" · "),
      dateMs: displayMs ?? safeTime,
      displayDateMs: entry.displayDateMs,
    };
  });

  // Items desde MDX
  const mdxItems: UnifiedItem[] = mdxPosts.map(post => {
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
  });

  // Item destacado especial BOSCO
  const boscoDateString = "2026-01-30";
  const boscoTime = new Date(boscoDateString).getTime();
  const boscoItem: UnifiedItem = {
    id: "bosco",
    href: "/jurisprudencia/sentencia-bosco-transparencia-algoritmica",
    title: "Sentencia BOSCO: Transparencia Algorítmica y Código Fuente",
    description: "Análisis jurídico de la STS 1119/2025 que consolida el derecho de acceso al código fuente cuando un algoritmo determina prestaciones sociales.",
    badge: "Destacada",
    meta: "STS 1119/2025 · 11 de septiembre de 2025",
    dateMs: Number.isNaN(boscoTime) ? 0 : boscoTime,
  };

  // Combinar y ordenar todos los items
  const items: UnifiedItem[] = [...mdxItems, boscoItem, ...resourceItems].sort(
    (a, b) => (b.displayDateMs ?? b.dateMs) - (a.displayDateMs ?? a.dateMs)
  );

  const config: SectionConfig = {
    title: "Jurisprudencia",
    description: "Repositorio crítico de resoluciones judiciales y administrativas que definen el Derecho de la IA. Analizamos sentencias que sientan precedente sobre transparencia algorítmica, responsabilidad civil y protección de derechos fundamentales en la era digital.",
    heroImage: "/images/sections/jurisprudencia-ia.png",
    heroAlt: "Jurisprudencia",
    footerTitle: "Enfoque jurisprudencial",
    footerDescription: "Análisis crítico de precedentes judiciales con impacto directo en la práctica profesional. Cada sentencia se examina desde la perspectiva del Derecho aplicable, identificando estándares y tendencias que moldean el futuro de la regulación de IA.",
    breadcrumbItems: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Jurisprudencia",
        url: "https://derechoartificial.com/jurisprudencia",
      },
    ],
    metadata: metadata,
  };

  return <UnifiedSectionLayout config={config} items={items} />;
}

