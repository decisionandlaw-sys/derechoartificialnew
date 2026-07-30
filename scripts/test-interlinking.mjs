#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔗 Test de interlinking iniciado...');

// Configuración
const contentDir = path.join(__dirname, '../content');
const postsDir = path.join(__dirname, '../content/posts');

console.log('📂 Directorios:');
console.log('  Content:', contentDir);
console.log('  Posts:', postsDir);

// Verificar directorios
console.log('\n✅ Verificando directorios:');
if (fs.existsSync(contentDir)) {
  console.log('  ✓ Content dir existe');
} else {
  console.log('  ❌ Content dir NO existe');
}

if (fs.existsSync(postsDir)) {
  console.log('  ✓ Posts dir existe');
} else {
  console.log('  ❌ Posts dir NO existe');
}

// Listar archivos MDX
function findMdxFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      console.log(`  📁 Escaneando: ${currentDir}`);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.mdx')) {
          files.push(fullPath);
          console.log(`    📄 Encontrado: ${item}`);
        }
      }
    } catch (error) {
      console.warn(`  ⚠️  Error en ${currentDir}: ${error.message}`);
    }
  }
  
  scanDir(dir);
  return files;
}

console.log('\n🔍 Buscando archivos MDX...');
const allFiles = [
  ...findMdxFiles(contentDir),
  ...findMdxFiles(postsDir)
];

console.log(`\n📊 Total archivos MDX encontrados: ${allFiles.length}`);

if (allFiles.length > 0) {
  console.log('\n📋 Lista de archivos:');
  allFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${path.basename(file)}`);
  });
} else {
  console.log('❌ No se encontraron archivos MDX');
}

console.log('\n✅ Test completado');
