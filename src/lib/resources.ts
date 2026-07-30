import { promises as fs } from "fs";
import path from "path";
import { renderMarkdownToHtml } from "./content";

const recursosBaseDir = path.join(process.cwd(), "public", "Recursos");
const analisisDir = path.join(recursosBaseDir, "Analisis");
const fuentesDir = path.join(recursosBaseDir, "Fuentes");

export type ResourceSection = "normativa" | "jurisprudencia" | "guias" | "firma-scarpa" | "guias-ia";

type ResourceSectionConfig = {
  id: ResourceSection;
  analysisSubdir: string;
  fuentesSubdir: string;
  categoryLabel: string;
  basePath: string;
};

const SECTION_CONFIGS: ResourceSectionConfig[] = [
  {
    id: "normativa",
    analysisSubdir: "Normativa",
    fuentesSubdir: "Normativa",
    categoryLabel: "Normativa",
    basePath: "/normativa",
  },
  {
    id: "jurisprudencia",
    analysisSubdir: "Jurisprudencia",
    fuentesSubdir: "Jurisprudencia",
    categoryLabel: "Jurisprudencia",
    basePath: "/jurisprudencia",
  },
  {
    id: "guias",
    analysisSubdir: "Guias-y-Protocolos",
    fuentesSubdir: "Guias-y-Protocolos",
    categoryLabel: "Guías y Protocolos",
    basePath: "/recursos/guias",
  },
  {
    id: "firma-scarpa",
    analysisSubdir: "Firma-Scarpa",
    fuentesSubdir: "Firma-Scarpa",
    categoryLabel: "Firma Scarpa",
    basePath: "/firma-scarpa",
  },
  {
    id: "guias-ia",
    analysisSubdir: "guias-ia",
    fuentesSubdir: "guias-ia",
    categoryLabel: "Guías IA",
    basePath: "/guias-ia",
  },
];

function getSectionConfig(section: ResourceSection): ResourceSectionConfig {
  const config = SECTION_CONFIGS.find((c) => c.id === section);
  if (!config) {
    throw new Error(`Unknown resource section: ${section}`);
  }
  return config;
}

export type ResourceKind = "Article" | "Legislation" | "LegalDecision" | "NewsArticle";

export type ResourceEntry = {
  slug: string;
  title: string;
  summaryHtml: string;
  bodyHtml: string;
  kind: ResourceKind;
  sourceUrl: string | null;
  dateMs: number | null;
  displayDateMs: number | null;
  jurisdiction?: string | null;
  courtName?: string | null;
  description?: string | null;
  date?: string;
};

