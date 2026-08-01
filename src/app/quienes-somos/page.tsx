import type { Metadata } from "next";
import { StructuredData } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Conoce el proyecto editorial Derecho Artificial, la trayectoria del responsable editorial y el Manifiesto Editorial.",
  keywords: [
    "Derecho Artificial",
    "proyecto editorial",
    "manifiesto editorial",
    "Ricardo Scarpa",
    "derecho e inteligencia artificial",
    "ética",
    "regulación",
  ],
  alternates: {
    canonical: "/quienes-somos",
    languages: {
      "es-ES": "/quienes-somos",
      "en-US": "https://decisionandlaw.com/",
    },
  },
  openGraph: {
    type: "website",
    title: "Quiénes somos | Derecho Artificial",
    description:
      "Conoce el proyecto editorial Derecho Artificial, la trayectoria del responsable editorial y el Manifiesto Editorial.",
    url: "https://derechoartificial.com/quienes-somos",
    siteName: "Derecho Artificial",
    locale: "es_ES",
    images: [
      {
        url: "/logo-principal.png",
        width: 1200,
        height: 630,
        alt: "Sobre Derecho Artificial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiénes somos",
    description: "Conoce el proyecto editorial Derecho Artificial y su misión.",
    images: ["/logo-principal.png"],
    creator: "@RicardoScarpa",
  },
};

export default function QuienesSomosPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { label: "Inicio", href: "/" },
          { label: "Quiénes Somos", href: "/quienes-somos" }
        ]}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          mainEntityOfPage: "https://derechoartificial.com/quienes-somos",
          name: "Quiénes somos - Derecho Artificial",
          description:
            "Conoce el proyecto editorial Derecho Artificial, la trayectoria del responsable editorial y el Manifiesto Editorial.",
        }}
      />
      <main>
        <article className="section-spacing" id="mision">
          <div className="container-editorial">
            <header className="mb-16">
              <p className="text-sm uppercase tracking-widest text-caption mb-4">Sobre el proyecto</p>
              <div className="flex items-center gap-2 mb-6">
                <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground leading-tight">
                  Sobre Derecho Artificial
                </h1>
              </div>
              <p className="text-lg text-body">
                Un espacio para la reflexión jurídica rigurosa en la era de la inteligencia artificial.
              </p>
            </header>

            <div className="prose-editorial mb-24">
              <section className="mb-16">
                <h2>Qué es Derecho Artificial</h2>
                <p>
                  Derecho Artificial es una publicación editorial independiente dedicada al análisis de las
                  implicaciones jurídicas, éticas y sociales de la inteligencia artificial. Nuestro objetivo es
                  contribuir al debate informado sobre cómo el Derecho debe responder a los desafíos que plantean
                  estas tecnologías.
                </p>
                <p>
                  Fundado en 2024, el proyecto nace de la convicción de que el mundo hispanohablante necesita un
                  espacio de referencia donde profesionales del Derecho, académicos, reguladores y ciudadanos
                  puedan encontrar análisis riguroso y accesible sobre estos temas.
                </p>
              </section>

              <section className="mb-16">
                <h2>Por qué existimos</h2>
                <p>
                  La inteligencia artificial está transformando la práctica jurídica y plantea cuestiones
                  fundamentales sobre justicia, responsabilidad y derechos humanos. Sin embargo, gran parte del
                  debate público está dominado por:
                </p>
                <ul className="list-disc pl-6 space-y-3 my-6">
                  <li>Discursos promocionales de empresas tecnológicas que minimizan riesgos.</li>
                  <li>Narrativas sensacionalistas que exageran amenazas sin rigor.</li>
                  <li>Ánalisis técnicos inaccesibles para no especialistas.</li>
                  <li>
                    Contenido en inglés que no considera las particularidades de los sistemas jurídicos
                    hispanohablantes.
                  </li>
                </ul>
                <p>
                  Derecho Artificial busca ocupar el espacio intermedio: análisis serio pero accesible, crítico
                  pero constructivo, global pero atento a las realidades locales.
                </p>
              </section>

              <section className="mb-16">
                <h2>A quién nos dirigimos</h2>
                <p>Nuestros contenidos están diseñados para:</p>
                <ul className="list-disc pl-6 space-y-3 my-6">
                  <li>
                    <strong>Profesionales del Derecho</strong>: Abogados, jueces, fiscales y notarios que necesitan
                    comprender las herramientas de IA que afectan su práctica.
                  </li>
                  <li>
                    <strong>Académicos e investigadores</strong>: Profesores y estudiantes de Derecho que estudian
                    la intersección con la tecnología.
                  </li>
                  <li>
                    <strong>Reguladores y decisores políticos</strong>: Funcionarios que diseñan e implementan
                    marcos normativos para la IA.
                  </li>
                  <li>
                    <strong>Ciudadanos informados</strong>: Personas interesadas en comprender cómo la IA afecta
                    sus derechos.
                  </li>
                </ul>
              </section>

              <section className="mb-16">
                <h2>Nuestro enfoque</h2>
                <p>Nos guiamos por los siguientes principios metodológicos:</p>
                <ul className="list-disc pl-6 space-y-3 my-6">
                  <li>
                    <strong>Rigor académico</strong>: Basamos nuestros análisis en fuentes primarias, jurisprudencia
                    y doctrina actualizada.
                  </li>
                  <li>
                    <strong>Independencia editorial</strong>: No aceptamos contenido patrocinado ni publicidad que
                    comprometa nuestra línea editorial.
                  </li>
                  <li>
                    <strong>Accesibilidad</strong>: Evitamos la jerga innecesaria sin sacrificar precisión técnica.
                  </li>
                  <li>
                    <strong>Perspectiva crítica</strong>: Cuestionamos tanto el tecno-optimismo como el catastrofismo
                    injustificado.
                  </li>
                  <li>
                    <strong>Enfoque práctico</strong>: Conectamos el análisis teórico con implicaciones concretas para
                    la práctica jurídica.
                  </li>
                </ul>
              </section>

              <section className="mb-16">
                <h2>Cómo trabajamos</h2>
                <p>
                  Todos nuestros contenidos pasan por un proceso de revisión editorial que incluye verificación de
                  fuentes y revisión por pares cuando es apropiado. Publicamos correcciones cuando identificamos
                  errores y mantenemos transparencia sobre nuestras fuentes de financiación.
                </p>
                <p>
                  Actualmente, Derecho Artificial es un proyecto sin ánimo de lucro sostenido por contribuciones
                  voluntarias. No utilizamos publicidad intrusiva ni vendemos datos de usuarios. Nuestra única
                  fuente de ingresos son donaciones de lectores y ocasionales proyectos de consultoría académica.
                </p>
              </section>
            </div>

            <section className="mb-24 p-8 bg-surface border border-divider rounded-lg">
              <h2 className="font-display font-bold tracking-tight text-2xl md:text-3xl text-foreground mb-6">
                Sobre el responsable editorial
              </h2>
              <p className="text-lg text-body mb-6">
                Este proyecto editorial está dirigido y coordinado por <strong>Ricardo S. C.</strong>
              </p>

              <div className="space-y-4 text-body leading-relaxed">
                <p>
                  <strong>Formación Académica</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1 my-2 text-body">
                  <li>Licenciado en Derecho por la Universidad Europea de Madrid.</li>
                  <li>
                    Máster en Informática Jurídica por la Universidad Nacional de Educación a Distancia (UNED).
                  </li>
                  <li>
                    Máster en Dirección de Empresas Audiovisuales por el Instituto de Empresa (IE) de Madrid.
                  </li>
                </ul>

                <p className="mt-6">
                  <strong>Equipo Editorial Multidisciplinar</strong>
                </p>
                <p>
                  Para abordar la complejidad de la Inteligencia Artificial, este proyecto cuenta con la colaboración
                  activa de expertos de primer nivel en cada especialidad. Las aportaciones externas se nutren de
                  ingenieros en Inteligencia Artificial, programadores especialistas y filósofos del Derecho,
                  garantizando una visión integral, técnica y humanista de los desafíos jurídicos actuales.
                </p>
              </div>
            </section>

            <div id="manifiesto" className="bg-surface/50 p-8 md:p-12 rounded-lg border border-border my-20">
              <header className="mb-12 text-center">
                <p className="text-sm uppercase tracking-widest text-primary mb-4 font-bold">
                  Nuestros Principios
                </p>
                <h2 className="font-display font-bold tracking-tight text-3xl md:text-4xl text-foreground mb-6">Manifiesto Editorial</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Compromiso con la independencia, la ética y el pensamiento crítico.
                </p>
              </header>

              <div className="grid gap-12 md:grid-cols-1">
                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">
                    1. Independencia editorial
                  </h3>
                  <p className="text-body">
                    Derecho Artificial es un proyecto editorial independiente, sin financiación comercial ni vínculos
                    que comprometan el análisis crítico. No aceptamos patrocinios, acuerdos comerciales ni relaciones
                    de afiliación con proveedores tecnológicos o instituciones.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">
                    2. Centralidad del derecho
                  </h3>
                  <p className="text-body">
                    El análisis jurídico, normativo y regulatorio prevalece sobre discursos tecnológicos, comerciales
                    o especulativos. Priorizamos fuentes institucionales, textos normativos y análisis doctrinal
                    fundamentado.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">
                    3. Primacía de fuentes institucionales
                  </h3>
                  <p className="text-body">
                    Las instituciones públicas, organismos reguladores, jurisprudencia y documentación oficial
                    constituyen la base de nuestro análisis. Las fuentes corporativas o comerciales se citan con
                    contexto crítico y nunca como autoridad primaria.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">4. Supervisión humana</h3>
                  <p className="text-body">
                    La inteligencia artificial no puede sustituir el juicio profesional en decisiones que afectan
                    derechos fundamentales. Defendemos la supervisión humana efectiva, no meramente formal, como
                    requisito ineludible en contextos jurídicos sensibles.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">5. Enfoque europeo</h3>
                  <p className="text-body">
                    El marco normativo europeo—AI Act, RGPD, Carta de Derechos Fundamentales—constituye el eje de
                    nuestro análisis. Priorizamos la perspectiva regulatoria europea sobre modelos más permisivos de
                    otras jurisdicciones.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">
                    6. Prudencia frente a automatización
                  </h3>
                  <p className="text-body">
                    Rechazamos el determinismo tecnológico y la aceleración sin reflexión. La adopción de sistemas de
                    IA en el ámbito jurídico requiere evaluación crítica de riesgos, cumplimiento normativo y
                    preservación de garantías procesales.
                  </p>
                </section>

                <section>
                  <h3 className="font-display font-bold tracking-tight text-xl text-foreground mb-3 font-semibold">7. Rigor sobre velocidad</h3>
                  <p className="text-body">
                    Priorizamos la precisión, la profundidad y el análisis fundamentado sobre la inmediatez o la
                    publicación por calendario. El rigor jurídico exige tiempo y reflexión, no reacciones
                    precipitadas.
                  </p>
                </section>
              </div>
            </div>

            <div className="prose-editorial">
              <section>
                <h2>Participe</h2>
                <p>
                  Derecho Artificial es un proyecto abierto a la colaboración. Si comparte nuestros valores y desea
                  contribuir —como autor, revisor, traductor o de cualquier otra forma— le invitamos a ponerse en
                  contacto con nosotros.
                </p>
                <p>
                  También agradecemos sugerencias de temas, correcciones de errores y comentarios constructivos sobre
                  nuestros contenidos. La calidad de este proyecto depende del diálogo con nuestra comunidad de
                  lectores.
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
