import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/layout/LegalLayout";
import {
  StructuredData,
  createBreadcrumbJsonLd,
  createLegislationJsonLd,
} from "@/components/seo/StructuredData";
import { RelatedArticles } from "@/components/RelatedArticles";
import { getSectionResourceEntry, listSectionResourceSlugs } from "@/lib/resources";
import { getPostBySlug, getHeroImage, getFeaturedImage } from "@/lib/mdx-utils";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { defaultSchema } from 'hast-util-sanitize';

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema as any).tagNames,
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'caption'
  ],
  attributes: {
    ...(defaultSchema as any).attributes,
    table: ['className'],
    thead: [],
    tbody: [],
    tr: [],
    th: ['align', 'colspan', 'rowspan'],
    td: ['align', 'colspan', 'rowspan'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    code: ['className']
  }
};

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const slugs = await listSectionResourceSlugs("normativa");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  
  // Priorizar MDX nativo
  const mdxPost = getPostBySlug(slug);
  if (mdxPost) {
    const { title, description, category } = mdxPost.frontmatter;
    const metaDescription =
      mdxPost.excerpt || description || "Análisis jurídico experto sobre normativa en IA.";
    const canonical = `https://derechoartificial.com/${category}/${slug}`;
    const ogImage = getHeroImage("normativa");
    return {
      title,
      description: metaDescription,
      alternates: { canonical },
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        type: "article",
        title,
        description: metaDescription,
        url: canonical,
        siteName: "Derecho Artificial",
        locale: "es_ES",
        authors: ['Ricardo Scarpa'],
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }]
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: metaDescription,
        images: [ogImage],
      }
    };
  }

  const entry = await getSectionResourceEntry("normativa", slug);
  if (!entry) return {};
  const description = entry.description || entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 158) || "Análisis jurídico experto sobre IA por Ricardo Scarpa";
  const canonical = `https://derechoartificial.com/normativa/${entry.slug}`;
  const ogImage = getHeroImage("normativa");

  return {
    title: entry.title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      title: entry.title,
      description,
      url: canonical,
      siteName: "Derecho Artificial",
      locale: "es_ES",
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: entry.title
      }],
      publishedTime: entry.dateMs != null ? new Date(entry.dateMs).toISOString() : undefined,
      authors: ['Ricardo Scarpa']
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description,
      images: [ogImage],
      creator: "@RicardoScarpa",
    },
  };
}

