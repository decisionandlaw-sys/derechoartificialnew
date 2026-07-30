# Sistema de Publicación de Posts

Este sistema automatizado garantiza que todos los posts se publiquen correctamente y sean accesibles en la web.

## 🚀 Uso Rápido

### Para publicar un nuevo post:

```bash
npm run publish-post nombre-del-archivo.mdx
```

### Para verificar todos los posts:

```bash
npm run verify-posts
```

## 📋 Proceso Automatizado

El sistema de publicación realiza automáticamente:

1. ✅ **Validación del frontmatter** (slug, category, title)
2. ✅ **Eliminación de imports innecesarios** (Callout, Table, etc.)
3. ✅ **Creación de página del post** con estructura completa
4. ✅ **Detección de PDF** y creación de recuadro "SENTENCIA"
5. ✅ **Verificación de inconsistencias** entre nombre de archivo y slug
6. ✅ **Creación de redirecciones** para compatibilidad
7. ✅ **Verificación general** de todos los posts existentes

## 📁 Estructura Requerida

### Frontmatter del MDX:

```yaml
---
title: "Título del Post"
description: "Descripción del post"
slug: "slug-personalizado-para-url"
date: "2026-03-04"
lastModified: "2026-03-04"
readingTime: 15
category: "Jurisprudencia IA"  # o "Global IA", "normativa", etc.
tags:
  [
    "tag1",
    "tag2",
    "tag3"
  ]
authors:
  - "Derecho Artificial"
---
```

### Archivos requeridos:

- **MDX:** `content/posts/nombre-del-archivo.mdx`
- **PDF (opcional):** `public/fuentes/nombre-del-archivo.pdf`

## 🎯 Categorías Soportadas

| Categoría en Frontmatter | Ruta URL | Directorio |
|-------------------------|----------|------------|
| `jurisprudencia` | `/jurisprudencia/slug` | `src/app/jurisprudencia/` |
| `Jurisprudencia IA` | `/jurisprudencia/slug` | `src/app/jurisprudencia/` |
| `Global IA` | `/global-ia/slug` | `src/app/global-ia/` |
| `ia-global` | `/global-ia/slug` | `src/app/global-ia/` |
| `normativa` | `/normativa/slug` | `src/app/normativa/` |
| `legislación digital` | `/normativa/slug` | `src/app/normativa/` |

## 🔧 Características del Sistema

### 1. Detección Automática de Inconsistencias

Si el nombre del archivo no coincide con el slug:
```bash
⚠️  Inconsistencia detectada:
   Nombre archivo: nombre-archivo
   Slug: slug-personalizado
🔄 Creando redirección: nombre-archivo -> slug-personalizado
```

### 2. Integración de PDF

Si existe un PDF con el mismo nombre:
```bash
✅ PDF encontrado y accesible
📝 Recuadro "SENTENCIA" creado automáticamente
```

### 3. Limpieza de Código

Elimina automáticamente imports innecesarios:
```tsx
// Estos imports son eliminados automáticamente:
import { Callout } from "@/components/ui/callout";
import { Table, TableHeader, ... } from "@/components/ui/table";
```

### 4. Estructura Completa de Página

Crea automáticamente:
- ✅ Metadata SEO completa
- ✅ LegalLayout consistente
- ✅ Breadcrumb navigation
- ✅ Tags y metadatos
- ✅ RelatedArticles al final
- ✅ ReactMarkdown con sanitización

## 🚨 Solución de Problemas Comunes

### Error: "Post no encontrado"

**Causa:** La página no existe para el slug especificado.

**Solución:**
```bash
npm run verify-posts
```

### Error: 404 en URL basada en nombre de archivo

**Causa:** Inconsistencia entre nombre de archivo y slug.

**Solución:**
```bash
npm run publish-post nombre-del-archivo.mdx
# El sistema creará automáticamente la redirección
```

### Error: "No se encontró slug en frontmatter"

**Causa:** Falta el campo `slug` en el frontmatter.

**Solución:**
```yaml
---
# Agregar esta línea:
slug: "slug-personalizado-para-url"
---
```

## 📋 Ejemplo Completo

### 1. Crear archivos:

```bash
# MDX
content/posts/mi-post-juridico.mdx

# PDF (opcional)
public/fuentes/mi-post-juridico.pdf
```

### 2. Ejecutar publicación:

```bash
npm run publish-post mi-post-juridico.mdx
```

### 3. Resultado:

```
🚀 Iniciando proceso de publicación...
📄 Procesando: mi-post-juridico.mdx
📋 Información del post:
   Título: Mi Post Jurídico
   Slug: mi-post-juridico-analisis-2025
   Categoría: Jurisprudencia IA
✅ Imports innecesarios eliminados
✅ Página del post ya existe
✅ PDF encontrado y accesible
🔍 Ejecutando verificación general de posts...
✅ Proceso de publicación completado
📝 Post disponible en: https://derechoartificial.com/jurisprudencia/mi-post-juridico-analisis-2025
```

## 🔄 Verificación General

Para verificar todos los posts existentes y detectar problemas:

```bash
npm run verify-posts
```

Este comando:
- ✅ Verifica todos los archivos MDX
- ✅ Detecta frontmatters incompletos
- ✅ Crea páginas faltantes
- ✅ Genera redirecciones necesarias
- ✅ Reporta inconsistencias

## 🎯 Mejoras Continuas

El sistema está diseñado para:

1. **Prevenir errores 404** mediante verificación automática
2. **Mantener consistencia** entre nombres de archivo y slugs
3. **Automatizar tareas repetitivas** de publicación
4. **Garantizar acceso** a todo contenido publicado
5. **Facilitar mantenimiento** del sitio

## 📞 Soporte

Si encuentras algún problema:

1. Ejecuta `npm run verify-posts` para diagnóstico
2. Verifica el frontmatter del MDX
3. Confirma que los archivos estén en las ubicaciones correctas
4. Revisa la salida del comando para identificar el problema específico

El sistema está diseñado para ser robusto y prevenir la mayoría de los problemas comunes de publicación.
