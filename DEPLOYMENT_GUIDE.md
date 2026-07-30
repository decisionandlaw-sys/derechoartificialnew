# Guía de Despliegue y Revalidación - DerechoArtificial.com

## 📋 Overview

Esta guía explica cómo funciona el sistema de revalidación de caché para asegurar que los nuevos posts aparezcan inmediatamente en la web sin necesidad de rebuilds manuales.

## 🔄 Sistema de Revalidación

### **Problema Resuelto**
- **Antes:** Los posts nuevos no aparecían hasta el próximo rebuild
- **Ahora:** Revalidación automática y on-demand para contenido fresco

### **Componentes del Sistema**

#### **1. Endpoint API (`/api/revalidate`)**
- **Ubicación:** `src/app/api/revalidate/route.ts`
- **Método:** POST
- **Autenticación:** Header `x-revalidate-secret`
- **Función:** Revalida rutas y tags específicos

#### **2. Revalidación Automática**
- **Frecuencia:** Cada hora (3600 segundos)
- **Páginas afectadas:** Home, Firma Scarpa, Actualidad IA
- **Configuración:** `export const revalidate = 3600;`

#### **3. Script de Utilidad**
- **Ubicación:** `scripts/revalidate-home.sh`
- **Función:** Interfaz CLI para la API de revalidación
- **Características:** Validación, logging, manejo de errores

## 🚀 Uso del Sistema

### **Configuración Inicial**

#### **1. Generar Token Seguro**
```bash
# Generar token aleatorio de 32 bytes
openssl rand -base64 32
```

#### **2. Configurar Variables de Entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tu token
nano .env.local
```

#### **3. Variables Requeridas**
```env
# URL base del sitio
BASE_URL=https://www.derechoartificial.com

# Token secreto para revalidación
REVALIDATE_SECRET=your_secure_random_token_here
```

### **Modos de Revalidación**

#### **1. Automática (Cada Hora)**
```typescript
// En las páginas principales
export const revalidate = 3600; // Revalida cada hora
```

#### **2. On-Demand (Manual)**
```bash
# Revalidar todo
REVALIDATE_SECRET=your_token ./scripts/revalidate-home.sh --all

# Revalidar rutas específicas
REVALIDATE_SECRET=your_token ./scripts/revalidate-home.sh --paths '/firma-scarpa,/actualidad-ia'

# Revalidar tags específicos
REVALIDATE_SECRET=your_token ./scripts/revalidate-home.sh --tags 'firma-scarpa-posts,actualidad-posts'

# Modo verbose
REVALIDATE_SECRET=your_token ./scripts/revalidate-home.sh --all --verbose
```

#### **3. API Directa**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: your_token" \
  -d '{"paths": ["/firma-scarpa"], "tags": ["firma-scarpa-posts"]}' \
  https://www.derechoartificial.com/api/revalidate
```

## 🔧 Integración con CI/CD

### **GitHub Actions**

#### **1. Agregar Secret**
```bash
# En el repositorio de GitHub
# Settings → Secrets and variables → Actions → New repository secret
# Name: REVALIDATE_SECRET
# Value: tu_token_secreto
```

#### **2. Workflow de Revalidación**
```yaml
# .github/workflows/revalidate.yml
name: Revalidate Content

on:
  workflow_dispatch:
    inputs:
      paths:
        description: 'Specific paths to revalidate'
        required: false
        default: ''
      tags:
        description: 'Specific tags to revalidate'
        required: false
        default: ''

jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Revalidate Home
        run: |
          if [ "${{ github.event.inputs.paths }}" != "" ] && [ "${{ github.event.inputs.tags }}" != "" ]; then
            ./scripts/revalidate-home.sh --paths "${{ github.event.inputs.paths }}" --tags "${{ github.event.inputs.tags }}" --verbose
          else
            ./scripts/revalidate-home.sh --all --verbose
          fi
        env:
          REVALIDATE_SECRET: ${{ secrets.REVALIDATE_SECRET }}
          BASE_URL: https://www.derechoartificial.com
```

#### **3. Trigger Automático después de Publicación**
```yaml
# .github/workflows/publish-and-revalidate.yml
name: Publish and Revalidate

on:
  push:
    paths:
      - 'content/posts/**'
      - 'public/Recursos/**'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Publish posts
        run: npm run verify-posts
      
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
      
      - name: Revalidate cache
        run: ./scripts/revalidate-home.sh --all --verbose
        env:
          REVALIDATE_SECRET: ${{ secrets.REVALIDATE_SECRET }}
          BASE_URL: https://www.derechoartificial.com
```

