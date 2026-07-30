import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from '@/lib/mdx-utils';

export const revalidate = 60;

export const metadata: Metadata = {
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

const sectionMeta: Record<string, { label: string; href: string; image: string }> = {
  "firma-scarpa":             { label: "Firma Scarpa",             href: "/firma-scarpa",             image: "/images/sections/firma-scarpa.jpg" },
  normativa:                  { label: "Normativa",                href: "/normativa",                image: "/images/sections/normativa.jpg" },
  jurisprudencia:             { label: "Jurisprudencia",           href: "/jurisprudencia",           image: "/images/sections/jurisprudencia.jpg" },
  "guias-ia":                 { label: "Guías y Protocolos",       href: "/guias-ia",                 image: "/images/sections/guias-ia.jpg" },
  "etica-ia":                 { label: "Ética IA",                 href: "/etica-ia",                 image: "/images/sections/etica-ia.jpg" },
  "propiedad-intelectual-ia": { label: "Propiedad Intelectual",    href: "/propiedad-intelectual-ia", image: "/images/sections/propiedad-intelectual.jpg" },
  "global-ia":                { label: "Global IA",                href: "/global-ia",                image: "/images/sections/global-ia.jpg" },
};

function formatDate(value: string | number): string {
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

export default function HomePage() {
  const posts = getAllPosts();

  const sectionGroups = Object.entries(sectionMeta)
    .map(([route, meta]) => ({
      ...meta,
      key: route,
      entries: posts
        .filter(p => p.url.startsWith(`/${route}/`))
        .sort((a, b) => b.dateMs - a.dateMs),
    }))
    .filter(s => s.entries.length > 0)
    .sort((a, b) => b.entries[0].dateMs - a.entries[0].dateMs);

  const featured = posts
    .sort((a, b) => b.dateMs - a.dateMs)
    .slice(0, 1);

  return (
    <main>
      {/* Hero / Featured post */}
      {featured.length > 0 && (
        <section className="border-b border-[hsl(var(--divider))]">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row gap-8 py-10 md:py-16">
              <div className="md:flex-[0_0_67%] aspect-[2.29/1] relative overflow-hidden bg-[hsl(var(--muted))]">
                <Link href={featured[0].url} className="group block w-full h-full">
                  <Image
                    src="/images/hero-home.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                  />
                </Link>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--text-caption))] mb-4">
                    Destacado
                  </div>
                  <Link href={featured[0].url} className="group block">
                    <h1 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.03em] text-[hsl(var(--foreground))]">
                      {featured[0].title}
                      <span className="inline-flex ml-3 text-[hsl(var(--foreground)/0.4)] group-hover:text-[hsl(var(--foreground))] transition-all duration-200 go-icon">→</span>
                    </h1>
                  </Link>
                  {featured[0].excerpt && (
                    <p className="text-sm md:text-base text-[hsl(var(--text-body))] leading-relaxed mt-4 line-clamp-3">
                      {featured[0].excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-[hsl(var(--text-caption))] pt-5 mt-5 border-t border-[hsl(var(--divider)/0.3)]">
                  <span>{featured[0].frontmatter.author || "Derecho Artificial"}</span>
                  <span>·</span>
                  <span>{formatDate(featured[0].dateMs)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section blocks */}
      {sectionGroups.map((sec) => (
        <section key={sec.key}>
          <div className="container-wide">
            <div className="flex items-center justify-between py-5 border-b border-[hsl(var(--divider)/0.4)]">
              <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-[hsl(var(--foreground))]">
                {sec.label}
              </h2>
              <Link href={sec.href} className="text-xs text-[hsl(var(--text-caption))] hover:text-[hsl(var(--foreground))] transition-colors">
                Ver todas <span className="go-icon">→</span>
              </Link>
            </div>

            {/* Featured entry of section */}
            <div className="flex flex-col md:flex-row gap-8 py-8">
              <div className="md:flex-[0_0_67%] aspect-[2.29/1] relative overflow-hidden bg-[hsl(var(--muted))]">
                <Link href={sec.entries[0].url} className="group block w-full h-full">
                  <Image src={sec.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 67vw" />
                </Link>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link href={sec.entries[0].url} className="group block">
                    <h3 className="font-display font-black text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[0.9] tracking-[-0.03em] text-[hsl(var(--foreground))]">
                      {sec.entries[0].title}
                      <span className="inline-flex ml-2 text-[hsl(var(--foreground)/0.4)] group-hover:text-[hsl(var(--foreground))] transition-all duration-200 go-icon">→</span>
                    </h3>
                    {sec.entries[0].excerpt && (
                      <p className="text-sm md:text-base text-[hsl(var(--text-body))] leading-relaxed mt-3 line-clamp-3">
                        {sec.entries[0].excerpt}
                      </p>
                    )}
                  </Link>
                </div>
                <div className="flex items-center gap-3 text-xs text-[hsl(var(--text-caption))] pt-4 mt-4 border-t border-[hsl(var(--divider)/0.3)]">
                  <span>{sec.entries[0].frontmatter.author || "Derecho Artificial"}</span>
                  <span>·</span>
                  <span>{formatDate(sec.entries[0].dateMs)}</span>
                </div>
              </div>
            </div>

            {/* Grid of remaining entries */}
            {sec.entries.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[hsl(var(--divider)/0.4)]">
                {sec.entries.slice(1, 7).map((entry, i) => (
                  <div
                    key={`${sec.key}-${entry.slug}`}
                    className={`relative p-6 md:p-8 border-t border-[hsl(var(--divider)/0.2)] ${i % 3 !== 0 ? "md:border-l border-[hsl(var(--divider)/0.2)]" : ""}`}
                  >
                    <Link href={entry.url} className="group block">
                      <h4 className="font-display font-bold text-xl md:text-2xl tracking-tight leading-[0.95] text-[hsl(var(--foreground))] mb-3 pr-8 relative">
                        {entry.title}
                        <span className="absolute right-0 top-1 text-[hsl(var(--foreground)/0.4)] group-hover:text-[hsl(var(--foreground))] transition-all duration-200 go-icon text-base">→</span>
                      </h4>
                      {entry.excerpt && (
                        <p className="text-sm text-[hsl(var(--text-body))] leading-relaxed line-clamp-3">
                          {entry.excerpt}
                        </p>
                      )}
                    </Link>
                    <div className="text-xs text-[hsl(var(--text-caption))] mt-3">
                      {formatDate(entry.dateMs)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
