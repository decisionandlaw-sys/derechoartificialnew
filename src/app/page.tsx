import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listContentSlugs, getContentEntry } from '@/lib/content';
import { getSectionResourceEntry, listSectionResourceSlugs, type ResourceEntry } from '@/lib/resources';
import { getAllPosts } from '@/lib/mdx-utils';
import { formatDateFromMs, isNew } from '@/lib/badges';

// Revalidación automática cada hora
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Regulación IA: AI Act, RGPD y compliance",
  description:
    "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
  keywords: [
    "derecho artificial",
    "inteligencia artificial",
    "regulación IA",
    "AI Act",
    "RGPD",
    "jurisprudencia",
    "cumplimiento",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    title: "Regulación IA: AI Act, RGPD y compliance",
    description:
      "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
    url: "https://derechoartificial.com",
    siteName: "Derecho Artificial",
    locale: "es_ES",
    images: [
      {
        url: "/logo-principal.png",
        width: 1200,
        height: 630,
        alt: "Derecho Artificial - Perspectivas Legales sobre IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regulación IA: AI Act, RGPD y compliance",
    description:
      "Domina el AI Act, el RGPD y la jurisprudencia IA. Análisis jurídico, guías de compliance y sentencias comentadas para abogados y DPO.",
    images: ["/logo-principal.png"],
    creator: "@RicardoScarpa",
  },
};

export default async function HomePage() {
  const [
    actualidadJsonSlugs,
    actualidadResourceSlugs,
    firmaJsonSlugs,
    firmaResourceSlugs,
    normativaSlugs,
    jurisprudenciaSlugs,
    guiasSlugs,
  ] = await Promise.all([
    listContentSlugs("guias-ia"),
    listSectionResourceSlugs("guias-ia"),
    listContentSlugs("firma-scarpa"),
    listSectionResourceSlugs("firma-scarpa"),
    listSectionResourceSlugs("normativa"),
    listSectionResourceSlugs("jurisprudencia"),
    listSectionResourceSlugs("guias"),
  ]);

  const [actualidadJsonEntries, actualidadResourceEntries, firmaJsonEntries, firmaResourceEntries] =
    await Promise.all([
      Promise.all(actualidadJsonSlugs.map((slug) => getContentEntry("guias-ia", slug))),
      Promise.all(actualidadResourceSlugs.map((slug) => getSectionResourceEntry("guias-ia", slug))),
      Promise.all(firmaJsonSlugs.map((slug) => getContentEntry("firma-scarpa", slug))),
      Promise.all(firmaResourceSlugs.map((slug) => getSectionResourceEntry("firma-scarpa", slug))),
    ]);

  const resolvedActualidadJson = actualidadJsonEntries.filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );
  const resolvedActualidadResources = actualidadResourceEntries.filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );
  const resolvedFirmaJson = firmaJsonEntries.filter((e): e is NonNullable<typeof e> => Boolean(e));
  const resolvedFirmaResources = firmaResourceEntries.filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );

  const unifiedActualidad = [
    ...resolvedActualidadJson.map((e) => ({
      title: e.title,
      description: e.description,
      date: (() => {
        const publishedMs =
          typeof e.datePublished === "string" ? new Date(e.datePublished).getTime() : NaN;
        const fallback = typeof e.dateMs === "number" && !Number.isNaN(e.dateMs) ? e.dateMs : 0;
        return Number.isNaN(publishedMs) ? fallback : publishedMs;
      })(),
      urlPath: e.urlPath,
      author: e.author,
    })),
    ...resolvedActualidadResources.map((e) => ({
      title: e.title,
      description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
      date: e.displayDateMs ?? e.dateMs ?? 0,
      urlPath: `/guias-ia/${e.slug}`,
      author: "Derecho Artificial",
    })),
  ];

  const unifiedFirma = [
    // Priorizar posts MDX de Firma Scarpa
    ...getAllPosts().filter(post => {
      const category = (post.frontmatter.category || "").toLowerCase();
      const section = (post.frontmatter.section || "").toLowerCase();
      const categoryNormalized = category.replace(/-/g, ' ');
      const sectionNormalized = section.replace(/-/g, ' ');
      
      return (
        category === "firma-scarpa" ||
        categoryNormalized === "firma scarpa" ||
        categoryNormalized === "firma-scarpa" ||
        section === "firma-scarpa" ||
        sectionNormalized === "firma scarpa" ||
        sectionNormalized === "firma-scarpa"
      );
    }).map(post => ({
      title: post.frontmatter.title,
      description: post.excerpt,
      date: post.dateMs,
      urlPath: post.url,
      author: post.frontmatter.author || "Ricardo Scarpa",
    })),
    // Luego añadir recursos JSON legacy
    ...resolvedFirmaJson.map((e) => ({
      title: e.title,
      description: e.description,
      date: (() => {
        const publishedMs =
          typeof e.datePublished === "string" ? new Date(e.datePublished).getTime() : NaN;
        const fallback = typeof e.dateMs === "number" && !Number.isNaN(e.dateMs) ? e.dateMs : 0;
        return Number.isNaN(publishedMs) ? fallback : publishedMs;
      })(),
      urlPath: e.urlPath,
      author: e.author,
    })),
    // Finalmente añadir recursos PDF
    ...resolvedFirmaResources.map((e) => ({
      title: e.title,
      description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
      date: e.displayDateMs ?? e.dateMs ?? 0,
      urlPath: `/firma-scarpa/${e.slug}`,
      author: "Derecho Artificial",
    })),
  ].sort((a, b) => b.date - a.date);

  unifiedActualidad.sort((a, b) => b.date - a.date);

  const latestActualidad = unifiedActualidad[0] ?? null;
  const latestFirma = unifiedFirma[0] ?? null;

  const homeFeaturedSlugs = [
    "ai-act-guia-completa",
    "rgpd-gobernanza-datos-ia",
    "analisis-negligencia-chatgpt"
  ];

  const [latestNormativa, latestJurisprudencia, latestGuias] = await Promise.all([
    Promise.all(normativaSlugs.map((slug) => getSectionResourceEntry("normativa", slug))).then((arr) => {
      const items = arr.filter((e): e is NonNullable<typeof e> => Boolean(e));
      items.sort(
        (a, b) =>
          (b.displayDateMs ?? b.dateMs ?? 0) -
          (a.displayDateMs ?? a.dateMs ?? 0),
      );
      return items[0] ?? null;
    }),
    Promise.all(jurisprudenciaSlugs.map((slug) => getSectionResourceEntry("jurisprudencia", slug))).then((arr) => {
      const items = arr.filter((e): e is NonNullable<typeof e> => Boolean(e));
      items.sort(
        (a, b) =>
          (b.displayDateMs ?? b.dateMs ?? 0) -
          (a.displayDateMs ?? a.dateMs ?? 0),
      );
      return items[0] ?? null;
    }),
    Promise.all(guiasSlugs.map((slug) => getSectionResourceEntry("guias", slug))).then((arr) => {
      const items = arr.filter((e): e is NonNullable<typeof e> => Boolean(e));
      items.sort(
        (a, b) =>
          (b.displayDateMs ?? b.dateMs ?? 0) -
          (a.displayDateMs ?? a.dateMs ?? 0),
      );
      return items[0] ?? null;
    }),
  ]);

  const [normativaEntriesAll, jurisprudenciaEntriesAll, guiasEntriesAll] = await Promise.all([
    Promise.all(normativaSlugs.map((slug) => getSectionResourceEntry("normativa", slug))),
    Promise.all(jurisprudenciaSlugs.map((slug) => getSectionResourceEntry("jurisprudencia", slug))),
    Promise.all(guiasSlugs.map((slug) => getSectionResourceEntry("guias", slug))),
  ]);

  // Crear una lista unificada de todas las entradas recientes para la sección "Actualidad y Análisis"
  const mdxPosts = getAllPosts();
  const normalizeLangText = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const detectLanguage = (title: string, description: string): "es" | "other" => {
    const text = normalizeLangText(`${title} ${description}`.toLowerCase());
    const countMatches = (words: string[]) =>
      words.reduce((acc, word) => acc + (text.match(new RegExp(`\\b${word}\\b`, "g"))?.length ?? 0), 0);
    const esScore = countMatches([
      "el",
      "los",
      "las",
      "del",
      "y",
      "para",
      "datos",
      "proteccion",
      "privacidad",
      "agencia",
      "inteligencia",
    ]);
    const frScore = countMatches(["le", "les", "des", "dans", "droits", "effacement"]);
    if (esScore === 0) return "other";
    if (esScore > frScore) return "es";
    return "other";
  };
  const isAllowedLanguage = (title: string, description: string) => detectLanguage(title, description) === "es";
  const newsMdxCandidates = mdxPosts
    .filter((post) => {
      const cat = (post.frontmatter.category || "").toLowerCase();
      const tags = (post.frontmatter.tags || []).map((t: string) => t.toLowerCase());
      return (
        cat === "noticia" ||
        cat === "guias-ia" ||
        tags.includes("noticia") ||
        tags.includes("guias-ia") ||
        tags.includes("actualidad") ||
        tags.includes("news")
      );
    })
    .filter((post) => isAllowedLanguage(post.frontmatter.title, post.excerpt))
    .sort((a, b) => b.dateMs - a.dateMs)
    .slice(0, 6);
  const newsEntries =
    newsMdxCandidates.length > 0
      ? newsMdxCandidates.map((post) => ({
          title: post.frontmatter.title,
          description: post.excerpt,
          date: post.dateMs,
          urlPath: post.url,
          author: post.frontmatter.author || "Derecho Artificial",
          type: "Noticias IA" as const,
        }))
      : unifiedActualidad.slice(0, 6).map((e) => ({
          title: e.title,
          description: e.description,
          date: e.date,
          urlPath: e.urlPath,
          author: e.author,
          type: "Noticias IA" as const,
        }));

  const allRecentEntries: any[] = [];

  const formatDate = (value: string | number) => {
    // Si es un timestamp numérico (milisegundos desde 1970)
    if (typeof value === 'number') {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
    }
    
    // Si es una string de fecha (como "2026-02-10")
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const toMs = (value: string | number | Date | null | undefined) => {
    if (value == null) return 0;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 0;
    return d.getTime();
  };

  const [normativaTopEntries, jurisprudenciaTopEntries, guiasTopEntries] = await Promise.all([
    Promise.all(normativaSlugs.map((slug) => getSectionResourceEntry("normativa", slug))).then((arr) => {
      const items = arr.filter((e): e is NonNullable<typeof e> => Boolean(e));
      items.sort(
        (a, b) =>
          (b.displayDateMs ?? b.dateMs ?? 0) -
          (a.displayDateMs ?? a.dateMs ?? 0),
      );
      return items.slice(0, 2);
    }),
    Promise.all(jurisprudenciaSlugs.map((slug) => getSectionResourceEntry("jurisprudencia", slug))).then((arr) => {
      const items = arr.filter((e): e is NonNullable<typeof e> => Boolean(e));
      items.sort(
        (a, b) =>
          (b.displayDateMs ?? b.dateMs ?? 0) -
          (a.displayDateMs ?? a.dateMs ?? 0),
      );
      return items.slice(0, 2);
    }),
    Promise.all(guiasSlugs.map((slug) => getSectionResourceEntry("guias", slug))).then((arr) => {
      const items = arr.filter((e): e is NonNullable<typeof e> => Boolean(e));
      items.sort(
        (a, b) =>
          (b.displayDateMs ?? b.dateMs ?? 0) -
          (a.displayDateMs ?? a.dateMs ?? 0),
      );
      return items.slice(0, 2);
    }),
  ]);

  const normativaItems =
    normativaTopEntries
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/normativa/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? 0, "es-ES")} · Análisis normativo con fuentes oficiales`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];

  const jurisprudenciaItems =
    jurisprudenciaTopEntries
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/jurisprudencia/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? 0, "es-ES")} · Resoluciones clave sobre algoritmos y derechos`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];

  const guiasItems =
    guiasTopEntries
      .filter((e): e is NonNullable<typeof e> => Boolean(e))
      .map((e) => ({
        title: e.title,
        href: `/guias-ia/${e.slug}`,
        description: e.summaryHtml ? e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200) : "",
        meta: `${formatDateFromMs(e.displayDateMs ?? 0, "es-ES")} · Repositorio de documentación técnica y ética`,
        dateMs: e.displayDateMs ?? e.dateMs ?? 0,
      })) ?? [];

  const latestActualidadMs = toMs(unifiedActualidad[0]?.date);
  const latestJurisprudenciaMs =
    jurisprudenciaTopEntries[0]?.displayDateMs ?? jurisprudenciaTopEntries[0]?.dateMs ?? 0;
  const latestNormativaMs =
    normativaTopEntries[0]?.displayDateMs ?? normativaTopEntries[0]?.dateMs ?? 0;
  const latestGuiasMs = guiasTopEntries[0]?.displayDateMs ?? guiasTopEntries[0]?.dateMs ?? 0;
  const latestFirmaMs = toMs(unifiedFirma[0]?.date);
  const actualidadWeeklyCount = unifiedActualidad.filter((e) => isNew(e.date)).length;
  const firmaWeeklyCount = unifiedFirma.filter((e) => isNew(e.date)).length;

  const normativaWeeklyCount = normativaEntriesAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? 0)).length;
  const jurisprudenciaWeeklyCount = jurisprudenciaEntriesAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? 0)).length;
  const guiasWeeklyCount = guiasEntriesAll
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => isNew(e.displayDateMs ?? 0)).length;

  const uniqueByHref = <T extends { href: string }>(arr: T[]) => {
    const seen = new Set<string>();
    const res: T[] = [];
    for (const it of arr) {
      if (seen.has(it.href)) continue;
      seen.add(it.href);
      res.push(it);
    }
    return res;
  };

  const sectionCards = [
    {
      key: "firma-scarpa",
      label: "Firma Scarpa",
      href: "/firma-scarpa",
      image: "/images/sections/firma-scarpa.jpg",
      items: uniqueByHref(
        [unifiedFirma[0], unifiedFirma[1]]
          .filter((e): e is NonNullable<typeof e> => Boolean(e))
          .map((e) => ({
            title: e.title,
            href: e.urlPath,
            description: e.description ?? "",
            meta: `${formatDate(e.date)} · ${e.author}`,
            dateMs: e.date,
          })),
      ),
    },
    {
      key: "jurisprudencia",
      label: "Jurisprudencia",
      href: "/jurisprudencia",
      image: "/images/sections/jurisprudencia.jpg",
      items: uniqueByHref(jurisprudenciaItems).slice(0, 2),
    },
    {
      key: "normativa",
      label: "Normativa",
      href: "/normativa",
      image: "/images/sections/normativa.jpg",
      items: uniqueByHref(normativaItems).slice(0, 2),
    },
    {
      key: "guias",
      label: "Guías y Protocolos",
      href: "/guias-ia",
      image: "/images/sections/guias-ia.jpg",
      items: uniqueByHref(guiasItems).slice(0, 2),
    },
    {
      key: "glosario",
      label: "Glosario IA legal",
      href: "/glosario-ia-legal",
      image: "/images/sections/actualidad.jpg",
    },
    {
      key: "quienes-somos",
      label: "Quiénes somos",
      href: "/quienes-somos",
      image: "/images/sections/actualidad.jpg",
    },
    {
      key: "contacto",
      label: "Contacto",
      href: "/contacto",
      image: "/images/sections/actualidad.jpg",
    },
  ];


  const getCtaLabel = (key: string) => {
    switch (key) {
      case "normativa":
        return "Ver normativa";
      case "jurisprudencia":
        return "Ver jurisprudencia";
      case "guias":
        return "Navegar guías";
      case "firma-scarpa":
        return "Conocer la firma";
      case "glosario":
        return "Ver glosario";
      case "quienes-somos":
        return "Conocer el proyecto";
      case "contacto":
        return "Contactar";
      default:
        return "Ver sección";
    }
  };

  const allFeaturedCandidates = [
    ...unifiedFirma,
    ...unifiedActualidad,
    ...normativaEntriesAll.filter((e): e is ResourceEntry => e != null).map((e) => ({
      title: e.title,
      description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
      date: e.displayDateMs ?? e.dateMs ?? 0,
      urlPath: `/normativa/${e.slug}`,
      author: "Derecho Artificial",
    })),
    ...jurisprudenciaEntriesAll.filter((e): e is ResourceEntry => e != null).map((e) => ({
      title: e.title,
      description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
      date: e.displayDateMs ?? e.dateMs ?? 0,
      urlPath: `/jurisprudencia/${e.slug}`,
      author: "Derecho Artificial",
    })),
    ...guiasEntriesAll.filter((e): e is ResourceEntry => e != null).map((e) => ({
      title: e.title,
      description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
      date: e.displayDateMs ?? e.dateMs ?? 0,
      urlPath: `/guias-ia/${e.slug}`,
      author: "Derecho Artificial",
    })),
  ].sort((a, b) => b.date - a.date);

  const featuredEntry = allFeaturedCandidates[0] ?? null;

  const contentSections = [
    {
      key: "firma-scarpa",
      label: "Firma Scarpa",
      href: "/firma-scarpa",
      image: "/images/sections/firma-scarpa.jpg",
      entries: unifiedFirma,
    },
    {
      key: "normativa",
      label: "Normativa",
      href: "/normativa",
      image: "/images/sections/normativa.jpg",
      entries: normativaEntriesAll.filter((e): e is ResourceEntry => e != null).map((e) => ({
        title: e.title,
        description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
        date: e.displayDateMs ?? e.dateMs ?? 0,
        urlPath: `/normativa/${e.slug}`,
        author: "Derecho Artificial",
      })).sort((a, b) => b.date - a.date),
    },
    {
      key: "jurisprudencia",
      label: "Jurisprudencia",
      href: "/jurisprudencia",
      image: "/images/sections/jurisprudencia.jpg",
      entries: jurisprudenciaEntriesAll.filter((e): e is ResourceEntry => e != null).map((e) => ({
        title: e.title,
        description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
        date: e.displayDateMs ?? e.dateMs ?? 0,
        urlPath: `/jurisprudencia/${e.slug}`,
        author: "Derecho Artificial",
      })).sort((a, b) => b.date - a.date),
    },
    {
      key: "guias",
      label: "Guías y Protocolos",
      href: "/guias-ia",
      image: "/images/sections/guias-ia.jpg",
      entries: guiasEntriesAll.filter((e): e is ResourceEntry => e != null).map((e) => ({
        title: e.title,
        description: e.summaryHtml.replace(/<[^>]+>/g, "").slice(0, 200),
        date: e.displayDateMs ?? e.dateMs ?? 0,
        urlPath: `/guias-ia/${e.slug}`,
        author: "Derecho Artificial",
      })).sort((a, b) => b.date - a.date),
    },
    {
      key: "actualidad",
      label: "Actualidad IA",
      href: "/guias-ia",
      image: "/images/sections/actualidad.jpg",
      entries: unifiedActualidad,
    },
  ]
    .map((s) => ({ ...s, latestDate: s.entries[0]?.date ?? 0 }))
    .filter((s) => s.entries.length > 0)
    .sort((a, b) => b.latestDate - a.latestDate);

  return (
    <>
      <main>
        <section className="border-b border-divider/50">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row gap-6 py-8 md:py-12">
              <div className="md:flex-[0_0_67%] aspect-[2.29/1] relative overflow-hidden bg-muted">
                {featuredEntry && (
                  <Link href={featuredEntry.urlPath} className="group block w-full h-full">
                    <Image
                      src="/images/hero-home.jpg"
                      alt=""
                      fill
                      className="object-cover"
                      priority
                    />
                  </Link>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                {featuredEntry && (
                  <>
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-caption mb-3">
                        Destacado
                      </div>
                      <Link href={featuredEntry.urlPath} className="group block">
                        <h1 className="font-display font-black text-[clamp(1.5rem,3.5vw,3rem)] leading-[0.9] tracking-[-0.03em] text-foreground">
                          {featuredEntry.title}
                          <span className="inline-flex ml-3 text-foreground/60 group-hover:text-foreground transition-all duration-200 go-icon">→</span>
                        </h1>
                      </Link>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-caption pt-4 mt-4 border-t border-divider/20">
                      <span>{featuredEntry.author || "Derecho Artificial"}</span>
                      <span>·</span>
                      <span>{formatDate(featuredEntry.date)}</span>
                    </div>
                  </>
                )}
                {!featuredEntry && (
                  <div className="flex items-center justify-center h-full text-caption">
                    <p className="text-sm">Próximamente contenido</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {contentSections.map((sec) => (
          <section key={sec.key}>
            <div className="container-wide">
              <div className="flex items-center justify-between py-4 border-b border-divider/30">
                <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground">
                  {sec.label}
                </h2>
                <Link href={sec.href} className="text-xs text-caption hover:text-foreground transition-colors">
                  Ver todas <span className="go-icon">→</span>
                </Link>
              </div>

              <div className="flex flex-col md:flex-row gap-6 py-6">
                <div className="md:flex-[0_0_67%] aspect-[2.29/1] relative overflow-hidden bg-muted">
                  <Link href={sec.entries[0].urlPath} className="group block w-full h-full">
                    <Image src={sec.image} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 67vw" />
                  </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={sec.entries[0].urlPath} className="group block">
                      <h3 className="font-display font-black text-[clamp(1.2rem,2.5vw,2rem)] leading-[0.9] tracking-[-0.03em] text-foreground">
                        {sec.entries[0].title}
                        <span className="inline-flex ml-2 text-foreground/40 group-hover:text-foreground transition-all duration-200 go-icon">→</span>
                      </h3>
                      <p className="text-xs text-body leading-relaxed line-clamp-3 mt-3">
                        {sec.entries[0].description}
                      </p>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-caption pt-4 mt-4 border-t border-divider/20">
                    <span>{sec.entries[0].author || "Derecho Artificial"}</span>
                    <span>·</span>
                    <span>{formatDate(sec.entries[0].date)}</span>
                  </div>
                </div>
              </div>

              {sec.entries.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-divider/30">
                  {sec.entries.slice(1, 7).map((entry, i) => (
                    <div key={`${sec.key}-g-${i}`} className={`relative p-5 md:p-6 border-t border-divider/20 ${i % 3 !== 0 ? 'md:border-l border-divider/20' : ''}`}>
                      <Link href={entry.urlPath} className="group block">
                        <h4 className="font-display font-bold text-lg tracking-tight leading-[0.95] text-foreground mb-3 pr-6 relative">
                          {entry.title}
                          <span className="absolute right-0 top-1 text-foreground/40 group-hover:text-foreground transition-all duration-200 go-icon text-sm">→</span>
                        </h4>
                        <p className="text-xs text-body leading-relaxed line-clamp-3">
                          {entry.description}
                        </p>
                      </Link>
                      <div className="text-[11px] text-caption mt-3">
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}


