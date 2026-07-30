import fs from "fs/promises";
import path from "path";

const repoRoot = process.cwd();
const csvPath = path.join(repoRoot, "seo-mdx-mejorado.csv");

function parseCsvLine(line) {
  const parts = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      parts.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function escapeYamlDoubleQuoted(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizeNewlines(text) {
  return String(text).replace(/\r\n/g, "\n");
}

function applySeoToMdx(raw, seo) {
  const normalized = normalizeNewlines(raw);
  const match = normalized.match(/^(---\n)([\s\S]*?)(\n---\n)/);
  if (!match) {
    return { updated: raw, changed: false, hadFrontmatter: false };
  }

  const start = match[1];
  const fm = match[2];
  const end = match[3];
  const rest = normalized.slice(match[0].length);

  const lines = fm.split("\n");
  const kept = [];
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (/^(seoTitle|seoDescription|keywords|seoKeyword)\s*:/i.test(trimmed)) {
      continue;
    }
    if (line.trim()) kept.push(line);
  }

  const seoTitle = escapeYamlDoubleQuoted(seo.seoTitle);
  const seoDescription = escapeYamlDoubleQuoted(seo.seoDescription);
  const kw1 = escapeYamlDoubleQuoted(seo.kw1);
  const kw2 = escapeYamlDoubleQuoted(seo.kw2);
  const kw3 = escapeYamlDoubleQuoted(seo.kw3);

  kept.push(`seoTitle: "${seoTitle}"`);
  kept.push(`seoDescription: "${seoDescription}"`);
  kept.push(`keywords: ["${kw1}", "${kw2}", "${kw3}"]`);
  kept.push(`seoKeyword: "${kw1}"`);

  const updatedNormalized = start + kept.join("\n") + end + rest;
  const changed = updatedNormalized !== normalized;

  const out = raw.includes("\r\n") ? updatedNormalized.replace(/\n/g, "\r\n") : updatedNormalized;
  return { updated: out, changed: changed, hadFrontmatter: true };
}

async function main() {
  console.log("AUTOMATIZADOR SEO (Node)");
  console.log("=".repeat(70));

  let csvRaw;
  try {
    csvRaw = await fs.readFile(csvPath, "utf8");
  } catch {
    console.error(`ERROR: No encuentro ${csvPath}`);
    process.exitCode = 1;
    return;
  }

  const lines = csvRaw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    console.error("ERROR: CSV vacío o sin filas.");
    process.exitCode = 1;
    return;
  }

  const header = parseCsvLine(lines[0]);
  const expected = ["Archivo", "seoTitle", "seoDescription", "kw1", "kw2", "kw3"];
  const okHeader = expected.every((v, i) => (header[i] || "").trim() === v);
  if (!okHeader) {
    console.error(`ERROR: Cabecera CSV inesperada. Esperaba: ${expected.join(", ")}`);
    console.error(`Recibí: ${header.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const changes = new Map();
  for (const line of lines.slice(1)) {
    const parts = parseCsvLine(line);
    const row = {
      archivo: parts[0],
      seoTitle: parts[1],
      seoDescription: parts[2],
      kw1: parts[3],
      kw2: parts[4],
      kw3: parts[5],
    };
    if (!row.archivo) continue;
    changes.set(row.archivo.replace(/\\/g, "/"), row);
  }

  console.log(`CSV: ${changes.size} filas`);
  console.log("Actualizando archivos .mdx...");

  let processed = 0;
  let updatedCount = 0;
  let missingCount = 0;
  let noFrontmatterCount = 0;
  let errors = 0;

  const entries = Array.from(changes.entries());
  for (const [archivo, seo] of entries) {
    processed += 1;
    const filePath = path.join(repoRoot, ...archivo.split("/"));

    try {
      const raw = await fs.readFile(filePath, "utf8").catch(() => null);
      if (raw == null) {
        missingCount += 1;
        continue;
      }

      const { updated, changed, hadFrontmatter } = applySeoToMdx(raw, seo);
      if (!hadFrontmatter) {
        noFrontmatterCount += 1;
        continue;
      }

      if (changed) {
        await fs.writeFile(filePath, updated, "utf8");
        updatedCount += 1;
      }

      if (processed % 50 === 0) {
        console.log(`- ${processed}/${entries.length} procesados (${updatedCount} actualizados)`);
      }
    } catch (e) {
      errors += 1;
      console.error(`ERROR en ${archivo}: ${String(e?.message || e)}`);
    }
  }

  console.log("");
  console.log(`OK: ${updatedCount} archivos .mdx actualizados`);
  if (missingCount) console.log(`WARN: ${missingCount} archivos no encontrados (ignorados)`);
  if (noFrontmatterCount) console.log(`WARN: ${noFrontmatterCount} sin frontmatter válido (ignorados)`);
  if (errors) console.log(`ERRORS: ${errors}`);

  if (updatedCount === 0) {
    console.log("No hay cambios que commitear.");
    return;
  }

  console.log("");
  console.log("Git: commit + push (content/)");
  const { spawnSync } = await import("node:child_process");

  spawnSync("git", ["config", "user.email", "bot@derechoartificial.com"], { stdio: "ignore" });
  spawnSync("git", ["config", "user.name", "SEO Bot"], { stdio: "ignore" });

  const add = spawnSync("git", ["add", "content/"], { encoding: "utf8" });
  if (add.status !== 0) {
    console.error(add.stderr || "ERROR: git add falló");
    process.exitCode = 1;
    return;
  }

  const commitMsg = `SEO: Optimize ${updatedCount} meta tags (seoTitle, seoDescription, keywords)`;
  const commit = spawnSync("git", ["commit", "-m", commitMsg], { encoding: "utf8" });
  if (commit.status !== 0) {
    const out = `${commit.stdout || ""}\n${commit.stderr || ""}`.trim();
    if (/nothing to commit/i.test(out)) {
      console.log("Nada que commitear.");
      return;
    }
    console.error(out || "ERROR: git commit falló");
    process.exitCode = 1;
    return;
  }

  const push = spawnSync("git", ["push", "origin", "main"], { encoding: "utf8" });
  if (push.status === 0) {
    console.log("Push completado exitosamente.");
    return;
  }

  console.log("WARN: push no completado (posible autenticación).");
  console.log((push.stdout || "").trim());
  console.log((push.stderr || "").trim());
  process.exitCode = 1;
}

await main();
