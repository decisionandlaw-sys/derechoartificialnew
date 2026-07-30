# Informe de Experiencia Móvil — derechoartificial.com

## 1. Resumen del Diagnóstico

Derecho Artificial recibe el **80% del tráfico orgánico desde escritorio**, pero el **80% de los usuarios globales accede desde móvil**. Esta discrepancia indica que la versión móvil está fallando en captar y retener usuarios, probablemente por problemas de usabilidad, rendimiento y/o legibilidad.

Las pruebas realizadas (Playwright en viewport iPhone 375×812, análisis de código fuente, revisión de componentes) confirman **deficiencias críticas en la experiencia móvil** que explican la baja conversión de tráfico móvil.

---

## 2. Métricas Actuales vs. Umbrales Recomendados

| Métrica | Actual | Objetivo | Estado |
|---------|--------|----------|--------|
| **Body font-size** | 17px | ≥ 16px | ✅ |
| **Paragraph font-size** | 19px (`text-lg`) | 16-17px | ⚠️ Excesivo |
| **Hamburger touch target** | 36×36px | ≥ 44×44px | ❌ |
| **Social icons touch target** | 36×36px | ≥ 44×44px | ❌ |
| **Default button height** | 40px | ≥ 44px | ❌ |
| **Container padding** | 24px (`px-6`) | 16px en móvil | ⚠️ |
| **Logo height** | 160px | 80-100px en móvil | ❌ |
| **Header min-height** | 120px | 60-80px en móvil | ❌ |
| **Longest paragraph** | 911 caracteres | ≤ 300-400 caracteres | ❌ |
| **Text-align** | `justify` | `left` en móvil | ⚠️ |
| **Mobile menu scroll-lock** | No implementado | Sí | ❌ |
| **Mobile menu backdrop** | No implementado | Sí | ❌ |
| **Viewport meta** | `width=device-width, initial-scale=1` | Correcto | ✅ |
| **LCP** (estimado) | > 3.0s (imagen logo 160px + fuente) | < 2.5s | ❌ |
| **CLS** (estimado) | Potencial alto (fuente swap + imágenes sin dimensiones) | < 0.1 | ⚠️ |

> *Nota: No fue posible obtener datos exactos de PageSpeed Insights (API rate-limited). Las estimaciones de LCP/CLS se basan en el análisis de recursos críticos y la carga de la página.*

---

## 3. Problemas Detectados por Gravedad

### 🔴 Críticos (impacto directo en usabilidad/SEO)

| ID | Problema | Archivo/Línea | Impacto |
|----|----------|---------------|---------|
| C1 | **Touch targets insuficientes** — Hamburguesa 36px, iconos sociales 36px, botones 40px | Header.tsx, Footer.tsx, utils.ts | Usuarios móviles no pueden tocar con precisión; viola WCAG 2.5.5 |
| C2 | **Logo sobredimensionado en móvil** — `h-[160px]` ocupa ~40% del viewport | Header.tsx:113 | Empuja el contenido hacia abajo, aumenta LCP, reduce espacio útil |
| C3 | **Header con min-height excesivo** — `min-h-[120px]` en móvil | Header.tsx:105 | 120px de espacio muerto en la parte superior |
| C4 | **Párrafos excesivamente largos** — hasta 911 caracteres sin salto | Archivos .mdx | Legibilidad pésima en móvil; el usuario abandona |
| C5 | **Menú móvil sin scroll-lock ni backdrop** — El body se desplaza detrás | Header.tsx | Experiencia confusa; el usuario puede hacer scroll sin querer |

### 🟠 Altos (impacto significativo en experiencia)

| ID | Problema | Archivo/Línea | Impacto |
|----|----------|---------------|---------|
| A1 | **Texto justificado en móvil** — `text-justify` en `p` y `.prose p` | index.css:51-57 | Mala legibilidad en pantallas estrechas; palabras con espaciado irregular |
| A2 | **Container padding fijo `px-6`** — mismo padding en móvil y desktop | index.css:175-185 | Desperdicio de 24px de espacio horizontal en pantallas de 375px |
| A3 | **Tabla de contenido sin responsive** — `prose-table` sin overflow-x | index.css:194-196 | Tablas se desbordan del viewport en móvil |
| A4 | **Imágenes sin dimensiones explícitas** — layout shift potencial | page.tsx | CLS no controlado; imágenes sin width/height fijos |
| A5 | **Prose body `text-lg` (19px) en móvil** — texto más grande de lo necesario | index.css:190 | 19px ocupa más líneas, más scroll, peor experiencia |

### 🟡 Medios (impacto moderado)

