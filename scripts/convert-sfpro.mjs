import fs from 'fs';
import path from 'path';
import { createFont, woff2 } from 'fonteditor-core';

const fontsDir = path.resolve('public/fonts/SFPro');
const sources = [
  { file: 'SFPRODISPLAYREGULAR.OTF', out: 'SFPRODISPLAYREGULAR.woff2' },
  { file: 'SFPRODISPLAYMEDIUM.OTF', out: 'SFPRODISPLAYMEDIUM.woff2' },
  { file: 'SFPRODISPLAYBOLD.OTF', out: 'SFPRODISPLAYBOLD.woff2' },
];

function canSkipConversion(outPath) {
  return fs.existsSync(outPath) && fs.statSync(outPath).size > 0;
}

async function convert() {
  let woff2Ready = false;

  try {
    await woff2.init();
    woff2Ready = true;
  } catch (error) {
    console.warn('[convert-sfpro] No se pudo inicializar woff2; se usarán fuentes existentes.');
    console.warn(error?.message || error);
  }

  for (const { file, out } of sources) {
    const srcPath = path.join(fontsDir, file);
    const outPath = path.join(fontsDir, out);

    if (!fs.existsSync(srcPath)) {
      if (canSkipConversion(outPath)) {
        console.warn(`[convert-sfpro] Fuente origen ausente (${file}), se conserva ${out}.`);
        continue;
      }

      throw new Error(`No existe la fuente origen ni fallback generado: ${srcPath}`);
    }

    if (!woff2Ready) {
      if (canSkipConversion(outPath)) {
        console.warn(`[convert-sfpro] Conversión omitida para ${file}; se mantiene ${out}.`);
        continue;
      }

      throw new Error(`woff2 no está disponible y falta el archivo fallback: ${outPath}`);
    }

    try {
      const buffer = fs.readFileSync(srcPath);
      const font = createFont(buffer, { type: 'otf' });
      const w2 = font.write({ type: 'woff2' });
      fs.writeFileSync(outPath, Buffer.from(w2));
      console.log(`Converted: ${file} -> ${out}`);
    } catch (error) {
      if (canSkipConversion(outPath)) {
        console.warn(`[convert-sfpro] Error al convertir ${file}; se conserva ${out}.`);
        console.warn(error?.message || error);
        continue;
      }

      throw error;
    }
  }
}

convert().catch((err) => {
  console.error('[convert-sfpro] Falló la conversión y no hay fuentes fallback válidas.');
  console.error(err);
  process.exit(1);
});
