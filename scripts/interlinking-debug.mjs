#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔗 Iniciando debug de interlinking...');

try {
  console.log('📍 Paso 1: Definir rutas');
  const contentDir = path.join(__dirname, '../content');
  const postsDir = path.join(__dirname, '../content/posts');
  
  console.log('📂 Content:', contentDir);
  console.log('📂 Posts:', postsDir);
  
  console.log('📍 Paso 2: Verificar directorios');
  console.log('✅ Content existe:', fs.existsSync(contentDir));
  console.log('✅ Posts existe:', fs.existsSync(postsDir));
  
  console.log('📍 Paso 3: Listar archivos en content');
  const contentFiles = fs.readdirSync(contentDir);
  console.log('📁 Content tiene', contentFiles.length, 'archivos');
  
  console.log('📍 Paso 4: Listar archivos en posts');
  const postsFiles = fs.readdirSync(postsDir);
  console.log('📁 Posts tiene', postsFiles.length, 'archivos');
  
  console.log('📍 Paso 5: Buscar MDX en posts');
  const mdxFiles = postsFiles.filter(f => f.endsWith('.mdx'));
  console.log('📄 MDX files:', mdxFiles.length);
  
  if (mdxFiles.length > 0) {
    console.log('📋 Primeros 5 MDX:');
    mdxFiles.slice(0, 5).forEach((file, i) => {
      console.log(`  ${i+1}. ${file}`);
    });
  }
  
  console.log('✅ Debug completado exitosamente');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
