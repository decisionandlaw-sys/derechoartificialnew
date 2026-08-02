import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/layout/LegalLayout";
import {
  StructuredData,
  createBreadcrumbJsonLd,
  createLegalDecisionJsonLd,
} from "@/components/seo/StructuredData";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { RelatedArticles } from "@/components/RelatedArticles";
import { getPostBySlug, getAllPosts, getHeroImage, getFeaturedImage } from "@/lib/mdx-utils";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { defaultSchema } from 'hast-util-sanitize';
import { WatermarkedImage } from "@/components/ui/WatermarkedImage";

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema as any).tagNames,
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'caption'
  ],
  attributes: {
    ...(defaultSchema as any).attributes,
    table: ['className'],
    thead: [],
    tbody: [],
    tr: [],
    th: ['align', 'colspan', 'rowspan'],
    td: ['align', 'colspan', 'rowspan'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    code: ['className']
  }
};

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const resourceSlugs = await listSectionResourceSlugs("jurisprudencia");
  
  // Incluir slugs de posts MDX que tengan categoría jurisprudencia
  const mdxPosts = getAllPosts().filter(p => p.frontmatter.section === "jurisprudencia" || p.frontmatter.category === "jurisprudencia" || p.frontmatter.category?.toLowerCase() === "jurisprudencia ia");
  const mdxSlugs = mdxPosts.map(p => p.slug);

  const allSlugs = new Set<string>([...resourceSlugs, ...mdxSlugs]);
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;

  // Priorizar MDX nativo
  const mdxPost = getPostBySlug(slug);
  if (mdxPost && (mdxPost.frontmatter.section === "jurisprudencia" || mdxPost.frontmatter.category === "jurisprudencia" || mdxPost.frontmatter.category?.toLowerCase() === "jurisprudencia ia")) {
    const { title, description, category, date } = mdxPost.frontmatter;
    const metaDescription =
      mdxPost.excerpt || description || "Análisis jurídico experto sobre jurisprudencia en IA.";
    const canonical = mdxPost.frontmatter.canonical ?? `https://derechoartificial.com/${category}/${slug}`;
    const ogImage = getHeroImage("jurisprudencia");
    return {
      title,
      description: metaDescription,
      alternates: { canonical },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        type: "article",
        title,
        description: metaDescription,
        url: canonical,
        siteName: "Derecho Artificial",
        locale: "es_ES",
        publishedTime: date ? new Date(date).toISOString() : undefined,
        authors: ['Ricardo Scarpa'],
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: metaDescription,
        images: [ogImage],
      }
    };
  }

  const entry = await getSectionResourceEntry("jurisprudencia", slug);
  if (!entry) return {};
  const description = entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 158) || "Análisis jurídico experto sobre IA por Ricardo Scarpa";
  const canonical = `https://derechoartificial.com/jurisprudencia/${entry.slug}`;
  const ogImage = getHeroImage("jurisprudencia");

  return {
    title: entry.title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      title: entry.title,
      description,
      url: canonical,
      siteName: "Derecho Artificial",
      locale: "es_ES",
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: entry.title
      }],
      publishedTime: entry.dateMs != null ? new Date(entry.dateMs).toISOString() : undefined,
      authors: ['Ricardo Scarpa']
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description,
      images: [ogImage],
      creator: "@RicardoScarpa",
    },
  };
}

export default async function JurisprudenciaSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  // Intentar cargar desde MDX nativo primero
  const mdxPost = getPostBySlug(slug);
  if (mdxPost && (mdxPost.frontmatter.section === "jurisprudencia" || mdxPost.frontmatter.category === "jurisprudencia" || mdxPost.frontmatter.category?.toLowerCase() === "jurisprudencia ia")) {
    const { title, date, category, pdf, pdfLabel } = mdxPost.frontmatter;
    const isResolucion = title?.toLowerCase().includes("aepd") || category?.toLowerCase() === "aepd";
    const pdfUrl =
      pdf && (pdf.startsWith("/") || pdf.startsWith("http"))
        ? pdf
        : pdf
        ? `/fuentes/${pdf}.pdf`
        : "";
    return (
      <LegalLayout
        title={title}
        category={category === "jurisprudencia" ? "Jurisprudencia" : (category || "Jurisprudencia")}
        author={{ name: "Ricardo Scarpa", href: "/quienes-somos" }}
        date={date}
        image={getFeaturedImage(mdxPost)}
      >
        {pdfUrl ? (
          <div className="article-pdf-box mb-12">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn"
            >
              {pdfLabel || (isResolucion ? "Resolución" : "Sentencia")}
            </a>
          </div>
        ) : null}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, { schema: sanitizeSchema }]]}
            components={{
              img: (props: any) => <WatermarkedImage {...props} loading="lazy" decoding="async" />,
            }}
          >
            {mdxPost.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <RelatedArticles
            currentSlug={slug}
            currentTags={mdxPost.frontmatter.tags || []}
            currentCategory={mdxPost.frontmatter.category || "jurisprudencia"}
          />
        </div>
      </LegalLayout>
    );
  }

  const entry = await getSectionResourceEntry("jurisprudencia", slug);
  if (!entry) notFound();

  const url = `https://derechoartificial.com/jurisprudencia/${entry.slug}`;
  const description = entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200);

  const datePublished =
    entry.dateMs != null && !Number.isNaN(entry.dateMs)
      ? new Date(entry.dateMs).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  const postDate = (entry as any).date || (entry as any).publishedAt || (entry as any).updatedAt || datePublished;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": entry.title,
    "description": description,
    "author": { 
      "@type": "Person", 
      "name": "Ricardo Scarpa",
      "url": "https://derechoartificial.com/quienes-somos"
    },
    "publisher": { 
      "@type": "Organization", 
      "name": "Derecho Artificial",
      "logo": {
        "@type": "ImageObject",
        "url": "https://derechoartificial.com/logo-principal.png"
      }
    },
    "datePublished": postDate,
    "dateModified": (entry as any).updatedAt || postDate,
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

  const jsonLd = createLegalDecisionJsonLd({
    url,
    name: entry.title,
    description,
    datePublished,
    courtName: entry.courtName ?? undefined,
  });

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Jurisprudencia",
        url: "https://derechoartificial.com/jurisprudencia",
      },
      {
        name: entry.title,
        url,
      },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <StructuredData data={[jsonLd, breadcrumbJsonLd]} />
      <LegalLayout title={entry.title} category="Jurisprudencia">
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
              {entry.title?.toLowerCase().includes("aepd") ? "Resolución" : "Sentencia"}
            </a>
          ) : null}
        </div>
        {entry.bodyHtml ? <div dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} /> : null}
        <RelatedArticles 
          currentSlug={entry.slug} 
          currentCategory="jurisprudencia"
          currentTags={["#Jurisprudencia", "#IA"]}
        />
      </LegalLayout>
    </>
  );
}
