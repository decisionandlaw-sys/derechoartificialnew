import { promises as fs } from "fs";
import path from "path";
import { marked } from "marked";

export type ContentSection = "guias-ia" | "firma-scarpa" | "normativa" | "guia" | "jurisprudencia" | "propiedad-intelectual-ia" | "etica-ia" | "global-ia" | "recursos";

export type ContentEntry = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  author: string;
  body: string;
  image?: string;
};

export type ResolvedContentEntry = ContentEntry & {
  urlPath: string;
  url: string;
  html: string;
  dateMs: number;
};

const siteUrl = "https://derechoartificial.com";

function primaryContentDir(section: ContentSection) {
  return path.join(process.cwd(), "src", "content", section);
}

function legacyContentDir(section: ContentSection) {
  return path.join(process.cwd(), "content", section);
}

async function resolveContentDir(section: ContentSection) {
  try {
    await fs.access(primaryContentDir(section));
    return primaryContentDir(section);
  } catch {
    return legacyContentDir(section);
  }
}

async function readEntryFile(section: ContentSection, slug: string) {
  const fileName = `${slug}.json`;
  const primaryPath = path.join(primaryContentDir(section), fileName);
  const legacyPath = path.join(legacyContentDir(section), fileName);

  try {
    return await fs.readFile(primaryPath, "utf8");
  } catch {
    return await fs.readFile(legacyPath, "utf8");
  }
}

async function getContentFileDateMs(dir: string, fileName: string) {
  const filePath = path.join(dir, fileName);

  try {
    const stats = await fs.stat(filePath);
    const created = stats.birthtimeMs;
    if (typeof created === "number" && !Number.isNaN(created) && created > 0) {
      return created;
    }
    return stats.mtimeMs;
  } catch {
    return Date.now();
  }
}

export async function listContentSlugs(section: ContentSection): Promise<string[]> {
  try {
    const dir = await resolveContentDir(section);
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));

    const withDates = await Promise.all(
      files.map(async (entry) => {
        const slug = entry.name.replace(/\.json$/, "");
        let dateMs = await getContentFileDateMs(dir, entry.name);
        try {
          const raw = await fs.readFile(path.join(dir, entry.name), "utf8");
          const parsed: unknown = JSON.parse(raw);
          if (isValidEntry(parsed)) {
            const d = new Date(parsed.datePublished).getTime();
            if (!Number.isNaN(d)) {
              dateMs = d;
            }
          }
        } catch {
          void 0;
        }
        return { slug, dateMs };
      }),
    );

    withDates.sort((a, b) => b.dateMs - a.dateMs);

    return withDates.map((item) => item.slug);
  } catch {
    return [];
  }
}

function isValidEntry(value: unknown): value is Omit<ContentEntry, "slug"> {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.title === "string" &&
    typeof record.description === "string" &&
    typeof record.datePublished === "string" &&
    typeof record.author === "string" &&
    typeof record.body === "string"
  );
}

export async function getContentEntry(
  section: ContentSection,
  slug: string,
): Promise<ResolvedContentEntry | null> {
  try {
    const raw = await readEntryFile(section, slug);
    const parsed: unknown = JSON.parse(raw);
    if (!isValidEntry(parsed)) return null;

    const urlPath = `/${section}/${slug}`;
    const dir = await resolveContentDir(section);
    const dateMs = await getContentFileDateMs(dir, `${slug}.json`);

    return {
      slug,
      title: parsed.title,
      description: parsed.description,
      datePublished: parsed.datePublished,
      author: parsed.author,
      body: parsed.body,
      image: parsed.image,
      urlPath,
      url: `${siteUrl}${urlPath}`,
      html: renderMarkdownToHtml(parsed.body),
      dateMs: Number.isNaN(dateMs) ? 0 : dateMs,
    };
  } catch {
    return null;
  }
}

export function renderMarkdownToHtml(markdown: string) {
  return marked.parse(markdown) as string;
}
