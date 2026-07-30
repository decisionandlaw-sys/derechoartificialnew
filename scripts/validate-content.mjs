import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const repoRoot = process.cwd();
const strict = process.argv.includes("--strict");

const contentRoots = ["content", "content-en"];
const allowedSections = new Set([
  "analisis-juridico",
  "analisis",
  "ai-ethics",
  "ai-jurisprudence",
  "ai jurisprudence",
  "ai-legislation",
  "ai legislation",
  "case-law",
  "digital-legislation",
  "digital legislation",
  "etica-ia",
  "firma-scarpa",
  "firma scarpa",
  "global-ia",
  "global ai",
  "ia-global",
  "guias",
  "guias-ia",
  "guides",
  "jurisprudencia",
  "jurisprudence",
  "jurisprudence ai",
  "intellectual-property-ai",
  "international-legislation",
  "international legislation",
  "normativa",
  "regulation",
  "eu regulation",
  "regulations",
  "noticia",
  "posts",
  "propiedad-intelectual-ia",
  "recursos",
  "resources",
  "scarpa-firm",
]);

const sectionRoutes = {
  "ai-ethics": "etica-ia",
  "ai-jurisprudence": "jurisprudencia",
  "ai jurisprudence": "jurisprudencia",
  "ai-legislation": "normativa",
  "ai legislation": "normativa",
  "analisis-juridico": "analisis-juridico",
  analisis: "analisis-juridico",
  "case-law": "jurisprudencia",
  "digital-legislation": "normativa",
  "digital legislation": "normativa",
  "etica-ia": "etica-ia",
  "firma-scarpa": "firma-scarpa",
  "firma scarpa": "firma-scarpa",
  "global-ia": "global-ia",
  "global ai": "global-ia",
  "ia-global": "global-ia",
  guias: "guias-ia",
  "guias-ia": "guias-ia",
  guides: "guias-ia",
  jurisprudencia: "jurisprudencia",
  jurisprudence: "jurisprudencia",
  "jurisprudence ai": "jurisprudencia",
  "intellectual-property-ai": "propiedad-intelectual-ia",
  "international-legislation": "normativa",
  "international legislation": "normativa",
  normativa: "normativa",
  noticia: "noticia",
  "propiedad-intelectual-ia": "propiedad-intelectual-ia",
  recursos: "guias-ia",
  regulation: "normativa",
  "eu regulation": "normativa",
  regulations: "normativa",
  resources: "guias-ia",
  "scarpa-firm": "firma-scarpa",
};

const files = [];
const warnings = [];
const errors = [];
const routes = new Map();

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (/\.(md|mdx)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
}

function normalizeDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function slugFromPath(filePath) {
  const parsed = path.parse(filePath);
  if (parsed.name.toLowerCase() !== "index") {
    return parsed.name;
  }
  return path.basename(path.dirname(filePath));
}

function contentRootFor(filePath) {
  const relative = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  return contentRoots.find((root) => relative === root || relative.startsWith(`${root}/`));
}

function sectionFromPath(filePath) {
  const root = contentRootFor(filePath);
  if (!root) return "";
  const relative = path.relative(path.join(repoRoot, root), filePath).replace(/\\/g, "/");
  return relative.split("/")[0] || "";
}

function publicRouteFor(filePath, data) {
  const root = contentRootFor(filePath);
  const langPrefix = root === "content-en" ? "/en" : "";
  const slug = String(data.slug || slugFromPath(filePath)).trim();
  const section = normalizeSection(data.section || data.category || sectionFromPath(filePath));
  const routeSection = sectionRoutes[section];

  if (!slug || !routeSection) return null;
  return `${langPrefix}/${routeSection}/${slug}`.replace(/\/+/g, "/");
}

function normalizeSection(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

for (const root of contentRoots) {
  const rootPath = path.join(repoRoot, root);
  if (await exists(rootPath)) {
    await walk(rootPath);
  }
}

for (const filePath of files) {
  const relative = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  let parsed;

  try {
    const source = await fs.readFile(filePath, "utf8");
    parsed = matter(source);
  } catch (error) {
    const message = `${relative}: cannot read or parse MDX (${error.message})`;
    if (error.code === "EPERM" || error.code === "EACCES") {
      warnings.push(message);
    } else {
      errors.push(message);
    }
    continue;
  }

  const data = parsed.data || {};
  const pathSection = sectionFromPath(filePath);
  const declaredSection = normalizeSection(data.section || data.category);
  const normalizedPathSection = normalizeSection(pathSection);
  const route = publicRouteFor(filePath, data);
  const isIndexContent = path.basename(filePath).toLowerCase() === "index.mdx";

  if (!data.title) {
    warnings.push(`${relative}: missing title`);
  }

  if (data.date && !normalizeDate(data.date)) {
    warnings.push(`${relative}: invalid date "${data.date}"`);
  }

  if (isIndexContent && !declaredSection) {
    warnings.push(`${relative}: missing section/category`);
  }

  if (declaredSection && !allowedSections.has(declaredSection)) {
    warnings.push(`${relative}: unknown section/category "${declaredSection}"`);
  }

  if (
    isIndexContent &&
    declaredSection &&
    normalizedPathSection &&
    allowedSections.has(normalizedPathSection) &&
    sectionRoutes[declaredSection] !== sectionRoutes[normalizedPathSection]
  ) {
    warnings.push(
      `${relative}: declared section/category "${declaredSection}" differs from folder "${normalizedPathSection}"`,
    );
  }

  if (!route) {
    continue;
  }

  if (!routes.has(route)) {
    routes.set(route, []);
  }
  routes.get(route).push(relative);
}

for (const [route, owners] of routes.entries()) {
  if (owners.length > 1) {
    errors.push(`duplicate route ${route}: ${owners.join(", ")}`);
  }
}

console.log(`Validated ${files.length} content files.`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${errors.length}`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings.slice(0, 80)) {
    console.log(`- ${warning}`);
  }
  if (warnings.length > 80) {
    console.log(`- ... ${warnings.length - 80} more warnings`);
  }
}

if (errors.length) {
  console.log("\nErrors:");
  for (const error of errors.slice(0, 80)) {
    console.log(`- ${error}`);
  }
  if (errors.length > 80) {
    console.log(`- ... ${errors.length - 80} more errors`);
  }
}

if (errors.length || (strict && warnings.length)) {
  process.exitCode = 1;
}
