import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ─── Rutas base ───────────────────────────────────────────────────────────────

const ROOT       = process.cwd();
const POSTS_DIR  = path.join(ROOT, 'content', 'posts');   // legado (noticias automáticas)

// Secciones con nueva arquitectura: content/<section>/<slug>/index.mdx
const NEW_SECTIONS = [
  'jurisprudencia',
  'normativa',
  'firma-scarpa',
  'etica-ia',
  'propiedad-intelectual-ia',
  'global-ia',
  'guias',
  'glosario',
] as const;

// Mapa de section → ruta en el sitio
const SECTION_ROUTES: Record<string, string> = {
  'jurisprudencia':           'jurisprudencia',
  'normativa':                'normativa',
  'firma-scarpa':             'firma-scarpa',
  'etica-ia':                 'etica-ia',
  'propiedad-intelectual-ia': 'propiedad-intelectual-ia',
  'global-ia':                'global-ia',
  'guias':                    'guias-ia',
  'glosario':                 'glosario-ia-legal',
  // Legado: category → ruta (para posts en content/posts/)
  'jurisprudencia ia':        'jurisprudencia',
  'legislación digital':      'normativa',
  'legislación internacional':'normativa',
  'legislación':              'normativa',
  'legislación ia':           'normativa',
  'regulación ue':            'normativa',
  'firma scarpa':             'firma-scarpa',
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface PostFrontmatter {
  title: string;
  date: string;
  category?: string;
  section?: string;
  tags?: string[];
  pdf?: string;
  author?: string;
  description?: string;
  slug?: string;
  readingTime?: string;
  [key: string]: any;
}

export interface PostData {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  url: string;
  excerpt: string;
  dateMs: number;
  pdfUrl?: string;      // URL al PDF si existe (detectado automáticamente o desde frontmatter)
  sourceDir?: string;   // 'new' | 'legacy' — para debug
}

// ─── Utilidades ───────────────────────────────────────────────────────────────

function decodeSlug(value: string) {
  try { return decodeURIComponent(value); } catch { return value; }
}

function normalizeSlugForMatch(value: string) {
  return decodeSlug(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/-+/g, '-');
}

function parsePostDateToMs(rawDate: unknown, fallbackMs: number): number {
  if (typeof rawDate === 'number' && Number.isFinite(rawDate)) {
    return rawDate;
  }

  if (typeof rawDate !== 'string' || rawDate.trim().length === 0) {
    return fallbackMs;
  }

  const value = rawDate.trim();

  // YYYY-MM-DD (interpretar como fecha calendario, evitando variaciones por timezone)
  const isoDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/;
  const isoMatch = value.match(isoDateOnly);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const parsed = Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0);
    return Number.isNaN(parsed) ? fallbackMs : parsed;
  }

  // DD/MM/YYYY o DD-MM-YYYY (formatos usados en carga manual)
  const esDate = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
  const esMatch = value.match(esDate);
  if (esMatch) {
    const [, d, m, y] = esMatch;
    const parsed = new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0).getTime();
    return Number.isNaN(parsed) ? fallbackMs : parsed;
  }

  const direct = new Date(value).getTime();
  return Number.isNaN(direct) ? fallbackMs : direct;
}

/**
 * Determina la ruta del sitio a partir del campo `section` (nueva arquitectura)
 * o del campo `category` (legado). Devuelve null si no se reconoce.
 */
function resolveRoute(frontmatter: PostFrontmatter): string | null {
  // Nueva arquitectura: usar `section`
  if (frontmatter.section) {
    return SECTION_ROUTES[frontmatter.section.toLowerCase().trim()] ?? null;
  }
  // Legado: usar `category`
  if (frontmatter.category) {
    return SECTION_ROUTES[frontmatter.category.toLowerCase().trim()] ?? null;
  }
  return null;
}

/**
 * Detecta automáticamente si hay un PDF en la carpeta del post.
 * Solo aplica a la nueva arquitectura (content/<section>/<slug>/).
 */
function detectPdf(postDir: string, slug: string, frontmatter: PostFrontmatter): string | undefined {
  // 1. Campo pdf en frontmatter tiene prioridad
  if (frontmatter.pdf) {
    return frontmatter.pdf.startsWith('/') ? frontmatter.pdf : `/${frontmatter.pdf}`;
  }

  // 2. Detectar automáticamente cualquier .pdf en la carpeta del post
  if (postDir && fs.existsSync(postDir)) {
    const pdfFiles = fs.readdirSync(postDir).filter(f => f.endsWith('.pdf'));
    if (pdfFiles.length > 0) {
      // El PDF se sirve desde la ruta pública equivalente
      // Convención: el PDF se copia a public/fuentes/ durante el build o está en content/
      // Por compatibilidad, retornar la ruta relativa al post
      return `/fuentes/${pdfFiles[0]}`;
    }
  }

  return undefined;
}

/**
 * Determina la imagen hero para una sección.
 */
