import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getFeaturedImage, type PostData } from '@/lib/mdx-utils';
import { PostImage } from "@/components/ui/PostImage";

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL("https://derechoartificial.com"),
  title: "Regulación IA: AI Act, RGPD y compliance",
  description:
    "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Regulación IA: AI Act, RGPD y compliance",
    description: "Domina el AI Act, el RGPD y la jurisprudencia IA.",
    siteName: "Derecho Artificial",
    locale: "es_ES",
  },
};

const SECTIONS = [
  { route: "firma-scarpa",             label: "Firma Scarpa",             href: "/firma-scarpa" },
  { route: "normativa",                label: "Normativa IA",             href: "/normativa" },
  { route: "jurisprudencia",           label: "Jurisprudencia IA",        href: "/jurisprudencia" },
  { route: "guias-ia",                 label: "Guías IA",                 href: "/guias-ia" },
  { route: "propiedad-intelectual-ia", label: "Propiedad Intelectual IA", href: "/propiedad-intelectual-ia" },
  { route: "etica-ia",                 label: "Ética IA",                 href: "/etica-ia" },
  { route: "global-ia",                label: "IA Global",                href: "/global-ia" },
];

function formatDate(value: string | number): string {
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

function sectionLabelForUrl(url: string): string {
  for (const s of SECTIONS) {
    if (url.startsWith(`/${s.route}/`)) return s.label;
  }
  return "";
}

function FeaturedPost({ post, showKicker = true }: { post: PostData; showKicker?: boolean }) {
  const image = getFeaturedImage(post);
  return (
    <Link href={post.url} className="group block">
      {image && (
        <PostImage
          src={image}
          alt={post.frontmatter.title}
          sizes="(min-width: 1280px) 1216px, 100vw"
          aspectClassName="aspect-[16/9] md:aspect-[16/7]"
        />
      )}
      <div className="mt-5 md:mt-6 max-w-3xl">
        {showKicker && (
          <span className="font-display text-[11px] tracking-[0.15em] text-newsroom block mb-2">
            {sectionLabelForUrl(post.url).toUpperCase()}
          </span>
        )}
        <h3 className="font-display font-bold text-[clamp(1.5rem,3vw,2.5rem)] leading-[0.95] tracking-tight text-foreground">
          {post.frontmatter.title}
        </h3>
        <span className="text-[11px] text-[hsl(var(--text-caption))] mt-3 block">
          {formatDate(post.dateMs)}
        </span>
      </div>
    </Link>
  );
}

function CompactItem({ post, showKicker = true }: { post: PostData; showKicker?: boolean }) {
  const image = getFeaturedImage(post);
  return (
    <Link
      href={post.url}
      className="group flex items-start justify-between gap-4 p-5 md:p-6 border border-[hsl(var(--divider)/0.5)] hover:bg-[hsl(var(--highlight))] transition-colors"
    >
      <div className="min-w-0 flex-1">
        {showKicker && (
          <span className="font-display text-[11px] tracking-[0.15em] text-newsroom block mb-1.5">
            {sectionLabelForUrl(post.url).toUpperCase()}
          </span>
        )}
        <h4 className="font-display text-lg md:text-xl leading-[0.95] tracking-tight font-bold text-foreground">
          {post.frontmatter.title}
        </h4>
        <span className="text-[11px] text-[hsl(var(--text-caption))] mt-2 block">
          {formatDate(post.dateMs)}
        </span>
      </div>
      {image && (
        <PostImage
          src={image}
          alt={post.frontmatter.title}
          sizes="96px"
          aspectClassName="w-16 h-16 md:w-20 md:h-20"
          className="shrink-0 mt-1 hidden sm:block"
          watermark={false}
        />
      )}
    </Link>
  );
}

export default function HomePage() {
  const posts = getAllPosts();
  const sorted = [...posts].sort((a, b) => b.dateMs - a.dateMs);

  const sectionGroups = SECTIONS.map(s => ({
    ...s,
    entries: posts.filter(p => p.url.startsWith(`/${s.route}/`)).sort((a, b) => b.dateMs - a.dateMs),
  })).filter(s => s.entries.length > 0);

  const [featured, ...rest] = sorted;

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[hsl(var(--divider))]">
        <Image
          src="/images/hero-derecho-artificial.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <img
          src="/badges/human-machine.webp"
          alt=""
          aria-hidden="true"
          className="hm-badge"
          loading="lazy"
          decoding="async"
        />
        <div aria-hidden className="absolute inset-0 bg-black/30" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="relative container-wide py-16 md:py-24 lg:py-28">
          <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] tracking-[-0.04em] text-foreground">
            Derecho<br />Artificial
          </h1>
          <p className="font-display text-lg md:text-xl leading-[1.2] tracking-[-0.02em] text-foreground mt-5 max-w-md md:max-w-none">
            Derecho, ética y regulación de la IA
          </p>
        </div>
      </section>

      <section className="border-b border-[hsl(var(--divider))]">
        <div className="container-wide py-12 md:py-16">
          <h2 className="font-display font-bold text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight text-foreground mb-8">
            Últimos análisis
          </h2>
          {featured && <FeaturedPost post={featured} />}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
              {rest.slice(0, 4).map((post) => (
                <CompactItem key={post.url} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="secciones">
        <div className="container-wide py-12 md:py-16">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display font-bold text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight text-foreground">
              Últimas novedades por sección
            </h2>
            <p className="text-sm md:text-base text-foreground/85 leading-relaxed mt-3">
              Explora nuestros últimos briefings, ensayos y actualizaciones. Selección editorial para aportar criterio técnico y jurídico.
            </p>
          </div>

          <div className="flex flex-col gap-10 md:gap-12">
            {sectionGroups.map((sec, secIdx) => (
              <div key={sec.route} className="border border-[hsl(var(--divider)/0.5)]">
                <div className="h-[3px] bg-newsroom" />
                <div className="relative overflow-hidden bg-[hsl(var(--muted))] border-b border-[hsl(var(--divider)/0.3)]">
                  <span className="absolute top-3 right-5 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.85] tracking-[-0.08em] text-foreground/30 select-none pointer-events-none">
                    {String(secIdx + 1).padStart(2, "0")}
                  </span>
                  <Link href={sec.href} className="block px-5 md:px-6 py-5 md:py-6">
                    <span className="font-display text-[11px] tracking-[0.2em] text-newsroom">
                      {sec.label.toUpperCase()}
                    </span>
                  </Link>
                </div>

                <div className="p-5 md:p-6">
                  <FeaturedPost post={sec.entries[0]} showKicker={false} />
                  {sec.entries.length > 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                      {sec.entries.slice(1, 3).map((entry) => (
                        <CompactItem key={entry.url} post={entry} showKicker={false} />
                      ))}
                    </div>
                  )}
                </div>

                <Link href={sec.href} className="block p-5 md:p-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-newsroom hover:bg-[hsl(var(--highlight))] transition-colors border-t border-[hsl(var(--divider)/0.3)]">
                  Ver todas <span className="go-icon">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
