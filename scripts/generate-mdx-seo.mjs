import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const repoRoot = process.cwd();
const sources = [
  path.join(repoRoot, "content", "posts"),
  path.join(repoRoot, "content", "firma-scarpa"),
];

const suffix = " | Derecho Artificial";

const stopwords = new Set(
  [
    "de",
    "del",
    "la",
    "las",
    "el",
    "los",
    "y",
    "o",
    "en",
    "para",
    "por",
    "con",
    "sin",
    "una",
    "un",
    "al",
    "a",
    "e",
    "u",
    "que",
    "cómo",
    "como",
    "su",
    "sus",
    "se",
    "es",
    "son",
    "más",
    "menos",
    "sobre",
    "ante",
    "desde",
    "hasta",
    "hacia",
    "entre",
    "esta",
    "este",
    "estas",
    "estos",
    "lo",
    "ya",
    "tus",
    "tu",
    "mi",
    "mis",
  ].map((w) => w.toLowerCase()),
);

function stripMarkdown(text) {
  return String(text || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_`#>~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clampWords(text, maxChars) {
  const normalized = stripMarkdown(text);
  if (normalized.length <= maxChars) return normalized;
  const words = normalized.split(" ");
  let out = "";
  for (const w of words) {
    const next = out ? `${out} ${w}` : w;
    if (next.length > maxChars) break;
    out = next;
  }
  return out.trim();
}

function pickPrimaryKeyword({ title, tags = [], category = "" }) {
  const t = String(title || "");
  const lower = t.toLowerCase();

  const patterns = [
    { re: /\bthomson reuters\b/i, kw: "Thomson Reuters" },
    { re: /\bai act\b/i, kw: "AI Act" },
    { re: /\brgpd\b/i, kw: "RGPD" },
    { re: /\baepd\b/i, kw: "AEPD" },
    { re: /\bdeepfake(s)?\b/i, kw: "Deepfakes" },
    { re: /\bllm\b/i, kw: "LLM" },
    { re: /\blegal tech\b/i, kw: "Legal Tech" },
    { re: /\bpropiedad intelectual\b/i, kw: "Propiedad intelectual" },
    { re: /\bdiscriminaci[oó]n algor[ií]tmica\b/i, kw: "Discriminación algorítmica" },
    { re: /\bcloud\b/i, kw: "Cloud legal" },
    { re: /\bcepej\b/i, kw: "CEPEJ" },
    { re: /\bccbe\b/i, kw: "CCBE" },
    { re: /\btribunal supremo\b/i, kw: "Tribunal Supremo" },
    { re: /\btribunal general\b/i, kw: "Tribunal General UE" },
    { re: /\btransferencias internacionales\b/i, kw: "Transferencias de datos" },
    { re: /\bbrecha(s)? de datos\b/i, kw: "Brechas de datos" },
    { re: /\bverificaci[oó]n de la edad\b/i, kw: "Verificación de edad" },
    { re: /\bia generativa\b/i, kw: "IA generativa" },
  ];

  for (const p of patterns) {
    if (p.re.test(t)) return p.kw;
  }

  const tagCandidate = (Array.isArray(tags) ? tags : [])
    .map((x) => String(x || "").replace(/^#/, "").trim())
    .find((x) => x && x.length >= 3);
  if (tagCandidate) return titleCase(tagCandidate);

  if (String(category || "").toLowerCase() === "noticia") return "IA y privacidad";

  const cleaned = stripMarkdown(t)
    .replace(/\b(20\d{2})\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned
    .split(" ")
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !stopwords.has(w.toLowerCase()));
  const head = words.slice(0, 3).join(" ");
  return head ? titleCase(head) : "Derecho e IA";
}

function titleCase(text) {
  const s = String(text || "").trim();
  if (!s) return "";
  const parts = s.split(" ");
  return parts
    .map((p, idx) => {
      const lower = p.toLowerCase();
      if (idx > 0 && stopwords.has(lower)) return lower;
      if (p.toUpperCase() === p && p.length <= 6) return p;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAcronyms(text) {
  return String(text || "")
    .replace(/\baepd\b/gi, "AEPD")
    .replace(/\brgpd\b/gi, "RGPD")
    .replace(/\bue\b/gi, "UE")
    .replace(/\beds\b/gi, "EDS")
    .replace(/\bllm\b/gi, "LLM")
    .replace(/\bai\b/gi, "IA")
    .replace(/\bcepej\b/gi, "CEPEJ")
    .replace(/\bccbe\b/gi, "CCBE")
    .replace(/\bdsа\b/gi, "DSA");
}

function buildSeoTitle({ title, primaryKeyword }) {
  const baseTitle = normalizeAcronyms(stripMarkdown(title));
  let keyword = normalizeAcronyms(primaryKeyword);
  if (keyword.length > 26) {
    keyword = clampWords(keyword, 26);
  }
  let rest = baseTitle;
  const kwLower = keyword.toLowerCase();
  if (rest.toLowerCase().startsWith(kwLower)) {
    rest = rest.slice(keyword.length).trim();
    rest = rest.replace(/^[:\-–—]\s*/, "");
  }
  rest = rest.replace(/\b(20\d{2})\b/g, "").trim();
  rest = rest.replace(/\s+/g, " ").trim();

  const fixedHead = `${keyword} 2026`;
  const maxRest = 60 - (fixedHead.length + 2 + suffix.length);
  let shortened = maxRest > 0 ? clampWords(rest, maxRest) : "";
  if (!shortened) {
    shortened = "claves y novedades";
  } else if (shortened.length < 12) {
    shortened = `${shortened} claves`;
  }
  shortened = maxRest > 0 ? clampWords(shortened, maxRest) : "";
  let candidate = shortened ? `${fixedHead}: ${shortened}${suffix}` : `${fixedHead}${suffix}`;

  if (candidate.length < 50 && maxRest > 0) {
    const fill = "análisis y claves";
    const needed = 50 - candidate.length;
    const extra = needed > 0 ? clampWords(fill, Math.min(maxRest, needed + 20)) : "";
    const rest2 = clampWords(`${shortened} ${extra}`.trim(), maxRest);
    candidate = `${fixedHead}: ${rest2}${suffix}`;
  }
  if (candidate.length <= 60) return candidate;

  const hard = `${fixedHead}${suffix}`;
  if (hard.length <= 60) return hard;

  const maxKeyword = 60 - (" 2026".length + suffix.length);
  const safeKeyword = clampWords(keyword, Math.max(8, maxKeyword));
  return `${safeKeyword} 2026${suffix}`;
}

function normalizeKeywordList(primary, tags = [], title = "") {
  const out = [];
  const seen = new Set();
  const push = (v) => {
    const s = normalizeAcronyms(String(v || "").replace(/^#/, "").trim());
    if (!s) return;
    const key = s.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(titleCase(normalizeAcronyms(s)));
  };
  push(primary);
  for (const t of Array.isArray(tags) ? tags : []) push(t);

  const t = stripMarkdown(title);
  const candidates = t
    .split(/[\s:(),.]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !stopwords.has(w.toLowerCase()));
  for (const c of candidates) {
    if (out.length >= 3) break;
    push(c);
  }

  while (out.length < 3) {
    push("Regulación IA");
  }

  return out.slice(0, 3);
}

function fitToRange(text, min, max) {
  let s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length > max) {
    s = s.slice(0, max);
    s = s.replace(/\s+\S*$/, "").trimEnd();
    if (!/[.!?]$/.test(s)) s = `${s}.`;
  }
  const pads = [
    " Con ejemplos.",
    " Guía práctica.",
    " Paso a paso.",
    " Con checklist.",
    " Para abogados.",
    " Para despachos.",
  ];
  let i = 0;
  while (s.length < min && i < pads.length) {
    const next = `${s}${pads[i]}`;
    if (next.length > max) break;
    s = next;
    i += 1;
  }
  if (s.length < min) {
    const filler = " Con claves prácticas.";
    if (s.length + filler.length <= max) {
      s = `${s}${filler}`;
    } else {
      const headMax = Math.max(0, max - filler.length);
      s = `${s.slice(0, headMax).replace(/\s+\S*$/, "").trimEnd()}${filler}`;
    }
  }
  if (s.length > max) {
    s = s.slice(0, max);
    s = s.replace(/\s+\S*$/, "").trimEnd();
    if (!/[.!?]$/.test(s)) s = `${s}.`;
  }
  while (s.length < min) {
    const extra = " Claves.";
    if (s.length + extra.length <= max) {
      s = `${s}${extra}`;
    } else {
      const headMax = Math.max(0, max - extra.length);
      s = `${s.slice(0, headMax).replace(/\s+\S*$/, "").trimEnd()}${extra}`;
      break;
    }
  }
  return s;
}

function buildSeoDescription({ description, bodyText, keywords }) {
  const lead = normalizeAcronyms(stripMarkdown(description)) || normalizeAcronyms(clampWords(bodyText, 220));
  const kw = keywords.filter(Boolean).slice(0, 3);
  const k1 = kw[0] || "IA";
  const k2 = kw[1] || "regulación";
  const k3 = kw[2] || "cumplimiento";

  const min = 150;
  const max = 160;

  const leadLen = Math.max(60, Math.min(115, 115 - (k1.length + k2.length + k3.length)));
  const leadShort = clampWords(lead, leadLen);
  const candidate = `${leadShort}. Aprende ${k1}, ${k2} y ${k3}: qué cambia, riesgos y cómo cumplir en 2026.`;
  return fitToRange(candidate, min, max);
}

async function listMdxFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const out = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        out.push(...(await listMdxFiles(full)));
        continue;
      }
      if (e.isFile() && e.name.toLowerCase().endsWith(".mdx")) out.push(full);
    }
    return out;
  } catch {
    return [];
  }
}

function toPosix(p) {
  return p.replace(/\\/g, "/");
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  const allFiles = [];
  for (const dir of sources) {
    allFiles.push(...(await listMdxFiles(dir)));
  }

  allFiles.sort((a, b) => a.localeCompare(b, "es"));

  const rows = [];

  for (const filePath of allFiles) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data || {};
    const content = parsed.content || "";

    const title = String(data.title || path.basename(filePath, ".mdx"));
    const description = String(data.description || "");
    const tags = data.tags || data.keywords || [];
    const category = data.category || "";

    const primaryKeyword = pickPrimaryKeyword({ title, tags, category });
    const keywords = normalizeKeywordList(primaryKeyword, tags, title);
    const seoTitle = buildSeoTitle({ title, primaryKeyword });
    const seoDescription = buildSeoDescription({
      description,
      bodyText: content,
      keywords,
    });

    const rel = toPosix(path.relative(repoRoot, filePath));
    rows.push({
      file: rel,
      seoTitle,
      seoDescription,
      keywords,
    });
  }

  const header = `| Archivo | seoTitle | seoDescription | Keywords |\n|---|---|---|---|\n`;
  const mdLines = [header];
  for (const r of rows) {
    const kw = r.keywords.join(", ");
    mdLines.push(
      `| ${r.file} | ${r.seoTitle.replace(/\|/g, "\\|")} | ${r.seoDescription.replace(/\|/g, "\\|")} | ${kw} |`,
    );
  }

  const mdOut = mdLines.join("\n") + "\n";
  await fs.writeFile(path.join(repoRoot, "seo-mdx-table.md"), mdOut, "utf8");

  const csvLines = [];
  csvLines.push(["Archivo", "seoTitle", "seoDescription", "kw1", "kw2", "kw3"].join(","));
  for (const r of rows) {
    const [k1, k2, k3] = r.keywords;
    csvLines.push(
      [
        csvEscape(r.file),
        csvEscape(r.seoTitle),
        csvEscape(r.seoDescription),
        csvEscape(k1),
        csvEscape(k2),
        csvEscape(k3),
      ].join(","),
    );
  }
  await fs.writeFile(path.join(repoRoot, "seo-mdx-table.csv"), csvLines.join("\n") + "\n", "utf8");

  const summary = {
    files: rows.length,
    output: ["seo-mdx-table.md", "seo-mdx-table.csv"],
  };
  await fs.writeFile(path.join(repoRoot, "seo-mdx-table.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");
  console.log(JSON.stringify(summary));
}

await main();
