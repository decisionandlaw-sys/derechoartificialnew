import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Legal AI Glossary | Derecho Artificial",
  description:
    "Comprehensive glossary of legal and technical terms related to Artificial Intelligence, regulation and compliance in the EU.",
  alternates: {
    canonical: "https://derechoartificial.com/en/legal-ai-glossary",
    languages: {
      "es-ES": "https://derechoartificial.com/glosario-ia-legal",
      "en-US": "https://derechoartificial.com/en/legal-ai-glossary",
    },
  },
};

export default function LegalAIGlossaryPage() {
  const candidates = ["Recursos", "recursos"];
  let html = "";
  for (const dir of candidates) {
    const p = path.join(process.cwd(), "public", dir, "glosario.html");
    if (fs.existsSync(p)) {
      html = fs.readFileSync(p, "utf-8");
      break;
    }
  }
  if (!html) {
    html = "<p>The glossary is not available at the moment.</p>";
  }

  return (
    <>
      <Breadcrumbs 
        items={[
          { label: "Home", href: "/en" },
          { label: "Legal AI Glossary", href: "/en/legal-ai-glossary" }
        ]}
      />
      <main className="min-h-screen pb-20">
      <section className="pt-24 pb-16 md:pt-32 md:pb-12 px-6 bg-background border-b border-divider/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-6">
            Resources · Legal Dictionary
          </p>
          <h1 className="font-display font-black text-[clamp(2rem,5vw,4rem)] text-foreground mb-8 leading-[0.9] tracking-[-0.03em]">
            Legal AI Glossary
          </h1>
          <p className="text-base text-body leading-relaxed max-w-2xl mx-auto mb-10">
            Definitions of legal and technical concepts used across AI regulation, compliance and doctrine in Europe.
          </p>
        </div>
      </section>
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-[0.5px] md:grid-cols-3 bg-divider/30 border border-divider/30">
            <a href="#A" className="bg-card p-8 hover:bg-muted transition-colors">
              <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-3">Index</p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">Go to alphabetical index</h3>
              <p className="text-xs text-body leading-relaxed">Access terms from A to X.</p>
            </a>
            <a href="#M" className="bg-card p-8 hover:bg-muted transition-colors">
              <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-3">Shortcut</p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">Section M</h3>
              <p className="text-xs text-body leading-relaxed">Quick access to frequent terms.</p>
            </a>
            <a href="/en/legislation" className="bg-card p-8 hover:bg-muted transition-colors">
              <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-3">Context</p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">AI Act Guide</h3>
              <p className="text-xs text-body leading-relaxed">Regulatory framework and obligations.</p>
            </a>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </main>
    </>
  );
}
