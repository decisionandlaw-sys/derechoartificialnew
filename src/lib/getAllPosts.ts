import { promises as fs } from "fs";
import path from "path";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: string;
  url: string;
};

export async function getAllPosts(): Promise<Post[]> {
  const dataDir = path.join(process.cwd(), "src", "data");
  
  try {
    // 1. Cargar datos de los archivos JSON en src/data
    const latestNewsRaw = await fs.readFile(path.join(dataDir, "latest-news.json"), "utf8");
    const libraryDocsRaw = await fs.readFile(path.join(dataDir, "library-docs.json"), "utf8");
    const legalNewsRaw = await fs.readFile(path.join(dataDir, "legal-news.json"), "utf8");

    const latestNews = JSON.parse(latestNewsRaw);
    const libraryDocs = JSON.parse(libraryDocsRaw);
    const legalNews = JSON.parse(legalNewsRaw);

    // 2. Normalizar y combinar
    const posts: Post[] = [
      ...latestNews.map((p: any) => ({
        slug: p.id || p.slug,
        title: p.title,
        date: p.date,
        excerpt: p.summary || p.description || "",
        tags: p.tags || [],
        category: "guias-ia",
        url: p.url.startsWith("http") ? p.url : `/guias-ia/${p.id || p.slug}`
      })),
      ...libraryDocs.map((p: any) => ({
        slug: p.id || p.slug,
        title: p.title,
        date: p.date,
        excerpt: p.description || "",
        tags: p.tags || [],
        category: "recursos",
        url: p.url.startsWith("http") ? p.url : `/recursos/${p.id || p.slug}`
      })),
      ...legalNews.map((p: any) => ({
        slug: p.id || p.slug,
        title: p.title,
        date: p.date,
        excerpt: p.summary || p.description || "",
        tags: p.tags || [],
        category: "guias-ia",
        url: p.url.startsWith("http") ? p.url : `/guias-ia/${p.id || p.slug}`
      }))
    ];

    // 3. Añadir algunos posts hardcoded que sabemos que existen para mejorar la recomendación
    // (Esto es temporal mientras se migran todos a JSON real)
    const fixedPosts: Post[] = [
      {
        slug: "ai-act-guia-completa",
        title: "Guía completa del AI Act",
        date: "2026-02-08",
        excerpt: "Análisis profundo del Reglamento Europeo de Inteligencia Artificial.",
        tags: ["#AIAct", "#Regulación", "#UE"],
        category: "normativa",
        url: "/normativa/ai-act-guia-completa"
      },
      {
        slug: "rgpd-gobernanza-datos-ia",
        title: "RGPD y Gobernanza de Datos IA",
        date: "2026-02-09",
        excerpt: "Cómo el RGPD se aplica al entrenamiento y uso de sistemas de IA.",
        tags: ["#RGPD", "#Privacidad", "#IA"],
        category: "normativa",
        url: "/normativa/rgpd-gobernanza-datos-ia"
      },
      {
        slug: "caso-itutorgroup",
        title: "Caso iTutorGroup: Discriminación algorítmica",
        date: "2026-01-15",
        excerpt: "Lecciones legales sobre sesgos en procesos de selección automatizados.",
        tags: ["#Discriminación", "#Algoritmos", "#FirmaScarpa"],
        category: "firma-scarpa",
        url: "/firma-scarpa/caso-itutorgroup"
      },
      {
        slug: "tsj-canarias-ia",
        title: "Sentencia TSJ Canarias: IA y veracidad profesional",
        date: "2025-12-20",
        excerpt: "Análisis de la sentencia sobre el uso de IA en la práctica legal.",
        tags: ["#Jurisprudencia", "#Abogacía", "#IA"],
        category: "firma-scarpa",
        url: "/firma-scarpa/tsj-canarias-ia"
      }
    ];

    const allPosts = [...posts, ...fixedPosts];

    // Ordenar por fecha descendente
    return allPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error loading posts for RelatedArticles:", error);
    return [];
  }
}
