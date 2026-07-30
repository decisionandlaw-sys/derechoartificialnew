import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/layout/LegalLayout";
import {
  StructuredData,
  createArticleJsonLd,
  createLegislationJsonLd,
  createLegalDecisionJsonLd,
  createNewsArticleJsonLd,
} from "@/components/seo/StructuredData";
import { getResourceEntry, listResourceSlugs } from "@/lib/resources";

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const slugs = await listResourceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getResourceEntry(slug);
  if (!entry) return {};
  const description = entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200);
  return {
    title: entry.title,
    description,
    alternates: {
      canonical: `/recursos/${entry.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      title: entry.title,
      description,
      url: `/recursos/${entry.slug}`,
    },
  };
}

export default async function RecursoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = await getResourceEntry(slug);
  if (!entry) notFound();

  const url = `https://derechoartificial.com/recursos/${entry.slug}`;
  const description = entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200);

  const datePublished =
    entry.dateMs != null && !Number.isNaN(entry.dateMs)
      ? new Date(entry.dateMs).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: description,
    author: { 
      "@type": "Person", 
      name: "Ricardo Scarpa",
      url: "https://derechoartificial.com/quienes-somos"
    },
    publisher: { 
      "@type": "Organization", 
      name: "Derecho Artificial",
      logo: {
        "@type": "ImageObject",
        url: "https://derechoartificial.com/logo-principal.png"
      }
    },
    datePublished: datePublished,
    "image": {
      "@type": "ImageObject",
      "url": "https://derechoartificial.com/og-default-1200x630.jpg",
      "width": 1200,
      "height": 630
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  const jsonLd =
    entry.kind === "Legislation"
      ? createLegislationJsonLd({
          url,
          name: entry.title,
          description,
          datePublished,
          jurisdiction: entry.jurisdiction ?? undefined,
        })
      : entry.kind === "LegalDecision"
        ? createLegalDecisionJsonLd({
            url,
            name: entry.title,
            description,
            datePublished,
            courtName: entry.courtName ?? undefined,
          })
        : entry.kind === "NewsArticle"
          ? createNewsArticleJsonLd({
              url,
              headline: entry.title,
              description,
              datePublished,
            })
          : createArticleJsonLd({
              url,
              headline: entry.title,
              description,
              datePublished,
            });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <StructuredData data={jsonLd} />
      <LegalLayout title={entry.title} category="Recursos">
        <div className="article-pdf-box mb-12">
          {entry.summaryHtml ? (
            <div
              className="prose prose-slate max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: entry.summaryHtml }}
            />
          ) : null}
          {entry.sourceUrl ? (
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn"
            >
              Descargar documento original
            </a>
          ) : null}
        </div>
        {entry.bodyHtml ? <div dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} /> : null}
      </LegalLayout>
    </>
  );
}
