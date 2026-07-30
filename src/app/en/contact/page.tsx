import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/app/contacto/ui/ContactForm";
import { StructuredData, createBreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact form for inquiries, corrections, and editorial collaborations.",
  keywords: [
    "contact",
    "AI law",
    "editorial collaboration",
    "corrections",
    "AI compliance",
  ],
  alternates: {
    canonical: "/en/contact",
    languages: {
      "es-ES": "/contacto",
      "en-US": "/en/contact",
    },
  },
  openGraph: {
    type: "website",
    title: "Contact",
    description: "Contact form for inquiries, corrections, and editorial collaborations.",
    url: "/en/contact",
    locale: "en_US",
    images: [
      {
        url: "/logo-principal.png",
      },
    ],
  },
};

export default function ContactPage() {
  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntityOfPage: "https://derechoartificial.com/en/contact",
    name: "Contact - Derecho Artificial",
    description:
      "Contact form for inquiries, corrections, and editorial collaborations.",
  };

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com/en",
      },
      {
        name: "Contact",
        url: "https://derechoartificial.com/en/contact",
      },
    ],
  });

  return (
    <>
      <StructuredData data={[contactPageJsonLd, breadcrumbJsonLd]} />
      <main>
        <section className="section-spacing" id="contact">
          <div className="container-editorial">
            <header className="mb-16">
              <p className="text-sm uppercase tracking-widest text-caption mb-4">Contact</p>
              <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground leading-tight">Get in touch</h1>
              <p className="text-lg text-body max-w-2xl mt-6">
                We welcome suggestions, corrections, collaboration proposals, and any constructive feedback on our work.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <Suspense fallback={null}>
                  <ContactForm locale="en" />
                </Suspense>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-display font-bold tracking-tight text-lg text-foreground mb-3">Response times</h3>
                    <p className="text-sm text-body">
                      We respond to all messages within 3–5 business days. For urgent inquiries, please indicate it in
                      the subject line.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display font-bold tracking-tight text-lg text-foreground mb-3">Privacy</h3>
                    <p className="text-sm text-body">
                      We process your data only to reply to your inquiry and, if applicable, coordinate editorial
                      collaboration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
