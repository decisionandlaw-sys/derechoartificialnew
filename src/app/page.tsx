import type { Metadata } from "next";
import Image from "next/image";
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
  { route: "firma-scarpa",             label: "Firma Scarpa",             href: "/firma-scarpa",             image: "/images/heroes/firma-scarpa-hero.jpg" },
  { route: "normativa",                label: "Normativa IA",             href: "/normativa",                image: "/images/heroes/normativa-ia-hero.jpg" },
  { route: "jurisprudencia",           label: "Jurisprudencia IA",        href: "/jurisprudencia",           image: "/images/heroes/jurisprudencia-ia-hero.jpg" },
  { route: "guias-ia",                 label: "Guías IA",                 href: "/guias-ia",                 image: "/images/heroes/guias-ia-hero.jpg" },
  { route: "propiedad-intelectual-ia", label: "Propiedad Intelectual IA", href: "/propiedad-intelectual-ia", image: "/images/heroes/propiedad-intelectual-ia-hero.jpg" },
  { route: "etica-ia",                 label: "Ética IA",                 href: "/etica-ia",                 image: "/images/heroes/etica-ia-hero.jpg" },
  { route: "global-ia",                label: "IA Global",                href: "/global-ia",                image: "/images/heroes/ia-global-hero.jpg" },
];

function formatDate(value: string | number): string {
  const d = typeof value === "number" ? new Date(value) : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}

export default function HomePage() {
  const posts = getAllPosts();

  const sectionGroups = SECTIONS.map(s => ({
    ...s,
    entries: posts.filter(p => p.url.startsWith(`/${s.route}/`)).sort((a, b) => b.dateMs - a.dateMs),
  })).filter(s => s.entries.length > 0);

  return (
    <main>
      <section className="relative overflow-hidden bg-[hsl(var(--muted))] border-b border-[hsl(var(--divider))]">
        <div className="absolute inset-0">
          <Image src="/images/heroes/home-hero.jpg" alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsla(0,0%,2.4%,0.92)] via-[hsla(0,0%,2.4%,0.7)] to-[hsla(0,0%,2.4%,0.3)]" />
        </div>
        <div className="container-wide relative z-10 py-24 md:py-36">
          <h1 className="font-display font-black text-[clamp(3.5rem,8vw,7rem)] leading-[0.85] tracking-[-0.04em] text-[hsl(var(--foreground))] max-w-[90%]">
            Derecho Artificial
          </h1>
          <p className="font-display font-bold text-[clamp(1.25rem,2.5vw,2rem)] leading-[1.1] tracking-[-0.02em] text-[hsl(var(--foreground)/0.8)] mt-4 max-w-[50%]">
            Derecho, ética y regulación de la IA
          </p>
          <p className="text-sm md:text-base text-[hsl(var(--text-body))] leading-relaxed mt-4 max-w-[40%]">
            Análisis jurídico del Reglamento IA y su impacto legal. Guías prácticas para abogados y profesionales del compliance.
          </p>
          <div className="flex gap-4 mt-8">
            <Link href="/guias-ia" className="inline-flex items-center px-6 py-3 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-sm font-semibold tracking-wide uppercase hover:opacity-85 transition-opacity">
              Ver guías IA <span className="go-icon ml-2">→</span>
            </Link>
            <Link href="#secciones" className="inline-flex items-center px-6 py-3 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] text-sm font-semibold tracking-wide uppercase hover:bg-[hsl(var(--card))] transition-colors">
              Explorar secciones <span className="go-icon ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="secciones">
        <div className="container-wide py-12 md:py-16">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display font-bold text-[clamp(1.75rem,3vw,2.75rem)] tracking-tight text-[hsl(var(--foreground))]">
              Últimas novedades por sección
            </h2>
            <p className="text-sm md:text-base text-[hsl(var(--text-body))] leading-relaxed mt-3">
              Explora nuestros últimos briefings, ensayos y actualizaciones. Selección editorial para aportar criterio técnico y jurídico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectionGroups.map((sec) => (
              <div key={sec.route} className="border border-[hsl(var(--divider)/0.5)]">
                <Link href={sec.href} className="group block relative aspect-[2.29/1] overflow-hidden bg-[hsl(var(--muted))]">
                  <Image src={sec.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsla(0,0%,2.4%,0.85)] to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 md:p-6">
                    <span className="font-display font-bold text-xl md:text-2xl text-[hsl(var(--foreground))] tracking-tight">
                      {sec.label}
                    </span>
                  </div>
                </Link>

                <div className="divide-y divide-[hsl(var(--divider)/0.3)]">
                  {sec.entries.slice(0, 2).map((entry) => (
                    <Link key={entry.slug} href={entry.url} className="group block p-5 md:p-6 hover:bg-[hsl(var(--highlight))] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-bold text-lg md:text-xl leading-[1.05] tracking-tight text-[hsl(var(--foreground))] pr-2">
                            {entry.title}
                          </h3>
                          {entry.excerpt && (
                            <p className="text-xs md:text-sm text-[hsl(var(--text-body))] leading-relaxed mt-2 line-clamp-2">
                              {entry.excerpt}
                            </p>
                          )}
                          <span className="text-[11px] text-[hsl(var(--text-caption))] mt-3 block">
                            {formatDate(entry.dateMs)}
                          </span>
                        </div>
                        <span className="shrink-0 text-[hsl(var(--foreground)/0.3)] group-hover:text-[hsl(var(--foreground))] transition-all duration-200 go-icon text-lg mt-1">→</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <Link href={sec.href} className="block border-t border-[hsl(var(--divider)/0.3)] p-3 md:p-4 text-center text-[11px] font-medium uppercase tracking-[0.15em] text-[hsl(var(--text-caption))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--highlight))] transition-colors">
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
