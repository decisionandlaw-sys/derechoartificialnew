#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔗 Interlinking Minimal - Iniciando...');

const contentDir = path.join(__dirname, '../content');
const postsDir = path.join(__dirname, '../content/posts');

// Patrones de clusters
const CLUSTER_PATTERNS = {
  "jurisprudencia": ["jurisprudencia", "sentencia", "caso", "corte", "tribunal", "getty", "stability", "thaler", "dabus"],
  "ia-proteccion-datos": ["rgpd", "proteccion-datos", "privacidad", "aepd"],
  "ai-act": ["ai-act", "reglamento-ia"],
  "firma-scarpa": ["doctrinal", "analisis", "scarpa"],
  "guia": ["guia", "manual", "protocolo"],
  "etica-ia": ["etica", "gobernanza", "transparencia"]
};

// Función para detectar cluster
function detectCluster(fileName) {
  for (const [cluster, patterns] of Object.entries(CLUSTER_PATTERNS)) {
    for (const pattern of patterns) {
      if (fileName.toLowerCase().includes(pattern.toLowerCase())) {
        return cluster;
      }
    }
  }
  
  if (fileName.includes('-doctrinal') || fileName.includes('-doctrinal-final')) {
    return 'firma-scarpa';
  }
  
  if (fileName.includes('-seo')) {
    return 'firma-scarpa';
  }
  
  const datePattern = /^\d{4}-\d{2}-\d{2}-/;
  if (datePattern.test(fileName)) {
    return 'actualidad-ia';
  }
  
  return null;
}

// Función para encontrar archivos MDX
function findMdxFiles() {
  const files = [];
  
  function scanDir(dir) {
    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.mdx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Error en ${dir}: ${error.message}`);
    }
  }
  
  scanDir(postsDir);
  return files;
}

// Procesar archivos
function processFiles() {
  console.log('📁 Buscando archivos MDX...');
  const files = findMdxFiles();
  console.log(`📄 Encontrados ${files.length} archivos MDX`);
  
  const clusterStats = {};
  const processedFiles = [];
  
  // Procesar primeros 20 archivos para prueba
  const filesToProcess = files.slice(0, 20);
  console.log(`📝 Procesando primeros ${filesToProcess.length} archivos...`);
  
  for (const filePath of filesToProcess) {
    try {
      const fileName = path.basename(filePath, '.mdx');
      const cluster = detectCluster(fileName);
      
      if (cluster) {
        clusterStats[cluster] = (clusterStats[cluster] || 0) + 1;
        console.log(`✅ ${fileName} → ${cluster}`);
        
        processedFiles.push({
          fileName,
          filePath,
          cluster,
          keywords: [cluster]
        });
      } else {
        console.log(`⚠️  ${fileName} → sin cluster`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${filePath}: ${error.message}`);
    }
  }
  
  console.log('\n📊 Estadísticas de clusters:');
  for (const [cluster, count] of Object.entries(clusterStats)) {
    console.log(`  ${cluster}: ${count} archivos`);
  }
  
  // Generar reporte simple
  const report = {
    method: "filename-pattern-based",
    date: new Date().toISOString().split('T')[0],
    summary: {
      filesScanned: files.length,
      filesProcessed: processedFiles.length,
      clustersDetected: Object.keys(clusterStats).length
    },
    clusterStats,
    processedFiles
  };
  
  const reportPath = path.join(__dirname, '../interlinking-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📋 Reporte guardado en: ${reportPath}`);
  console.log(`📄 Archivos escaneados: ${report.summary.filesScanned}`);
  console.log(`⚙️  Archivos procesados: ${report.summary.filesProcessed}`);
  console.log(`🏷️  Clusters detectados: ${report.summary.clustersDetected}`);
  
  return report;
}

// Ejecutar
try {
  const report = processFiles();
  console.log('\n✅ Proceso completado exitosamente');
  console.log('💡 Para procesar todos los archivos y añadir enlaces, ejecuta la versión completa del script.');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
}
