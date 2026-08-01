import type { Metadata } from "next";
import { SEOHead } from "@/components/SEOHead";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Suspense } from "react";
import { ContactForm } from "./ui/ContactForm";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata = SEOHead({
  title: "Contacto",
  description: "Formulario de contacto para consultas jurídicas sobre IA, correcciones y colaboraciones editoriales.",
  canonical: "/contacto",
  ogType: "website"
});

export default function ContactoPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { label: "Inicio", href: "/" },
          { label: "Contacto", href: "/contacto" }
        ]}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          mainEntityOfPage: "https://derechoartificial.com/contacto",
          name: "Contacto - Derecho Artificial",
          description:
            "Formulario de contacto para consultas jurídicas sobre IA, correcciones y colaboraciones editoriales.",
        }}
      />
      <main>
        <section className="section-spacing" id="contacto">
          <div className="container-editorial">
            <header className="mb-16">
              <p className="text-sm uppercase tracking-widest text-caption mb-4">Contacto</p>
              <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground leading-tight">
                Póngase en contacto
              </h1>
              <p className="text-lg text-body max-w-2xl mt-6">
                Agradecemos sugerencias, correcciones, propuestas de colaboración y cualquier comentario constructivo
                sobre nuestro trabajo.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-8">
                  <div>
                    <h3 className="font-display font-bold tracking-tight text-lg text-foreground mb-3">Tiempos de respuesta</h3>
                    <p className="text-sm text-body">
                      Respondemos a todos los mensajes en un plazo de 3-5 días hábiles. Para consultas urgentes, por
                      favor indíquelo en el asunto.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-display font-bold tracking-tight text-lg text-foreground mb-3">Privacidad</h3>
                    <p className="text-sm text-body">
                      Trataremos tus datos únicamente para responder a tu consulta y, si procede, coordinar la
                      colaboración editorial.
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
