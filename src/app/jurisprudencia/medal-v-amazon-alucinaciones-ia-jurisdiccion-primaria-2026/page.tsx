import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Análisis Jurídico - Derecho Artificial",
  description: "Análisis exhaustivo de jurisprudencia y normativa en inteligencia artificial",
  alternates: {
    canonical: "/jurisprudencia/medal-v-amazon-alucinaciones-ia-jurisdiccion-primaria-2026",
  },
};

export default async function PostPage() {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === "medal-v-amazon-alucinaciones-ia-jurisdiccion-primaria-2026");
  
  if (!post) {
    return <div>Post no encontrado</div>;
  }

  return (
    <>
      <LegalLayout
        title={post.frontmatter.title}
        category="Jurisprudencia IA"
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
            currentCategory={post.frontmatter.category || "Jurisprudencia IA"}
          />
        </div>
      </LegalLayout>
    </>
  );
}