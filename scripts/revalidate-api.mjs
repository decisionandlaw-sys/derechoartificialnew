#!/usr/bin/env node

/**
 * Script de revalidación para DerechoArtificial.com
 * Uso: node scripts/revalidate-api.mjs [opciones]
 */

import https from 'https';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Colores para output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Configuración
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
const BASE_URL = process.env.BASE_URL || 'https://www.derechoartificial.com';
const API_ENDPOINT = `${BASE_URL}/api/revalidate`;

// Función de ayuda
function showHelp() {
  colorLog('blue', 'Script de Revalidación - DerechoArtificial.com');
  console.log('');
  colorLog('yellow', 'Uso: node scripts/revalidate-api.mjs [opciones]');
  console.log('');
  colorLog('yellow', 'Opciones:');
  console.log('  -h, --help          Muestra esta ayuda');
  console.log('  -p, --paths         Rutas específicas a revalidar (separadas por comas)');
  console.log('  -t, --tags          Tags específicos a revalidar (separados por comas)');
  console.log('  -a, --all           Revalida todas las rutas y tags por defecto');
  console.log('  -v, --verbose       Modo verbose');
  console.log('');
  colorLog('yellow', 'Variables de entorno:');
  console.log('  REVALIDATE_SECRET    Token secreto para autenticación (requerido)');
  console.log('  BASE_URL           URL base del sitio (default: https://www.derechoartificial.com)');
  console.log('');
  colorLog('yellow', 'Ejemplos:');
  console.log('  # Revalidar todo');
  console.log('  REVALIDATE_SECRET=tu_secreto node scripts/revalidate-api.mjs --all');
  console.log('');
  console.log('  # Revalidar rutas específicas');
  console.log('  REVALIDATE_SECRET=tu_secreto node scripts/revalidate-api.mjs --paths "/firma-scarpa,/actualidad-ia"');
  console.log('');
  console.log('  # Revalidar tags específicos');
  console.log('  REVALIDATE_SECRET=tu_secreto node scripts/revalidate-api.mjs --tags "firma-scarpa-posts,actualidad-posts"');
}

// Validar configuración
function validateConfig() {
  if (!REVALIDATE_SECRET) {
    colorLog('red', '❌ Error: REVALIDATE_SECRET no está configurado');
    colorLog('yellow', '💡 Solución: export REVALIDATE_SECRET=tu_token_secreto');
    colorLog('yellow', '💡 O configura en .env.local o secrets de CI/CD');
    process.exit(1);
  }
}

// Función para revalidar
function revalidate(paths = [], tags = [], verbose = false) {
  return new Promise((resolve, reject) => {
    colorLog('blue', '🔄 Iniciando revalidación...');
    colorLog('blue', `🌐 Endpoint: ${API_ENDPOINT}`);

    if (verbose) {
      colorLog('blue', `📂 Paths: ${paths.length > 0 ? paths.join(', ') : 'todos por defecto'}`);
      colorLog('blue', `🏷️ Tags: ${tags.length > 0 ? tags.join(', ') : 'todos por defecto'}`);
    }

    // Construir el payload JSON
    const payload = {};
    if (paths.length > 0) payload.paths = paths;
    if (tags.length > 0) payload.tags = tags;

    if (verbose) {
      colorLog('blue', `📦 Payload: ${JSON.stringify(payload, null, 2)}`);
    }

    // Datos de la petición
    const postData = JSON.stringify(payload);
    const options = {
      hostname: new URL(API_ENDPOINT).hostname,
      port: new URL(API_ENDPOINT).port || 443,
      path: new URL(API_ENDPOINT).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'x-revalidate-secret': REVALIDATE_SECRET
      }
    };

    // Ejecutar la petición
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        colorLog('blue', `📊 Código HTTP: ${res.statusCode}`);

        // Procesar respuesta
        switch (res.statusCode) {
          case 200:
            colorLog('green', '✅ Revalidación exitosa');
            if (verbose) {
              try {
                const response = JSON.parse(data);
                console.log(JSON.stringify(response, null, 2));
              } catch (e) {
                console.log(data);
              }
            }
            resolve();
            break;
          case 401:
            colorLog('red', '❌ Error: Token inválido');
            colorLog('yellow', '💡 Verifica que REVALIDATE_SECRET sea correcto');
            reject(new Error('Token inválido'));
            break;
          case 500:
            colorLog('red', '❌ Error interno del servidor');
            if (verbose) {
              try {
                const response = JSON.parse(data);
                console.log(JSON.stringify(response, null, 2));
              } catch (e) {
                console.log(data);
              }
            }
            reject(new Error('Error interno del servidor'));
            break;
          default:
            colorLog('red', `❌ Error inesperado: ${res.statusCode}`);
            if (verbose) {
              console.log(data);
            }
            reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      colorLog('red', `❌ Error de red: ${error.message}`);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Parsear argumentos
let paths = [];
let tags = [];
let verbose = false;
let all = false;

const args = process.argv.slice(2);

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '-h':
    case '--help':
      showHelp();
      process.exit(0);
      break;
    case '-p':
    case '--paths':
      paths = args[++i].split(',');
      break;
    case '-t':
    case '--tags':
      tags = args[++i].split(',');
      break;
    case '-a':
    case '--all':
      all = true;
      break;
    case '-v':
    case '--verbose':
      verbose = true;
      break;
    default:
      colorLog('red', `❌ Opción desconocida: ${args[i]}`);
      showHelp();
      process.exit(1);
  }
}

// Validar configuración
validateConfig();

// Ejecutar revalidación
if (all) {
  revalidate([], [], verbose)
    .then(() => {
      colorLog('green', '🎉 Proceso de revalidación completado');
    })
    .catch((error) => {
      colorLog('red', `❌ Error: ${error.message}`);
      process.exit(1);
    });
} else {
  revalidate(paths, tags, verbose)
    .then(() => {
      colorLog('green', '🎉 Proceso de revalidación completado');
    })
    .catch((error) => {
      colorLog('red', `❌ Error: ${error.message}`);
      process.exit(1);
    });
}