function slugifyBaseName(baseName: string) {
  return baseName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function inferTitleFromFileName(fileName: string) {
  const withoutExt = fileName.replace(/\.[^/.]+$/, "");
  const withSpaces = withoutExt.replace(/[_-]+/g, " ").trim();
  return withSpaces;
}

function inferKindFromTitle(title: string): ResourceKind {
  const normalized = title.toLowerCase();
  const legislationKeywords = [
    "reglamento",
    "regulation",
    "ley",
    "act",
    "directiva",
    "directive",
  ];
  if (legislationKeywords.some((k) => normalized.includes(k))) {
    return "Legislation";
  }
  return "Article";
}

async function readTextFile(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

type AnalysisFile = {
  fileName: string;
  relativeDir: string;
};

async function listAnalysisFiles(): Promise<AnalysisFile[]> {
  try {
    const entries = await fs.readdir(analisisDir, { withFileTypes: true });
    const files: AnalysisFile[] = [];

    for (const entry of entries) {
      if (entry.isFile()) {
        const lower = entry.name.toLowerCase();
        if (lower.endsWith(".md") || lower.endsWith(".markdown") || lower.endsWith(".txt")) {
          files.push({ fileName: entry.name, relativeDir: "" });
        }
      } else if (entry.isDirectory()) {
        const subDirPath = path.join(analisisDir, entry.name);
        try {
          const subEntries = await fs.readdir(subDirPath, { withFileTypes: true });
          for (const subEntry of subEntries) {
            if (!subEntry.isFile()) continue;
            const lower = subEntry.name.toLowerCase();
            if (lower.endsWith(".md") || lower.endsWith(".markdown") || lower.endsWith(".txt")) {
              files.push({ fileName: subEntry.name, relativeDir: entry.name });
            }
          }
        } catch {
          void 0;
        }
      }
    }

    return files;
  } catch {
    return [];
  }
}

async function getFileDateMs(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
    const created = stats.birthtimeMs;
    if (typeof created === "number" && !Number.isNaN(created) && created > 0) {
      return created;
    }
    const modified = stats.mtimeMs;
    return typeof modified === "number" && !Number.isNaN(modified) && modified > 0
      ? modified
      : Date.now();
  } catch {
    return Date.now();
  }
}

async function getDisplayDateMs(filePath: string) {
  const markdown = await readTextFile(filePath);
  const normalized = markdown.replace(/\r\n/g, "\n");
  const dateField = extractFrontmatterField(normalized, "date");
  if (dateField) {
    const date = new Date(dateField);
    const ms = date.getTime();
    if (!Number.isNaN(ms)) return ms;
  }
  const t = normalized.toLowerCase();
  const monthsEs: Record<string, number> = {
    enero: 1,
    febrero: 2,
    marzo: 3,
    abril: 4,
    mayo: 5,
    junio: 6,
    julio: 7,
    agosto: 8,
    septiembre: 9,
    setiembre: 9,
    octubre: 10,
    noviembre: 11,
    diciembre: 12,
  };
  const monthsEn: Record<string, number> = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };
  function toMs(y: number, m: number, d: number) {
    const date = new Date(`${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T00:00:00Z`);
    const ms = date.getTime();
    return Number.isNaN(ms) ? null : ms;
  }
  let m = t.match(/(\d{1,2})\s+de\s+([a-záéíóú.]+)\s+de\s+(\d{4})/i);
  if (m) {
    const d = parseInt(m[1], 10);
    let monKey = (m[2] || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    monKey = monKey.endsWith(".") ? monKey.slice(0, -1) : monKey;
    const mon = monthsEs[monKey];
    const y = parseInt(m[3], 10);
    if (mon) return toMs(y, mon, d);
  }
  m = t.match(/(\d{1,2})\s+([a-záéíóú.]+)\s+(\d{4})/i);
  if (m) {
    const d = parseInt(m[1], 10);
    let monKey = (m[2] || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    monKey = monKey.endsWith(".") ? monKey.slice(0, -1) : monKey;
    const mon = monthsEs[monKey];
    const y = parseInt(m[3], 10);
    if (mon) return toMs(y, mon, d);
  }
  m = t.match(/([a-z.]+)\s+(\d{1,2}),\s*(\d{4})/i);
  if (m) {
    const raw = (m[1] || "").toLowerCase();
    const mon = monthsEn[raw.endsWith(".") ? raw.slice(0, -1) : raw];
    const d = parseInt(m[2], 10);
    const y = parseInt(m[3], 10);
    if (mon) return toMs(y, mon, d);
  }
  m = t.match(/(\d{1,2})\s+([a-z.]+)\s+(\d{4})/i);
  if (m) {
    const d = parseInt(m[1], 10);
    const raw = (m[2] || "").toLowerCase();
    const mon = monthsEn[raw.endsWith(".") ? raw.slice(0, -1) : raw];
    const y = parseInt(m[3], 10);
    if (mon) return toMs(y, mon, d);
  }
  m = t.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (m) {
    const y = parseInt(m[1], 10);
    const mon = parseInt(m[2], 10);
    const d = parseInt(m[3], 10);
    const ms = toMs(y, mon, d);
    if (ms != null) return ms;
  }
  m = t.match(/([a-záéíóú.]+)\s+(\d{4})/i);
  if (m) {
    let monKey = (m[1] || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    monKey = monKey.endsWith(".") ? monKey.slice(0, -1) : monKey;
    const mon = monthsEs[monKey] || monthsEn[monKey];
    const y = parseInt(m[2], 10);
    if (mon) return toMs(y, mon, 1);
  }
  return null;
}
function extractFrontmatterField(markdown: string, field: string) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  let lines: string[] = [];
  if (normalized.startsWith("---")) {
    const endIndex = normalized.indexOf("\n---", 3);
    if (endIndex === -1) return "";
    lines = normalized.slice(3, endIndex).split("\n");
  } else {
    const all = normalized.split("\n");
    for (const line of all) {
      const t = line.trim();
      if (!t) break;
      if (/^[a-zA-Z][\w-]*\s*:\s*.+$/.test(t)) {
        lines.push(t);
        continue;
      }
      break;
    }
  }
  const regex = new RegExp(`^${field}\\s*:\\s*(.+)$`, "i");
  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      let value = match[1].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1).trim();
      }
      return value;
    }
  }
  return "";
}

