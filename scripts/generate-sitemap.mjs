import { promises as fs } from 'fs';
import path from 'path';

const siteUrl = "https://derechoartificial.com";

// Simulate the listContentSlugs function for static generation
async function listContentSlugs(section) {
  try {
    const contentDir = path.join(process.cwd(), "src", "content", section);
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));
    return files.map((entry) => entry.name.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

function generateSitemapEntry(url, lastModified, changeFrequency, priority) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  const lastModified = new Date().toISOString().split('T')[0];

  // Static routes from the original sitemap.ts
  const staticRoutes = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/firma-scarpa`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/jurisprudencia`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/actualidad-ia`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/legislacion`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/normativa`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/recursos/guias`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/quienes-somos`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contacto`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/aviso-legal`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/politica-de-privacidad`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/cookies`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/glosario-ia-legal`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/en`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/en/scarpa-firm`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/en/jurisprudence`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/en/legislation`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/en/guides-protocols`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/en/about-us`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/en/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/en/legal-ai-glossary`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic routes for Firma Scarpa
  const firmaScarpaSlugs = await listContentSlugs("firma-scarpa");
  const firmaScarpaRoutes = firmaScarpaSlugs.map((slug) => ({
    url: `${siteUrl}/firma-scarpa/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Specific Bosco route
  const boscoRoute = {
    url: `${siteUrl}/jurisprudencia/sentencia-bosco-transparencia-algoritmica`,
    changeFrequency: "monthly",
    priority: 0.9,
  };

  // Generate XML content
  const urls = [...staticRoutes, ...firmaScarpaRoutes, boscoRoute]
    .map(route => generateSitemapEntry(route.url, lastModified, route.changeFrequency, route.priority))
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  // Write to public directory
  const publicDir = path.join(process.cwd(), "public");
  await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
  
  console.log(`Generated sitemap.xml with ${staticRoutes.length + firmaScarpaRoutes.length + 1} URLs`);
  console.log(`Firma Scarpa articles: ${firmaScarpaSlugs.length}`);
}

generateSitemap().catch(console.error);
