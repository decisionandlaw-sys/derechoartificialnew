import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { getAllPosts } from "@/lib/mdx-utils";
import { LegalLayout } from "@/components/layout/LegalLayout";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { defaultSchema } from 'hast-util-sanitize';
import { RelatedArticles } from "@/components/RelatedArticles";

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

export const metadata: Metadata = {
  title: "DMA Review: Análisis de la Consulta sobre IA y Gatekeepers - Primera Revisión de la Ley de Mercados Digitales",
  description: "Análisis jurídico exhaustivo de la Consulta sobre Revisión del DMA (Digital Markets Act) de la UE con enfoque en IA, modelos de lenguaje, interoperabilidad, self-preferencing, acceso a datos, servicios cloud y gobernanza de plataformas.",
  keywords: [
    "DMA Review",
    "Digital Markets Act",
    "IA y Competencia",
    "Gatekeepers",
    "Interoperabilidad IA",
    "LLM Regulation",
    "Mercados Digitales UE",
    "Self-preferencing IA",
  ],
  alternates: {
    canonical: "/normativa/dma_review_ia_analisis",
    languages: {
      "es-ES": "/normativa/dma_review_ia_analisis",
      "en-US": "https://decisionandlaw.com/",
    },
  },
  openGraph: {
    type: "article",
    title: "DMA Review: Análisis de la Consulta sobre IA y Gatekeepers - Primera Revisión de la Ley de Mercados Digitales",
    description: "Análisis jurídico exhaustivo de la Consulta sobre Revisión del DMA de la UE con enfoque en IA, modelos de lenguaje, interoperabilidad, self-preferencing y gobernanza de plataformas.",
    url: "/normativa/dma_review_ia_analisis",
    locale: "es_ES",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

export default async function DMAReviewIAPage() {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === "dma_review_ia_analisis");
  
  if (!post) {
    return <div>Post no encontrado</div>;
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Normativa",
        url: "https://derechoartificial.com/normativa",
      },
      {
        name: "DMA Review IA",
        url: "https://derechoartificial.com/normativa/dma_review_ia_analisis",
      },
    ],
  });

  const pdfUrl = "/fuentes/dma_review_ia_analisis.pdf";

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <LegalLayout
        title={post.frontmatter.title}
        category="Normativa IA"
        author={{ name: "Análisis Jurídico", href: "/quienes-somos" }}
        date={post.frontmatter.date}
      >
        {/* Recuadro de descarga del PDF */}
        <div className="article-pdf-box mb-12">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <svg
                className="h-8 w-8 text-body"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg text-foreground mb-1 tracking-tight">Documento Original</h3>
              <p className="text-sm text-body mb-3 leading-relaxed">
                Accede al análisis completo en formato PDF con todas las contribuciones a la consulta DMA Review, análisis de IA y gatekeepers, modelos de lenguaje, interoperabilidad, self-preferencing, y gobernanza de plataformas digitales.
              </p>
              <Link
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="article-pdf-btn gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                DOCUMENTO
              </Link>
            </div>
          </div>
        </div>

        {/* Metadatos del artículo */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>📅 {new Date(post.frontmatter.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>📝 {post.frontmatter.author || 'Análisis Jurídico'}</span>
          <span>🏷️ {post.frontmatter.category}</span>
          {post.frontmatter.lastmod && (
            <span>🔄 Actualizado: {new Date(post.frontmatter.lastmod).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          )}
        </div>

        {/* Palabras clave */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {post.frontmatter.keywords?.map((keyword: string) => (
              <span
                key={keyword}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        {post.frontmatter.tags && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contenido del artículo */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, { schema: sanitizeSchema }]]}
            components={{
              img: (props: any) => <img {...props} loading="lazy" decoding="async" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <RelatedArticles
            currentSlug={post.slug}
            currentTags={post.frontmatter.tags || []}
            currentCategory={post.frontmatter.category || "normativa"}
          />
        </div>
      </LegalLayout>
    </>
  );
}
