import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/layout/LegalLayout";
import {
  StructuredData,
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createLegislationJsonLd,
} from "@/components/seo/StructuredData";
import type { ResourceEntry } from "@/lib/resources";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { Badges } from "@/lib/badges";

export const metadata: Metadata = {
  title: "EU AI Act Guide 2026: Compliance for Organizations",
  description:
    "Expert analysis of the EU AI Act in 2026. Risk levels, sanctions, and the role of Spain's AESIA for companies and practitioners.",
  alternates: {
    canonical: "/en/legislation",
    languages: {
      "es-ES": "/normativa",
      "en-US": "/en/legislation",
    },
  },
};

export default async function LegislationPage() {
  const articleJsonLd = createArticleJsonLd({
    url: "https://derechoartificial.com/en/legislation",
    headline: "EU AI Act Guide 2026: Compliance for Organizations",
    description:
      "Expert analysis of the EU AI Act in 2026. Risk levels, sanctions, and Spain's AESIA role for companies and lawyers.",
    datePublished: "2026-01-15",
    authorName: "Ricardo Scarpa",
  });

  const legislationJsonLd = createLegislationJsonLd({
    url: "https://derechoartificial.com/en/legislation",
    name: "Regulation (EU) 2024/1689 - Artificial Intelligence Act",
    description:
      "Comprehensive EU framework for AI based on risk levels and obligations for high-risk systems.",
    datePublished: "2024-07-12",
    jurisdiction: "European Union",
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Which organizations must comply with the AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Any that place AI systems on the EU market or use them within the Union, including non-EU providers whose systems' output is used in EU territory.",
        },
      },
      {
        "@type": "Question",
        name: "When does it fully apply?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The Regulation enters into force 20 days after publication, with staggered applicability. Bans on unacceptable risk apply after 6 months, and most rules after 24 months (2026).",
        },
      },
    ],
  };

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com/en",
      },
      {
        name: "Legislation",
        url: "https://derechoartificial.com/en/legislation",
      },
    ],
  });

  const slugs = await listSectionResourceSlugs("normativa");
  const entries = await Promise.all(slugs.map((slug) => getSectionResourceEntry("normativa", slug)));
  const resolvedEntries = entries.filter((entry): entry is ResourceEntry => Boolean(entry));

  

  return (
    <>
      <StructuredData data={[articleJsonLd, legislationJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <LegalLayout title="EU AI Act Guide 2026: Compliance for Organizations" category="Legislation" date="2026-01-15">
        <div className="article-pdf-box mb-12">
          <h2 className="font-display font-bold text-2xl text-foreground mb-4 tracking-tight">Executive Summary</h2>
          <p className="text-body mb-6 leading-relaxed text-justify hyphens-auto">
            The EU Artificial Intelligence Act establishes the world's first comprehensive legal framework for AI.
            This guide outlines key obligations for providers and users, the risk classification system, and the
            staggered implementation timeline culminating in 2026. Essential reading for legal and compliance teams.
          </p>
          <a
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1689"
            target="_blank"
            rel="noopener noreferrer"
            className="article-pdf-btn gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            DOWNLOAD OFFICIAL REGULATION (PDF)
          </a>
        </div>

        <section className="grid gap-6 md:grid-cols-3 not-prose mb-12 bento-surface">
          <a
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32024R1689"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Official document</p>
            <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">AI Act Regulation (PDF)</h3>
            <p className="text-sm text-body">Direct download from EUR-Lex.</p>
          </a>
          <Link
            href="/jurisprudencia/sentencia-bosco-transparencia-algoritmica"
            className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Transparency</p>
            <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">BOSCO case</h3>
            <p className="text-sm text-body">Source code access for social benefits decisions.</p>
          </Link>
          <Link
            href="/en/legislation"
            className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Activity</p>
            <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Legislative updates</h3>
            <p className="text-sm text-body">Entries recorded: {resolvedEntries.length}</p>
          </Link>
        </section>

        <p className="lead">
          The full applicability of the{" "}
          <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689" target="_blank" rel="noopener noreferrer">
            Artificial Intelligence Act (AI Act)
          </a>{" "}
          marks a milestone in global digital regulation. For organizations,{" "}
          <strong>legal compliance</strong> is now a market requirement to operate within the European Union.
        </p>

        <h2>Risk Levels under the EU AI Act</h2>
        <p>
          The framework adopts a risk-based approach, classifying AI systems into four categories that determine the
          regulatory burden, balancing innovation and fundamental rights.
        </p>

        <h3>High-Risk Systems</h3>
        <p>
          Those used in critical infrastructures, education, employment or essential public services. These require
          rigorous conformity assessment, quality management and human oversight to mitigate{" "}
          <strong>algorithmic bias</strong> risks for citizens.
        </p>

        <h3>Unacceptable Risk Systems</h3>
        <p>
          Systems threatening{" "}
          <strong>fundamental rights</strong> are strictly prohibited, such as government social scoring or subliminal
          manipulation of human behaviour.
        </p>

        <div className="my-10 p-6 bg-blue-50/50 border border-blue-100 not-prose">
          <h4 className="font-display font-bold tracking-tight text-lg text-blue-900 mb-2">Related: Algorithmic Transparency in Spain</h4>
          <p className="text-sm text-blue-800 mb-3 text-justify hyphens-auto">
            For judicial application of transparency in automated systems before full applicability of the Regulation,
            see our analysis of the BOSCO case and access to source code.
          </p>
          <Link
            href="/jurisprudencia/sentencia-bosco-transparencia-algoritmica"
            className="text-blue-700 font-medium hover:underline flex items-center gap-2 text-sm"
          >
            Read BOSCO Judgment Analysis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-12 mb-16 not-prose">
          <h3 className="font-display font-bold tracking-tight text-2xl text-foreground mb-6">Compliance FAQ</h3>
          <div className="space-y-4">
            <details className="group border border-border p-4 bg-card">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                <span>Which organizations must comply with the AI Act?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <p className="group-open:animate-fadeIn mt-3 text-muted-foreground text-sm leading-relaxed text-justify">
                Any that place AI systems on the EU market or use them within the Union, including non-EU providers whose systems' output is used in EU territory.
              </p>
            </details>
            <details className="group border border-border p-4 bg-card">
              <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                <span>When does it fully apply?</span>
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <p className="group-open:animate-fadeIn mt-3 text-muted-foreground text-sm leading-relaxed text-justify">
                The Regulation enters into force 20 days after publication, with staggered applicability. Bans on unacceptable risk apply after 6 months, and most rules after 24 months (2026).
              </p>
            </details>
          </div>
        </div>

        {resolvedEntries.length > 0 && (
          <section className="mt-12">
            <h3 className="font-display font-bold tracking-tight text-2xl text-foreground mb-6">Related legislation</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {resolvedEntries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/normativa/${entry.slug}`}
                  className="card-elevated p-6 hover:border-primary/20 transition-all duration-300"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">Legislation</p>
                  <h3 className="font-display font-bold tracking-tight text-2xl text-foreground mb-4">{entry.title}</h3>
                  <Badges ms={entry.dateMs} locale="en-US" newLabel="New" updatedLabel="Updated" className="mb-3 inline-flex items-center gap-2 text-xs text-caption" />
                  {entry.summaryHtml && <p className="text-body">{entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200)}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}
      </LegalLayout>
    </>
  );
}
