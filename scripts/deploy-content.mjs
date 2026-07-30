import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const exec = promisify(execCb);
const cwd = process.cwd();

async function sh(cmd) {
  const { stdout, stderr } = await exec(cmd, { cwd, maxBuffer: 10 * 1024 * 1024 });
  const out = stdout?.trim() ?? "";
  const err = stderr?.trim() ?? "";
  if (err && !/^\s*$/.test(err)) {
    return `${out}\n${err}`.trim();
  }
  return out;
}

function formatSectionsFromPaths(paths) {
  const sections = new Set();
  for (const p of paths) {
    const parts = p.replace(/\\/g, "/").split("/");
    const idx = parts.findIndex((x) => x.toLowerCase() === "recursos");
    if (idx !== -1) {
      const next = parts[idx + 1]?.toLowerCase() || "";
      const sub = parts[idx + 2] || "";
      if (next === "analisis" || next === "fuentes") {
        const s = (sub || "").trim();
        if (s) sections.add(s);
      }
    }
  }
  const map = {
    "Normativa": "Normativa",
    "Jurisprudencia": "Jurisprudencia",
    "Guias-y-Protocolos": "Guías y Protocolos",
    "Firma-Scarpa": "Firma Scarpa",
    "actualidad-ia": "Actualidad IA",
  };
  const labels = Array.from(sections).map((s) => map[s] ?? s);
  labels.sort((a, b) => a.localeCompare(b, "es"));
  return labels;
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const customMsgArg = args.find((a) => a.startsWith("--msg="));
  const customMsg = customMsgArg ? customMsgArg.slice(6).trim() : "";

  console.log("Generando MD desde HTML...");
  await sh("npm run generate-md");

  console.log("Lint...");
  await sh("npm run lint");

  console.log("Typecheck...");
  await sh("npm run typecheck");

  console.log("Build...");
  await sh("npm run build");

  const status = await sh("git status --porcelain");
  const changed = status
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => !!l)
    .map((l) => l.replace(/^[A-Z?]{1,2}\s+/, ""));

  if (changed.length === 0) {
    console.log("No hay cambios para desplegar.");
    return;
  }

  const sections = formatSectionsFromPaths(changed);
  const sectionLabel =
    sections.length > 0 ? `Secciones: ${sections.join(", ")}` : "Secciones";
  const msg =
    customMsg || `Contenido: ${sectionLabel} · ES`;

  console.log(`Commit message: ${msg}`);

  if (dry) {
    console.log("Modo dry-run: no se realizará commit ni push.");
    return;
  }

  console.log("git add -A");
  await sh("git add -A");
  console.log("git commit");
  await sh(`git commit -m "${msg.replace(/"/g, '\\"')}"`);
  console.log("git push");
  await sh("git push");
  console.log("Despliegue lanzado. Verifica la publicación en producción tras unos minutos.");
}

main().catch((err) => {
  console.error(String(err?.stack || err));
  process.exitCode = 1;
});
