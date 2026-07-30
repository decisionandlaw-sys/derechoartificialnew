#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔗 Sistema de Interlinking Completo - Iniciando...');

const contentDir = path.join(__dirname, '../content');
const postsDir = path.join(__dirname, '../content/posts');
const outputReport = path.join(__dirname, '../interlinking-report.json');
const dryRun = true; // Cambiar a false para aplicar cambios

// Patrones de clusters
const CLUSTER_PATTERNS = {
  "jurisprudencia": ["jurisprudencia", "sentencia", "caso", "corte", "tribunal", "getty", "stability", "thaler", "dabus"],
  "ia-proteccion-datos": ["rgpd", "proteccion-datos", "privacidad", "aepd", "datos-biometricos", "decisiones-automatizadas"],
  "ai-act": ["ai-act", "reglamento-ia", "sistemas-prohibidos", "sistemas-alto-riesgo"],
  "firma-scarpa": ["doctrinal", "analisis", "scarpa"],
  "guia": ["guia", "manual", "protocolo", "completa"],
  "etica-ia": ["etica", "gobernanza", "transparencia", "auditoria", "bias", "responsabilidad-ia"],
  "ia-agentica": ["ia-agentica", "agencia", "autonoma", "agente", "responsabilidad-agentes"],
  "legal-tech": ["legal-tech", "herramientas", "startups", "automatizacion", "software-juridico"],
  "recursos": ["glosario", "recurso", "base-datos"]
};

// Instituciones y casos conocidos
const INSTITUTIONAL_PATTERNS = {
  "jurisprudencia": ["getty-images", "stability-ai", "thaler", "dabus", "eeoc", "itutorgroup", "sentencia-t-323", "colombia", "fletcher-v-experian", "hallucinations"],
  "ia-agentica": ["openai", "anthropic", "google-gemini", "microsoft-copilot"],
  "ia-proteccion-datos": ["aepd", "edpb", "ftc"],
  "ai-act": ["comision-europea", "consejo-ue", "parlamento-europeo"]
};

// Función para detectar cluster
function detectCluster(fileName) {
  let detectedCluster = null;
  let keywords = [];
  
  // Patrón 1: Palabras clave en nombre
  for (const [cluster, patterns] of Object.entries(CLUSTER_PATTERNS)) {
    for (const pattern of patterns) {
      if (fileName.toLowerCase().includes(pattern.toLowerCase())) {
        detectedCluster = cluster;
        keywords.push(pattern);
      }
    }
  }
  
  // Patrón 2: Estructura del nombre
  if (fileName.includes('-doctrinal') || fileName.includes('-doctrinal-final')) {
    detectedCluster = 'firma-scarpa';
    keywords.push('doctrinal');
  }
  
  if (fileName.includes('-seo')) {
    const baseName = fileName.replace('-seo', '');
    for (const [cluster, patterns] of Object.entries(CLUSTER_PATTERNS)) {
      for (const pattern of patterns) {
        if (baseName.toLowerCase().includes(pattern.toLowerCase())) {
          detectedCluster = cluster;
          keywords.push(pattern);
        }
      }
  }
  
  // Patrón 3: Fechas (AAAA-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}-/;
  if (datePattern.test(fileName)) {
    detectedCluster = 'actualidad-ia';
    keywords.push('noticia', 'actualidad');
  }
  
  // Patrón 4: Instituciones conocidas
  for (const [cluster, institutions] of Object.entries(INSTITUTIONAL_PATTERNS)) {
    for (const institution of institutions) {
      if (fileName.toLowerCase().includes(institution.toLowerCase())) {
        detectedCluster = cluster;
        keywords.push(institution);
      }
    }
  }
  
  return {
    cluster: detectedCluster,
    keywords: [...new Set(keywords)]
  };
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

// Función para parsear información del archivo
function parseFileInfo(filePath) {
  const fileName = path.basename(filePath, '.mdx');
  const relativePath = path.relative(contentDir, filePath);
  const { cluster, keywords } = detectCluster(fileName);
  
  // Extraer slug del frontmatter
  let slug = fileName;
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const slugMatch = frontmatterMatch[1].match(/slug:\s*["']([^"']+)["']/);
      if (slugMatch) {
        slug = slugMatch[1];
      }
    }
  } catch (error) {
    // Usar nombre de archivo si no puede leer frontmatter
  }
  
  return {
    filePath,
    fileName,
    slug,
    relativePath,
    cluster,
    keywords,
    content: fs.readFileSync(filePath, 'utf-8')
  };
}

