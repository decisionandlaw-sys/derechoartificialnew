type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

function toJsonLd(data: JsonLdValue) {
  return JSON.stringify(data);
}

export function StructuredData({ data }: { data: JsonLdValue }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(data) }} />;
}

const siteUrl = "https://www.derechoartificial.com";

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Derecho Artificial",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo-principal.png`,
    },
    sameAs: [
      "https://x.com/derechoartificial",
      "https://www.linkedin.com/company/derechoartificial",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@derechoartificial.com",
      availableLanguage: ["es", "en"],
    },
  };
}

export function createWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Derecho Artificial",
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: ["es-ES", "en-US"],
  };
}

export function createBreadcrumbJsonLd(params: { items: { name: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: params.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createPersonJsonLd(params: {
  name: string;
  url: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${params.url}#person`,
    name: params.name,
    url: params.url,
    description: params.description,
    worksFor: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function createArticleJsonLd(params: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) {
  const siteUrl = "https://www.derechoartificial.com";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url
    },
    headline: params.headline,
    description: params.description,
    image: params.image ? [params.image] : [`${siteUrl}/og-default-1200x630.jpg`],
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    license: `${siteUrl}/aviso-legal`,
    author: {
      "@type": "Person",
      name: params.authorName ?? "Ricardo Scarpa",
      url: "https://www.derechoartificial.com/quienes-somos",
      "@id": "https://www.derechoartificial.com/quienes-somos"
    },
    publisher: {
      "@type": "Organization",
      "name": "Derecho Artificial",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo-principal.png`
      },
      "@id": `${siteUrl}/#organization`
    },
  };
}

export function createGenericArticleJsonLd(params: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": params.url
    },
    "headline": params.headline,
    "description": params.description,
    "author": {
      "@type": "Person",
      "name": params.authorName ?? "Ricardo Scarpa",
      "url": "https://www.derechoartificial.com/quienes-somos"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Derecho Artificial",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.derechoartificial.com/logo-principal.png"
      }
    },
    "datePublished": params.datePublished,
    "dateModified": params.dateModified ?? params.datePublished,
    "image": params.image ?? "/logo-principal.png"
  };
}

export function createNewsArticleJsonLd(params: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url,
    },
    headline: params.headline,
    description: params.description,
    image: params.image ? [params.image] : [`${siteUrl}/logo-principal.png`],
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    license: `${siteUrl}/aviso-legal`,
    author: {
      "@type": "Person",
      name: params.authorName ?? "Ricardo Scarpa",
      url: "https://www.derechoartificial.com/quienes-somos",
      "@id": "https://www.derechoartificial.com/quienes-somos",
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function createLegalDecisionJsonLd(params: {
  url: string;
  name: string;
  description: string;
  datePublished: string;
  courtName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalDecision",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url
    },
    name: params.name,
    headline: params.name,
    description: params.description,
    datePublished: params.datePublished,
    license: `${siteUrl}/aviso-legal`,
    author: {
      "@type": "Person",
      name: "Ricardo Scarpa",
      url: "https://www.derechoartificial.com/quienes-somos",
      "@id": "https://www.derechoartificial.com/quienes-somos"
    },
    publisher: {
      "@id": `${siteUrl}/#organization`
    },
    ...(params.courtName && { creator: { "@type": "Organization", name: params.courtName } })
  };
}

export function createLegislationJsonLd(params: {
  url: string;
  name: string;
  description: string;
  datePublished: string;
  jurisdiction?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Legislation",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url
    },
    name: params.name,
    headline: params.name,
    description: params.description,
    datePublished: params.datePublished,
    license: `${siteUrl}/aviso-legal`,
    author: {
      "@type": "Person",
      name: "Ricardo Scarpa",
      url: "https://www.derechoartificial.com/quienes-somos",
      "@id": "https://www.derechoartificial.com/quienes-somos"
    },
    publisher: {
      "@id": `${siteUrl}/#organization`
    },
    ...(params.jurisdiction && { legislationJurisdiction: params.jurisdiction })
  };
}

export function createLegalServiceJsonLd(params: {
  url: string;
  name: string;
  description: string;
  providerName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: params.name,
    url: params.url,
    description: params.description,
    provider: {
      "@type": "Organization",
      name: params.providerName ?? "Derecho Artificial",
      url: siteUrl,
      logo: `${siteUrl}/logo-principal.png`,
    },
  };
}

export function createLegalArticleJsonLd(params: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.url
    },
    headline: params.headline,
    description: params.description,
    datePublished: params.datePublished,
    license: `${siteUrl}/aviso-legal`,
    author: {
      "@type": "Person",
      name: params.authorName ?? "Ricardo Scarpa",
      url: "https://www.derechoartificial.com/quienes-somos",
      "@id": "https://www.derechoartificial.com/quienes-somos"
    },
    publisher: {
      "@type": "Organization",
      name: "Derecho Artificial",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo-principal.png`,
      },
    },
  };
}
