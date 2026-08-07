import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Glosario de IA Legal y Regulación Europea | Derecho Artificial",
  description: "Diccionario especializado en términos de Inteligencia Artificial, EU AI Act, Legaltech y ética digital. Definiciones clave para abogados y empresas.",
  alternates: {
    canonical: "https://www.derechoartificial.com/glosario-ia-legal",
    languages: {
      es: "https://www.derechoartificial.com/glosario-ia-legal",
      en: "https://decisionandlaw.com/",
    },
  },
  openGraph: {
    type: "website",
    title: "Glosario de IA Legal y Regulación Europea",
    description: "Diccionario especializado en términos de Inteligencia Artificial, EU AI Act, Legaltech y ética digital.",
    url: "https://www.derechoartificial.com/glosario-ia-legal",
    siteName: "Derecho Artificial",
    locale: "es_ES",
    images: [{
      url: "/logo-principal.png",
      width: 1200,
      height: 630,
      alt: "Glosario de IA Legal",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glosario de IA Legal",
    description: "Diccionario especializado en términos de Inteligencia Artificial y Regulación Europea.",
    images: ["/logo-principal.png"],
    creator: "@RicardoScarpa",
  },
};

export default function GlossaryPage() {
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
    html = "<p>El glosario no está disponible en este momento.</p>";
  }
  return (
    <>
      <Breadcrumbs 
        items={[
          { label: "Inicio", href: "/" },
          { label: "Glosario IA Legal", href: "/glosario-ia-legal" }
        ]}
      />
      <main className="min-h-screen pb-20">
      <section className="pt-24 pb-16 md:pt-32 md:pb-12 px-6 bg-background border-b border-divider/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-6">
            Recursos · Diccionario Jurídico
          </p>
          <h1 className="font-display font-black text-[clamp(2rem,5vw,4rem)] text-foreground mb-8 leading-[0.9] tracking-[-0.03em]">
            Glosario de IA Legal
          </h1>
          <p className="text-base text-body leading-relaxed max-w-2xl mx-auto mb-10">
            Definiciones técnicas y jurídicas para comprender el marco regulatorio y doctrinal de la inteligencia artificial en Europa.
          </p>
        </div>
      </section>
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-[0.5px] md:grid-cols-3 bg-divider/30 border border-divider/30">
            <a href="#A" className="bg-card p-8 hover:bg-muted transition-colors">
              <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-3">Índice</p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">Ir al índice alfabético</h3>
              <p className="text-xs text-body leading-relaxed">Accede a los términos desde A hasta X.</p>
            </a>
            <a href="#M" className="bg-card p-8 hover:bg-muted transition-colors">
              <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-3">Atajo</p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">Sección M</h3>
              <p className="text-xs text-body leading-relaxed">Acceso rápido a términos frecuentes.</p>
            </a>
            <a href="/normativa" className="bg-card p-8 hover:bg-muted transition-colors">
              <p className="text-[10px] uppercase tracking-[0.15em] text-caption mb-3">Contexto</p>
              <h3 className="font-display font-bold text-lg text-foreground mb-2 leading-tight">Guía del AI Act</h3>
              <p className="text-xs text-body leading-relaxed">Marco regulatorio y obligaciones.</p>
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
