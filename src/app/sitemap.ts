import { MetadataRoute } from 'next';
import { listContentSlugs, getContentEntry, ContentSection } from '@/lib/content';
import { getAllPosts } from '@/lib/mdx-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://derechoartificial.com';

  // 1. Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/firma-scarpa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/jurisprudencia`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/normativa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/guias-ia`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/quienes-somos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  // 2. Artículos dinámicos de todas las secciones de contenido
  const contentSections: ContentSection[] = [
    'firma-scarpa',
    'guias-ia',
    'normativa',
    'jurisprudencia',
    'etica-ia',
  ];
  let allArticlePages: MetadataRoute.Sitemap = [];

  for (const section of contentSections) {
    try {
      const slugs = await listContentSlugs(section);
      const entries = await Promise.all(
        slugs.map(slug => getContentEntry(section, slug))
      );

      const sectionPages = entries
        .filter(entry => entry !== null)
        .map(entry => ({
          url: `${baseUrl}/${section}/${entry!.slug}`,
          lastModified: new Date(entry!.datePublished),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      
      allArticlePages = [...allArticlePages, ...sectionPages];
    } catch (error) {
      console.error(`Error processing section ${section}:`, error);
    }
  }

  // 3. Posts MDX (Jurisprudencia, Noticias, etc.)
  const mdxPosts = getAllPosts();
  const mdxPages: MetadataRoute.Sitemap = mdxPosts
    .filter(post => !post.url.startsWith('http')) // Excluir enlaces externos si los hay
    .map(post => {
      // Función para validar y crear fecha segura
      const createSafeDate = (dateString: string | undefined): Date => {
        if (!dateString) return new Date();
        
        try {
          const date = new Date(dateString);
          // Verificar si la fecha es válida
          if (isNaN(date.getTime())) {
            console.warn(`Invalid date detected: ${dateString}, using current date`);
            return new Date();
          }
          return date;
        } catch (error) {
          console.warn(`Error parsing date: ${dateString}, using current date`, error);
          return new Date();
        }
      };

      return {
        url: `${baseUrl}${post.url}`,
        lastModified: post.frontmatter.lastModified 
          ? createSafeDate(post.frontmatter.lastModified)
          : createSafeDate(post.frontmatter.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      };
    });

  return [...staticPages, ...allArticlePages, ...mdxPages];
}

