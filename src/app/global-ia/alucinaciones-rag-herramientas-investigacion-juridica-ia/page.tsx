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
  title: "Alucinaciones en herramientas de investigación jurídica con IA: el fracaso del RAG y sus implicaciones legales",
  description: "Analisis juridico del estudio Stanford (JELS 2025) sobre tasas de alucinacion en Lexis+ AI, Westlaw y Ask Practical Law AI. Consecuencias para la responsabilidad profesional del abogado bajo el Reglamento de IA, RGPD y el deber deontologico de supervision.",
  keywords: [
    "alucinaciones IA investigación jurídica",
    "RAG legal hallucination",
    "Westlaw IA alucinaciones",
    "LexisNexis Lexis+ AI fiabilidad",
    "responsabilidad abogado inteligencia artificial",
    "Reglamento IA herramientas jurídicas",
    "RGPD decisiones automatizadas",
    "deber supervisión abogado IA",
    "Stanford Legal AI benchmark",
    "herramientas IA despachos abogados",
  ],
  alternates: {
    canonical: "/global-ia/alucinaciones-rag-herramientas-investigacion-juridica-ia",
    languages: {
      "es-ES": "/global-ia/alucinaciones-rag-herramientas-investigacion-juridica-ia",
      "en-US": "/en/global-ai/rag-hallucinations-legal-research-tools",
    },
  },
  openGraph: {
    type: "article",
    title: "Alucinaciones en herramientas de investigación jurídica con IA: el fracaso del RAG y sus implicaciones legales",
    description: "Analisis juridico del estudio Stanford sobre tasas de alucinacion en Lexis+ AI, Westlaw y Ask Practical Law AI. Consecuencias para la responsabilidad profesional del abogado bajo el Reglamento de IA.",
    url: "/global-ia/alucinaciones-rag-herramientas-investigacion-juridica-ia",
    locale: "es_ES",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

export default async function AlucinacionesRAGPage() {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === "alucinaciones-rag-herramientas-investigacion-juridica-ia");
  
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
        name: "Global IA",
        url: "https://derechoartificial.com/global-ia",
      },
      {
        name: "Alucinaciones RAG",
        url: "https://derechoartificial.com/global-ia/alucinaciones-rag-herramientas-investigacion-juridica-ia",
      },
    ],
  });

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <LegalLayout
        title={post.frontmatter.title}
        category="Global IA"
        author={{ name: "Derecho Artificial", href: "/quienes-somos" }}
        date={post.frontmatter.date}
      >
        {/* Metadatos del artículo */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>📅 {new Date(post.frontmatter.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>📝 {post.frontmatter.authors?.[0] || 'Derecho Artificial'}</span>
          <span>🏷️ {post.frontmatter.category}</span>
          {post.frontmatter.readingTime && (
            <span>⏱️ {post.frontmatter.readingTime} min</span>
          )}
          {post.frontmatter.lastModified && (
            <span>🔄 Actualizado: {new Date(post.frontmatter.lastModified).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          )}
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
            currentCategory={post.frontmatter.category || "global-ia"}
          />
        </div>
      </LegalLayout>
    </>
  );
}
