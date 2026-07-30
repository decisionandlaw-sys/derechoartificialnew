#!/usr/bin/env node

/**
 * Sistema Automático de Interlinking para DerechoArtificial.com
 * Método: Basado en patrones de nombres de archivos (sin leer contenido)
 * Framework: Next.js con MDX
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
  contentDir: path.join(__dirname, '../content'),
  postsDir: path.join(__dirname, '../content/posts'),
  maxLinksPerFile: 7,
  outputReport: path.join(__dirname, '../interlinking-report.json'),
  dryRun: true // Cambiar a true para solo preview
};

// Patrones de clusters basados en nombres de archivos
const CLUSTER_PATTERNS = {
  "ai-act": ["ai-act", "reglamento-ia", "sistemas-prohibidos", "sistemas-alto-riesgo"],
  "jurisprudencia": ["jurisprudencia", "sentencia", "caso", "corte", "tribunal", "getty", "stability", "thaler", "dabus"],
  "ia-proteccion-datos": ["rgpd", "proteccion-datos", "privacidad", "perfilado", "datos-biometricos", "decisiones-automatizadas"],
  "ia-agentica": ["ia-agentica", "agencia", "autonoma", "agente", "responsabilidad-agentes"],
  "legal-tech": ["legal-tech", "herramientas", "startups", "automatizacion", "software-juridico"],
  "etica-ia": ["etica", "gobernanza", "transparencia", "auditoria", "bias", "responsabilidad-ia"],
  "firma-scarpa": ["doctrinal", "analisis"],
  "guia": ["guia", "manual", "protocolo", "completa"],
  "recursos": ["glosario", "recurso", "base-datos"]
};

// Instituciones y casos conocidos
const INSTITUTIONAL_PATTERNS = {
  "jurisprudencia": ["getty-images", "stability-ai", "thaler", "dabus", "eeoc", "itutorgroup", "sentencia-t-323", "colombia", "fletcher-v-experian", "hallucinations"],
  "ia-agentica": ["openai", "anthropic", "google-gemini", "microsoft-copilot"],
  "ia-proteccion-datos": ["aepd", "edpb", "ftc"],
  "ai-act": ["comision-europea", "consejo-ue", "parlamento-europeo"]
};

console.log('🔗 Iniciando sistema de interlinking automático...');

// Función para encontrar todos los archivos MDX
function findAllMdxFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.mdx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  No se puede leer directorio ${currentDir}: ${error.message}`);
    }
  }
  
  scanDir(dir);
  return files;
}

// Función para extraer información del nombre de archivo
function parseFileInfo(filePath) {
  const fileName = path.basename(filePath, '.mdx');
  const relativePath = path.relative(CONFIG.contentDir, filePath);
  
  // Detectar cluster basado en patrones
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
    // Mantener el mismo cluster que la versión -doctrinal
    for (const [cluster, patterns] of Object.entries(CLUSTER_PATTERNS)) {
      for (const pattern of patterns) {
        if (baseName.toLowerCase().includes(pattern.toLowerCase())) {
          detectedCluster = cluster;
          keywords.push(pattern);
        }
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
  
  // Extraer slug del frontmatter si es posible, si no usar el nombre
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
    // Si no puede leer el frontmatter, usar el nombre del archivo
    // console.warn(`No se pudo leer frontmatter de ${fileName}, usando nombre de archivo`);
  }
  
  return {
    filePath,
    fileName,
    slug,
    relativePath,
    detectedCluster,
    keywords: [...new Set(keywords)], // Eliminar duplicados
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
  
  // Ordenar por relevancia (más keywords compartidas)
  return related.sort((a, b) => b.score - a.score).slice(0, 5);
}

// Función para generar texto de enlace
function generateLinkText(relatedFile, context) {
  const title = relatedFile.fileName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  // Si es del mismo cluster, usar formato específico
  if (relatedFile.detectedCluster === context.detectedCluster) {
    return `Ver también: ${title}`;
  }
  
  return `Análisis relacionado: ${title}`;
}

// Función para generar URL
function generateUrl(file) {
  if (file.relativePath.startsWith('posts/')) {
    return `/firma-scarpa/${file.slug}`;
  }
  
  // Para otros directorios, inferir la ruta
  if (file.detectedCluster) {
    return `/${file.detectedCluster}/${file.slug}`;
  }
  
  return `/${file.slug}`;
}

// Función para añadir enlaces a un archivo
function addInterlinksToFile(fileInfo, relatedFiles) {
  const lines = fileInfo.content.split('\n');
  const newLines = [];
  let linksAdded = 0;
  let lastHeadingLevel = 0;
  
  for (let i = 0; i < lines.length && linksAdded < CONFIG.maxLinksPerFile; i++) {
    const line = lines[i];
    
    // Detectar encabezados para insertar enlaces estratégicamente
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      lastHeadingLevel = headingMatch[1].length;
      
      // Insertar enlaces después de encabezados principales (## o ###)
      if (lastHeadingLevel >= 2 && lastHeadingLevel <= 3 && linksAdded < CONFIG.maxLinksPerFile) {
        newLines.push(line);
        
        // Añadir sección de enlaces relacionados
        if (linksAdded < relatedFiles.length && linksAdded < CONFIG.maxLinksPerFile) {
          const relatedFile = relatedFiles[linksAdded];
          const linkText = generateLinkText(relatedFile, fileInfo);
          const url = generateUrl(relatedFile.file);
          
          newLines.push('');
          newLines.push(`> **${linkText}**: [${relatedFile.file.fileName.replace(/-/g, ' ')}](${url})`);
          linksAdded++;
        }
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

// Función principal
function main() {
  console.log('� Iniciando sistema de interlinking automático...');
  console.log('�📁 Escaneando directorios de contenido...');
  console.log('📂 Directorio de contenido:', CONFIG.contentDir);
  console.log('📂 Directorio de posts:', CONFIG.postsDir);
  
  console.log('📍 Entrando al bloque try...');
  
  try {
    console.log('📍 Verificando directorios...');
    
    // Verificar que los directorios existen
    if (!fs.existsSync(CONFIG.contentDir)) {
      console.log('❌ Directorio de contenido no existe:', CONFIG.contentDir);
      return;
    }
    if (!fs.existsSync(CONFIG.postsDir)) {
      console.log('❌ Directorio de posts no existe:', CONFIG.postsDir);
      return;
    }
    
    console.log('✅ Directorios verificados');
    console.log('📍 Buscando archivos MDX...');
    
    // Encontrar todos los archivos MDX
    const allFiles = [
      ...findAllMdxFiles(CONFIG.contentDir),
      ...findAllMdxFiles(CONFIG.postsDir)
    ];
    
    console.log('📍 Archivos encontrados, eliminando duplicados...');
    
    // Eliminar duplicados (por si hay archivos en ambos directorios)
    const uniqueFiles = allFiles.filter((file, index, self) =>
      index === self.findIndex(f => f.filePath === file.filePath)
    );
    
    console.log(`📄 Encontrados ${uniqueFiles.length} archivos MDX únicos`);
    
    if (uniqueFiles.length === 0) {
      console.log('❌ No se encontraron archivos MDX. Verifica las rutas de los directorios.');
      return;
    }
    
    console.log('📍 Parseando información de archivos...');
    
    // Parsear información de cada archivo
    const parsedFiles = uniqueFiles.map(parseFileInfo);
    
    console.log('📍 Calculando estadísticas de clusters...');
    
    // Estadísticas de clusters
    const clusterStats = {};
    for (const file of parsedFiles) {
      if (file.detectedCluster) {
        clusterStats[file.detectedCluster] = (clusterStats[file.detectedCluster] || 0) + 1;
      }
    }
    
    console.log('📊 Clusters detectados:');
    for (const [cluster, count] of Object.entries(clusterStats)) {
      console.log(`  ${cluster}: ${count} archivos`);
    }
    
    console.log('📍 Procesando archivos para añadir enlaces...');
    
    // Procesar cada archivo para añadir enlaces
    const results = [];
    let totalLinksAdded = 0;
    let filesProcessed = 0;
    
    for (const fileInfo of parsedFiles) {
      if (!fileInfo.detectedCluster) {
        console.log(`⚠️  Omitiendo ${fileInfo.fileName} (sin cluster detectado)`);
        continue;
      }
      
      // Encontrar archivos relacionados
      const relatedFiles = findRelatedFiles(fileInfo, parsedFiles);
      
      if (relatedFiles.length === 0) {
        console.log(`⚠️  Sin archivos relacionados para ${fileInfo.fileName}`);
        continue;
      }
      
      // Añadir enlaces
      const result = addInterlinksToFile(fileInfo, relatedFiles);
      
      if (result.modified) {
        if (!CONFIG.dryRun) {
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
        cluster: fileInfo.detectedCluster,
        linksAdded: result.linksAdded,
        relatedFiles: relatedFiles.map(rf => ({
          file: rf.file.fileName,
          commonKeywords: rf.commonKeywords,
          score: rf.score
        }))
      });
    }
    
    console.log('📍 Generando reporte...');
    
    // Generar reporte
    const report = {
      method: "filename-pattern-based",
      date: new Date().toISOString().split('T')[0],
      config: {
        maxLinksPerFile: CONFIG.maxLinksPerFile,
        dryRun: CONFIG.dryRun
      },
      summary: {
        filesScanned: uniqueFiles.length,
        filesProcessed: filesProcessed,
        clustersDetected: Object.keys(clusterStats).length,
        totalLinksAdded: totalLinksAdded,
        averageLinksPerFile: filesProcessed > 0 ? (totalLinksAdded / filesProcessed).toFixed(1) : 0
      },
      clusterStats,
      results
    };
    
    // Guardar reporte
    fs.writeFileSync(CONFIG.outputReport, JSON.stringify(report, null, 2));
    
    console.log('\n📈 Resumen del proceso:');
    console.log(`📄 Archivos escaneados: ${report.summary.filesScanned}`);
    console.log(`⚙️  Archivos procesados: ${report.summary.filesProcessed}`);
    console.log(`🏷️  Clusters detectados: ${report.summary.clustersDetected}`);
    console.log(`🔗 Enlaces añadidos: ${report.summary.totalLinksAdded}`);
    console.log(`📊 Promedio por archivo: ${report.summary.averageLinksPerFile}`);
    console.log(`📋 Reporte guardado en: ${CONFIG.outputReport}`);
    
    if (CONFIG.dryRun) {
      console.log('\n🔍 MODO DRY RUN: No se modificaron archivos. Cambia dryRun a false para aplicar cambios.');
    } else {
      console.log('\n✅ Interlinking completado. Los archivos han sido modificados.');
    }
    
  } catch (error) {
    console.error('❌ Error durante la ejecución:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
