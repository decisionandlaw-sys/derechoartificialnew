import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from '@/lib/mdx-utils';

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

export default function HomePage() {
  const posts = getAllPosts();

  const sectionGroups = SECTIONS.map(s => ({
    ...s,
    entries: posts.filter(p => p.url.startsWith(`/${s.route}/`)).sort((a, b) => b.dateMs - a.dateMs),
  })).filter(s => s.entries.length > 0);

  return (
    <main>
      <section className="border-b border-[hsl(var(--divider))]">
        <div className="container-wide py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3">
              <span className="font-display text-[10px] tracking-[0.25em] text-newsroom mb-5 block">
                DERECHO E INTELIGENCIA ARTIFICIAL
              </span>
              <h1 className="font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] tracking-[-0.04em] text-foreground">
                Derecho<br />Artificial
              </h1>
              <p className="font-display text-lg md:text-xl leading-[1.2] tracking-[-0.02em] text-foreground mt-5 max-w-md">
                Derecho, ética y regulación de la IA
              </p>
              <p className="text-sm md:text-base text-foreground/85 leading-relaxed mt-3 max-w-md">
                Análisis jurídico del Reglamento IA y su impacto legal. Guías prácticas para abogados y profesionales del compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link href="/guias-ia" className="inline-flex items-center justify-center px-6 py-3 bg-newsroom text-white text-sm font-semibold tracking-wide uppercase rounded-none hover:bg-white hover:text-newsroom transition-all duration-150">
                  Ver guías IA <span className="go-icon ml-2">→</span>
                </Link>
                <Link href="#secciones" className="inline-flex items-center justify-center px-6 py-3 border border-[hsl(var(--border))] text-foreground text-sm font-semibold tracking-wide uppercase rounded-none hover:bg-foreground hover:text-background transition-all duration-150">
                  Explorar secciones <span className="go-icon ml-2">→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2 border-l border-[hsl(var(--divider)/0.5)] pl-6 lg:pl-8 pt-1">
              <span className="font-display text-[11px] tracking-[0.2em] text-foreground block mb-5">
                ÚLTIMOS ANÁLISIS
              </span>
              <div className="flex flex-col">
                {posts.sort((a, b) => b.dateMs - a.dateMs).slice(0, 4).map((post) => (
                  <Link
                    key={post.slug}
                    href={post.url}
                    className="group py-4 border-t border-[hsl(var(--divider)/0.5)] first:border-t-0"
                  >
                    <span className="font-display text-[11px] tracking-[0.15em] text-newsroom block mb-1.5">
                      {sectionLabelForUrl(post.url).toUpperCase()}
                    </span>
                    <h3 className="font-display text-lg md:text-xl leading-[0.95] tracking-tight font-bold text-foreground group-hover:text-newsroom transition-colors duration-150">
                      {post.frontmatter.title}
                    </h3>
                    <span className="text-[11px] text-[hsl(var(--text-caption))] mt-2 block">
                      {formatDate(post.dateMs)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="secciones">
        <div className="container-wide py-12 md:py-16">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display font-bold text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight text-[hsl(var(--foreground))]">
              Últimas novedades por sección
            </h2>
            <p className="text-sm md:text-base text-foreground/85 leading-relaxed mt-3">
              Explora nuestros últimos briefings, ensayos y actualizaciones. Selección editorial para aportar criterio técnico y jurídico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectionGroups.map((sec, secIdx) => (
              <div key={sec.route} className="border border-[hsl(var(--divider)/0.5)]">
                <div className="h-[3px] bg-newsroom" />
                <div className="relative overflow-hidden bg-[hsl(var(--muted))] border-b border-[hsl(var(--divider)/0.3)]">
                  <span className="absolute top-3 right-5 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.85] tracking-[-0.08em] text-foreground/5 select-none pointer-events-none">
                    {String(secIdx + 1).padStart(2, "0")}
                  </span>
                  <Link href={sec.href} className="block px-5 md:px-6 py-5 md:py-6">
                    <span className="font-display text-[11px] tracking-[0.2em] text-newsroom">
                      {sec.label.toUpperCase()}
                    </span>
                  </Link>
                </div>

                <div className="divide-y divide-[hsl(var(--divider)/0.3)]">
                  {sec.entries.slice(0, 2).map((entry, entryIdx) => (
                    <Link key={entry.slug} href={entry.url} className="group block p-5 md:p-6 hover:bg-[hsl(var(--highlight))] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-display font-bold leading-[0.95] tracking-tight text-foreground ${
                            entryIdx === 0
                              ? "text-2xl md:text-3xl"
                              : "text-lg md:text-xl"
                          }`}>
                            {entry.frontmatter.title}
                          </h3>
                          {entry.excerpt && (
                            <p className="text-xs md:text-sm text-foreground/80 leading-relaxed mt-3 line-clamp-2">
                              {entry.excerpt}
                            </p>
                          )}
                          <span className="text-[11px] text-[hsl(var(--text-caption))] mt-3 block">
                            {formatDate(entry.dateMs)}
                          </span>
                        </div>
                        <span className="shrink-0 text-foreground/30 group-hover:text-foreground transition-all duration-200 go-icon text-lg mt-1">→</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href={sec.href} className="block p-5 md:p-6 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-newsroom hover:bg-[hsl(var(--highlight))] transition-colors">
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
