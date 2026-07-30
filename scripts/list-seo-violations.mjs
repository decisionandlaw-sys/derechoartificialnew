import fs from "fs/promises";

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

async function main() {
  const csv = await fs.readFile("seo-mdx-table.csv", "utf8");
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const rows = lines.slice(1).map(parseCsvLine);
  const violations = [];

  for (const r of rows) {
    const file = r[0] || "";
    const seoTitle = r[1] || "";
    const seoDescription = r[2] || "";
    const titleOk =
      seoTitle.length <= 60 &&
      seoTitle.length >= 50 &&
      seoTitle.includes("2026") &&
      seoTitle.endsWith(" | Derecho Artificial");
    const descOk = seoDescription.length >= 150 && seoDescription.length <= 160;
    if (titleOk && descOk) continue;
    violations.push({
      file,
      seoTitle,
      seoTitleLength: seoTitle.length,
      seoDescriptionLength: seoDescription.length,
      titleOk,
      descOk,
    });
  }

  await fs.writeFile("seo-mdx-violations.json", JSON.stringify(violations, null, 2) + "\n", "utf8");
  console.log(JSON.stringify({ violations: violations.length }, null, 2));
}

await main();
