import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { ResolvedContentEntry } from "@/lib/content";
import { getContentEntry, listContentSlugs } from "@/lib/content";
import { createNewsArticleJsonLd, createGenericArticleJsonLd, StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedArticles } from "@/components/RelatedArticles";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { Button } from "@/components/ui/button";
import type { ResourceEntry } from "@/lib/resources";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { getPostBySlug, getAllPosts, getFeaturedImage } from "@/lib/mdx-utils";
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

export async function generateStaticParams() {
  const [jsonSlugs, resourceSlugs] = await Promise.all([
    listContentSlugs("guias-ia"),
    listSectionResourceSlugs("guias-ia"),
  ]);

  const mdxPosts = getAllPosts().filter(p => 
    p.frontmatter.category === "guias-ia" || 
    p.frontmatter.category === "guias" ||
    p.frontmatter.section === "guias"
  );
  const mdxSlugs = mdxPosts.map(p => p.slug);

  const allSlugs = new Set<string>([...jsonSlugs, ...resourceSlugs, ...mdxSlugs]);
  const seed = allSlugs.size ? Array.from(allSlugs) : [""];
  return seed.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const mdxPost = getPostBySlug(slug);
  if (mdxPost && (mdxPost.frontmatter.category === "guias-ia" || mdxPost.frontmatter.section === "guias" || mdxPost.frontmatter.category === "guias")) {
    const { title, description, category, section, date } = mdxPost.frontmatter;
    const metaDescription =
      mdxPost.excerpt || description || "Monitor editorial de novedades regulatorias sobre inteligencia artificial.";
    const canonical = `https://derechoartificial.com/guias-ia/${slug}`;
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
        authors: ['Ricardo Scarpa']
      }
    };
  }

  const [jsonEntry, resourceEntry] = await Promise.all([
    getContentEntry("guias-ia", slug),
    getSectionResourceEntry("guias-ia", slug),
  ]);

  if (!jsonEntry && !resourceEntry) return {};

  const entry: ResolvedContentEntry | ResourceEntry = (jsonEntry ?? resourceEntry)!;

  const title = entry.title;
  const description =
    jsonEntry?.description ??
    resourceEntry?.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 158) ??
    entry.title.slice(0, 158);

  const canonical = jsonEntry?.urlPath ? `https://derechoartificial.com${jsonEntry.urlPath}` : `https://derechoartificial.com/guias-ia/${entry.slug}`;

  const ogImage = "https://derechoartificial.com/og-default-1200x630.jpg";

  return {
    title,
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
      publishedTime: jsonEntry?.datePublished || (resourceEntry as any)?.dateMs ? new Date(jsonEntry?.datePublished || (resourceEntry as any)?.dateMs).toISOString() : undefined,
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

export default async function ActualidadIASlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const mdxPost = getPostBySlug(slug);
  if (mdxPost && (mdxPost.frontmatter.category === "guias-ia" || mdxPost.frontmatter.section === "guias" || mdxPost.frontmatter.category === "guias")) {
    const { title, date } = mdxPost.frontmatter;
    return (
      <LegalLayout
        title={title}
        category="Guías IA"
        author={{ name: "Ricardo Scarpa", href: "/quienes-somos" }}
        date={date}
        image={getFeaturedImage(mdxPost)}
      >
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
            currentCategory={mdxPost.frontmatter.category || "guias-ia"}
          />
        </div>
      </LegalLayout>
    );
  }

  const jsonEntry = await getContentEntry("guias-ia", slug);
  const resourceEntry = jsonEntry ? null : await getSectionResourceEntry("guias-ia", slug);

  if (!jsonEntry && !resourceEntry) notFound();

  if (jsonEntry) {
    const authorName = jsonEntry.author === "Derecho Artificial" ? "Ricardo Scarpa" : jsonEntry.author;

    const jsonLd = createNewsArticleJsonLd({
      url: jsonEntry.url,
      headline: jsonEntry.title,
      description: jsonEntry.description,
      datePublished: jsonEntry.datePublished,
      authorName: authorName,
    });

    const genericJsonLd = createGenericArticleJsonLd({
      url: jsonEntry.url,
      headline: jsonEntry.title,
      description: jsonEntry.description,
      datePublished: jsonEntry.datePublished,
      authorName: authorName,
    });

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": jsonEntry.title,
      "description": jsonEntry.description,
      "author": { 
        "@type": "Person", 
        "name": authorName,
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
      "datePublished": jsonEntry.datePublished,
      "dateModified": jsonEntry.datePublished,
      "image": {
        "@type": "ImageObject",
        "url": "https://derechoartificial.com/og-default-1200x630.jpg",
        "width": 1200,
        "height": 630
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": jsonEntry.url
      }
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <Script id={`ld-article-guias-ia-${slug}`} type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(jsonLd)}
        </Script>
        <StructuredData data={genericJsonLd} />
        <LegalLayout
          title={jsonEntry.title}
          category="Guías IA"
          date={jsonEntry.datePublished}
          author={{ 
            name: authorName,
            href: "/quienes-somos"
          }}
        >
          <Breadcrumbs items={[
            { label: 'Inicio', href: '/' },
            { label: 'Guías IA', href: '/guias-ia' },
            { label: jsonEntry.title, href: `/guias-ia/${jsonEntry.slug}` }
          ]} />
          <div className="mb-10">
            <Button asChild variant="outline" size="sm">
              <Link href="/guias-ia">Volver a Guías IA</Link>
            </Button>
          </div>
          <p className="lead text-muted-foreground mb-8">{jsonEntry.description}</p>
          <div dangerouslySetInnerHTML={{ __html: jsonEntry.html }} />
          <RelatedArticles currentSlug={slug} />
        </LegalLayout>
      </>
    );
  }

  const entry = resourceEntry!;
  const datePublished = (entry as any).dateMs != null && !Number.isNaN((entry as any).dateMs)
    ? new Date((entry as any).dateMs).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const postDate = (entry as any).date || (entry as any).publishedAt || (entry as any).updatedAt || datePublished;

  const jsonLd = createNewsArticleJsonLd({
    url: `https://derechoartificial.com/guias-ia/${entry.slug}`,
    headline: entry.title,
    description: entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
    datePublished: postDate,
    authorName: "Ricardo Scarpa",
  });

  const genericJsonLd = createGenericArticleJsonLd({
    url: `https://derechoartificial.com/guias-ia/${entry.slug}`,
    headline: entry.title,
    description: entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
    datePublished: postDate,
    authorName: "Ricardo Scarpa",
  });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": entry.title,
    "description": entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
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
      "@id": `https://derechoartificial.com/guias-ia/${entry.slug}`
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id={`ld-article-guias-ia-${slug}`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <StructuredData data={genericJsonLd} />
      <LegalLayout
        title={entry.title}
        category="Guías IA"
        date={postDate}
        author={{ name: "Ricardo Scarpa" }}
      >
        <Breadcrumbs items={[
          { label: 'Inicio', href: '/' },
          { label: 'Guías IA', href: '/guias-ia' },
          { label: entry.title, href: `/guias-ia/${entry.slug}` }
        ]} />
        <div className="mb-10">
          <Button asChild variant="outline" size="sm">
            <Link href="/guias-ia">Volver a Guías IA</Link>
          </Button>
        </div>
        {entry.summaryHtml && (
          <div className="lead text-muted-foreground mb-8" dangerouslySetInnerHTML={{ __html: entry.summaryHtml }} />
        )}
        <div dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />
        <RelatedArticles 
          currentSlug={slug} 
          currentTags={(resourceEntry as any)?.tags || []}
          currentCategory="guias-ia"
        />
      </LegalLayout>
    </>
  );
}