function extractFrontmatterTitle(markdown: string) {
  return extractFrontmatterField(markdown, "title");
}

function inferTitleFromMarkdown(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return "";
  }
  const lines = normalized.split("\n");
  const blockLines: string[] = [];
  for (const line of lines) {
    if (!line.trim()) {
      if (blockLines.length > 0) {
        break;
      }
      continue;
    }
    blockLines.push(line.trim());
  }
  if (blockLines.length === 0) {
    return "";
  }
  const joined = blockLines.join(" ");
  const withoutHeading = joined.replace(/^#+\s*/, "").trim();
  if (!withoutHeading) {
    return "";
  }
  const sentenceMatch = withoutHeading.match(/^(.+?[.!?])(\s|$)/);
  const sentence = sentenceMatch ? sentenceMatch[1] : withoutHeading;
  return sentence.replace(/\s+/g, " ").trim();
}

function stripFrontmatter(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  if (normalized.startsWith("---")) {
    const endIndex = normalized.indexOf("\n---", 3);
    if (endIndex === -1) return normalized;
    const rest = normalized.slice(endIndex + 4);
    return rest.replace(/^\s+/, "");
  }
  const lines = normalized.split("\n");
  let index = 0;
  while (index < lines.length) {
    const t = lines[index].trim();
    if (!t) break;
    if (/^[a-zA-Z][\w-]*\s*:\s*.+$/.test(t)) {
      index += 1;
      continue;
    }
    break;
  }
  if (index === 0) return normalized;
  return lines.slice(index).join("\n").replace(/^\s+/, "");
}

export async function listSectionResourceSlugs(section: ResourceSection): Promise<string[]> {
  const config = getSectionConfig(section);
  const sectionDir = path.join(analisisDir, config.analysisSubdir);
  try {
    const entries = await fs.readdir(sectionDir, { withFileTypes: true });
    const fileEntries = await Promise.all(
      entries
        .filter((entry) => {
          if (!entry.isFile()) return false;
          const lower = entry.name.toLowerCase();
          return (
            lower.endsWith(".md") ||
            lower.endsWith(".markdown") ||
            lower.endsWith(".txt") ||
            lower.endsWith(".html")
          );
        })
        .map(async (entry) => {
          const filePath = path.join(sectionDir, entry.name);
          const baseName = entry.name.replace(/\.[^/.]+$/, "");
          const slug = slugifyBaseName(baseName);
          // Prefer source file date if available; fallback to analysis file date
          const dateMs = await getDisplayDateMs(filePath);
  return { slug, dateMs: dateMs || 0 };
}),
);

fileEntries.sort((a, b) => b.dateMs - a.dateMs);

    const seen = new Set<string>();
    const slugs: string[] = [];

    for (const item of fileEntries) {
      if (!item.slug || seen.has(item.slug)) continue;
      seen.add(item.slug);
      slugs.push(item.slug);
    }

    return slugs;
  } catch {
    return [];
  }
}

export async function listResourceSlugs(): Promise<string[]> {
  const files = await listAnalysisFiles();
  return files
    .map((entry) => slugifyBaseName(entry.fileName.replace(/\.[^/.]+$/, "")))
    .filter((slug, index, all) => slug && all.indexOf(slug) === index)
    .sort((a, b) => a.localeCompare(b, "es"));
}

type RawAnalysis = {
  slug: string;
  title: string;
  markdown: string;
  sourceFileName: string | null;
  dateMs: number | null;
  jurisdiction: string | null;
    courtName: string | null;
    description: string | null;
    filePath: string;
  };