export default async function NormativaSlugPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  // Intentar cargar desde MDX nativo primero
  const mdxPost = getPostBySlug(slug);
  
  if (mdxPost) {
    const { title, date, pdf, category } = mdxPost.frontmatter;
    const pdfUrl =
      pdf && (pdf.startsWith("/") || pdf.startsWith("http"))
        ? pdf
        : pdf
        ? `/fuentes/${pdf}.pdf`
        : "";
    return (
      <LegalLayout
        title={title}
        category={category || "Normativa"}
        author={{ name: "Ricardo Scarpa", href: "/quienes-somos" }}
        date={date}
        image={getFeaturedImage(mdxPost)}
      >
        <div className="article-pdf-box mb-12">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn"
            >
              Descargar documento original
            </a>
          ) : null}
        </div>

        <div className="prose prose-lg max-w-prose mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, { schema: sanitizeSchema }]]}
            components={{
              img: (props: any) => <img {...props} loading="lazy" decoding="async" />,
            }}
          >
            {mdxPost.content}
          </ReactMarkdown>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <RelatedArticles 
            currentSlug={slug} 
            currentCategory="normativa" 
            currentTags={mdxPost.frontmatter.tags}
          />
        </div>
      </LegalLayout>
    );
  }

  const entry = await getSectionResourceEntry("normativa", slug);
  if (!entry) notFound();

  const url = `https://derechoartificial.com/normativa/${entry.slug}`;
  const description = entry.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200);

  const datePublished =
    entry.dateMs != null && !Number.isNaN(entry.dateMs)
      ? new Date(entry.dateMs).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  const postDate = (entry as any).date || (entry as any).publishedAt || (entry as any).updatedAt || datePublished;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": entry.title,
    "description": description,
    "author": { 
      "@type": "Person", 
      "name": "Ricardo Scarpa",
      "url": "https://derechoartificial.com/quienes-somos"
    },
    "publisher": { 
      "@type": "Organization", 
      "name": "Derecho Artificial",
      "logo": {
        "@type": "ImageObject",
        "url": "https://derechoartificial.com/logo-principal.png"
      }
    },
    "datePublished": postDate,
    "dateModified": (entry as any).updatedAt || postDate,
    "image": {
      "@type": "ImageObject",
      "url": "https://derechoartificial.com/og-default-1200x630.jpg",
      "width": 1200,
      "height": 630
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  const faqJsonLd = entry.slug === "ai-act-guia-completa" ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Todos los sistemas de IA están regulados por el AI Act?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SÍ, todos los sistemas IA están cubiertos por AI Act, pero con intensidad regulatoria diferente: Prohibidos (Art. 5) con prohibición absoluta; Alto riesgo (Anexo III) con obligaciones estrictas Arts. 9-15; Transparencia (Art. 52) con el deber de informar al usuario que es IA; y Mínimo riesgo con códigos de conducta voluntarios."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué es un sistema de 'alto riesgo'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sistemas IA listados Anexo III que impactan significativamente derechos fundamentales o seguridad. Ejemplos: RRHH, educación, aplicación ley, scoring crediticio, biometría, infraestructuras críticas."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo sé si mi sistema es alto riesgo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Consultar Anexo III AI Act. Si sistema encaja en alguna categoría → Alto riesgo. Casos frontera → Consultar autoridad nacional (AESIA) o asesor jurídico especializado."
        }
      },
      {
        "@type": "Question",
        "name": "¿Puedo usar IA para selección de personal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SÍ, pero es sistema alto riesgo (Anexo III.4.a) → Obligaciones estrictas: Gestión riesgos Art. 9, Datasets sin sesgo Art. 10, FRIAS, Supervisión humana Art. 14 y Marcado CE."
        }
      },
      {
        "@type": "Question",
        "name": "¿Mi chatbot necesita cumplir el AI Act?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Depende: Mínimo riesgo requiere informar al usuario que es IA (Art. 52.1). Si es alto riesgo (ej: chatbot bancario toma decisiones crediticias) → Obligaciones completas Arts. 9-15."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuándo entra en vigor el AI Act?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya está en vigor (1 agosto 2024), pero aplicación escalonada: 2 feb 2025 (prohibiciones Art. 5), 2 ago 2026 (sistemas alto riesgo nuevos), 2 ago 2027 (sistemas alto riesgo existentes - deadline adaptación)."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué es el marcado CE y cómo lo obtengo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Certificación que sistema cumple AI Act → Permite comercializar UE. Cómo obtener: Anexo VI (Autoevaluación interna para mayoría sistemas), Anexo VII (Evaluación organismo notificado para biometría), registrar en base datos UE y aplicar logo CE."
        }
      },
      {
        "@type": "Question",
        "name": "¿Necesito hacer una EIPD y una FRIAS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Si el sistema de IA trata datos personales y es de alto riesgo, ambas son obligatorias: EIPD (RGPD Art. 35) por el tratamiento de datos y FRIAS (AI Act Art. 27) por el impacto en derechos fundamentales. Pueden integrarse en un documento único."
        }
      },
      {
        "@type": "Question",
        "name": "¿Las multas del AI Act se suman a las del RGPD?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SÍ. Si un sistema de IA incumple ambas normativas, las sanciones pueden ser acumulativas: hasta 20M€ por RGPD (AEPD) y hasta 35M€ por AI Act (AESIA), pudiendo superar los 50M€ en casos extremos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Puedo usar ChatGPT o Claude en mi empresa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SÍ, pero con cautelas: verificar que el proveedor cumple el AI Act y, si usas su API para decisiones de alto riesgo (como RRHH), tú asumes las obligaciones de 'desplegador' según el Art. 26. El uso genérico suele ser de bajo riesgo."
        }
      },
      {
        "@type": "Question",
        "name": "¿Los sistemas de IA actuales deben adaptarse?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SÍ. Los sistemas de alto riesgo ya en el mercado tienen hasta el 2 de agosto de 2027 para cumplir con los requisitos de los Arts. 9-15. Si no pueden adaptarse, deberán ser retirados del mercado."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué pasa si mi sistema IA causa un daño?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La responsabilidad es múltiple: administrativa (sanciones AI Act), civil (indemnizaciones por productos defectuosos o negligencia) y potencialmente penal si el daño constituye delito por imprudencia grave."
        }
      },
      {
        "@type": "Question",
        "name": "¿Necesito un DPO para cumplir el AI Act?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El AI Act no lo exige expresamente, pero si el sistema trata datos personales, el RGPD (Art. 37) puede obligar a designar uno. Es muy recomendable contar con un Oficial de IA (Chief AI Officer) para el cumplimiento normativo."
        }
      },
      {
        "@type": "Question",
        "name": "¿Puedo comprar un sistema IA a un proveedor fuera de la UE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SÍ, pero el proveedor debe cumplir el AI Act por su efecto extraterritorial. Tú, como importador (Art. 24), debes verificar la conformidad, conservar la documentación y asegurar que el sistema lleva el marcado CE y tu nombre."
        }
      },
      {
        "@type": "Question",
        "name": "¿Dónde puedo consultar dudas sobre el AI Act?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puedes acudir a la AESIA (cuando esté operativa), al portal de la Comisión Europea (AI Act + AI Pact), a asociaciones empresariales (ADigital, DigitalES) o a un asesor jurídico especializado en tecnología e IA."
        }
      }
    ]
  } : entry.slug === "rgpd-gobernanza-datos-ia" ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Es obligatorio un DPO para una startup de IA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Casi siempre SÍ si trata datos a gran escala, realiza supervisión sistemática de conductas o trata categorías especiales (salud, biometría) como actividad principal. No designarlo puede acarrear multas de hasta 10M€ o 2% de facturación."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo afecta el AI Act a algoritmos ya existentes antes de 2024?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tienen un periodo transitorio hasta el 2 de agosto de 2027 para adaptarse a los requisitos de los Arts. 9-15, obtener el marcado CE y registrarse. No obstante, el RGPD les aplica plenamente desde 2018 sin periodos de gracia."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es el consentimiento la mejor base legal para entrenar modelos IA?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generalmente NO. Es preferible usar la ejecución de contrato (Art. 6.1.b), el interés legítimo (Art. 6.1.f) con test de ponderación, o el interés público para investigación (Art. 89), debido a la dificultad de gestionar revocaciones y granularidad."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué pasa si mi proveedor de IA está en un 'paraíso de datos'?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Se considera transferencia internacional ilegal si no hay decisión de adecuación, CCT 2021 firmadas, un TIA favorable y medidas complementarias (cifrado E2E, seudonimización). Si el riesgo es alto y no hay garantías, no se debe transferir."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es legal el reconocimiento facial para fichar en el trabajo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Casi nunca. La AEPD lo considera desproporcionado si existen alternativas menos invasivas (tarjeta, PIN). Solo se admite en infraestructuras críticas o alta seguridad con una EIPD robusta y consulta previa."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué son los neurodatos y cómo se protegen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Son datos obtenidos de la actividad cerebral. Se consideran categorías especiales (salud) bajo el RGPD y requieren protección máxima: consentimiento reforzado, EIPD obligatoria, minimización estricta y cifrado de alto nivel."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué es la seudonimización y cuándo es obligatoria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es sustituir identificadores por códigos reversibles solo con información adicional separada. Es obligatoria en investigación científica (Art. 89) y muy recomendada como medida de seguridad (Art. 32) y privacidad desde el diseño (Art. 25)."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es nulo el consentimiento dado bajo presión?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SÍ, absolutamente. El consentimiento debe ser libre. Si hay asimetría de poder (empleador-empleado) o el servicio se condiciona a datos no necesarios, el consentimiento es nulo y el tratamiento ilícito, con sanciones de hasta 20M€."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué sanción conlleva NO notificar una brecha de seguridad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Conlleva una doble sanción: por la brecha en sí (hasta 10M€) y por la falta de notificación o retraso (hasta 10M€ adicionales), con el agravante de intencionalidad o negligencia si se intentó ocultar."
        }
      },
      {
        "@type": "Question",
        "name": "¿Quién tiene la última palabra sobre IA: AESIA o AEPD?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Depende: la AESIA supervisa la seguridad técnica y conformidad del producto IA, mientras que la AEPD tiene la competencia exclusiva sobre derechos fundamentales y protección de datos. En caso de conflicto sobre privacidad, prevalece la AEPD."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué es el 'machine unlearning' y qué dice el RGPD?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Es la capacidad de eliminar la huella de datos personales de un modelo entrenado. El RGPD exige cumplir el derecho de supresión (Art. 17). La dificultad técnica o el coste no eximen de la obligación de borrar los datos si son exactos e identificables."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es legal usar IA para predecir el abandono de clientes con datos de salud?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NO, si no se tiene un consentimiento específico para esa finalidad comercial. El uso de datos de salud para marketing predictivo se considera incompatible con la finalidad original de bienestar y viola el principio de limitación de la finalidad."
        }
      }
    ]
  } : null;

  const jsonLd = createLegislationJsonLd({
    url,
    name: entry.title,
    description,
    datePublished,
    jurisdiction: entry.jurisdiction ?? undefined,
  });

  const breadcrumbJsonLd = createBreadcrumbJsonLd({
    items: [
      {
        name: "Derecho Artificial",
        url: "https://derechoartificial.com",
      },
      {
        name: "Normativa",
        url: "https://derechoartificial.com/normativa",
      },
      {
        name: entry.title,
        url,
      },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <StructuredData data={[jsonLd, breadcrumbJsonLd]} />
      <LegalLayout title={entry.title} category="Normativa">
        <div className="article-pdf-box mb-12">
          {entry.summaryHtml ? (
            <div
              className="prose prose-slate max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: entry.summaryHtml }}
            />
          ) : null}
          {entry.sourceUrl ? (
            <a
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="article-pdf-btn"
            >
              Descargar documento original
            </a>
          ) : null}
        </div>
        {entry.bodyHtml ? <div dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} /> : null}
        <RelatedArticles 
          currentSlug={entry.slug} 
          currentCategory="normativa" 
          currentTags={entry.slug === "ai-act-guia-completa" ? ["#AIAct", "#Regulación", "#UE"] : entry.slug === "rgpd-gobernanza-datos-ia" ? ["#RGPD", "#Privacidad", "#IA"] : []}
        />
      </LegalLayout>
    </>
  );
}