export function getHeroImage(section: string): string {
  const HERO_BASE_PATH = '/images/heroes/posts_images';
  const PUBLIC_DIR = path.join(ROOT, 'public');
  
  const sectionNormalized = section.toLowerCase().trim();
  
  const possibilities = [
    `${sectionNormalized}.jpg`,
    `${sectionNormalized}-hero.jpg`,
    `${sectionNormalized}-ia-hero.jpg`,
    // Swapped versions
    `${sectionNormalized.split('-').reverse().join('-')}.jpg`,
    `${sectionNormalized.split('-').reverse().join('-')}-hero.jpg`,
    `${sectionNormalized.split('-').reverse().join('-')}-ia-hero.jpg`,
  ];
  
  for (const pos of possibilities) {
    const fullPath = path.join(PUBLIC_DIR, 'images', 'heroes', 'posts_images', pos);
    if (fs.existsSync(fullPath)) {
      return `${HERO_BASE_PATH}/${pos}`;
    }
  }
  
  return `${HERO_BASE_PATH}/default.jpg`;
}

// ─── Imagen destacada de artículo ────────────────────────────────────────────

const POST_IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const _postImageCache: Record<string, string[]> = {};

/**
 * Lista las imágenes disponibles en public/images/posts/<route>/ (cacheado).
 */
function listPostImages(route: string): string[] {
  if (_postImageCache[route]) return _postImageCache[route];
  let files: string[] = [];
  try {
    const dir = path.join(ROOT, 'public', 'images', 'posts', route);
    files = fs
      .readdirSync(dir)
      .filter((f) => POST_IMAGE_EXT.test(f))
      .sort();
  } catch {
    // Carpeta inexistente -> sin imágenes
  }
  _postImageCache[route] = files;
  return files;
}

/**
 * Asigna de forma determinística (por slug) una imagen de la carpeta
 * public/images/posts/<route>/ correspondiente a la sección del post.
 */
export function getPostImage(route: string, slug: string): string | null {
  const files = listPostImages(route);
  if (files.length === 0) return null;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return `/images/posts/${route}/${files[hash % files.length]}`;
}

/**
 * Imagen destacada de un post: prioriza el campo `image` del frontmatter;
 * si no lo tiene, asigna aleatoriamente (determinista por slug) una imagen
 * de la sección correspondiente a la URL del post.
 */
export function getFeaturedImage(post: PostData): string | null {
  const fmImage = post.frontmatter.image;
  if (fmImage) {
    return fmImage.startsWith('/') ? fmImage : `/${fmImage}`;
  }
  const route = post.url.split('/').filter(Boolean)[0];
  if (!route) return null;
  return getPostImage(route, post.slug);
}

// ─── Lector de nueva arquitectura ────────────────────────────────────────────

/**
 * Lee todos los posts de content/<section>/<slug>/index.mdx
 */
function readNewSectionPosts(): PostData[] {
  const posts: PostData[] = [];

  for (const section of NEW_SECTIONS) {
    const sectionDir = path.join(ROOT, 'content', section);
    if (!fs.existsSync(sectionDir)) continue;

    const slugDirs = fs.readdirSync(sectionDir).filter(entry => {
      const full = path.join(sectionDir, entry);
      return fs.statSync(full).isDirectory();
    });

    for (const slugDir of slugDirs) {
      const postDir = path.join(sectionDir, section === 'glosario' ? '' : '', slugDir);
      const mdxPath = path.join(sectionDir, slugDir, 'index.mdx');

      if (!fs.existsSync(mdxPath)) continue;

      try {
        const fileContents = fs.readFileSync(mdxPath, 'utf8');
        const { data, content } = matter(fileContents);
        const frontmatter = data as PostFrontmatter;
        const fallbackMs = fs.statSync(mdxPath).mtimeMs;
        const dateMs = parsePostDateToMs(frontmatter.date, fallbackMs);

        const slug = frontmatter.slug || slugDir;
        const route = resolveRoute(frontmatter) ?? section;

        const excerpt =
          frontmatter.description ||
          content.replace(/[#*`]/g, '').replace(/\n/g, ' ').trim().slice(0, 160) + '...';

        const pdfUrl = detectPdf(path.join(sectionDir, slugDir), slug, frontmatter);

        // Las noticias con URL externa no se incluyen
        if (frontmatter.category?.toLowerCase() === 'noticia' && frontmatter.url) {
          continue;
        }

        posts.push({
          slug,
          frontmatter,
          content,
          url: `/${route}/${slug}`,
          excerpt,
          dateMs,
          pdfUrl,
          sourceDir: 'new',
        });
      } catch (e) {
        console.warn(`[mdx-utils] Error leyendo ${mdxPath}:`, e);
      }
    }
  }

  return posts;
}

// ─── Lector de arquitectura legada ───────────────────────────────────────────

/**
 * Lee posts de content/posts/*.mdx (arquitectura anterior).
 * Se mantiene para compatibilidad con noticias automáticas y posts migrados pendientes.
 */
function readLegacyPosts(): PostData[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const fileMap = new Map<string, string>();

  const collectFiles = (dir: string, baseDir: string = '') => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        collectFiles(filePath, path.join(baseDir, file));
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const relativePath = baseDir ? path.join(baseDir, file) : file;
        const slug = relativePath.replace(/\.mdx?$/, '');
        if (!fileMap.has(slug)) {
          fileMap.set(slug, filePath);
        }
      }
    }
  };

  collectFiles(POSTS_DIR);

  const posts: PostData[] = [];

  for (const [rawSlug, fullPath] of fileMap.entries()) {
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontmatter = data as PostFrontmatter;
      const fallbackMs = fs.statSync(fullPath).mtimeMs;
      const dateMs = parsePostDateToMs(frontmatter.date, fallbackMs);

      const category = (frontmatter.category || 'blog') as string;
      const frontmatterUrl = frontmatter.url as string | undefined;

      // Excluir noticias con URL externa
      if (category.toLowerCase() === 'noticia' && frontmatterUrl) continue;

      const slug  = frontmatter.slug || rawSlug;
      const route = resolveRoute(frontmatter);

      // Si no tiene ruta reconocida, saltar (evita posts huérfanos)
      if (!route && category.toLowerCase() !== 'noticia') {
        // Solo omitir si no es noticia — las noticias sin URL externa se sirven en /noticia/
      }

      const excerpt =
        frontmatter.description ||
        content.replace(/[#*`]/g, '').replace(/\n/g, ' ').trim().slice(0, 160) + '...';

      const url = route
        ? `/${route}/${slug}`
        : `/noticia/${encodeURIComponent(slug)}`;

      // PDF desde frontmatter (legado no tiene detección automática)
      const pdfUrl = frontmatter.pdf
        ? (frontmatter.pdf.startsWith('/') ? frontmatter.pdf : `/fuentes/${frontmatter.pdf}`)
        : undefined;

      posts.push({
        slug,
        frontmatter,
        content,
        url,
        excerpt,
        dateMs,
        pdfUrl,
        sourceDir: 'legacy',
      });
    } catch (e) {
      console.warn(`[mdx-utils] Error leyendo ${fullPath}:`, e);
    }
  }

  return posts;
}

