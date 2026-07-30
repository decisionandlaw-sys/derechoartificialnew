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

  let badTitle = 0;
  let badDesc = 0;
  let badTitleMin = 0;
  let badDescMin = 0;

  for (const r of rows) {
    const seoTitle = r[1] || "";
    const seoDescription = r[2] || "";
    const okTitle =
      seoTitle.length <= 60 &&
      seoTitle.length >= 50 &&
      seoTitle.includes("2026") &&
      seoTitle.endsWith(" | Derecho Artificial");
    const okDesc = seoDescription.length >= 150 && seoDescription.length <= 160;

    if (!okTitle) badTitle += 1;
    if (!okDesc) badDesc += 1;
    if (seoTitle.length < 50) badTitleMin += 1;
    if (seoDescription.length < 150) badDescMin += 1;
  }

  const summary = {
    files: rows.length,
    badTitle,
    badDesc,
    titlesUnder50: badTitleMin,
    descUnder150: badDescMin,
  };
  console.log(JSON.stringify(summary, null, 2));
}

await main();
