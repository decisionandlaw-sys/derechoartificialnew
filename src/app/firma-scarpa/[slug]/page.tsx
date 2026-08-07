import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ResolvedContentEntry } from "@/lib/content";
import { getContentEntry, listContentSlugs } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { LegalLayout } from "@/components/layout/LegalLayout";
import {
  StructuredData,
  createArticleJsonLd,
  createGenericArticleJsonLd,
} from "@/components/seo/StructuredData";
import type { ResourceEntry } from "@/lib/resources";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedArticles } from "@/components/RelatedArticles";
import { getPostBySlug, getAllPosts, getHeroImage, getFeaturedImage } from "@/lib/mdx-utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { WatermarkedImage } from "@/components/ui/WatermarkedImage";

// Map slugs to PDF files
const PDF_MAPPING: Record<string, string> = {
  "clawdbot-ilusion-privacidad": "informe-clawdbot-rgpd.pdf",
  "informe-clawdbot": "informe-clawdbot.pdf",
};

export async function generateStaticParams() {
  const [jsonSlugs, resourceSlugs] = await Promise.all([
    listContentSlugs("firma-scarpa"),
    listSectionResourceSlugs("firma-scarpa"),
  ]);
  
  // Incluir slugs de posts MDX que tengan categoría firma-scarpa
  const mdxPosts = getAllPosts().filter(p => {
    const category = (p.frontmatter.category || "").toLowerCase();
    const section = (p.frontmatter.section || "").toLowerCase();
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
  const mdxSlugs = mdxPosts.map(p => p.slug);

  const allSlugs = new Set<string>([...jsonSlugs, ...resourceSlugs, ...mdxSlugs]);
  const seed = allSlugs.size ? Array.from(allSlugs) : ["nota-editorial-inaugural"];
  return seed.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Priorizar MDX nativo
  const mdxPost = getPostBySlug(slug);
  if (mdxPost) {
    const category = (mdxPost.frontmatter.category || "").toLowerCase();
    const section = (mdxPost.frontmatter.section || "").toLowerCase();
    const categoryNormalized = category.replace(/-/g, ' ');
    const sectionNormalized = section.replace(/-/g, ' ');
    
    const isValidFirmaScarpa = (
      category === "firma-scarpa" ||
      categoryNormalized === "firma scarpa" ||
      categoryNormalized === "firma-scarpa" ||
      section === "firma-scarpa" ||
      sectionNormalized === "firma scarpa" ||
      sectionNormalized === "firma-scarpa"
    );
    
    if (isValidFirmaScarpa) {
      const { title, description, category, date, section } = mdxPost.frontmatter;
    const metaDescription =
      mdxPost.excerpt || description || "Análisis jurídico experto sobre IA por Ricardo Scarpa.";
    const canonical = mdxPost.frontmatter.canonical ?? `https://www.derechoartificial.com/${category}/${slug}`;
      const ogImage = getHeroImage("firma-scarpa");
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
  }

  const [jsonEntry, resourceEntry] = await Promise.all([
    getContentEntry("firma-scarpa", slug),
    getSectionResourceEntry("firma-scarpa", slug),
  ]);

  if (!jsonEntry && !resourceEntry) return {};

  const entry: ResolvedContentEntry | ResourceEntry = (jsonEntry ?? resourceEntry)!;

  const title = entry.title;
  const description =
    jsonEntry?.description ||
    (resourceEntry as ResourceEntry)?.description ||
    resourceEntry?.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 158) ||
    entry.title.slice(0, 158);

  const canonical = jsonEntry?.urlPath ?? `https://www.derechoartificial.com/firma-scarpa/${entry.slug}`;
  
  // Get published time for OpenGraph
  const publishedTime = jsonEntry?.datePublished || (resourceEntry as any)?.datePublished;
  
  // Get tags/keywords
  const keywords = "derecho artificial, inteligencia artificial, AI Act, RGPD, discriminación algorítmica, compliance IA, Ricardo Scarpa";
  
  // Get author information
  const authors = jsonEntry?.author ? [jsonEntry.author] : ["Ricardo Scarpa"];

  const ogImage = getHeroImage("firma-scarpa");

  return {
    title,
    description,
    keywords,
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
      publishedTime: publishedTime ? new Date(publishedTime).toISOString() : undefined,
      authors,
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

export default async function FirmaScarpaSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Intentar cargar desde MDX nativo primero
  const mdxPost = getPostBySlug(slug);
  if (mdxPost) {
    const category = (mdxPost.frontmatter.category || "").toLowerCase();
    const section = (mdxPost.frontmatter.section || "").toLowerCase();
    const categoryNormalized = category.replace(/-/g, ' ');
    const sectionNormalized = section.replace(/-/g, ' ');
    
    const isValidFirmaScarpa = (
      category === "firma-scarpa" ||
      categoryNormalized === "firma scarpa" ||
      categoryNormalized === "firma-scarpa" ||
      section === "firma-scarpa" ||
      sectionNormalized === "firma scarpa" ||
      sectionNormalized === "firma-scarpa"
    );
    
    if (isValidFirmaScarpa) {
      const { title, date, category } = mdxPost.frontmatter;
    return (
      <LegalLayout
        title={title}
        category={category === "firma-scarpa" ? "Firma Scarpa" : (category || "Firma Scarpa")}
        author={{ name: "Ricardo Scarpa", href: "/quienes-somos" }}
        date={date}
        image={getFeaturedImage(mdxPost)}
      >
        {mdxPost.frontmatter.pdf && (
          <div className="article-pdf-box mb-12">
            <a
              href={mdxPost.frontmatter.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn"
            >
              Descargar documento original
            </a>
          </div>
        )}
        <div className="mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
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
            currentCategory={mdxPost.frontmatter.category || "firma-scarpa"}
          />
        </div>
      </LegalLayout>
    );
  }
  }

  const jsonEntry = await getContentEntry("firma-scarpa", slug);
  const resourceEntry = jsonEntry ? null : await getSectionResourceEntry("firma-scarpa", slug);

  if (!jsonEntry && !resourceEntry) notFound();

  if (jsonEntry) {
    const date = new Date(jsonEntry.datePublished);
    const formattedDate = Number.isNaN(date.getTime())
      ? jsonEntry.datePublished
      : date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

    const pdfFile = PDF_MAPPING[slug];

    const jsonLd = createArticleJsonLd({
      url: jsonEntry.url,
      headline: jsonEntry.title,
      description: jsonEntry.description,
      datePublished: jsonEntry.datePublished,
      authorName: "Ricardo Scarpa",
    });

    const genericJsonLd = createGenericArticleJsonLd({
      url: jsonEntry.url,
      headline: jsonEntry.title,
      description: jsonEntry.description,
      datePublished: jsonEntry.datePublished,
      authorName: "Ricardo Scarpa",
    });

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es la discriminación algorítmica?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La discriminación algorítmica ocurre cuando un sistema de inteligencia artificial toma decisiones automatizadas que generan un trato desigual o injusto basado en características protegidas como el género, la raza, la edad o la discapacidad, a menudo debido a sesgos en los datos de entrenamiento o en el diseño del modelo."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué obligaciones tiene el AI Act respecto al sesgo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El Reglamento de IA (AI Act) impone obligaciones estrictas para los sistemas de alto riesgo, incluyendo la implementación de sistemas de gestión de riesgos, la gobernanza de datos para minimizar sesgos, documentación técnica detallada, transparencia para los usuarios y una supervisión humana efectiva para corregir posibles desviaciones algorítmicas."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué multas puede haber por incumplir el AI Act?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Las sanciones pueden ser masivas, alcanzando hasta 35 millones de euros o el 7% de la facturación global anual de la empresa por el uso de prácticas prohibidas, y hasta 15 millones de euros o el 3% por el incumplimiento de las obligaciones generales establecidas en el Reglamento."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cómo afecta el RGPD a la inteligencia artificial?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El RGPD exige que cualquier tratamiento de datos personales mediante IA cumpla con principios fundamentales como la transparencia, la licitud, la limitación de la finalidad y la minimización de datos. Además, garantiza derechos como la oposición a decisiones automatizadas y el derecho a obtener una explicación humana."
          }
        },
        {
          "@type": "Question",
          "name": "¿Es obligatorio realizar una EIPD en proyectos de IA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SÍ, es obligatoria siempre que el tratamiento de datos mediante IA entrañe un alto riesgo para los derechos y libertades de las personas, lo cual es común en sistemas de perfilado, decisiones automatizadas o tratamiento masivo de categorías especiales de datos."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué es la responsabilidad proactiva en el contexto de la IA?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La responsabilidad proactiva o 'accountability' implica que el responsable del tratamiento no solo debe cumplir con la normativa (RGPD/AI Act), sino que debe ser capaz de demostrar dicho cumplimiento mediante documentación, auditorías, evaluaciones de impacto y medidas técnicas desde el diseño."
          }
        }
      ]
    };

    const authorJsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Ricardo Scarpa",
      "jobTitle": "Abogado experto en Derecho Digital e Inteligencia Artificial",
      "url": "https://www.derechoartificial.com/quienes-somos",
      "sameAs": [
        "https://www.linkedin.com/in/ricardoscarpa",
      ],
      "affiliation": [
        {
          "@type": "Organization",
          "name": "Universidad Europea de Madrid"
        },
        {
          "@type": "Organization",
          "name": "UNED"
        },
        {
          "@type": "Organization",
          "name": "IE Business School"
        }
      ],
      "knowsAbout": [
        "Derecho Digital",
        "Inteligencia Artificial",
        "AI Act",
        "RGPD",
        "Discriminación algorítmica",
        "Compliance tecnológico",
        "Responsabilidad civil en IA"
      ],
      "description": "Abogado y académico especializado en la regulación de la inteligencia artificial, protección de datos y ética tecnológica. Profesor en UEM, UNED e IE Business School."
    };

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": jsonEntry.title,
      "description": jsonEntry.description,
      "author": { 
        "@type": "Person", 
        "name": "Ricardo Scarpa",
        "url": "https://www.derechoartificial.com/quienes-somos"
      },
      "publisher": { 
        "@type": "Organization", 
        "name": "Derecho Artificial",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.derechoartificial.com/logo-principal.png"
        }
      },
      "datePublished": jsonEntry.datePublished,
      "dateModified": jsonEntry.datePublished,
      "image": {
        "@type": "ImageObject",
        "url": "https://www.derechoartificial.com/og-default-1200x630.jpg",
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
        <StructuredData data={jsonLd} />
        <StructuredData data={genericJsonLd} />
        <StructuredData data={faqJsonLd} />
        <StructuredData data={authorJsonLd} />
        <LegalLayout
          title={jsonEntry.title}
          category="Firma Scarpa"
          date={jsonEntry.datePublished}
          image={jsonEntry.image}
          author={{
            name: "Ricardo Scarpa",
            href: "/quienes-somos",
          }}
        >
          {/* Breadcrumbs para navegación y SEO */}
          <Breadcrumbs items={[
            { label: 'Inicio', href: '/' },
            { label: 'Firma Scarpa', href: '/firma-scarpa' },
            { label: jsonEntry.title, href: `/firma-scarpa/${jsonEntry.slug}` }
          ]} />
          
          <div className="mb-10 flex items-center justify-between">
            <Button asChild variant="outline" size="sm">
              <Link href="/firma-scarpa">Volver a Firma Scarpa</Link>
            </Button>
            {pdfFile && (
              <a
                href={`/assets/docs/${pdfFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="article-pdf-btn"
              >
                Descargar documento original
              </a>
            )}
          </div>

          <p className="lead text-muted-foreground mb-8">{jsonEntry.description}</p>

          <div dangerouslySetInnerHTML={{ __html: jsonEntry.html }} />

          {pdfFile && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-xl font-semibold mb-4">Documentación Original</h3>
            <a
              href={`/assets/docs/${pdfFile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="m9 15 3 3 3-3" />
              </svg>
              Descargar documento original
            </a>
            </div>
          )}

          {/* Artículos relacionados */}
          <RelatedArticles currentSlug={slug} />
        </LegalLayout>
      </>
    );
  }

  const entry = resourceEntry as ResourceEntry;

  const url = `https://www.derechoartificial.com/firma-scarpa/${entry.slug}`;
  const description =
    entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) || entry.title;

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
      "url": "https://www.derechoartificial.com/quienes-somos"
    },
    "publisher": { 
      "@type": "Organization", 
      "name": "Derecho Artificial",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.derechoartificial.com/logo-principal.png"
      }
    },
    "datePublished": postDate,
    "dateModified": (entry as any).updatedAt || postDate,
    "image": {
      "@type": "ImageObject",
      "url": "https://www.derechoartificial.com/og-default-1200x630.jpg",
      "width": 1200,
      "height": 630
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  const jsonLd = createArticleJsonLd({
    url,
    headline: entry.title,
    description,
    datePublished: new Date().toISOString().slice(0, 10),
    authorName: "Ricardo Scarpa",
  });

  const genericJsonLd = createGenericArticleJsonLd({
    url,
    headline: entry.title,
    description,
    datePublished: new Date().toISOString().slice(0, 10),
    authorName: "Ricardo Scarpa",
  });

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es la discriminación algorítmica?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La discriminación algorítmica ocurre cuando un sistema de inteligencia artificial toma decisiones automatizadas que generan un trato desigual o injusto basado en características protegidas como el género, la raza, la edad o la discapacidad, a menudo debido a sesgos en los datos de entrenamiento o en el diseño del modelo."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué obligaciones tiene el AI Act respecto al sesgo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El Reglamento de IA (AI Act) impone obligaciones estrictas para los sistemas de alto riesgo, incluyendo la implementación de sistemas de gestión de riesgos, la gobernanza de datos para minimizar sesgos, documentación técnica detallada, transparencia para los usuarios y una supervisión humana efectiva para corregir posibles desviaciones algorítmicas."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué multas puede haber por incumplir el AI Act?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Las sanciones pueden ser masivas, alcanzando hasta 35 millones de euros o el 7% de la facturación global anual de la empresa por el uso de prácticas prohibidas, y hasta 15 millones de euros o el 3% por el incumplimiento de las obligaciones generales establecidas en el Reglamento."
          }
        }
      ]
    };

  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Ricardo Scarpa",
    "jobTitle": "Abogado experto en Derecho Digital e Inteligencia Artificial",
    "url": "https://www.derechoartificial.com/quienes-somos",
    "sameAs": [
        "https://www.linkedin.com/in/ricardoscarpa",
      ],
    "affiliation": [
      {
        "@type": "Organization",
        "name": "Universidad Europea de Madrid"
      },
      {
        "@type": "Organization",
        "name": "UNED"
      },
      {
        "@type": "Organization",
        "name": "IE Business School"
      }
    ],
    "knowsAbout": [
      "Derecho Digital",
      "Inteligencia Artificial",
      "AI Act",
      "RGPD",
      "Discriminación algorítmica",
      "Compliance tecnológico",
      "Responsabilidad civil en IA"
    ],
    "description": "Abogado y académico especializado en la regulación de la inteligencia artificial, protección de datos y ética tecnológica. Profesor en UEM, UNED e IE Business School."
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <StructuredData data={jsonLd} />
      <StructuredData data={genericJsonLd} />
      <StructuredData data={faqJsonLd} />
      <StructuredData data={authorJsonLd} />
      <LegalLayout
        title={entry.title}
        category="Firma Scarpa"
        author={{
          name: "Ricardo Scarpa",
          href: "/quienes-somos",
        }}
      >
        {/* Breadcrumbs para navegación y SEO */}
        <Breadcrumbs items={[
          { label: 'Inicio', href: '/' },
          { label: 'Firma Scarpa', href: '/firma-scarpa' },
          { label: entry.title, href: `/firma-scarpa/${entry.slug}` }
        ]} />

        <div className="mb-10 flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href="/firma-scarpa">Volver a Firma Scarpa</Link>
          </Button>
          {entry.sourceUrl && (
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn"
            >
              Descargar documento original
            </a>
          )}
        </div>

        {entry.summaryHtml && (
          <p className="lead text-muted-foreground mb-8">
            {entry.summaryHtml.replace(/<[^>]+>/g, "")}
          </p>
        )}

        {entry.bodyHtml && <div dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />}

        {entry.sourceUrl && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-xl font-semibold mb-4">
              Documentación Original
            </h3>
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M12 18v-6" />
                <path d="m9 15 3 3 3-3" />
              </svg>
              Descargar documento original
            </a>
          </div>
        )}

        {/* Artículos relacionados */}
        <RelatedArticles 
          currentSlug={slug} 
          currentCategory="firma-scarpa"
          currentTags={slug === "caso-itutorgroup" ? ["#Discriminación", "#Algoritmos", "#FirmaScarpa"] : slug === "tsj-canarias-ia" ? ["#Jurisprudencia", "#Abogacía", "#IA"] : []}
        />
      </LegalLayout>
    </>
  );
}
