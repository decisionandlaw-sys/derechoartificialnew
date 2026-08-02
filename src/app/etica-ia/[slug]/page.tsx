import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/layout/LegalLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  StructuredData,
  createArticleJsonLd,
  createGenericArticleJsonLd,
} from "@/components/seo/StructuredData";
import { RelatedArticles } from "@/components/RelatedArticles";
import { getPostBySlug, getAllPosts, getHeroImage, getFeaturedImage } from "@/lib/mdx-utils";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { WatermarkedImage } from "@/components/ui/WatermarkedImage";

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const mdxPosts = getAllPosts().filter(
    (p) => (p.frontmatter.category || "").toLowerCase() === "etica-ia" || (p.frontmatter.section || "").toLowerCase() === "etica-ia",
  );
  return mdxPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mdxPost = getPostBySlug(slug);

  if (!mdxPost || (mdxPost.frontmatter.category || "").toLowerCase() !== "etica-ia" && (mdxPost.frontmatter.section || "").toLowerCase() !== "etica-ia") {
    return {};
  }

  const { title, description, category, date } = mdxPost.frontmatter;
  const canonical = mdxPost.frontmatter.canonical ?? `https://derechoartificial.com/${category}/${slug}`;
  const metaDescription =
    mdxPost.excerpt ||
    description ||
    "Análisis sobre ética de la inteligencia artificial, seguridad de modelos y responsabilidad profesional.";

    const ogImage = getHeroImage("etica-ia");
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
        images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        publishedTime: date ? new Date(date).toISOString() : undefined,
        authors: [mdxPost.frontmatter.author || "Ricardo Scarpa"],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: metaDescription,
        images: [ogImage],
      }
    };
}

export default async function EticaIASlugPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const mdxPost = getPostBySlug(slug);

  if (!mdxPost || (mdxPost.frontmatter.category || "").toLowerCase() !== "etica-ia" && (mdxPost.frontmatter.section || "").toLowerCase() !== "etica-ia") {
    notFound();
  }

  const { title, date, category, pdf, author } = mdxPost.frontmatter;

  const jsonLd = createArticleJsonLd({
    url: `https://derechoartificial.com/${category}/${slug}`,
    headline: title,
    description: mdxPost.excerpt,
    datePublished: date,
    authorName: author || "Ricardo Scarpa",
  });

  const genericJsonLd = createGenericArticleJsonLd({
    url: `https://derechoartificial.com/${category}/${slug}`,
    headline: title,
    description: mdxPost.excerpt,
    datePublished: date,
    authorName: author || "Ricardo Scarpa",
  });

  return (
    <>
      <StructuredData data={jsonLd} />
      <StructuredData data={genericJsonLd} />
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Ética IA", href: "/etica-ia" },
          { label: title, href: `/${category}/${slug}` },
        ]}
      />
      <LegalLayout
        title={title}
        category="Ética IA"
        author={{ name: author || "Ricardo Scarpa", href: "/quienes-somos" }}
        date={date}
        image={getFeaturedImage(mdxPost)}
      >
        {pdf && (
          <div className="article-pdf-box mb-12">
            <a
              href={pdf}
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
            currentCategory={mdxPost.frontmatter.category || "etica-ia"}
          />
        </div>
      </LegalLayout>
    </>
  );
}
