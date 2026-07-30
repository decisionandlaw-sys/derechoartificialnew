import type { Metadata } from "next";
import Link from "next/link";
import { listContentSlugs, getContentEntry } from "@/lib/content";
import { listSectionResourceSlugs, getSectionResourceEntry } from "@/lib/resources";
import { Badges, isNew, isRecent, formatDateFromMs, getItemDateMs } from "@/lib/badges";
import { IndicatorsLegend } from "@/components/ui/IndicatorsLegend";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAllPosts } from "@/lib/mdx-utils";

export const metadata: Metadata = {
  title: "Law, ethics and AI regulation",
  description:
    "Independent legal and editorial analysis on artificial intelligence: compliance, jurisprudence, and the EU regulatory framework.",
  keywords: [
    "artificial intelligence law",
    "AI regulation",
    "EU AI Act",
    "GDPR",
    "AI compliance",
    "AI jurisprudence",
    "law and technology",
  ],
  alternates: {
    canonical: "/en",
    languages: {
      "es-ES": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    title: "Law, ethics and AI regulation",
    description:
      "Independent legal and editorial analysis on artificial intelligence: compliance, jurisprudence, and the EU regulatory framework.",
    url: "/en",
    locale: "en_US",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

export default async function EnglishHomePage() {
  const [
    actualidadJsonSlugs,
    actualidadResourceSlugs,
    firmaJsonSlugs,
    firmaResourceSlugs,
    normativaSlugs,
    jurisprudenciaSlugs,
    guiasSlugs,
  ] = await Promise.all([
    listContentSlugs("guias-ia"),
    listSectionResourceSlugs("guias-ia"),
    listContentSlugs("firma-scarpa"),
    listSectionResourceSlugs("firma-scarpa"),
    listSectionResourceSlugs("normativa"),
    listSectionResourceSlugs("jurisprudencia"),
    listSectionResourceSlugs("guias"),
  ]);

  const [actualidadJsonEntries, actualidadResourceEntries, firmaJsonEntries, firmaResourceEntries] =
    await Promise.all([
      Promise.all(actualidadJsonSlugs.map((slug) => getContentEntry("guias-ia", slug))),
      Promise.all(actualidadResourceSlugs.map((slug) => getSectionResourceEntry("guias-ia", slug))),
      Promise.all(firmaJsonSlugs.map((slug) => getContentEntry("firma-scarpa", slug))),
      Promise.all(firmaResourceSlugs.map((slug) => getSectionResourceEntry("firma-scarpa", slug))),
    ]);

  const resolvedActualidadJson = actualidadJsonEntries.filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );
  const resolvedActualidadResources = actualidadResourceEntries.filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );
  const resolvedFirmaJson = firmaJsonEntries.filter((e): e is NonNullable<typeof e> => Boolean(e));
  const resolvedFirmaResources = firmaResourceEntries.filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );

  const unifiedActualidad = [
    ...resolvedActualidadJson.map((e) => ({
      title: e.title,
      description: e.description,
      date: typeof e.dateMs === "number" && !Number.isNaN(e.dateMs) ? e.dateMs : 0,
      urlPath: e.urlPath,
      author: e.author,
    })),
    ...resolvedActualidadResources.map((e) => ({
      title: e.title,
      description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
      date: e.dateMs ?? 0,
      urlPath: `/guias-ia/${e.slug}`,
      author: "Derecho Artificial",
    })),
  ];

  const unifiedFirma = [
    ...resolvedFirmaJson.map((e) => ({
      title: e.title,
      description: e.description,
      date: typeof e.dateMs === "number" && !Number.isNaN(e.dateMs) ? e.dateMs : 0,
      urlPath: e.urlPath,
      author: e.author,
    })),
    ...resolvedFirmaResources.map((e) => ({
      title: e.title,
      description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
      date: e.dateMs ?? 0,
      urlPath: `/firma-scarpa/${e.slug}`,
      author: "Derecho Artificial",
    })),
  ];

  unifiedActualidad.sort((a, b) => b.date - a.date);
  unifiedFirma.sort((a, b) => b.date - a.date);

  const latestActualidad = unifiedActualidad[0] ?? null;
  const latestFirma = unifiedFirma[0] ?? null;

  const [latestNormativa, latestJurisprudencia, latestGuias] = await Promise.all([
    normativaSlugs[0]
      ? getSectionResourceEntry("normativa", normativaSlugs[0])
      : Promise.resolve(null),
    jurisprudenciaSlugs[0]
      ? getSectionResourceEntry("jurisprudencia", jurisprudenciaSlugs[0])
      : Promise.resolve(null),
    guiasSlugs[0] ? getSectionResourceEntry("guias", guiasSlugs[0]) : Promise.resolve(null),
  ]);

  const formatDate = (value: string | number) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  
  const toMs = (value: string | number | Date | null | undefined) => {
    if (value == null) return 0;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 0;
    return d.getTime();
  };
  

  const [normativaTopEntries, jurisprudenciaTopEntries, guiasTopEntries] = await Promise.all([
    Promise.all(
      normativaSlugs.slice(0, 2).map((slug) => getSectionResourceEntry("normativa", slug)),
    ),
    Promise.all(
      jurisprudenciaSlugs.slice(0, 2).map((slug) => getSectionResourceEntry("jurisprudencia", slug)),
    ),
    Promise.all(guiasSlugs.slice(0, 2).map((slug) => getSectionResourceEntry("guias", slug))),
  ]);

  const normativaItems =
    normativaTopEntries
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/normativa/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? e.dateMs ?? 0, "en-US")} · Regulatory analysis with official sources`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];

  const jurisprudenciaItems =
    jurisprudenciaTopEntries
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/jurisprudencia/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? e.dateMs ?? 0, "en-US")} · Key decisions on algorithms and rights`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];

  const guiasItems =
    guiasTopEntries
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/recursos/guias/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? e.dateMs ?? 0, "en-US")} · Repository of technical and ethical documentation`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];
  const latestNewsMs = toMs(unifiedActualidad[0]?.date);
  const latestJurisprudenceMs = jurisprudenciaTopEntries[0]?.displayDateMs ?? jurisprudenciaTopEntries[0]?.dateMs ?? 0;
  const latestLegislationMs = normativaTopEntries[0]?.displayDateMs ?? normativaTopEntries[0]?.dateMs ?? 0;
  const latestGuidesMs = guiasTopEntries[0]?.displayDateMs ?? guiasTopEntries[0]?.dateMs ?? 0;
  const latestFirmMs = toMs(unifiedFirma[0]?.date);
  const newsWeeklyCount = unifiedActualidad.filter((e) => isNew(e.date)).length;
  const firmWeeklyCount = unifiedFirma.filter((e) => isNew(e.date)).length;

  const [legislationEntriesAll, jurisprudenceEntriesAll, guidesEntriesAll] = await Promise.all([
    Promise.all(normativaSlugs.map((slug) => getSectionResourceEntry("normativa", slug))),
    Promise.all(jurisprudenciaSlugs.map((slug) => getSectionResourceEntry("jurisprudencia", slug))),
    Promise.all(guiasSlugs.map((slug) => getSectionResourceEntry("guias", slug))),
  ]);
  const legislationWeeklyCount = legislationEntriesAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? e.dateMs ?? 0)).length;
  const jurisprudenceWeeklyCount = jurisprudenceEntriesAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? e.dateMs ?? 0)).length;
  const guidesWeeklyCount = guidesEntriesAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? e.dateMs ?? 0)).length;

  const uniqueByHref = <T extends { href: string }>(arr: T[]) => {
    const seen = new Set<string>();
    const res: T[] = [];
    for (const it of arr) {
      if (seen.has(it.href)) continue;
      seen.add(it.href);
      res.push(it);
    }
    return res;
  };

  const sectionCards = [
    {
      key: "scarpa-firm",
      label: "Scarpa Firm",
      href: "/firma-scarpa",
      items: uniqueByHref(
        [unifiedFirma[0], unifiedFirma[1]]
          .filter((e): e is NonNullable<typeof e> => Boolean(e))
          .map((e) => ({
            title: e.title,
            href: e.urlPath,
            description: e.description ?? "",
            meta: `${formatDate(e.date)} · ${e.author}`,
            dateMs: e.date,
          })),
      ),
    },
    {
      key: "jurisprudence",
      label: "Jurisprudence",
      href: "/jurisprudencia",
      items: uniqueByHref(jurisprudenciaItems).slice(0, 2),
    },
    {
      key: "ai-resources",
      label: "AI Resources",
      href: "/guias-ia",
      items: uniqueByHref(
        [unifiedActualidad[0], unifiedActualidad[1]]
          .filter((e): e is NonNullable<typeof e> => Boolean(e))
          .map((e) => ({
            title: e.title,
            href: e.urlPath,
            description: e.description ?? "",
            meta: `${formatDate(e.date)} · ${e.author}`,
            dateMs: e.date,
          })),
      ),
    },
    {
      key: "legislation",
      label: "Legislation",
      href: "/normativa",
      items: uniqueByHref(normativaItems).slice(0, 2),
    },
    {
      key: "guides",
      label: "Guides & Protocols",
      href: "/recursos/guias",
      items: uniqueByHref(guiasItems).slice(0, 2),
    },
    {
      key: "legal-ai-glossary",
      label: "Legal AI Glossary",
      href: "/glosario-ia-legal",
    },
    {
      key: "about-us",
      label: "About Us",
      href: "/quienes-somos",
    },
    {
      key: "contact",
      label: "Contact",
      href: "/contacto",
    },
  ];

  const getCtaLabel = (key: string) => {
    switch (key) {
      case "legislation":
        return "View legislation";
      case "jurisprudence":
        return "View jurisprudence";
      case "guides":
        return "Browse guides";
      case "ai-news":
        return "Read AI news";
      case "scarpa-firm":
        return "Explore the firm";
      case "legal-ai-glossary":
        return "View glossary";
      case "about-us":
        return "Learn about the project";
      case "contact":
        return "Get in touch";
      default:
        return "View section";
    }
  };

  return (
    <>
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/en" }
        ]}
      />
      <main>
      <section className="py-20 md:py-28 bg-surface border-b border-divider">
        <div className="container-narrow text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-caption mb-4">
            Law, ethics and AI regulation
          </p>
          <h1 className="font-sans text-4xl md:text-6xl text-foreground mb-6 leading-[1.05]">
            Law, ethics and AI regulation
          </h1>
          <h2 className="text-xl md:text-2xl text-body leading-relaxed max-w-3xl mx-auto">
            Beyond the news: independent legal analysis and expert judgment on the AI Act and its legal impact. The practical reference for lawyers and compliance professionals.
          </h2>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/guias-ia" className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              View AI news
            </Link>
            <Link href="/en#sections" className="px-4 py-2 border border-divider text-foreground hover:bg-surface transition-colors">
              Explore sections
            </Link>
          </div>
        </div>
      </section>
      <section className="section-spacing bento-surface">
        <div className="container-wide">
          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/en/scarpa-firm" className="bg-card border border-border p-5 md:p-6 min-h-36 hover:border-primary/30  transition-all duration-300 flex flex-col justify-between">
              <h3 className="font-display font-bold tracking-tight text-xl text-foreground">Scarpa Firm</h3>
              <h2 className="text-sm md:text-base text-body">The Firm: Expert opinion and critical analysis of Digital Law</h2>
            </Link>
            <Link href="/en/jurisprudence" className="bg-card border border-border p-5 md:p-6 min-h-36 hover:border-primary/30  transition-all duration-300 flex flex-col justify-between">
              <h3 className="font-display font-bold tracking-tight text-xl text-foreground">Jurisprudence</h3>
              <h2 className="text-sm md:text-base text-body">Jurisprudence Observatory: Case law and rulings on Artificial Intelligence</h2>
            </Link>
            <Link href="/guias-ia" className="bg-card border border-border p-5 md:p-6 min-h-36 hover:border-primary/30  transition-all duration-300 flex flex-col justify-between">
              <h3 className="font-display font-bold tracking-tight text-xl text-foreground">AI News</h3>
              <h2 className="text-sm md:text-base text-body">Legal Tech Updates: News and legal impact of technology</h2>
            </Link>
            <Link href="/en/legislation" className="bg-card border border-border p-5 md:p-6 min-h-36 hover:border-primary/30  transition-all duration-300 flex flex-col justify-between">
              <h3 className="font-display font-bold tracking-tight text-xl text-foreground">Legislation</h3>
              <h2 className="text-sm md:text-base text-body">Regulatory Framework: Laws, regulations and AI Compliance</h2>
            </Link>
            <Link href="/en/guides-protocols" className="bg-card border border-border p-5 md:p-6 min-h-36 hover:border-primary/30  transition-all duration-300 flex flex-col justify-between">
              <h3 className="font-display font-bold tracking-tight text-xl text-foreground">Guides & Protocols</h3>
              <h2 className="text-sm md:text-base text-body">Practical Guides and Professional Protocols</h2>
            </Link>
            <Link href="/en/legal-ai-glossary" className="bg-card border border-border p-5 md:p-6 min-h-36 hover:border-primary/30  transition-all duration-300 flex flex-col justify-between">
              <h3 className="font-display font-bold tracking-tight text-xl text-foreground">AI Glossary</h3>
              <h2 className="text-sm md:text-base text-body">Dictionary of legal terms and concepts</h2>
            </Link>
          </div>
          
        </div>
      </section>
      

      <section className="section-spacing">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">
                AI News
              </p>
              <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">
                News & Analysis: The legal pulse of AI
              </h2>
            </div>
            <div className="max-w-xl">
              <p className="text-sm text-caption">
                Explore our latest briefings, essays and critical documents. An editorial selection designed to equip digital transformation leaders with solid technical and legal judgement.
              </p>
              <div className="mt-3">
                <Link
                  href="/guias-ia"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  View all news
                </Link>
              </div>
            </div>
          </div>
          <StructuredData
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: [
                latestActualidad && {
                  "@type": "ListItem",
                  position: 1,
                  url: latestActualidad.urlPath,
                  name: latestActualidad.title,
                  datePublished: new Date(latestActualidad.date).toISOString(),
                },
                latestFirma && {
                  "@type": "ListItem",
                  position: 2,
                  url: latestFirma.urlPath,
                  name: latestFirma.title,
                  datePublished: new Date(latestFirma.date).toISOString(),
                },
                latestNormativa && {
                  "@type": "ListItem",
                  position: 3,
                  url: `/normativa/${latestNormativa.slug}`,
                  name: latestNormativa.title,
                  datePublished: latestNormativa.dateMs
                    ? new Date(latestNormativa.dateMs).toISOString()
                    : undefined,
                },
                latestJurisprudencia && {
                  "@type": "ListItem",
                  position: 4,
                  url: `/jurisprudencia/${latestJurisprudencia.slug}`,
                  name: latestJurisprudencia.title,
                  datePublished: latestJurisprudencia.dateMs
                    ? new Date(latestJurisprudencia.dateMs).toISOString()
                    : undefined,
                },
              ].filter(Boolean),
            }}
          />

          {
            // Build news entries from MDX or fallback to resources
          }
          {(() => {
            const mdxPosts = getAllPosts();
            const newsMdx = mdxPosts
              .filter((post) => {
                const cat = (post.frontmatter.category || "").toLowerCase();
                const tags = (post.frontmatter.tags || []).map((t: string) => t.toLowerCase());
                return cat === "noticia" || cat === "guias-ia" || tags.includes("noticia") || tags.includes("guias-ia") || tags.includes("news");
              })
              .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
              .slice(0, 6);
            const newsEntries =
              newsMdx.length > 0
                ? newsMdx.map((post) => ({
                    title: post.frontmatter.title,
                    description: post.excerpt,
                    date: new Date(post.frontmatter.date).getTime(),
                    urlPath: post.url,
                  }))
                : unifiedActualidad.slice(0, 6).map((e) => ({
                    title: e.title,
                    description: e.description,
                    date: e.date,
                    urlPath: e.urlPath,
                  }));
            return (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {newsEntries.map((entry, idx) => (
                  <Link
                    key={`${entry.urlPath}-${idx}`}
                    href={entry.urlPath}
                    className="group bg-card border border-border p-5 md:p-6 min-h-36 hover:border-primary/30  transition-all duration-300 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">
                      AI News
                    </p>
                    <h3 className="font-display font-bold tracking-tight text-lg text-foreground mb-2">
                      {entry.title}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">→</span>
                    </h3>
                    <Badges ms={entry.date} locale="en-US" newLabel="New" updatedLabel="Updated" className="mb-3 inline-flex items-center gap-2 text-xs text-caption" />
                    <p className="text-sm text-body mb-4 line-clamp-3">
                      {entry.description}
                    </p>
                    <p className="mt-auto text-xs text-caption">{formatDate(entry.date)}</p>
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      <section id="sections" className="section-spacing">
        <div className="container-wide">
          <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground mb-8">
            Sections
          </h2>
          {(() => {
            const filterByCategory = (cat: string) =>
              getAllPosts()
                .filter((post) => {
                  const c = (post.frontmatter.category || "").toLowerCase();
                  const tags = (post.frontmatter.tags || []).map((t: string) => t.toLowerCase());
                  return c === cat || tags.includes(cat);
                })
                .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
                .slice(0, 2)
                .map((post) => ({
                  title: post.frontmatter.title,
                  href: post.url,
                  description: post.excerpt,
                  dateMs: new Date(post.frontmatter.date).getTime(),
                  meta: undefined,
                }));
            const propiedadItems = filterByCategory("propiedad-intelectual-ia");
            const eticaItems = filterByCategory("etica-ia");
            const globalItems = filterByCategory("ia-global");
            const recursosItems = uniqueByHref([
              ...guiasItems.slice(0, 1),
              ...[unifiedActualidad[0]]
                .filter((e): e is NonNullable<typeof e> => Boolean(e))
                .map((e) => ({
                  title: e.title,
                  href: e.urlPath,
                  description: e.description ?? "",
                  meta: `${formatDate(e.date)} · ${e.author}`,
                  dateMs: e.date,
                })),
            ]);
            const cards = [
              {
                key: "scarpa-firm",
                label: "Scarpa Firm",
                href: "/firma-scarpa",
                description: "Expert opinion and critical analysis of Digital Law",
                items: uniqueByHref(
                  [unifiedFirma[0], unifiedFirma[1]]
                    .filter((e): e is NonNullable<typeof e> => Boolean(e))
                    .map((e) => ({
                      title: e.title,
                      href: e.urlPath,
                      description: e.description ?? "",
                      meta: `${formatDate(e.date)} · ${e.author}`,
                      dateMs: e.date,
                    })),
                ),
              },
              {
                key: "legislation",
                label: "AI Regulation",
                href: "/normativa",
                description: "Laws, regulations and AI compliance",
                items: uniqueByHref(normativaItems).slice(0, 2),
              },
              {
                key: "jurisprudence",
                label: "AI Jurisprudence",
                href: "/jurisprudencia",
                description: "Key decisions on algorithms and rights",
                items: uniqueByHref(jurisprudenciaItems).slice(0, 2),
              },
              {
                key: "resources",
                label: "AI Resources",
                href: "/guias-ia",
                description: "Guides, protocols and curated news",
                items: recursosItems,
              },
              {
                key: "ip-ai",
                label: "AI Intellectual Property",
                href: "/propiedad-intelectual-ia",
                description: "Section in development, content coming soon",
                items: propiedadItems,
              },
              {
                key: "ethics-ai",
                label: "AI Ethics",
                href: "/etica-ia",
                description: "Section in development, content coming soon",
                items: eticaItems,
              },
              {
                key: "global-ai",
                label: "Global AI",
                href: "/global-ia",
                description: "Section in development, content coming soon",
                items: globalItems,
              },
            ];
            return (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((section) => (
                  <div
                    key={section.key}
                    className="card-elevated p-6 md:p-8 hover:border-primary/20 transition-all duration-300 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        {(section.items && section.items.length > 0) && (
                          <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">
                            Section
                          </p>
                        )}
                        <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground">{section.label}</h3>
                        {(!section.items || section.items.length === 0) && (
                          <p className="text-sm text-body mt-2">{section.description}</p>
                        )}
                      </div>
                      <Link
                        href={section.href}
                        className="text-sm font-medium text-primary inline-flex items-center gap-1 flex-shrink-0"
                      >
                        {getCtaLabel(section.key)} <span>→</span>
                      </Link>
                    </div>
                    {section.items && section.items.length > 0 && (
                      <div className="mt-2 flex flex-col gap-3">
                        {section.items.slice(0, 2).map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="border border-dashed border-divider p-4 hover:border-primary/40 transition-colors"
                          >
                            <p className="font-medium text-sm text-foreground mb-1">{item.title}</p>
                            <Badges ms={getItemDateMs(item)} locale="en-US" newLabel="New" updatedLabel="Updated" className="mb-2 inline-flex items-center gap-2 text-xs text-caption" />
                            {item.description &&
                              item.title &&
                              item.description.trim().toLowerCase() !== item.title.trim().toLowerCase() && (
                                <p className="text-sm text-body line-clamp-2">{item.description}</p>
                              )}
                            {item.meta && <p className="mt-2 text-xs text-caption">{item.meta}</p>}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>
    </main>
    </>
  );
}
