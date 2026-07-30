# GUÍA DE CORRECCIÓN: Sistema de Fechas en Derecho Artificial

## PROBLEMA IDENTIFICADO

Tu proyecto muestra la fecha actual (7 de febrero de 2026) para TODAS las entradas porque:

1. **Los archivos JSON se actualizan automáticamente** con fechas recientes (probablemente por un script scraper)
2. **No hay fechas de publicación fijas** asignadas manualmente a cada entrada
3. **El código de ordenamiento funciona correctamente**, pero ordena fechas que son todas iguales o muy recientes

## SOLUCIÓN

### PASO 1: Reemplazar los archivos JSON con fechas corregidas

Reemplaza estos archivos en `src/data/` (o donde estén ubicados):

1. **latest-news.json** → Usa el archivo `latest-news-corregido.json` que te proporciono
2. **library-docs.json** → Usa el archivo `library-docs-corregido.json` que te proporciono
3. **legal-news.json** → Aplica el mismo principio (asigna fechas reales según el contenido)

#### Criterio para asignar fechas:

- Si el documento tiene fecha oficial de publicación → Usa esa fecha
- Si es contenido creado por ti → Usa la fecha real de creación
- Si es un agregado de noticias → Usa fechas escalonadas lógicas

Ejemplos de fechas aplicadas:
```json
{
  "id": "aesia-fallback-1",
  "title": "AESIA publica nuevas guías sobre IA Generativa",
  "date": "2025-12-15",  // ← Fecha FIJA, no autogenerada
  ...
}
```

### PASO 2: Identificar y desactivar scripts de actualización automática

Busca en tu proyecto:

```bash
# En la raíz del proyecto
grep -r "new Date()" src/data/
grep -r "Date.now()" src/data/
grep -r "toISOString()" src/scripts/
```

Si encuentras scripts que actualizan los JSON automáticamente:
- **DESACTÍVALOS** o modifícalos para que NO sobrescriban las fechas existentes
- Probablemente están en `/scripts/` o como GitHub Actions

### PASO 3: Verificar que el ordenamiento funciona

El código de tus `page.tsx` ya ordena correctamente:

```typescript
// En actualidad-ia/page.tsx (LÍNEA 131-133)
const items: NovedadItem[] = [...contentItems, ...resourceItems].sort(
  (a, b) => (b.displayDateMs ?? b.dateMs) - (a.displayDateMs ?? a.dateMs),
);
```

✅ Este código está BIEN, no lo cambies.

El problema NO es el código de ordenamiento, sino los DATOS que le llegan.

### PASO 4: Para contenido Markdown/MDX (si aplica)

Si tienes archivos `.md` o `.mdx` con frontmatter, asegúrate de que tengan fechas fijas:

```markdown
---
title: "Título del artículo"
date: "2025-12-15"  # ← Fecha FIJA en formato ISO
author: "Ricardo Scarpa"
---

Contenido del artículo...
```

### PASO 5: Verificar las bibliotecas de recursos

En tus archivos que usan `getSectionResourceEntry()`:

```typescript
// El problema NO está aquí, está en los archivos .md fuente
const entry = await getSectionResourceEntry("normativa", slug);
```

Revisa los archivos fuente (probablemente en `src/content/normativa/` o similar) y asegúrate de que tienen fechas fijas en el frontmatter.

## ARCHIVOS QUE DEBES MODIFICAR

1. **src/data/latest-news.json** → Reemplazar con fechas reales
2. **src/data/library-docs.json** → Reemplazar con fechas reales  
3. **src/data/legal-news.json** → Reemplazar con fechas reales
4. **src/content/firma-scarpa/*.md** → Verificar frontmatter tiene `date: "YYYY-MM-DD"`
5. **src/content/actualidad-ia/*.md** → Verificar frontmatter tiene `date: "YYYY-MM-DD"`
6. **src/content/jurisprudencia/*.md** → Verificar frontmatter tiene `date: "YYYY-MM-DD"`
7. **src/content/normativa/*.md** → Verificar frontmatter tiene `date: "YYYY-MM-DD"`

## ARCHIVOS QUE NO DEBES MODIFICAR

❌ NO cambies los archivos `page.tsx` - el ordenamiento ya funciona correctamente
❌ NO cambies `/lib/resources.ts` - la lógica de lectura ya funciona correctamente
❌ NO cambies `/lib/content.ts` - la lógica de lectura ya funciona correctamente

## VERIFICACIÓN POST-CORRECCIÓN

Después de hacer los cambios:

1. **Reconstruye el proyecto:**
   ```bash
   npm run build
   # o
   bun run build
   ```

2. **Verifica las fechas en localhost:**
   ```bash
   npm run dev
   ```
   
3. **Comprueba que cada sección ordena cronológicamente:**
   - `/firma-scarpa` - Debe mostrar entradas de más reciente a más antigua
   - `/actualidad-ia` - Debe mostrar entradas de más reciente a más antigua
   - `/jurisprudencia` - Debe mostrar entradas de más reciente a más antigua
   - `/normativa` - Debe mostrar entradas de más reciente a más antigua

4. **Busca la fecha "7 de febrero de 2026":**
   - Si sigue apareciendo en todas, los JSON no se actualizaron
   - Si aparece solo en entradas recientes, ¡funciona!

## PREVENCIÓN FUTURA

Para evitar que vuelva a pasar:

1. **Documenta las fechas**: Crea un archivo `FECHAS.md` donde registres las fechas reales de cada publicación
2. **Revisa scripts automáticos**: Busca en `.github/workflows/` si hay acciones que actualicen los JSON
3. **Git hooks**: Añade un pre-commit que valide que las fechas no sean todas iguales

## RESUMEN EJECUTIVO

**El problema:** Scripts/procesos que sobrescriben fechas reales con fechas autogeneradas

**La solución:** 
1. Asignar fechas REALES Y FIJAS a cada entrada en los JSON
2. Desactivar/modificar scripts que actualizan fechas automáticamente
3. Verificar que archivos Markdown tienen frontmatter con fechas fijas

**Lo que NO hay que cambiar:** El código de ordenamiento (ya funciona bien)

---

## SIGUIENTE PASO

Una vez que hayas aplicado estos cambios, deberías ver:

✅ Entradas ordenadas cronológicamente (más reciente primero)
✅ Cada entrada con su fecha real de publicación
✅ Las badges "Nuevo" y "Actualizado" funcionando correctamente

Si después de esto sigues teniendo problemas, necesitaré ver:
- Los archivos fuente de contenido (los .md de firma-scarpa, actualidad-ia, etc.)
- El contenido de `/lib/resources.ts` y `/lib/content.ts`
- Cualquier script en `/scripts/` o `.github/workflows/`