| ID | Problema | Archivo/Línea | Impacto |
|----|----------|---------------|---------|
| M1 | **Categorías en `text-xs` (13px)** — puede ser pequeño para móvil | page.tsx | Dificultad de lectura en pantallas pequeñas |
| M2 | **SearchBar ocupa ancho completo en móvil** — `max-w-xs` (288px) | Header.tsx:120 | Ocupa demasiado espacio horizontal |
| M3 | **Footer sin simplificación móvil** — 2 columnas con ítems densos | Footer.tsx:40 | Demasiada información en el pie en móvil |
| M4 | **Transiciones sin `prefers-reduced-motion`** — animaciones sin respeto por preferencias | index.css:242-248 | Accesibilidad |
| M5 | **No hay `font-display: optional` para SF Pro** — usa `swap` (puede causar FOIT/FOUT) | index.css:14-34 | LCP potencialmente afectado |

### 🟢 Bajos (impacto menor, buenas prácticas)

| ID | Problema | Archivo/Línea | Impacto |
|----|----------|---------------|---------|
| B1 | **Cookie banner posición fija** — puede solaparse con contenido | CookieBanner.tsx | Menor |
| B2 | **SearchBar sin placeholder visible** — placeholder "Buscar análisis..." en gris claro | SearchBar.tsx | Contraste |
| B3 | **H1 demasiado largo en artículos** — títulos de 80+ caracteres | .mdx files | Se truncan en móvil |
| B4 | **Schema JSON-LD duplicado** — aparece 2 veces en el HTML | layout.tsx:82-93 | Peso extra de página |

---

## 4. Propuesta de Mejoras Priorizadas

### 🔥 Prioridad 1 — Impacto Inmediato (esfuerzo bajo, impacto alto)

#### 1.1 Reducir logo en móvil
```tsx
// Header.tsx — cambiar la línea del logo
// Actual:
<img alt="Derecho Artificial" width={300} height={100} className="h-[160px] w-auto object-contain" />

// Propuesto:
<img alt="Derecho Artificial" width={300} height={100} className="h-[100px] md:h-[160px] w-auto object-contain" />
```
**Impacto**: Reduce LCP, libera ~60px de espacio vertical en móvil.

#### 1.2 Reducir min-height del header en móvil
```tsx
// Header.tsx
// Actual:
<div className="flex items-center justify-between py-3 md:py-4 min-h-[120px]">

// Propuesto:
<div className="flex items-center justify-between py-2 md:py-4 min-h-[80px] md:min-h-[120px]">
```
**Impacto**: Recupera 40px de espacio vertical útil.

#### 1.3 Aumentar touch targets (hamburguesa, iconos sociales, botones)
```tsx
// Header.tsx — hamburger button
// Actual:
<button type="button" className="lg:hidden p-2 -mr-2 ...">
// Propuesto:
<button type="button" className="lg:hidden p-3 -mr-3 ...">

// Footer.tsx — social icons
// Actual:
className="inline-flex h-9 w-9 items-center justify-center rounded-full border ..."
// Propuesto:
className="inline-flex h-11 w-11 items-center justify-center rounded-full border ..."

// lib/utils.ts — default button size
// No tocar h-10 (es el estándar), pero crear variante mobile:
// En su lugar, en componentes de mobile usar <Button size="lg">
```
**Impacto**: Usabilidad táctil dentro de estándares WCAG.

#### 1.4 Scroll-lock + backdrop en menú móvil
```tsx
// Header.tsx — añadir al estado del menú móvil
// Actual: solo {mobileMenuOpen && (...)}
// Propuesto:
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [mobileMenuOpen]);

// En el panel del menú, añadir backdrop:
{mobileMenuOpen && (
  <>
    <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setMobileMenuOpen(false)} />
    <nav className="relative z-50 lg:hidden ...">
```
**Impacto**: UX móvil profesional; evita scroll accidental.

---

### 🏗️ Prioridad 2 — Mejoras de Layout (esfuerzo medio, impacto alto)

#### 2.1 Padding de contenedor responsive
```css
/* index.css — cambiar todos los containers */
.container-narrow {
  @apply container mx-auto px-4 md:px-6 max-w-3xl;
}
.container-wide {
  @apply container mx-auto px-4 md:px-6 max-w-7xl;
}
.container-editorial {
  @apply container mx-auto px-4 md:px-6 max-w-4xl;
}
```
**Impacto**: Gana 8px adicionales a cada lado en móvil (mejor aprovechamiento del espacio).

#### 2.2 Texto sin justificar en móvil
```css
/* index.css — cambiar text-justify condicional */
p { @apply text-justify md:text-justify text-left hyphens-none font-medium; }
.prose p { @apply text-justify md:text-justify text-left hyphens-none font-medium; }
```
**Impacto**: Legibilidad mejorada en pantallas estrechas.

#### 2.3 Tablas responsivas
```css
/* Añadir al index.css */
.prose-editorial table {
  @apply block w-full overflow-x-auto whitespace-nowrap md:whitespace-normal;
  -webkit-overflow-scrolling: touch;
}
```
**Impacto**: Evita desbordamiento horizontal en tablas de datos legales.

