import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from '@/lib/mdx-utils';

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Regulación IA: AI Act, RGPD y compliance",
  description:
    "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
  keywords: [
    "derecho artificial",
    "inteligencia artificial",
    "regulación IA",
    "AI Act",
    "RGPD",
    "jurisprudencia",
    "cumplimiento",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    title: "Regulación IA: AI Act, RGPD y compliance",
    description:
      "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
    url: "https://derechoartificial.com",
    siteName: "Derecho Artificial",
    locale: "es_ES",
    images: [
      {
        url: "/logo-principal.png",
        width: 1200,
        height: 630,
        alt: "Derecho Artificial - Perspectivas Legales sobre IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regulación IA: AI Act, RGPD y compliance",
    description:
      "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
    images: ["/logo-principal.png"],
    creator: "@RicardoScarpa",
  },
};

export default function HomePage() {
  const allPosts = getAllPosts();

  const formatDate = (value: number) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const toEntry = (p: typeof allPosts[number]) => ({
    title: p.title,
    description: p.excerpt,
    date: p.dateMs,
    urlPath: p.url,
    author: p.frontmatter.author || "Derecho Artificial",
  });

  const allEntries = allPosts.map(toEntry).sort((a, b) => b.date - a.date);

  const featuredEntry = allEntries[0] ?? null;

  const sectionDefs = [
    { key: "firma-scarpa", label: "Firma Scarpa", href: "/firma-scarpa", image: "/images/sections/firma-scarpa.jpg", route: "firma-scarpa" },
    { key: "normativa", label: "Normativa", href: "/normativa", image: "/images/sections/normativa.jpg", route: "normativa" },
    { key: "jurisprudencia", label: "Jurisprudencia", href: "/jurisprudencia", image: "/images/sections/jurisprudencia.jpg", route: "jurisprudencia" },
    { key: "guias", label: "Guías y Protocolos", href: "/guias-ia", image: "/images/sections/guias-ia.jpg", route: "guias-ia" },
    { key: "etica-ia", label: "Ética IA", href: "/etica-ia", image: "/images/sections/etica-ia.jpg", route: "etica-ia" },
    { key: "propiedad-intelectual-ia", label: "Propiedad Intelectual", href: "/propiedad-intelectual-ia", image: "/images/sections/propiedad-intelectual.jpg", route: "propiedad-intelectual-ia" },
    { key: "global-ia", label: "Global IA", href: "/global-ia", image: "/images/sections/global-ia.jpg", route: "global-ia" },
  ];

  const contentSections = sectionDefs
    .map(cfg => ({
      ...cfg,
      entries: allPosts
        .filter(p => p.url.startsWith(`/${cfg.route}/`))
        .sort((a, b) => b.dateMs - a.dateMs)
        .map(toEntry),
    }))
    .filter(s => s.entries.length > 0)
    .sort((a, b) => b.entries[0].date - a.entries[0].date);

  return (
    <>
      <main>
        <section className="border-b border-divider/50">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row gap-6 py-8 md:py-12">
              <div className="md:flex-[0_0_67%] aspect-[2.29/1] relative overflow-hidden bg-muted">
                {featuredEntry && (
                  <Link href={featuredEntry.urlPath} className="group block w-full h-full">
                    <Image
                      src="/images/hero-home.jpg"
                      alt=""
                      fill
                      className="object-cover"
                      priority
                    />
                  </Link>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                {featuredEntry && (
                  <>
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-caption mb-3">
                        Destacado
                      </div>
                      <Link href={featuredEntry.urlPath} className="group block">
                        <h1 className="font-display font-black text-[clamp(1.5rem,3.5vw,3rem)] leading-[0.9] tracking-[-0.03em] text-foreground">
                          {featuredEntry.title}
                          <span className="inline-flex ml-3 text-foreground/60 group-hover:text-foreground transition-all duration-200 go-icon">→</span>
                        </h1>
                      </Link>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-caption pt-4 mt-4 border-t border-divider/20">
                      <span>{featuredEntry.author}</span>
                      <span>·</span>
                      <span>{formatDate(featuredEntry.date)}</span>
                    </div>
                  </>
                )}
                {!featuredEntry && (
                  <div className="flex items-center justify-center h-full text-caption">
                    <p className="text-sm">Próximamente contenido</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {contentSections.map((sec) => (
          <section key={sec.key}>
            <div className="container-wide">
              <div className="flex items-center justify-between py-4 border-b border-divider/30">
                <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground">
                  {sec.label}
                </h2>
                <Link href={sec.href} className="text-xs text-caption hover:text-foreground transition-colors">
                  Ver todas <span className="go-icon">→</span>
                </Link>
              </div>

              <div className="flex flex-col md:flex-row gap-6 py-6">
                <div className="md:flex-[0_0_67%] aspect-[2.29/1] relative overflow-hidden bg-muted">
                  <Link href={sec.entries[0].urlPath} className="group block w-full h-full">
                    <Image src={sec.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 67vw" />
                  </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={sec.entries[0].urlPath} className="group block">
                      <h3 className="font-display font-black text-[clamp(1.2rem,2.5vw,2rem)] leading-[0.9] tracking-[-0.03em] text-foreground">
                        {sec.entries[0].title}
                        <span className="inline-flex ml-2 text-foreground/40 group-hover:text-foreground transition-all duration-200 go-icon">→</span>
                      </h3>
                      <p className="text-xs text-body leading-relaxed line-clamp-3 mt-3">
                        {sec.entries[0].description}
                      </p>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-caption pt-4 mt-4 border-t border-divider/20">
                    <span>{sec.entries[0].author}</span>
                    <span>·</span>
                    <span>{formatDate(sec.entries[0].date)}</span>
                  </div>
                </div>
              </div>

              {sec.entries.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-divider/30">
                  {sec.entries.slice(1, 7).map((entry, i) => (
                    <div key={`${sec.key}-g-${i}`} className={`relative p-5 md:p-6 border-t border-divider/20 ${i % 3 !== 0 ? 'md:border-l border-divider/20' : ''}`}>
                      <Link href={entry.urlPath} className="group block">
                        <h4 className="font-display font-bold text-lg tracking-tight leading-[0.95] text-foreground mb-3 pr-6 relative">
                          {entry.title}
                          <span className="absolute right-0 top-1 text-foreground/40 group-hover:text-foreground transition-all duration-200 go-icon text-sm">→</span>
                        </h4>
                        <p className="text-xs text-body leading-relaxed line-clamp-3">
                          {entry.description}
                        </p>
                      </Link>
                      <div className="text-[11px] text-caption mt-3">
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}


