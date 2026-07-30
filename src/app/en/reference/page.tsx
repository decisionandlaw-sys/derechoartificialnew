import type { Metadata } from "next";
import Link from "next/link";
import { listContentSlugs, getContentEntry } from "@/lib/content";
import { listSectionResourceSlugs, getSectionResourceEntry } from "@/lib/resources";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { Badges, formatDateFromMs, isNew } from "@/lib/badges";

export const metadata: Metadata = {
  title: "Reference | Derecho Artificial",
  description:
    "Value map and editorial capabilities: legislation, jurisprudence, news and technical library with dynamic signals.",
  alternates: {
    canonical: "/en/reference",
    languages: {
      "es-ES": "/referencia",
      "en-US": "/en/reference",
    },
  },
  openGraph: {
    type: "website",
    title: "Reference | Derecho Artificial",
    description:
      "Value map and editorial capabilities: legislation, jurisprudence, news and technical library with dynamic signals.",
    url: "/en/reference",
    locale: "en_US",
    images: [{ url: "/logo-principal.png" }],
  },
};

export default async function ReferencePage() {
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

  const unifiedNews = [
    ...resolvedActualidadJson.map((e) => ({
      title: e.title,
      description: e.description,
      date: new Date(e.datePublished).getTime(),
      urlPath: e.urlPath,
      author: e.author,
    })),
    ...resolvedActualidadResources.map((e) => ({
      title: e.title,
      description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
      date: e.dateMs ?? 0,
      urlPath: `/guias-ia/${e.slug}`,
      author: "Derecho Artificial",
    })),
  ];
  const unifiedFirm = [
    ...resolvedFirmaJson.map((e) => ({
      title: e.title,
      description: e.description,
      date: new Date(e.datePublished).getTime(),
      urlPath: e.urlPath,
      author: e.author,
    })),
    ...resolvedFirmaResources.map((e) => ({
      title: e.title,
      description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
      date: e.dateMs ?? 0,
      urlPath: `/firma-scarpa/${e.slug}`,
      author: "Derecho Artificial",
    })),
  ];
  unifiedNews.sort((a, b) => b.date - a.date);
  unifiedFirm.sort((a, b) => b.date - a.date);

  const [legislationTop, jurisprudenceTop, guidesTop] = await Promise.all([
    Promise.all(normativaSlugs.slice(0, 3).map((slug) => getSectionResourceEntry("normativa", slug))),
    Promise.all(jurisprudenciaSlugs.slice(0, 3).map((slug) => getSectionResourceEntry("jurisprudencia", slug))),
    Promise.all(guiasSlugs.slice(0, 3).map((slug) => getSectionResourceEntry("guias", slug))),
  ]);

  const [legislationAll, jurisprudenceAll, guidesAll] = await Promise.all([
    Promise.all(normativaSlugs.map((slug) => getSectionResourceEntry("normativa", slug))),
    Promise.all(jurisprudenciaSlugs.map((slug) => getSectionResourceEntry("jurisprudencia", slug))),
    Promise.all(guiasSlugs.map((slug) => getSectionResourceEntry("guias", slug))),
  ]);

  const legislationItems =
    legislationTop
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/normativa/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? e.dateMs ?? 0, "en-US")} · Regulatory analysis with official sources`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];
  const jurisprudenceItems =
    jurisprudenceTop
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/jurisprudencia/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? e.dateMs ?? 0, "en-US")} · Key decisions on algorithms and rights`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];
  const guidesItems =
    guidesTop
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/recursos/guias/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? e.dateMs ?? 0, "en-US")} · Technical and ethical documentation`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];

  const latestLegislationMs =
    Math.max(
      0,
      ...legislationAll
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
        .map((e) => e.displayDateMs ?? e.dateMs ?? 0),
    ) || 0;
  const latestJurisprudenceMs =
    Math.max(
      0,
      ...jurisprudenceAll
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
        .map((e) => e.displayDateMs ?? e.dateMs ?? 0),
    ) || 0;
  const latestGuidesMs =
    Math.max(
      0,
      ...guidesAll
        .filter((e): e is NonNullable<typeof e> => Boolean(e))
        .map((e) => e.displayDateMs ?? e.dateMs ?? 0),
    ) || 0;

  const legislationWeeklyCount = legislationAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? e.dateMs ?? 0)).length;
  const jurisprudenceWeeklyCount = jurisprudenceAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? e.dateMs ?? 0)).length;
  const guidesWeeklyCount = guidesAll
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

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      { name: "Derecho Artificial", url: "https://derechoartificial.com/en" },
      { name: "Reference", url: "https://derechoartificial.com/en/reference" },
    ],
  });

  const latestNewsMs = unifiedNews[0]?.date ?? 0;
  const latestFirmMs = unifiedFirm[0]?.date ?? 0;

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Reference | Derecho Artificial",
          description:
            "Value map and editorial capabilities: legislation, jurisprudence, news and technical & ethical library.",
          url: "https://derechoartificial.com/en/reference",
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Derecho Artificial",
          url: "https://derechoartificial.com/en",
          logo: "https://derechoartificial.com/logo-principal.png",
          sameAs: ["https://derechoartificial.com/en/about-us"],
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "AI Law analysis and technical library",
          serviceType: "LegalAnalysis",
          areaServed: "EU",
          provider: {
            "@type": "Organization",
            name: "Derecho Artificial",
            url: "https://derechoartificial.com/en",
          },
        }}
      />
      <main>
        <section className="section-spacing bento-surface">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Reference</p>
                <h1 className="font-sans text-2xl md:text-3xl text-foreground">Editorial rigor and dynamic signals</h1>
              </div>
              <div className="text-sm">
                <Link
                  href="/en/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(160px,_auto)]">
              <Link
                href="/guias-ia"
                className="bg-card border border-border p-6 lg:col-span-3 hover:border-primary/30  transition-all duration-300"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">AI News</p>
                <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Briefings & editorial analysis</h3>
                <p className="text-sm text-body">Latest entries and resources.</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-caption">
                  <Badges ms={latestNewsMs} locale="en-US" newLabel="New" updatedLabel="Updated" />
                </div>
              </Link>
              <Link
                href="/en/scarpa-firm"
                className="bg-card border border-border p-6 lg:col-span-3 hover:border-primary/30  transition-all duration-300"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Scarpa Firm</p>
                <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Essays & working notes</h3>
                <p className="text-sm text-body">Original analysis and downloadable materials.</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-caption">
                  <Badges ms={latestFirmMs} locale="en-US" newLabel="New" updatedLabel="Updated" />
                </div>
              </Link>
              <Link
                href="/en/legislation"
                className="bg-card border border-border p-6 lg:col-span-2 hover:border-primary/30  transition-all duration-300"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Legislation</p>
                <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-2">Regulatory framework</h3>
                <p className="text-sm text-body">EU AI Act and applicable regulation.</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-caption">
                  <Badges ms={latestLegislationMs} locale="en-US" newLabel="New" updatedLabel="Updated" />
                  <span className="text-[10px]">Weekly activity: {legislationWeeklyCount}</span>
                  {latestLegislationMs > 0 && (
                    <span className="text-[10px]">Last updated: {formatDateFromMs(latestLegislationMs, "en-US")}</span>
                  )}
                </div>
              </Link>
              <Link
                href="/en/jurisprudence"
                className="bg-card border border-border p-6 lg:col-span-2 hover:border-primary/30  transition-all duration-300"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Jurisprudence</p>
                <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-2">Key decisions</h3>
                <p className="text-sm text-body">Selection on algorithms and rights.</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-caption">
                  <Badges ms={latestJurisprudenceMs} locale="en-US" newLabel="New" updatedLabel="Updated" />
                  <span className="text-[10px]">Weekly activity: {jurisprudenceWeeklyCount}</span>
                  {latestJurisprudenceMs > 0 && (
                    <span className="text-[10px]">
                      Last updated: {formatDateFromMs(latestJurisprudenceMs, "en-US")}
                    </span>
                  )}
                </div>
              </Link>
              <Link
                href="/en/guides-protocols"
                className="bg-card border border-border p-6 lg:col-span-2 hover:border-primary/30  transition-all duration-300"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Guides & Protocols</p>
                <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-2">Technical & ethical library</h3>
                <p className="text-sm text-body">Official documentation and soft law.</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs text-caption">
                  <Badges ms={latestGuidesMs} locale="en-US" newLabel="New" updatedLabel="Updated" />
                  <span className="text-[10px]">Weekly activity: {guidesWeeklyCount}</span>
                  {latestGuidesMs > 0 && (
                    <span className="text-[10px]">Last updated: {formatDateFromMs(latestGuidesMs, "en-US")}</span>
                  )}
                </div>
              </Link>
            </div>
            
          </div>
        </section>
        <section className="section-spacing bento-surface">
          <div className="container-wide">
            <div className=" border border-divider bg-surface p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Editorial method</p>
              <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground mb-4">Rigor, sources and governance</h2>
              <p className="text-sm text-body mb-6">
                We prioritize regulatory frameworks and verifiable official documentation. Each piece cites sources,
                dates and context to ensure traceability and compliance with the EU AI Act.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/en/legislation" className="border border-border p-4 hover:border-primary/40 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Legislation</p>
                  <p className="text-sm text-body">EU AI Act, GDPR and related regulatory developments.</p>
                </Link>
                <Link href="/en/guides-protocols" className="border border-border p-4 hover:border-primary/40 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Guides & Protocols</p>
                  <p className="text-sm text-body">AESIA, CEPEJ, European Commission and international bodies.</p>
                </Link>
                <Link href="/en/jurisprudence" className="border border-border p-4 hover:border-primary/40 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Jurisprudence</p>
                  <p className="text-sm text-body">Key decisions on transparency, liability and rights.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-spacing bento-surface">
          <div className="container-wide">
            <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground mb-8">Sections</h2>
            <div className="space-y-6">
              <div className="card-elevated p-6 md:p-8 hover:border-primary/20 transition-all duration-300 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Section</p>
                    <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground">Legislation</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-caption">Weekly activity: {legislationWeeklyCount}</span>
                    <Link href="/en/legislation" className="text-sm font-medium text-primary inline-flex items-center gap-1">
                      View section <span>→</span>
                    </Link>
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-3">
                  {uniqueByHref(legislationItems).slice(0, 2).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="border border-dashed border-divider p-4 hover:border-primary/40 transition-colors"
                    >
                      <p className="font-medium text-sm text-foreground mb-1">{item.title}</p>
                      <Badges
                        ms={item.dateMs}
                        locale="en-US"
                        newLabel="New"
                        updatedLabel="Updated"
                        className="mb-2 inline-flex items-center gap-2 text-xs text-caption"
                      />
                      {item.description && <p className="text-sm text-body line-clamp-2">{item.description}</p>}
                      {item.meta && <p className="mt-2 text-xs text-caption">{item.meta}</p>}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card-elevated p-6 md:p-8 hover:border-primary/20 transition-all duration-300 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Section</p>
                    <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground">Jurisprudence</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-caption">Weekly activity: {jurisprudenceWeeklyCount}</span>
                    <Link href="/en/jurisprudence" className="text-sm font-medium text-primary inline-flex items-center gap-1">
                      View section <span>→</span>
                    </Link>
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-3">
                  {uniqueByHref(jurisprudenceItems).slice(0, 2).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="border border-dashed border-divider p-4 hover:border-primary/40 transition-colors"
                    >
                      <p className="font-medium text-sm text-foreground mb-1">{item.title}</p>
                      <Badges
                        ms={item.dateMs}
                        locale="en-US"
                        newLabel="New"
                        updatedLabel="Updated"
                        className="mb-2 inline-flex items-center gap-2 text-xs text-caption"
                      />
                      {item.description && <p className="text-sm text-body line-clamp-2">{item.description}</p>}
                      {item.meta && <p className="mt-2 text-xs text-caption">{item.meta}</p>}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card-elevated p-6 md:p-8 hover:border-primary/20 transition-all duration-300 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Section</p>
                    <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground">Guides & Protocols</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-caption">Weekly activity: {guidesWeeklyCount}</span>
                    <Link href="/en/guides-protocols" className="text-sm font-medium text-primary inline-flex items-center gap-1">
                      View section <span>→</span>
                    </Link>
                  </div>
                </div>
                <div className="mt-2 flex flex-col gap-3">
                  {uniqueByHref(guidesItems).slice(0, 2).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="border border-dashed border-divider p-4 hover:border-primary/40 transition-colors"
                    >
                      <p className="font-medium text-sm text-foreground mb-1">{item.title}</p>
                      <Badges
                        ms={item.dateMs}
                        locale="en-US"
                        newLabel="New"
                        updatedLabel="Updated"
                        className="mb-2 inline-flex items-center gap-2 text-xs text-caption"
                      />
                      {item.description && <p className="text-sm text-body line-clamp-2">{item.description}</p>}
                      {item.meta && <p className="mt-2 text-xs text-caption">{item.meta}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-spacing bento-surface">
          <div className="container-wide">
            <div className="grid gap-4 md:grid-cols-4">
              <Link
                href="/en/legislation"
                className="border border-border p-4 hover:border-primary/40 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Quick access</p>
                <p className="text-sm text-foreground">Legislation</p>
                <p className="text-xs text-caption mt-1">EU AI Act and regulation</p>
                <div className="mt-2 text-[10px] text-caption">
                  New this week: {legislationWeeklyCount}
                </div>
              </Link>
              <Link
                href="/en/jurisprudence"
                className="border border-border p-4 hover:border-primary/40 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Quick access</p>
                <p className="text-sm text-foreground">Jurisprudence</p>
                <p className="text-xs text-caption mt-1">Key decisions</p>
                <div className="mt-2 text-[10px] text-caption">
                  New this week: {jurisprudenceWeeklyCount}
                </div>
              </Link>
              <Link
                href="/en/guides-protocols"
                className="border border-border p-4 hover:border-primary/40 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Quick access</p>
                <p className="text-sm text-foreground">Guides & Protocols</p>
                <p className="text-xs text-caption mt-1">Technical library</p>
                <div className="mt-2 text-[10px] text-caption">
                  New this week: {guidesWeeklyCount}
                </div>
              </Link>
              <Link
                href="/en/contact"
                className="border border-border p-4 hover:border-primary/40 transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Quick access</p>
                <p className="text-sm text-foreground">Contact</p>
                <p className="text-xs text-caption mt-1">Collaborate with the project</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="section-spacing bento-surface">
          <div className="container-wide">
            <div className=" border border-divider bg-surface p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Editorial method</p>
              <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground mb-4">Rigor, sources and governance</h2>
              <p className="text-sm text-body mb-6">
                We prioritize regulatory frameworks and verifiable official documentation. Each piece links sources,
                dates and context to ensure traceability and compliance with the EU AI Act.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/en/legislation" className="border border-border p-4 hover:border-primary/40 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Legislation</p>
                  <p className="text-sm text-body">EU AI Act, GDPR and related regulatory developments.</p>
                </Link>
                <Link href="/en/guides-protocols" className="border border-border p-4 hover:border-primary/40 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Guides & Protocols</p>
                  <p className="text-sm text-body">AESIA, CEPEJ, European Commission and international bodies.</p>
                </Link>
                <Link href="/en/jurisprudence" className="border border-border p-4 hover:border-primary/40 transition-colors">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-2">Jurisprudence</p>
                  <p className="text-sm text-body">Key decisions on transparency, liability and rights.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-spacing">
          <div className="container-wide">
            <div className=" border border-divider bg-surface p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Contact</p>
                <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground">Collaborate with the project</h2>
                <p className="text-sm text-body mt-2">
                  Verifiable links, rigorous analysis and dynamic signaling for the AI legal ecosystem.
                </p>
              </div>
              <Link
                href="/en/contact"
                className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Open form
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
