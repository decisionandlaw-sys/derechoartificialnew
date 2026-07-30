import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para verificar y crear páginas de posts
async function verifyAndCreatePostPages() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const appDir = path.join(process.cwd(), 'src', 'app');
  const jurisprudenciaDir = path.join(appDir, 'jurisprudencia');
  const globalIaDir = path.join(appDir, 'global-ia');
  const normativaDir = path.join(appDir, 'normativa');
  
  console.log('🔍 Verificando posts MDX...');
  
  // Leer todos los archivos MDX
  const mdxFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'));
  
  for (const file of mdxFiles) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extraer frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.log(`⚠️  No se encontró frontmatter en: ${file}`);
      continue;
    }
    
    const frontmatterText = frontmatterMatch[1];
    const slugMatch = frontmatterText.match(/slug:\s*"([^"]+)"/);
    const categoryMatch = frontmatterText.match(/category:\s*"([^"]+)"/);
    
    if (!slugMatch) {
      console.log(`⚠️  No se encontró slug en: ${file}`);
      continue;
    }
    
    if (!categoryMatch) {
      console.log(`⚠️  No se encontró category en: ${file}`);
      continue;
    }
    
    const slug = slugMatch[1];
    const category = categoryMatch[1];
    const fileName = file.replace('.mdx', '');
    
    console.log(`📄 Procesando: ${file}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Categoría: ${category}`);
    console.log(`   Nombre archivo: ${fileName}`);
    
    // Determinar la ruta correcta según la categoría
    let targetDir;
    let routePath;
    
    if (category.toLowerCase() === 'jurisprudencia' || category.toLowerCase() === 'jurisprudencia ia') {
      targetDir = jurisprudenciaDir;
      routePath = 'jurisprudencia';
    } else if (category.toLowerCase() === 'global ia' || category.toLowerCase() === 'ia-global') {
      targetDir = globalIaDir;
      routePath = 'global-ia';
    } else if (category.toLowerCase() === 'normativa' || category.toLowerCase() === 'legislación digital' || category.toLowerCase() === 'legislación') {
      targetDir = normativaDir;
      routePath = 'normativa';
    } else if (category.toLowerCase() === 'firma-scarpa') {
      targetDir = path.join(appDir, 'firma-scarpa');
      routePath = 'firma-scarpa';
    } else {
      console.log(`⚠️  Categoría no reconocida: ${category}`);
      continue;
    }
    
    // Crear directorio si no existe
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Verificar si la página principal existe
    const pageDir = path.join(targetDir, slug);
    const pageFile = path.join(pageDir, 'page.tsx');
    
    if (!fs.existsSync(pageFile)) {
      console.log(`❌ No existe página para: ${slug}`);
      console.log(`   Ruta esperada: ${pageFile}`);
      
      // Crear página automáticamente
      await createPostPage(pageDir, pageFile, file, slug, category, routePath);
    } else {
      console.log(`✅ Página existe: ${slug}`);
    }
    
    // Verificar si hay inconsistencia entre nombre de archivo y slug
    if (fileName !== slug) {
      console.log(`⚠️  Inconsistencia detectada:`);
      console.log(`   Nombre archivo: ${fileName}`);
      console.log(`   Slug: ${slug}`);
      
      // Crear página de redirección
      const redirectDir = path.join(targetDir, fileName);
      const redirectFile = path.join(redirectDir, 'page.tsx');
      
      if (!fs.existsSync(redirectFile)) {
        console.log(`🔄 Creando redirección: ${fileName} -> ${slug}`);
        await createRedirectPage(redirectDir, redirectFile, routePath, slug);
      } else {
        console.log(`✅ Redirección ya existe: ${fileName}`);
      }
    }
  }
  
  console.log('✅ Verificación completada');
}

// Función para crear página de post
async function createPostPage(pageDir, pageFile, mdxFile, slug, category, routePath) {
  console.log(`📝 Creando página: ${slug}`);
  
  // Crear directorio
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }
  
  // Determinar si tiene PDF
  const pdfPath = path.join(process.cwd(), 'public', 'fuentes', `${mdxFile.replace('.mdx', '.pdf')}`);
  const hasPdf = fs.existsSync(pdfPath);
  
  // Crear contenido de la página
  const pageContent = generatePageContent(mdxFile, slug, category, routePath, hasPdf);
  
  fs.writeFileSync(pageFile, pageContent);
  console.log(`✅ Página creada: ${pageFile}`);
}

// Función para crear página de redirección
async function createRedirectPage(redirectDir, redirectFile, routePath, targetSlug) {
  console.log(`🔄 Creando redirección: ${redirectFile}`);
  
  // Crear directorio
  if (!fs.existsSync(redirectDir)) {
    fs.mkdirSync(redirectDir, { recursive: true });
  }
  
  const redirectContent = `import { redirect } from 'next/navigation';

export default function RedirectPage() {
  redirect('/${routePath}/${targetSlug}');
}`;
  
  fs.writeFileSync(redirectFile, redirectContent);
  console.log(`✅ Redirección creada: ${redirectFile}`);
}

// Función para generar contenido de página
function generatePageContent(mdxFile, slug, category, routePath, hasPdf) {
  const pdfSection = hasPdf ? `
        {/* PDF Download Box */}
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 4H9m0 4h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">SENTENCIA</h3>
                <p className="text-sm text-blue-700">Documento de análisis jurídico</p>
              </div>
            </div>
            <Link
              href="/fuentes/${mdxFile.replace('.mdx', '.pdf')}"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar PDF
            </Link>
          </div>
        </div>` : '';

  return `import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/mdx-utils";
import { LegalLayout } from "@/components/layout/LegalLayout";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { defaultSchema } from 'hast-util-sanitize';
import { RelatedArticles } from "@/components/RelatedArticles";

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

export const metadata: Metadata = {
  title: "Análisis Jurídico - Derecho Artificial",
  description: "Análisis exhaustivo de jurisprudencia y normativa en inteligencia artificial",
  alternates: {
    canonical: "/${routePath}/${slug}",
  },
};

export default async function PostPage() {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === "${slug}");
  
  if (!post) {
    return <div>Post no encontrado</div>;
  }

  return (
    <>
      <LegalLayout
        title={post.frontmatter.title}
        category="${category}"
        author={{ name: "Derecho Artificial", href: "/quienes-somos" }}
        date={post.frontmatter.date}
      >
        {/* Metadatos del artículo */}
        <div className="mb-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>📅 {new Date(post.frontmatter.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>📝 {post.frontmatter.authors?.[0] || 'Derecho Artificial'}</span>
          <span>🏷️ {post.frontmatter.category}</span>
          {post.frontmatter.readingTime && (
            <span>⏱️ {post.frontmatter.readingTime} min</span>
          )}
          {post.frontmatter.lastModified && (
            <span>🔄 Actualizado: {new Date(post.frontmatter.lastModified).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          )}
        </div>

        ${pdfSection}

        {/* Tags */}
        {post.frontmatter.tags && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contenido del artículo */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, { schema: sanitizeSchema }]]}
            components={{
              img: (props: any) => <img {...props} loading="lazy" decoding="async" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <RelatedArticles
            currentSlug={post.slug}
            currentTags={post.frontmatter.tags || []}
            currentCategory={post.frontmatter.category || "${category}"}
          />
        </div>
      </LegalLayout>
    </>
  );
}`;
}

// Ejecutar verificación
verifyAndCreatePostPages().catch(console.error);
