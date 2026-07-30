import type { Metadata } from "next";
import libraryDocs from "@/data/library-docs.json";
import { Badges } from "@/lib/badges";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Guides & Protocols",
  description: "Operational guides and protocols for legal practice involving AI.",
  keywords: [
    "AI guides",
    "AI governance",
    "AI compliance",
    "risk assessment",
    "internal policies",
    "checklists",
  ],
  alternates: {
    canonical: "/en/guides-protocols",
    languages: {
      "es-ES": "/recursos/guias",
      "en-US": "/en/guides-protocols",
    },
  },
  openGraph: {
    type: "website",
    title: "Guides & Protocols",
    description: "Operational guides and protocols for legal practice involving AI.",
    url: "/en/guides-protocols",
    locale: "en_US",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

type DocCard = {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  date?: string;
  year?: string;
  language?: string;
  tags?: string[];
};

const softLawDocs: DocCard[] = [
  {
    id: "sl-1",
    title: "European Ethical Charter on the use of AI in judicial systems",
    description:
      "Five core CEPEJ principles for AI in justice: fundamental rights, non-discrimination, quality and safety, transparency and user control.",
    source: "CEPEJ - Council of Europe",
    year: "2018",
    url: "https://www.coe.int/en/web/cepej/cepej-european-ethical-charter-on-the-use-of-artificial-intelligence-ai-in-judicial-systems-and-their-environment",
  },
  {
    id: "sl-2",
    title: "Ethics Guidelines for Trustworthy AI",
    description:
      "EU High-Level Expert Group ethical framework. Seven key requirements: human agency, technical robustness, privacy, transparency, diversity, societal well-being and accountability.",
    source: "European Commission",
    year: "2019",
    url: "https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai",
  },
  {
    id: "sl-3",
    title: "Recommendation on the Ethics of Artificial Intelligence",
    description:
      "Global normative framework adopted by UNESCO Member States. Establishes shared values and principles guiding legal frameworks.",
    source: "UNESCO",
    year: "2021",
    url: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics",
  },
];

export default function GuidesProtocolsPage() {
  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com/en",
      },
      {
        name: "Guides & Protocols",
        url: "https://derechoartificial.com/en/guides-protocols",
      },
    ],
  });

  const docs = libraryDocs as DocCard[];
  const aesiaDocs = docs.filter((d) => d.source === "AESIA");
  const ecDocs = docs.filter((d) => d.source === "Comisión Europea");
  const cepejDocs = softLawDocs.filter((d) => d.source.startsWith("CEPEJ"));
  const softLawEcDocs = softLawDocs.filter((d) => d.source === "European Commission");
  const otherDocs = softLawDocs.filter(
    (d) => d.source !== "European Commission" && !d.source.startsWith("CEPEJ"),
  );
  const commissionDocs: DocCard[] = [...ecDocs, ...softLawEcDocs];
  const mainAesiaDoc = aesiaDocs[0];

  return (
    <>
      <StructuredData data={breadcrumbJsonLd} />
      <main className="section-spacing">
        <div className="container-editorial">
          <header className="mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-caption mb-4">Section</p>
            <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground leading-tight">Guides &amp; Protocols</h1>
            <p className="text-lg text-body mt-6">Hub of technical and ethical documentation from AESIA, the European Commission, and international bodies.</p>
          </header>
          
          <section className="grid gap-6 md:grid-cols-3 not-prose mb-12 bento-surface">
            <a
              href="#aesia"
              className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">AESIA</p>
              <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Documents</h3>
              <p className="text-sm text-body">Key publications from AESIA.</p>
              <div className="mt-4 text-xs text-caption">Total: {aesiaDocs.length}</div>
            </a>
            <a
              href="#european-commission"
              className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">European Commission</p>
              <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Documents</h3>
              <p className="text-sm text-body">Official guides and materials.</p>
              <div className="mt-4 text-xs text-caption">Total: {commissionDocs.length}</div>
            </a>
            <a
              href="#other-organizations"
              className="bg-card border border-border p-6 hover:border-primary/30  transition-all duration-300"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-caption mb-3">Others</p>
              <h3 className="font-display font-bold tracking-tight text-xl md:text-2xl text-foreground mb-2">Soft law</h3>
              <p className="text-sm text-body">CEPEJ, UNESCO and related bodies.</p>
              <div className="mt-4 text-xs text-caption">Total: {otherDocs.length + cepejDocs.length}</div>
            </a>
          </section>

          <div className="space-y-20">
            <section id="aesia">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-primary"></span>
                <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">AESIA (Spain AI Oversight Agency)</h2>
              </div>
              {mainAesiaDoc && (
                <div className="article-pdf-box mb-10">
                  <h3 className="font-display font-bold text-xl text-foreground mb-4 tracking-tight">Summary: AESIA Practical Guides</h3>
                  <p className="text-body mb-6 leading-relaxed text-justify hyphens-auto">
                    AESIA publishes guides and protocols to help public and private organizations manage risks, document
                    AI systems and comply with the EU AI Act. This repository collects key documents, focusing on
                    incident notification, governance and transparency best practices.
                  </p>
                  <a
                    href={mainAesiaDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-pdf-btn gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    DOWNLOAD ORIGINAL DOCUMENT
                  </a>
                </div>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aesiaDocs.length > 0 ? (
                  aesiaDocs.map((doc) => <DocCardItem key={doc.id} doc={doc} color="bg-blue-600" />)
                ) : (
                  <div className="col-span-full p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                    No documents available at the moment.
                  </div>
                )}
              </div>
            </section>

            <section id="cepej">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-primary"></span>
                <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">CEPEJ (Council of Europe)</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cepejDocs.length > 0 ? (
                  cepejDocs.map((doc) => <DocCardItem key={doc.id} doc={doc} color="bg-slate-500" />)
                ) : (
                  <div className="col-span-full p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                    No documents available at the moment.
                  </div>
                )}
              </div>
            </section>

            <section id="european-commission">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-primary"></span>
                <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">European Commission</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commissionDocs.length > 0 ? (
                  commissionDocs.map((doc) => <DocCardItem key={doc.id} doc={doc} color="bg-[#003399]" />)
                ) : (
                  <div className="col-span-full p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                    No documents available at the moment.
                  </div>
                )}
              </div>
            </section>

            <section id="other-organizations">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-primary"></span>
                <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">Other organizations</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherDocs.length > 0 ? (
                  otherDocs.map((doc) => <DocCardItem key={doc.id} doc={doc} color="bg-slate-500" />)
                ) : (
                  <div className="col-span-full p-6 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                    No documents available at the moment.
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="mt-12 rounded-lg border border-divider bg-surface p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-caption mb-3">2026 repository</p>
            <p className="text-body max-w-3xl">
              This repository prioritizes protocols that can be deployed immediately. Each guide includes objectives,
              operational steps, ownership roles, and minimum metrics for adoption.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

function DocCardItem({ doc, color }: { doc: DocCard; color: string }) {
  const isAesia = doc.source === "AESIA";
  const toMs = (value?: string) => {
    if (!value) return 0;
    const d = new Date(value);
    const ms = d.getTime();
    return Number.isNaN(ms) ? 0 : ms;
  };
  const dateMs = toMs(doc.date);

  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full bg-card p-6 border border-border rounded-lg hover:border-primary transition-all duration-300 "
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-1 text-[10px] uppercase tracking-wider text-white font-medium ${color}`}>
          {doc.source}
        </span>
        <div className="text-xs text-muted-foreground font-mono inline-flex items-center gap-2">
          <span>{doc.year || doc.date?.split("-")[0]}</span>
          <Badges ms={dateMs} locale="en-US" newLabel="New" updatedLabel="Updated" />
        </div>
      </div>
      <h3 className="font-display font-bold tracking-tight text-lg text-foreground mb-3 group-hover:text-primary transition-colors">{doc.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">{doc.description}</p>
      <div className="flex items-center text-xs font-medium text-primary uppercase tracking-wider mt-auto">
        {isAesia ? "Download original document" : "Open document"} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </a>
  );
}
