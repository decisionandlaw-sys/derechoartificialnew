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

export const metadata: Metadata = {
  title: "Análisis Jurídico de la Ley Italiana 132/2025 sobre Inteligencia Artificial",
  description: "Estudio comprehensivo de la Ley italiana 23 septiembre 2025 n. 132 en materia de IA con análisis de gobernanza, transparencia, regulación sectorial y responsabilidad.",
  keywords: [
    "Ley italiana IA",
    "AI Act",
    "regulación inteligencia artificial",
    "gobernanza IA",
    "derecho digital",
    "Ley 132/2025",
    "Italia IA",
  ],
  alternates: {
    canonical: "/normativa/ley-ia-italiana-analisis",
    languages: {
      "es-ES": "/normativa/ley-ia-italiana-analisis",
      "en-US": "https://decisionandlaw.com/",
    },
  },
  openGraph: {
    type: "article",
    title: "Análisis Jurídico de la Ley Italiana 132/2025 sobre Inteligencia Artificial",
    description: "Estudio comprehensivo de la Ley italiana 23 septiembre 2025 n. 132 en materia de IA con análisis de gobernanza, transparencia, regulación sectorial y responsabilidad.",
    url: "/normativa/ley-ia-italiana-analisis",
    locale: "es_ES",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

export default async function LeyIAItalianaPage() {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === "ley-ia-italiana-analisis");
  
  if (!post) {
    return <div>Post no encontrado</div>;
  }

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://www.derechoartificial.com",
      },
      {
        name: "Normativa",
        url: "https://www.derechoartificial.com/normativa",
      },
      {
        name: "Ley Italiana IA",
        url: "https://www.derechoartificial.com/normativa/ley-ia-italiana-analisis",
      },
    ],
  });

  const pdfUrl = "/fuentes/ley-ia-italiana-analisis.pdf";

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <LegalLayout
        title={post.frontmatter.title}
        category="Normativa"
        author={{ name: "Ricardo Scarpa", href: "/quienes-somos" }}
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
                Accede al análisis completo en formato PDF con todas las referencias bibliográficas y notas jurídicas.
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
                LEY
              </Link>
            </div>
          </div>
        </div>

        {/* Metadatos del artículo */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>📅 {new Date(post.frontmatter.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>📝 {post.frontmatter.author || 'Ricardo Scarpa'}</span>
          <span>🏷️ {post.frontmatter.category}</span>
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

        {/* Contenido del artículo */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, { schema: sanitizeSchema }]]}
            components={{
              img: (props: any) => <WatermarkedImage {...props} loading="lazy" decoding="async" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <RelatedArticles
            currentSlug={post.slug}
            currentTags={post.frontmatter.keywords || []}
            currentCategory={post.frontmatter.category || "normativa"}
          />
        </div>
      </LegalLayout>
    </>
  );
}