// ─── API pública ──────────────────────────────────────────────────────────────

let _postsCache: PostData[] | null = null;

/**
 * Devuelve todos los posts del sitio (nueva arquitectura + legado), ordenados por fecha.
 * El resultado se cachea en memoria durante el proceso de build.
 */
export function getAllPosts(): PostData[] {
  if (_postsCache) return _postsCache;

  const newPosts    = readNewSectionPosts();
  const legacyPosts = readLegacyPosts();

  // Los nuevos tienen prioridad: si hay un slug duplicado, gana el nuevo
  const newSlugs = new Set(newPosts.map(p => p.slug));
  const filtered = legacyPosts.filter(p => !newSlugs.has(p.slug));

  const all = [...newPosts, ...filtered].sort((a, b) => {
    return b.dateMs - a.dateMs;
  });

  _postsCache = all;
  return all;
}

/**
 * Devuelve solo posts de una sección específica.
 */
export function getPostsBySection(section: string): PostData[] {
  const route = SECTION_ROUTES[section.toLowerCase().trim()];
  if (!route) return [];
  return getAllPosts().filter(p => p.url.startsWith(`/${route}/`));
}

/**
 * Devuelve todas las noticias (category: "noticia").
 */
export function getAllNoticias(): PostData[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const fileMap = new Map<string, string>();
  const collectFiles = (dir: string, baseDir: string = '') => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        collectFiles(filePath, path.join(baseDir, file));
      } else if (file.endsWith('.mdx')) {
        const relativePath = baseDir ? path.join(baseDir, file) : file;
        const slug = relativePath.replace(/\.mdx?$/, '');
        if (!fileMap.has(slug)) fileMap.set(slug, filePath);
      }
    }
  };
  collectFiles(POSTS_DIR);

  const noticias: PostData[] = [];

  for (const [rawSlug, fullPath] of fileMap.entries()) {
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontmatter = data as PostFrontmatter;

      if (frontmatter.category?.toLowerCase() !== 'noticia') continue;

      const slug    = frontmatter.slug || rawSlug;
      const url     = frontmatter.url || `/noticia/${encodeURIComponent(slug)}`;
      const excerpt = frontmatter.description ||
        content.replace(/[#*`]/g, '').replace(/\n/g, ' ').trim().slice(0, 160) + '...';
      const fallbackMs = fs.statSync(fullPath).mtimeMs;
      const dateMs = parsePostDateToMs(frontmatter.date, fallbackMs);

      noticias.push({ slug, frontmatter, content, url, excerpt, dateMs, sourceDir: 'legacy' });
    } catch { /* silencio */ }
  }

  return noticias.sort((a, b) => b.dateMs - a.dateMs);
}

/**
 * Busca un post por slug con fallback a normalización.
 */
export function getPostBySlug(slug: string): PostData | undefined {
  const posts = getAllPosts();

  const directMatch = posts.find(p => p.slug === slug);
  if (directMatch) return directMatch;

  const decodedSlug  = decodeSlug(slug);
  const decodedMatch = posts.find(p => p.slug === decodedSlug);
  if (decodedMatch) return decodedMatch;

  const normalizedSlug = normalizeSlugForMatch(slug);
  return posts.find(p => normalizeSlugForMatch(p.slug) === normalizedSlug);
}
