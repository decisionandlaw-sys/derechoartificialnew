import type { Metadata } from "next";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Independent observatory analyzing the impact of AI on Law. Mission, editorial direction, and Editorial Manifesto.",
  keywords: [
    "about Derecho Artificial",
    "editorial manifesto",
    "AI law",
    "AI ethics",
    "AI regulation",
    "EU perspective",
  ],
  alternates: {
    canonical: "/en/about-us",
    languages: {
      "es-ES": "/quienes-somos",
      "en-US": "/en/about-us",
    },
  },
  openGraph: {
    type: "website",
    title: "About Us",
    description:
      "Independent observatory analyzing the impact of AI on Law. Mission, editorial direction, and Editorial Manifesto.",
    url: "/en/about-us",
    locale: "en_US",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

export default function AboutUsPage() {
  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntityOfPage: "https://derechoartificial.com/en/about-us",
    name: "About Us - Derecho Artificial",
    description:
      "Independent observatory analyzing the impact of AI on Law. Mission, editorial direction, and Editorial Manifesto.",
  };

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com/en",
      },
      {
        name: "About Us",
        url: "https://derechoartificial.com/en/about-us",
      },
    ],
  });

  return (
    <>
      <StructuredData data={[aboutPageJsonLd, breadcrumbJsonLd]} />
      <main>
        <article className="section-spacing" id="mission">
          <div className="container-editorial">
            <header className="mb-16">
              <p className="text-sm uppercase tracking-widest text-caption mb-4">About the project</p>
              <div className="flex items-center gap-2 mb-6">
                <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground leading-tight">
                  About Derecho Artificial
                </h1>
              </div>
              <p className="text-lg text-body">
                A space for rigorous legal reflection in the age of artificial intelligence.
              </p>
            </header>

            <div className="prose-editorial mb-24">
              <section className="mb-16">
                <h2>What is Derecho Artificial</h2>
                <p>
                  Derecho Artificial is an independent editorial publication dedicated to analyzing the legal, ethical
                  and social implications of artificial intelligence. Our goal is to contribute to an informed debate
                  on how Law should respond to the challenges posed by these technologies.
                </p>
                <p>
                  Founded in 2024, the project stems from the conviction that the Spanish-speaking world needs a
                  reference space where legal professionals, academics, regulators and citizens can find rigorous and
                  accessible analysis on these topics.
                </p>
              </section>

              <section className="mb-16">
                <h2>Why we exist</h2>
                <p>
                  Artificial intelligence is transforming legal practice and raises fundamental questions about justice,
                  responsibility and human rights. Yet much of the public debate is dominated by:
                </p>
                <ul className="list-disc pl-6 space-y-3 my-6">
                  <li>Tech marketing narratives that downplay risks.</li>
                  <li>Sensationalist storytelling that exaggerates threats without rigour.</li>
                  <li>Technical analyses inaccessible to non‑specialists.</li>
                  <li>English‑centric content overlooking Spanish‑language legal systems.</li>
                </ul>
                <p>
                  Derecho Artificial aims for the middle ground: serious yet accessible analysis, critical yet
                  constructive, global yet attentive to local realities.
                </p>
              </section>

              <section className="mb-16">
                <h2>Who we address</h2>
                <p>Our content is designed for:</p>
                <ul className="list-disc pl-6 space-y-3 my-6">
                  <li>
                    <strong>Legal professionals</strong>: Lawyers, judges, prosecutors and notaries who need to
                    understand AI tools affecting their practice.
                  </li>
                  <li>
                    <strong>Academics and researchers</strong>: Law professors and students studying the intersection
                    with technology.
                  </li>
                  <li>
                    <strong>Regulators and policymakers</strong>: Officials designing and implementing AI regulatory
                    frameworks.
                  </li>
                  <li>
                    <strong>Informed citizens</strong>: People interested in understanding how AI affects their rights.
                  </li>
                </ul>
              </section>

              <section className="mb-16">
                <h2>Our approach</h2>
                <p>We are guided by the following methodological principles:</p>
                <ul className="list-disc pl-6 space-y-3 my-6">
                  <li>
                    <strong>Academic rigour</strong>: Analyses based on primary sources, case law and updated doctrine.
                  </li>
                  <li>
                    <strong>Editorial independence</strong>: No sponsored content or advertising that compromises our
                    line.
                  </li>
                  <li>
                    <strong>Accessibility</strong>: We avoid unnecessary jargon without sacrificing technical precision.
                  </li>
                  <li>
                    <strong>Critical perspective</strong>: We question both techno‑optimism and unjustified
                    catastrophism.
                  </li>
                  <li>
                    <strong>Practical focus</strong>: We connect theoretical analysis with concrete implications for
                    legal practice.
                  </li>
                </ul>
              </section>

              <section className="mb-16">
                <h2>How we work</h2>
                <p>
                  All content goes through an editorial review including source verification and peer review when
                  appropriate. We publish corrections when errors are identified and maintain transparency about funding.
                </p>
                <p>
                  Derecho Artificial is currently a non‑profit project sustained by voluntary contributions. We do not
                  use intrusive advertising or sell user data. Our only income sources are reader donations and
                  occasional academic consulting projects.
                </p>
              </section>
            </div>

            <section className="mb-24 p-8 bg-surface border border-divider rounded-lg">
              <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground mb-6">About the Editorial Lead</h2>
              <p className="text-lg text-body mb-6">
                This editorial project is directed and coordinated by <strong>Ricardo S. C.</strong>
              </p>

              <div className="space-y-4 text-body leading-relaxed">
                <p>
                  <strong>Academic Background</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1 my-2 text-body">
                  <li>LL.B. in Law, Universidad Europea de Madrid.</li>
                  <li>Master in Legal Informatics, Universidad Nacional de Educación a Distancia (UNED).</li>
                  <li>Master in Audiovisual Business Management, Instituto de Empresa (IE), Madrid.</li>
                </ul>

                <p className="mt-6">
                  <strong>Multidisciplinary Editorial Team</strong>
                </p>
                <p>
                  To address the complexity of AI, this project collaborates with top‑tier experts. External
                  contributions come from AI engineers, specialist programmers and legal philosophers, ensuring a
                  comprehensive, technical and humanistic view of today’s legal challenges.
                </p>
              </div>
            </section>

            <div id="manifesto" className="bg-surface/50 p-8 md:p-12 rounded-lg border border-border my-20">
              <header className="mb-12 text-center">
                <p className="text-sm uppercase tracking-widest text-primary mb-4 font-bold">Our Principles</p>
                <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-foreground mb-6">Editorial Manifesto</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Commitment to independence, ethics and critical thinking.
                </p>
              </header>

              <div className="grid gap-12 md:grid-cols-1">
                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">1. Editorial independence</h3>
                  <p className="text-body">
                    Derecho Artificial is an independent editorial project, without commercial funding or ties that
                    compromise critical analysis. We do not accept sponsorships, commercial agreements or affiliation
                    relationships with tech providers or institutions.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">2. Centrality of Law</h3>
                  <p className="text-body">
                    Legal and regulatory analysis prevails over technological, commercial or speculative discourse. We
                    prioritize institutional sources, normative texts and grounded doctrinal analysis.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">3. Primacy of institutional sources</h3>
                  <p className="text-body">
                    Public institutions, regulators, case law and official documentation form the basis of our analysis.
                    Corporate or commercial sources are cited with critical context and never as primary authority.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">4. Human oversight</h3>
                  <p className="text-body">
                    AI cannot replace professional judgment in decisions affecting fundamental rights. We defend
                    effective human oversight—not merely formal—as a non‑negotiable requirement in sensitive legal
                    contexts.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">5. European focus</h3>
                  <p className="text-body">
                    The European framework—AI Act, GDPR, Charter of Fundamental Rights—anchors our analysis. We
                    prioritize the EU regulatory perspective over more permissive models in other jurisdictions.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">6. Prudence on automation</h3>
                  <p className="text-body">
                    We reject technological determinism and unchecked acceleration. Deploying AI systems in legal
                    contexts requires critical risk evaluation, regulatory compliance and preservation of due process
                    guarantees.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">7. Rigour over speed</h3>
                  <p className="text-body">
                    We prioritize accuracy, depth and grounded analysis over immediacy or calendar‑driven publishing.
                    Legal rigour requires time and reflection, not rushed reactions.
                  </p>
                </section>
              </div>
            </div>

            <div className="prose-editorial">
              <section>
                <h2>Participate</h2>
                <p>
                  Derecho Artificial is open to collaboration. If you share our values and wish to contribute—as author,
                  reviewer, translator or otherwise—please get in touch.
                </p>
                <p>
                  We also welcome topic suggestions, error corrections and constructive feedback. The quality of this
                  project depends on dialogue with our reader community.
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