### **Vercel Integration**

#### **1. Environment Variables**
```bash
# En Vercel Dashboard
# Project → Settings → Environment Variables
REVALIDATE_SECRET=your_secure_token
BASE_URL=https://www.derechoartificial.com
```

#### **2. Webhook de Revalidación**
```bash
# Después del deploy, Vercel puede llamar automáticamente
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -d '{"paths": ["/"], "tags": ["firma-scarpa-posts", "actualidad-posts"]}' \
  https://www.derechoartificial.com/api/revalidate
```

## 📊 Monitoreo y Debugging

### **Logs del Sistema**

#### **1. Logs de la API**
```bash
# En Vercel
vercel logs --follow

# En desarrollo
npm run dev
# Revisa la consola para logs de revalidación
```

#### **2. Logs del Script**
```bash
# Modo verbose para debugging
./scripts/revalidate-home.sh --all --verbose

# Salida esperada:
🔄 Iniciando revalidación...
🌐 Endpoint: https://www.derechoartificial.com/api/revalidate
📂 Paths: /,/firma-scarpa,/actualidad-ia
🏷️ Tags: firma-scarpa-posts,actualidad-posts
✅ Path revalidado: /
✅ Path revalidado: /firma-scarpa
✅ Tag revalidado: firma-scarpa-posts
✅ Revalidación completada
```

### **Troubleshooting**

#### **Problemas Comunes**

##### **1. Token Inválido (401)**
```bash
❌ Error: Token inválido
💡 Solución: Verifica que REVALIDATE_SECRET sea correcto
```

**Solución:**
```bash
# Regenerar token
openssl rand -base64 32

# Actualizar en .env.local y secrets de CI/CD
```

##### **2. Endpoint No Encontrado (404)**
```bash
❌ Error: Endpoint no encontrado
💡 Solución: Verifica que el deploy esté completo
```

**Solución:**
```bash
# Verificar que el archivo existe
ls -la src/app/api/revalidate/route.ts

# Revisar logs de build
npm run build
```

##### **3. Error Interno (500)**
```bash
❌ Error interno del servidor
💡 Solución: Revisa los logs del servidor
```

**Solución:**
```bash
# Verificar variables de entorno
echo $REVALIDATE_SECRET

# Probar API localmente
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET"
```

## 🎯 Mejores Prácticas

### **Seguridad**
1. **Token Fuerte:** Usa `openssl rand -base64 32` o más
2. **Rotación:** Cambia el token periódicamente
3. **Almacenamiento:** Nunca commits de secrets en el repo
4. **HTTPS:** Siempre usar HTTPS en producción

### **Performance**
1. **Revalidación Selectiva:** Solo revalida lo necesario
2. **Batch Operations:** Agrupa múltiples rutas/tags
3. **Evita Over-revalidation:** No revalidar demasiado seguido

### **CI/CD**
1. **Automatización:** Integra revalidación en el pipeline
2. **Rollback:** Ten plan de reversión si falla
3. **Notificaciones:** Alertas si la revalidación falla

## 🔄 Flujo Completo de Publicación

### **Proceso Ideal**
1. **Autor crea contenido** en `content/posts/` o `public/Recursos/`
2. **CI/CD detecta cambios** y hace trigger
3. **Build y deploy** automático a Vercel
4. **Revalidación automática** del caché
5. **Contenido visible** inmediatamente

### **Verificación**
```bash
# 1. Verificar que el post exista
ls content/posts/nuevo-post.mdx

# 2. Publicar automáticamente
npm run verify-posts

# 3. Revalidar caché
./scripts/revalidate-home.sh --all

# 4. Verificar en la web
curl -I https://www.derechoartificial.com/firma-scarpa/nuevo-post
```

## 📞 Soporte

### **Recursos**
- **Documentación Next.js:** https://nextjs.org/docs/app/api-reference/file-conventions/route-segments
- **Revalidación ISR:** https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation
- **Vercel Caching:** https://vercel.com/docs/concepts/functions/serverless-functions#edge-caching

### **Contacto**
- **Issues:** GitHub Issues del repositorio
- **Emergencias:** Contactar al equipo de desarrollo

---

## 🎉 Resumen

Con este sistema implementado:

✅ **Contenido fresco siempre visible**
✅ **Sin rebuilds manuales necesarios**
✅ **Integración perfecta con CI/CD**
✅ **Monitoreo completo**
✅ **Seguridad robusta**
✅ **Performance optimizada**

Los nuevos posts de Firma Scarpa (y cualquier otra sección) ahora aparecerán inmediatamente después de la publicación, sin necesidad de intervención manual.