async function resolveRawAnalysisBySlug(slug: string): Promise<RawAnalysis | null> {
  const files = await listAnalysisFiles();
  for (const entry of files) {
    const baseName = entry.fileName.replace(/\.[^/.]+$/, "");
    const fileSlug = slugifyBaseName(baseName);
    if (fileSlug !== slug) continue;
    const filePath =
      entry.relativeDir === ""
        ? path.join(analisisDir, entry.fileName)
        : path.join(analisisDir, entry.relativeDir, entry.fileName);
    const markdown = await readTextFile(filePath);
    const frontmatterTitle = extractFrontmatterTitle(markdown);
    const title =
      frontmatterTitle || inferTitleFromMarkdown(markdown) || inferTitleFromFileName(baseName);
    const jurisdiction = extractFrontmatterField(markdown, "jurisdiction");
    const courtName = extractFrontmatterField(markdown, "court");
    const description = extractFrontmatterField(markdown, "description");
    const sourceFileName = await findMatchingSourceFileName(baseName, entry.relativeDir || null);
    const dateMs = await getFileDateMs(filePath);
    return {
      slug,
      title,
      markdown,
      sourceFileName,
      dateMs: Number.isNaN(dateMs) ? null : dateMs,
      jurisdiction: jurisdiction || null,
      courtName: courtName || null,
      description: description || null,
      filePath,
    };
  }
  return null;
}

async function findMatchingSourceFileName(baseName: string, relativeDir: string | null) {
  const normalizedTarget = slugifyBaseName(baseName);
  const searchDirs: { base: string; prefix?: string }[] = [];

  if (relativeDir) {
    const sectionSubdir = path.join(fuentesDir, relativeDir);
    searchDirs.push({ base: sectionSubdir, prefix: relativeDir });
  }

  searchDirs.push({ base: fuentesDir });

  for (const dir of searchDirs) {
    try {
      const entries = await fs.readdir(dir.base, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        const sourceBaseName = entry.name.replace(/\.[^/.]+$/, "");
        const normalizedSource = slugifyBaseName(sourceBaseName);
        if (normalizedSource === normalizedTarget) {
          if (dir.prefix) {
            return `${dir.prefix}/${entry.name}`;
          }
          return entry.name;
        }
      }
    } catch {
      void 0;
    }
  }

  return null;
}

function splitSummaryAndBody(markdown: string) {
  const normalized = stripFrontmatter(markdown).trim();
  if (!normalized) {
    return { summary: "", body: "" };
  }
  const lines = normalized.split("\n");
  const summaryLines: string[] = [];
  let index = 0;
  while (index < lines.length && lines[index].trim()) {
    summaryLines.push(lines[index]);
    index += 1;
  }
  const summary = summaryLines.join("\n").trim();
  const body = lines.slice(index).join("\n").trim();
  return { summary, body };
}

export async function getResourceEntry(slug: string): Promise<ResourceEntry | null> {
  const raw = await resolveRawAnalysisBySlug(slug);
  if (!raw) return null;
  const { summary, body } = splitSummaryAndBody(raw.markdown);
  const kind = inferKindFromTitle(raw.title);
  const summaryHtml = summary ? renderMarkdownToHtml(summary) : "";
  const bodyHtml = body ? renderMarkdownToHtml(body) : "";
  const sourceUrl =
    raw.sourceFileName != null
      ? `/Recursos/Fuentes/${encodeURIComponent(raw.sourceFileName).replace(/%2F/g, "/")}`
      : null;
  const displayDateMs = await getDisplayDateMs(raw.filePath);
  let sourceDateMs: number | null = null;
  if (raw.sourceFileName) {
    try {
      const sourceFilePath = path.join(fuentesDir, raw.sourceFileName);
      const d = await getFileDateMs(sourceFilePath);
      sourceDateMs = Number.isNaN(d) ? null : d;
    } catch {
      sourceDateMs = null;
    }
  }
  return {
    slug,
    title: raw.title,
    summaryHtml,
    bodyHtml,
    kind,
    sourceUrl,
    dateMs: sourceDateMs ?? raw.dateMs,
    displayDateMs: displayDateMs ?? null,
    jurisdiction: raw.jurisdiction,
    courtName: raw.courtName,
    description: raw.description,
  };
}

type RawSectionAnalysis = {
  slug: string;
  title: string;
  markdown: string;
  sourceFileName: string | null;
  dateMs: number | null;
  jurisdiction: string | null;
    courtName: string | null;
    description: string | null;
    filePath: string;
  };

