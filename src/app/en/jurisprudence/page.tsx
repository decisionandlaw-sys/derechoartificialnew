import type { Metadata } from "next";
import Link from "next/link";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { Badges } from "@/lib/badges";

export const metadata: Metadata = {
  title: "Jurisprudence",
  description: "Selection and analysis of relevant decisions on technology, data and AI.",
  keywords: [
    "AI jurisprudence",
    "case law",
    "data protection",
    "digital rights",
    "AI liability",
    "law and technology",
  ],
  alternates: {
    canonical: "/en/jurisprudence",
    languages: {
      "es-ES": "/jurisprudencia",
      "en-US": "/en/jurisprudence",
    },
  },
  openGraph: {
    type: "website",
    title: "Jurisprudence",
    description: "Selection and analysis of relevant decisions on technology, data and AI.",
    url: "/en/jurisprudence",
    locale: "en_US",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

type CaseItem = {
  id: string;
  href: string;
  title: string;
  description: string;
  meta: string;
  dateMs: number;
};

export default async function JurisprudencePage() {
  const resourceSlugs = await listSectionResourceSlugs("jurisprudencia");
  const resourceEntries = await Promise.all(
    resourceSlugs.map((slug) => getSectionResourceEntry("jurisprudencia", slug)),
  );
  const resolvedResourceEntries = resourceEntries.filter(
    (entry): entry is NonNullable<typeof entry> => Boolean(entry),
  );

  const boscoDateString = "2026-01-30";
  const boscoTime = new Date(boscoDateString).getTime();
  const boscoItem: CaseItem = {
    id: "bosco",
    href: "/jurisprudencia/sentencia-bosco-transparencia-algoritmica",
    title: "BOSCO Judgment: Algorithmic Transparency and Source Code",
    description:
      "Legal analysis of STS 1119/2025 consolidating the right to access source code when algorithms determine social benefits.",
    meta: "STS 1119/2025 · 11 September 2025",
    dateMs: Number.isNaN(boscoTime) ? 0 : boscoTime,
  };

  const resourceItems: CaseItem[] = resolvedResourceEntries.map((entry) => {
    const time = entry.dateMs ?? 0;
    const safeTime = Number.isNaN(time) ? 0 : time;
    const date =
      entry.displayDateMs != null && !Number.isNaN(entry.displayDateMs) ? new Date(entry.displayDateMs) : null;
    const dateLabel =
      date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : null;

    const plainSummary = entry.summaryHtml ? entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "";

    const parts: string[] = [];
    if (dateLabel) {
      parts.push(dateLabel);
    }
    if (entry.sourceUrl) {
      parts.push("Includes original document download");
    }

    return {
      id: `resource-${entry.slug}`,
      href: `/jurisprudencia/${entry.slug}`,
      title: entry.title,
      description: plainSummary,
      meta: parts.join(" · "),
      dateMs: entry.displayDateMs ?? safeTime,
    };
  });

  const items: CaseItem[] = [boscoItem, ...resourceItems].sort((a, b) => b.dateMs - a.dateMs);

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com/en",
      },
      {
        name: "Jurisprudence",
        url: "https://derechoartificial.com/en/jurisprudence",
      },
    ],
  });

  

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <main className="section-spacing">
        <div className="container-editorial">
          <header className="mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-caption mb-4">Section</p>
            <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground leading-tight">Jurisprudence</h1>
            <p className="lead mt-6 text-justify max-w-3xl">
              Curated repository of judicial and administrative decisions shaping AI Law. We analyze rulings on
              algorithmic transparency, civil liability, and protection of fundamental rights in the digital era.
            </p>
          </header>
          
          <section className="grid gap-6 md:grid-cols-3 mb-12 bento-surface">
            <Link
              href={boscoItem.href}
              className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Featured</p>
              <h2 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">BOSCO Judgment</h2>
              <p className="text-sm text-body">Algorithmic transparency and source code access.</p>
              <div className="mt-4 text-xs text-caption">{boscoItem.meta}</div>
            </Link>
            <Link
              href="/en/jurisprudence"
              className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Activity</p>
              <h2 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Latest decisions</h2>
              <p className="text-sm text-body">Entries recorded in the section.</p>
              <div className="mt-4 text-xs text-caption">Total: {items.length}</div>
            </Link>
            <Link
              href="/en/legislation"
              className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Context</p>
              <h2 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Regulatory framework</h2>
              <p className="text-sm text-body">Relation with the EU AI Act and applicable regulation.</p>
            </Link>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="card-elevated p-6 hover:border-primary/20 transition-all duration-300"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Decision</p>
                <h2 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">{item.title}</h2>
                <Badges ms={item.dateMs} locale="en-US" newLabel="New" updatedLabel="Updated" className="mb-3 inline-flex items-center gap-2 text-xs text-caption" />
                {item.description && <p className="text-body mb-6">{item.description}</p>}
                {item.meta && <div className="text-sm text-caption">{item.meta}</div>}
              </Link>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
