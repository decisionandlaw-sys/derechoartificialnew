#!/usr/bin/env node
/**
 * publish-post.mjs — Script de publicación · derechoartificial.com
 *
 * USO:
 *   node scripts/publish-post.mjs <seccion>/<slug>
 *
 * EJEMPLOS:
 *   node scripts/publish-post.mjs jurisprudencia/xai-openai-2026
 *   node scripts/publish-post.mjs firma-scarpa/encrucijada-ia-justicia
 *   node scripts/publish-post.mjs normativa/reglamento-ia-guia
 *
 * ESTRUCTURA ESPERADA EN CONTENT/:
 *   content/jurisprudencia/xai-openai-2026/index.mdx
 *   content/jurisprudencia/xai-openai-2026/xai-openai-2026.pdf  ← opcional
 *
 * QUÉ HACE:
 *   1. Valida que el index.mdx existe y tiene frontmatter correcto
 *   2. Verifica que el campo `section` del frontmatter coincide con la carpeta
 *   3. Avisa si falta PDF en secciones donde es esperado (jurisprudencia, normativa)
 *   4. Avisa si hay PDF en secciones donde no corresponde (firma-scarpa)
 *   5. Hace git add + commit + push
 *   6. Vercel despliega automáticamente
 *
 * QUÉ NO HACE:
 *   - NO crea page.tsx (el [slug]/page.tsx dinámico ya sirve todos los posts)
 *   - NO modifica el MDX (sin riesgo de corromper frontmatter)
 *   - NO hace git add -A (solo añade los archivos del post)
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─── Configuración de secciones ──────────────────────────────────────────────

const SECTIONS = {
  'jurisprudencia':           { route: 'jurisprudencia',           pdfExpected: true  },
  'normativa':                { route: 'normativa',                pdfExpected: true  },
  'firma-scarpa':             { route: 'firma-scarpa',             pdfExpected: false, pdfForbidden: true },
  'etica-ia':                 { route: 'etica-ia',                 pdfExpected: false },
  'propiedad-intelectual-ia': { route: 'propiedad-intelectual-ia', pdfExpected: false },
  'ia-global':                { route: 'global-ia',                pdfExpected: false },
  'global-ia':                { route: 'global-ia',                pdfExpected: false },
  'guias':                    { route: 'recursos/guias',           pdfExpected: false },
};

// ─── Utilidades ───────────────────────────────────────────────────────────────

function log(emoji, msg)  { console.log(`${emoji}  ${msg}`); }
function warn(msg)        { console.warn(`⚠️   ${msg}`); }
function fail(msg)        { console.error(`❌  ${msg}`); process.exit(1); }

/**
 * Parsea el frontmatter YAML sin dependencias externas.
 * Devuelve un objeto con los campos clave o null si no hay frontmatter.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yaml   = match[1];
  const fields = {};

  for (const line of yaml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key   = trimmed.slice(0, colonIdx).trim();
    let   value = trimmed.slice(colonIdx + 1).trim();

    // Ignorar líneas de arrays YAML (empiezan con -)
    if (value.startsWith('-')) continue;

    // Quitar comillas
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Eliminar comentarios inline
    value = value.split('#')[0].trim();
    if (value) fields[key] = value;
  }

  return fields;
}

// ─── Función principal ────────────────────────────────────────────────────────

async function publishPost(seccionSlug) {
  console.log('');
  log('🚀', `Publicando: ${seccionSlug}\n`);

  // 1. Separar sección y slug
  const parts = seccionSlug.split('/');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    fail(`Formato incorrecto. Usa: seccion/slug\nEjemplo: jurisprudencia/xai-openai-2026`);
  }
  const [argSection, argSlug] = parts;

  // 2. Verificar sección válida
  const sectionConfig = SECTIONS[argSection];
  if (!sectionConfig) {
    fail(
      `Sección no reconocida: "${argSection}"\n` +
      `Secciones válidas: ${Object.keys(SECTIONS).join(', ')}`
    );
  }

  // 3. Resolver rutas
  const projectRoot = path.resolve(__dirname, '..');
  const postDir     = path.join(projectRoot, 'content', argSection, argSlug);
  const mdxPath     = path.join(postDir, 'index.mdx');

  // 4. Verificar que el directorio y el MDX existen
  if (!fs.existsSync(postDir)) {
    fail(
      `No se encontró la carpeta: content/${argSection}/${argSlug}/\n` +
      `Crea la carpeta y coloca el index.mdx dentro antes de publicar.`
    );
  }
  if (!fs.existsSync(mdxPath)) {
    fail(
      `No se encontró: content/${argSection}/${argSlug}/index.mdx\n` +
      `El archivo debe llamarse exactamente "index.mdx"`
    );
  }
  log('✅', `MDX: content/${argSection}/${argSlug}/index.mdx`);

  // 5. Parsear y validar frontmatter
  const content = fs.readFileSync(mdxPath, 'utf8');
  const fields  = parseFrontmatter(content);

  if (!fields) {
    fail(`El archivo no tiene frontmatter válido (bloque --- al inicio).`);
  }

  const required = ['title', 'date', 'section', 'slug'];
  const missing  = required.filter(f => !fields[f]);
  if (missing.length > 0) {
    fail(
      `Faltan campos obligatorios: ${missing.join(', ')}\n\n` +
      `Frontmatter mínimo:\n` +
      `  ---\n` +
      `  title: "Título"\n` +
      `  description: "Descripción SEO"\n` +
      `  date: "YYYY-MM-DD"\n` +
      `  author: "Ricardo Scarpa"\n` +
      `  section: "${argSection}"\n` +
      `  slug: "${argSlug}"\n` +
      `  category: "analisis-juridico"\n` +
      `  ---`
    );
  }

  const { title, date, section: fmSection, slug: fmSlug } = fields;

  log('📋', `Título:    ${title}`);
  log('📋', `Fecha:     ${date}`);
  log('📋', `Sección:   ${fmSection}`);
  log('📋', `Slug:      ${fmSlug}`);

  // 6. Coherencia frontmatter ↔ carpeta
  if (fmSection !== argSection) {
    fail(
      `El campo section del frontmatter ("${fmSection}") no coincide\n` +
      `con la carpeta del archivo ("${argSection}").\n` +
      `Corrígelo en el frontmatter o mueve el archivo a la carpeta correcta.`
    );
  }
  if (fmSlug !== argSlug) {
    warn(`El slug del frontmatter ("${fmSlug}") difiere de la carpeta ("${argSlug}").`);
    warn(`La URL usará el slug del frontmatter: /${sectionConfig.route}/${fmSlug}`);
  }

  log('✅', `URL final: /${sectionConfig.route}/${fmSlug}`);

  // 7. Verificar author
  if (fields.author && fields.author !== 'Ricardo Scarpa') {
    warn(`Author es "${fields.author}" — debería ser "Ricardo Scarpa".`);
  }

  // 8. Gestión del PDF
  const pdfFiles = fs.existsSync(postDir)
    ? fs.readdirSync(postDir).filter(f => f.endsWith('.pdf'))
    : [];
  const hasPdf  = pdfFiles.length > 0;
  const pdfFile = hasPdf ? pdfFiles[0] : null;

  if (sectionConfig.pdfForbidden && hasPdf) {
    warn(`Sección "firma-scarpa" no lleva PDF (análisis propios sin fuente externa).`);
    warn(`Se encontró: ${pdfFile} — no se añadirá al commit.`);
  } else if (sectionConfig.pdfExpected && !hasPdf) {
    warn(`Sección "${argSection}" normalmente incluye PDF de la sentencia/norma.`);
    warn(`Si lo tienes, colócalo en: content/${argSection}/${argSlug}/${argSlug}.pdf`);
    warn(`El post se publicará sin enlace al PDF.`);
  } else if (hasPdf) {
    log('✅', `PDF: ${pdfFile}`);
  }

  // 9. Sanity check: página dinámica existe
  const dynamicPage = path.join(projectRoot, 'src', 'app', sectionConfig.route, '[slug]', 'page.tsx');
  if (!fs.existsSync(dynamicPage)) {
    warn(`No se encontró src/app/${sectionConfig.route}/[slug]/page.tsx`);
    warn(`El post puede no renderizarse correctamente.`);
  } else {
    log('✅', `Router dinámico: src/app/${sectionConfig.route}/[slug]/page.tsx`);
  }

  // 10. Sanity check: no existe page.tsx estático para este slug
  const staticPage = path.join(projectRoot, 'src', 'app', sectionConfig.route, fmSlug, 'page.tsx');
  if (fs.existsSync(staticPage)) {
    warn(`¡Existe un page.tsx estático en src/app/${sectionConfig.route}/${fmSlug}/page.tsx!`);
    warn(`Tiene precedencia sobre el router dinámico y puede romper el build.`);
    warn(`Elimínalo con: git rm "src/app/${sectionConfig.route}/${fmSlug}/page.tsx"`);
  }

  // 11. Git status
  console.log('');
  log('🔍', 'Verificando git...');

  try {
    execSync('git status --porcelain', { cwd: projectRoot, encoding: 'utf8' });
  } catch {
    fail('No se pudo ejecutar git. ¿Estás en el directorio raíz del proyecto?');
  }

  // 12. Git add + commit + push
  console.log('');
  log('📦', 'Haciendo commit y push...\n');

  try {
    // Añadir toda la carpeta del post
    execSync(`git add "content/${argSection}/${argSlug}"`, {
      cwd: projectRoot,
      stdio: 'inherit',
    });

    const pdfNote   = hasPdf && !sectionConfig.pdfForbidden ? '\n- Incluye PDF' : '';
    const commitMsg =
      `feat(${argSection}): publicar "${title}"\n\n` +
      `- Sección: /${sectionConfig.route}/\n` +
      `- Slug: ${fmSlug}\n` +
      `- Fecha: ${date}` + pdfNote;

    execSync(`git commit -m ${JSON.stringify(commitMsg)}`, {
      cwd: projectRoot,
      stdio: 'inherit',
    });

    execSync('git push', {
      cwd: projectRoot,
      stdio: 'inherit',
    });

  } catch {
    fail(`Error en git commit/push. Revisa el mensaje arriba.`);
  }

  // 13. Resumen final
  console.log('');
  console.log('─'.repeat(60));
  log('🎉', 'Post publicado.');
  console.log('');
  log('🌐', `https://www.derechoartificial.com/${sectionConfig.route}/${fmSlug}`);
  log('⏱️ ', 'Vercel desplegará en ~1-2 minutos.');
  console.log('─'.repeat(60));
  console.log('');
}

// ─── Entrada ──────────────────────────────────────────────────────────────────

const arg = process.argv[2];

if (!arg) {
  console.error('\n❌  Falta el argumento seccion/slug\n');
  console.error('Uso:     node scripts/publish-post.mjs <seccion>/<slug>');
  console.error('Ejemplo: node scripts/publish-post.mjs jurisprudencia/xai-openai-2026\n');
  console.error('Secciones: jurisprudencia | normativa | firma-scarpa | etica-ia |');
  console.error('           propiedad-intelectual-ia | ia-global | global-ia | guias\n');
  process.exit(1);
}

publishPost(arg).catch(e => {
  console.error(`❌  Error inesperado: ${e.message}`);
  process.exit(1);
});