// Función para encontrar archivos relacionados
function findRelatedFiles(currentFile, allFiles) {
  const related = [];
  
  for (const file of allFiles) {
    if (file.filePath === currentFile.filePath) continue;
    
    // Calcular similitud basada en keywords compartidas
    const commonKeywords = currentFile.keywords.filter(k => 
      file.keywords.some(fk => fk.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(fk.toLowerCase()))
    );
    
    if (commonKeywords.length > 0) {
      related.push({
        file,
        commonKeywords,
        score: commonKeywords.length
      });
    }
  }
  
  // Ordenar por relevancia y limitar a 5
  return related.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Función para generar texto de enlace
function generateLinkText(relatedFile, context) {
  const title = relatedFile.fileName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  if (relatedFile.cluster === context.cluster) {
    return `Ver también: ${title}`;
  }
  
  return `Análisis relacionado: ${title}`;
}

// Función para generar URL
function generateUrl(file) {
  if (file.relativePath.startsWith('posts/')) {
    return `/firma-scarpa/${file.slug}`;
  }
  
  if (file.cluster) {
    return `/${file.cluster}/${file.slug}`;
  }
  
  return `/${file.slug}`;
}

// Función para añadir enlaces
function addInterlinksToFile(fileInfo, relatedFiles) {
  const lines = fileInfo.content.split('\n');
  const newLines = [];
  let linksAdded = 0;
  const maxLinks = 3; // Limitar a 3 enlaces por archivo
  
  for (let i = 0; i < lines.length && linksAdded < maxLinks; i++) {
    const line = lines[i];
    
    // Detectar encabezados para insertar enlaces
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      
      // Insertar enlaces después de encabezados principales (## o ###)
      if (level >= 2 && level <= 3 && linksAdded < maxLinks && linksAdded < relatedFiles.length) {
        newLines.push(line);
        
        const relatedFile = relatedFiles[linksAdded];
        const linkText = generateLinkText(relatedFile, fileInfo);
        const url = generateUrl(relatedFile.file);
        
        newLines.push('');
        newLines.push(`> **${linkText}**: [${relatedFile.file.fileName.replace(/-/g, ' ')}](${url})`);
        linksAdded++;
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }
  
  return {
    originalContent: fileInfo.content,
    newContent: newLines.join('\n'),
    linksAdded,
    modified: linksAdded > 0
  };
}

// Procesar archivos
function processFiles() {
  console.log('📁 Buscando archivos MDX...');
  const files = findMdxFiles();
  console.log(`📄 Encontrados ${files.length} archivos MDX`);
  
  // Parsear información de todos los archivos
  console.log('📊 Analizando archivos...');
  const allFiles = files.map(parseFileInfo);
  
  // Estadísticas iniciales
  const clusterStats = {};
  for (const file of allFiles) {
    if (file.cluster) {
      clusterStats[file.cluster] = (clusterStats[file.cluster] || 0) + 1;
    }
  }
  
  console.log('📊 Clusters detectados:');
  for (const [cluster, count] of Object.entries(clusterStats)) {
    console.log(`  ${cluster}: ${count} archivos`);
  }
  
  // Procesar archivos para añadir enlaces
  console.log('🔗 Procesando archivos para añadir enlaces...');
  const results = [];
  let totalLinksAdded = 0;
  let filesProcessed = 0;
  
  // Procesar todos los archivos con cluster detectado
  const filesToProcess = allFiles.filter(f => f.cluster);
  console.log(`📝 Procesando ${filesToProcess.length} archivos con cluster...`);
  
  for (const fileInfo of filesToProcess) {
    try {
      // Encontrar archivos relacionados
      const relatedFiles = findRelatedFiles(fileInfo, allFiles);
      
      if (relatedFiles.length === 0) {
        console.log(`⚠️  Sin archivos relacionados para ${fileInfo.fileName}`);
        continue;
      }
      
      // Añadir enlaces
      const result = addInterlinksToFile(fileInfo, relatedFiles);
      
      if (result.modified) {
        if (!dryRun) {
          fs.writeFileSync(fileInfo.filePath, result.newContent, 'utf-8');
          console.log(`✅ ${fileInfo.fileName}: +${result.linksAdded} enlaces`);
        } else {
          console.log(`🔍 [DRY RUN] ${fileInfo.fileName}: +${result.linksAdded} enlaces`);
        }
        
        totalLinksAdded += result.linksAdded;
        filesProcessed++;
      }
      
      results.push({
        file: fileInfo.fileName,
        cluster: fileInfo.cluster,
        linksAdded: result.linksAdded,
        relatedFiles: relatedFiles.map(rf => ({
          file: rf.file.fileName,
          commonKeywords: rf.commonKeywords,
          score: rf.score
        }))
      });
      
    } catch (error) {
      console.error(`❌ Error procesando ${fileInfo.fileName}: ${error.message}`);
    }
  }
  
  // Generar reporte completo
  const report = {
    method: "filename-pattern-based",
    date: new Date().toISOString().split('T')[0],
    config: {
      dryRun: dryRun,
      maxLinksPerFile: 3
    },
    summary: {
      filesScanned: files.length,
      filesProcessed: filesProcessed,
      clustersDetected: Object.keys(clusterStats).length,
      totalLinksAdded: totalLinksAdded,
      averageLinksPerFile: filesProcessed > 0 ? (totalLinksAdded / filesProcessed).toFixed(1) : 0
    },
    clusterStats,
    results
  };
  
  fs.writeFileSync(outputReport, JSON.stringify(report, null, 2));
  
  console.log('\n📈 Resumen del proceso:');
  console.log(`📄 Archivos escaneados: ${report.summary.filesScanned}`);
  console.log(`⚙️  Archivos procesados: ${report.summary.filesProcessed}`);
  console.log(`🏷️  Clusters detectados: ${report.summary.clustersDetected}`);
  console.log(`🔗 Enlaces añadidos: ${report.summary.totalLinksAdded}`);
  console.log(`📊 Promedio por archivo: ${report.summary.averageLinksPerFile}`);
  console.log(`📋 Reporte guardado en: ${outputReport}`);
  
  if (dryRun) {
    console.log('\n🔍 MODO DRY RUN: No se modificaron archivos.');
    console.log('💡 Para aplicar cambios, cambia dryRun a false en el script.');
  } else {
    console.log('\n✅ Interlinking completado. Los archivos han sido modificados.');
  }
  
  return report;
}

// Ejecutar
try {
  const report = processFiles();
  console.log('\n🎉 Sistema de interlinking completado exitosamente');
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
}