async function resolveSectionRawAnalysis(section: ResourceSection, slug: string): Promise<RawSectionAnalysis | null> {
  const config = getSectionConfig(section);
  const sectionDir = path.join(analisisDir, config.analysisSubdir);
  try {
    const entries = await fs.readdir(sectionDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const lower = entry.name.toLowerCase();
      if (
        !lower.endsWith(".md") &&
        !lower.endsWith(".markdown") &&
        !lower.endsWith(".txt") &&
        !lower.endsWith(".html")
      )
        continue;
      const baseName = entry.name.replace(/\.[^/.]+$/, "");
      const fileSlug = slugifyBaseName(baseName);
      if (fileSlug !== slug) continue;
      const filePath = path.join(sectionDir, entry.name);
      const markdown = await readTextFile(filePath);
      const frontmatterTitle = extractFrontmatterTitle(markdown);
      const isHtml = lower.endsWith(".html");
      const title =
        frontmatterTitle ||
        (isHtml ? inferTitleFromHtml(markdown) : inferTitleFromMarkdown(markdown)) ||
        inferTitleFromFileName(baseName);
      const jurisdiction = extractFrontmatterField(markdown, "jurisdiction");
      const courtName = extractFrontmatterField(markdown, "court");
      const description = extractFrontmatterField(markdown, "description");
      const sourceFileName = await findMatchingSourceFileName(baseName, config.fuentesSubdir);
      const dateMs = await getFileDateMs(filePath);
      return {
        slug,
        title,
        markdown,
        sourceFileName,
        dateMs: Number.isNaN(dateMs) ? null : dateMs,
        jurisdiction: jurisdiction || null,
        courtName: courtName || null,
        description: description || null,
        filePath,
      };
    }
  } catch {
    return null;
  }
  return null;
}

function kindForSection(section: ResourceSection): ResourceKind {
  if (section === "normativa") {
    return "Legislation";
  }
  if (section === "jurisprudencia") {
    return "LegalDecision";
  }
  if (section === "guias-ia") {
    return "NewsArticle";
  }
  return "Article";
}

export async function getSectionResourceEntry(
  section: ResourceSection,
  slug: string,
): Promise<ResourceEntry | null> {
  const raw = await resolveSectionRawAnalysis(section, slug);
  if (!raw) return null;
  const isHtml = raw.filePath.toLowerCase().endsWith(".html");
  const { summary, body } = isHtml ? { summary: "", body: raw.markdown } : splitSummaryAndBody(raw.markdown);
  const kind = kindForSection(section);
  const summaryHtml = isHtml ? extractFirstParagraphHtml(raw.markdown) : summary ? renderMarkdownToHtml(summary) : "";
  const bodyHtml = isHtml ? raw.markdown : body ? renderMarkdownToHtml(body) : "";
  const sourceUrl =
    raw.sourceFileName != null
      ? `/Recursos/Fuentes/${encodeURIComponent(raw.sourceFileName).replace(/%2F/g, "/")}`
      : null;
  const displayDateMs = await getDisplayDateMs(raw.filePath);
  let sourceDateMs: number | null = null;
  if (raw.sourceFileName) {
    try {
      const sourceFilePath = path.join(fuentesDir, raw.sourceFileName);
      const d = await getFileDateMs(sourceFilePath);
      sourceDateMs = Number.isNaN(d) ? null : d;
    } catch {
      sourceDateMs = null;
    }
  }
  return {
    slug,
    title: raw.title,
    summaryHtml,
    bodyHtml,
    kind,
    sourceUrl,
    dateMs: sourceDateMs ?? raw.dateMs,
    displayDateMs: displayDateMs ?? null,
    jurisdiction: raw.jurisdiction,
    courtName: raw.courtName,
    description: raw.description,
  };
}

function extractFirstParagraphHtml(text: string) {
  const m = text.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return m ? m[0] : "";
}

function inferTitleFromHtml(html: string) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) {
    const inner = h1[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (inner) return inner;
  }
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleTag) {
    const inner = titleTag[1].replace(/\s+/g, " ").trim();
    if (inner) return inner;
  }
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return "";
  const m = plain.match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : plain).trim();
}