#### 2.4 Prose body text más pequeño en móvil
```css
/* index.css — prose-editorial */
.prose-editorial {
  @apply prose prose-neutral dark:prose-invert max-w-none
  prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed
  ...
}
```
**Impacto**: 16px en móvil vs 19px actual. Mejor legibilidad y menos scroll.

---

### 🚀 Prioridad 3 — Rendimiento (esfuerzo medio-alto, impacto SEO)

#### 3.1 Optimizar fuente SF Pro
```css
/* index.css — cambiar font-display a optional o usar preload */
@font-face {
  font-family: "SF Pro Display";
  src: url("/fonts/SFPro/SFPRODISPLAYREGULAR.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: optional; /* swap → optional: evita FOIT */
}
```
Además, añadir `<link rel="preload">` en `<head>` para la fuente más usada.

#### 3.2 Lazy loading de imágenes del footer y redes sociales
```tsx
// Añadir loading="lazy" a imágenes below-the-fold
<img loading="lazy" ... />
```

#### 3.3 Reducir peso del JSON-LD
El StructuredData se renderiza 2 veces en el HTML (una en `<head>` vía script, otra vía el componente). Unificar.

#### 3.4 Añadir width/height explícitos a imágenes del homepage
```tsx
// page.tsx — cada <Image> debería tener width/height definidos
// Si next/image ya lo hace, verificar que todos los componentes lo cumplen.
```

---

### 🎨 Prioridad 4 — Contenido y Tipografía (esfuerzo variable)

#### 4.1 Revisar párrafos largos en artículos
Los artículos legales tienen párrafos de hasta 911 caracteres sin salto. Para móvil:
- Máximo recomendado: **300-400 caracteres por párrafo**
- Dividir párrafos existentes en unidades más pequeñas

#### 4.2 Shorten H1 en artículos para móvil
Títulos como "La IA Fiable como Estándar Jurídico de Gobernanza Digital en la Unión Europea" (78 chars) son difíciles de leer en una línea de móvil. Sugerencia:
- Usar `text-balance` (ya implementado) + permitir que el título ocupe 2-3 líneas
- En el futuro, redactar títulos más cortos para SEO y móvil

#### 4.3 Categorías en `text-sm` en móvil
```tsx
// En lugar de text-xs (13px):
<span className="text-xs md:text-sm ...">
```

---

## 5. Plan de Implementación

| Fase | Semana | Acciones | Esfuerzo | Impacto |
|------|--------|---------|----------|---------|
| **1** | 1 | Reducir logo/header móvil, touch targets, scroll-lock menú | 2h | 🔴 Crítico |
| **2** | 1 | Padding responsive, texto left en móvil, tablas overflow-x | 1h | 🟠 Alto |
| **3** | 2 | Prose body 16px en móvil, categorías text-sm | 30min | 🟡 Medio |
| **4** | 2 | Font-display optional, preload fuente, lazy loading imágenes | 1h | 🟠 Alto (SEO) |
| **5** | 3 | Revisar y dividir párrafos largos en artículos existentes | 3h+ | 🟡 Medio |
| **6** | 3 | Social icons 44px, botones con size="lg" en móvil | 30min | 🟠 Alto |
| **7** | 4 | Unificar JSON-LD, quitar duplicados | 30min | 🟢 Bajo |
| **8** | 4 | prefers-reduced-motion en animaciones | 15min | 🟢 Bajo |

### Quick Wins (hacer hoy, en < 1h)
1. Logo: `h-[160px]` → `h-[100px] md:h-[160px]`
2. Header: `min-h-[120px]` → `min-h-[80px] md:min-h-[120px]`
3. Hamburger: `p-2` → `p-3`
4. Text-align: añadir `text-left` en párrafos
5. Container padding: `px-4 md:px-6`

---

## 6. KPIs para medir éxito

| KPI | Actual | Objetivo (1 mes) | Herramienta |
|-----|--------|-------------------|-------------|
| Tasa de rebote móvil | (desconocido) | -10% | Google Analytics |
| Duración sesión móvil | (desconocido) | +20% | Google Analytics |
| Páginas/sesión móvil | (desconocido) | +15% | Google Analytics |
| LCP móvil | > 3.0s (est.) | < 2.5s | PageSpeed Insights |
| CLS móvil | > 0.1 (est.) | < 0.1 | PageSpeed Insights |
| Tráfico orgánico móvil | ~20% | > 30% | Search Console |
| Touch targets | 36px | ≥ 44px | Lighthouse/Playwright |

---

*Generado el 27 de junio de 2026 — Basado en análisis de código fuente, pruebas con Playwright (viewport 375×812) y revisión manual de componentes.*
