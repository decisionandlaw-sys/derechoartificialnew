import type { Metadata } from "next";
import { getAllPosts, getFeaturedImage } from "@/lib/mdx-utils";
import { UnifiedSectionLayout, type UnifiedItem, type SectionConfig } from "@/components/layout/UnifiedSectionLayout";

export const metadata: Metadata = {
  title: "Global IA - Inteligencia Artificial en el Derecho Global",
  description: "Análisis exhaustivo de la regulación de inteligencia artificial a nivel mundial, incluyendo AI Act europeo, executive orders de EE.UU., regulaciones asiáticas y estándares internacionales de IA.",
  keywords: [
    "Global IA",
    "regulación IA mundial",
    "AI Act europeo",
    "Executive Order IA EE.UU.",
    "regulación China IA",
    "estándares internacionales IA",
    "IA derecho comparado",
    "gobernanza IA global",
  ],
  alternates: {
    canonical: "/global-ia",
    languages: {
      "es-ES": "/global-ia",
      "en-US": "https://decisionandlaw.com/",
    },
  },
  openGraph: {
    type: "website",
    title: "Global IA - Inteligencia Artificial en el Derecho Global",
    description: "Análisis exhaustivo de la regulación de inteligencia artificial a nivel mundial, incluyendo AI Act europeo, executive orders de EE.UU., regulaciones asiáticas y estándares internacionales de IA.",
    url: "/global-ia",
    locale: "es_ES",
    images: [
      {
        url: "/images/heroes/ia-global-hero.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

type GlobalIAPost = {
  id: string;
  href: string;
  title: string;
  description: string;
  meta: string;
  dateMs: number;
};

export default async function GlobalIAPage() {
  // Mejorar el filtrado para incluir más variantes de categoría
  const mdxPosts = getAllPosts().filter(post => 
    post.frontmatter.category === 'Global IA' || 
    post.frontmatter.category === 'ia-global' ||
    post.frontmatter.category === 'global-ia' ||
    (post.frontmatter.category && post.frontmatter.category.toLowerCase().replace(/-/g, ' ') === 'ia global') ||
    (post.frontmatter.category && post.frontmatter.category.toLowerCase().replace(/-/g, ' ') === 'global ia') ||
    (post.frontmatter.section || "").toLowerCase() === 'ia-global' ||
    (post.frontmatter.section || "").toLowerCase() === 'global-ia'
  );

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const items: UnifiedItem[] = mdxPosts.map(post => {
    const dateMs = new Date(post.frontmatter.date).getTime();
    return {
      id: `mdx-${post.slug}`,
      href: post.url,
      title: post.frontmatter.title,
      description: post.excerpt,
      badge: "Análisis",
      meta: `${formatDate(post.frontmatter.date)} · ${post.frontmatter.authors?.[0] || post.frontmatter.author || "Derecho Artificial"}`,
      dateMs: dateMs,
      displayDateMs: dateMs,
      image: getFeaturedImage(post) ?? undefined,
    };
  }).sort((a, b) => (b.displayDateMs ?? b.dateMs) - (a.displayDateMs ?? a.dateMs));

  const config: SectionConfig = {
    title: "Global IA",
    description: "Análisis exhaustivo de la regulación de inteligencia artificial a nivel mundial, incluyendo AI Act europeo, executive orders de EE.UU., regulaciones asiáticas y estándares internacionales de IA.",
    heroImage: "/images/sections/ia-global.png",
    heroAlt: "Global IA",
    footerTitle: "Enfoque global",
    footerDescription: "Análisis comparado de la regulación de IA en diferentes jurisdicciones, examinando estándares internacionales, conflictos de leyes y mejores prácticas para la gobernanza global de la inteligencia artificial.",
    breadcrumbItems: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Global IA",
        url: "https://derechoartificial.com/global-ia",
      },
    ],
    metadata: metadata,
  };

  return <UnifiedSectionLayout config={config} items={items} />;
}

