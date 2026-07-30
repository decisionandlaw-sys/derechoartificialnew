import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const siteUrl = "https://derechoartificial.com";
const author = "Ricardo Scarpa";

const months = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

function parseSpanishDate(value) {
  const match = /^\s*(\d{1,2})\s+de\s+([a-záéíóúñ]+),\s*(\d{4})\s*$/i.exec(value);
  if (!match) return null;
  const day = match[1].padStart(2, "0");
  const monthKey = match[2].toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const month = months[monthKey];
  if (!month) return null;
  return `${match[3]}-${month}-${day}`;
}

function extractSeoProp(source, propName) {
  const re = new RegExp(`${propName}\\s*=\\s*"(.*?)"`, "s");
  const match = re.exec(source);
  return match?.[1]?.trim() ?? null;
}

function cleanInline(text) {
  return text
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\{[\s\S]*?\}/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<em>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<code>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function extractH1(source) {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(source)?.[1];
  return h1 ? cleanInline(h1) : null;
}

function extractBodyMarkdown(source) {
  const startIndex = source.indexOf('className="prose-editorial');
  const slice = startIndex >= 0 ? source.slice(startIndex) : source;

  const tokenRe = /<(h[2-3]|p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  const tokens = [];
  for (const match of slice.matchAll(tokenRe)) {
    const tag = match[1].toLowerCase();
    const raw = match[2];
    const text = cleanInline(raw);
    if (!text) continue;
    tokens.push({ tag, text });
  }

  let md = "";
  let prevWasLi = false;
  for (const t of tokens) {
    if (t.tag === "li") {
      if (!prevWasLi && md && !md.endsWith("\n\n")) md += "\n";
      md += `- ${t.text}\n`;
      prevWasLi = true;
      continue;
    }

    if (prevWasLi) {
      md += "\n";
      prevWasLi = false;
    }

    if (t.tag === "h2") {
      if (md) md += "\n";
      md += `## ${t.text}\n\n`;
      continue;
    }
    if (t.tag === "h3") {
      if (md) md += "\n";
      md += `### ${t.text}\n\n`;
      continue;
    }
    if (t.tag === "blockquote") {
      if (md) md += "\n";
      const lines = t.text.split("\n").map((l) => l.trim()).filter(Boolean);
      md += `${lines.map((l) => `> ${l}`).join("\n")}\n\n`;
      continue;
    }

    md += `${t.text}\n\n`;
  }

  return md.trim();
}

async function readFirmaScarpaIndex() {
  const file = path.join(repoRoot, "src", "vite-pages", "FirmaScarpa.tsx");
  const source = await fs.readFile(file, "utf8");
  const objectRe =
    /\{\s*[\s\S]*?title:\s*"((?:\\.|[^"\\])*)"\s*,\s*excerpt:\s*"((?:\\.|[^"\\])*)"\s*,\s*date:\s*"((?:\\.|[^"\\])*)"\s*,\s*category:\s*"((?:\\.|[^"\\])*)"\s*,\s*href:\s*"((?:\\.|[^"\\])*)"\s*,?\s*\}/g;

  const results = [];
  for (const match of source.matchAll(objectRe)) {
    results.push({
      title: match[1],
      excerpt: match[2],
      date: match[3],
      category: match[4],
      href: match[5],
    });
  }

  if (!results.length) {
    throw new Error("No pude extraer los artículos desde FirmaScarpa.tsx");
  }

  return results;
}

function resolveSourceFileBySlug(slug) {
  return path.join(repoRoot, "src", "vite-pages", "analisis", `${slug}.tsx`);
}

async function buildSlugToFileMap() {
  const dir = path.join(repoRoot, "src", "vite-pages", "analisis");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && e.name.endsWith(".tsx")).map((e) => path.join(dir, e.name));

  const map = new Map();
  for (const file of files) {
    const source = await fs.readFile(file, "utf8");
    const canonical = extractSeoProp(source, "canonical");
    if (!canonical) continue;
    const slug = canonical.split("/").filter(Boolean).pop();
    if (!slug) continue;
    map.set(slug, file);
  }

  return map;
}

async function migrate() {
  const articles = await readFirmaScarpaIndex();
  const outDir = path.join(repoRoot, "src", "content", "firma-scarpa");
  await fs.mkdir(outDir, { recursive: true });

  const slugToFile = await buildSlugToFileMap();
  const failures = [];

  for (const a of articles) {
    const slug = a.href.split("/").filter(Boolean).pop();
    if (!slug) {
      failures.push({ href: a.href, reason: "No pude derivar slug" });
      continue;
    }

    let source = null;
    try {
      const file = slugToFile.get(slug) ?? resolveSourceFileBySlug(slug);
      source = await fs.readFile(file, "utf8");
    } catch {
      failures.push({ slug, reason: "No encontré el archivo TSX para el slug" });
      continue;
    }

    const titleFromH1 = extractH1(source);
    const seoTitle = extractSeoProp(source, "title");
    const title = titleFromH1 ?? seoTitle?.split("|")[0]?.trim() ?? a.title;

    const seoDescription = extractSeoProp(source, "description");
    const description = seoDescription ?? a.excerpt;

    const publishedTimeRaw = extractSeoProp(source, "publishedTime");
    const publishedTime = publishedTimeRaw && /^\d{4}-\d{2}-\d{2}$/.test(publishedTimeRaw)
      ? publishedTimeRaw
      : parseSpanishDate(a.date) ?? null;

    if (!publishedTime) {
      failures.push({ slug, reason: "No pude inferir datePublished" });
      continue;
    }

    const body = extractBodyMarkdown(source);
    if (!body) {
      failures.push({ slug, reason: "No pude extraer el cuerpo del artículo" });
      continue;
    }

    const entry = {
      title,
      description,
      datePublished: publishedTime,
      author,
      body,
      url: `${siteUrl}/firma-scarpa/${slug}`,
    };

    const outFile = path.join(outDir, `${slug}.json`);
    await fs.writeFile(outFile, JSON.stringify(entry, null, 2) + "\n", "utf8");
  }

  if (failures.length) {
    const message = failures.map((f) => JSON.stringify(f)).join("\n");
    throw new Error(`Fallos durante la migración:\n${message}`);
  }
}

await migrate();
