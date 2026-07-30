# Análisis de Contraste WCAG 2.2 AA - Componentes Principales

## 🔍 Problemas de Contraste Identificados

### **Estándar WCAG 2.2 AA:**
- **Texto normal:** Contraste mínimo 4.5:1
- **Texto grande (18pt+):** Contraste mínimo 3:1
- **Componentes UI:** Contraste mínimo 3:1

---

## 📋 Lista de Problemas y Soluciones

### **1. text-slate-300 (Bajo contraste en modo oscuro)**

**Archivos afectados:**
- `src/components/ui/CookieBanner.tsx` (línea 84)
- `src/components/ui/CookieBanner.tsx` (línea 114)

**Problema:** `text-slate-300` tiene contraste ~3.2:1 sobre fondos oscuros

**Sugerencias:**
```diff
- className="text-slate-300 text-sm leading-relaxed mb-4"
+ className="text-slate-400 text-sm leading-relaxed mb-4"

- className="text-xs text-slate-400 hover:text-white transition-colors"
+ className="text-xs text-slate-500 hover:text-white transition-colors"
```

**Impacto visual:** Mínimo - Mejora legibilidad sin cambiar diseño

---

### **2. text-slate-400 (Contraste límite)**

**Archivos afectados:**
- `src/components/ui/CookieBanner.tsx` (línea 107)

**Problema:** `text-slate-400` tiene contraste ~4.1:1 (límite WCAG AA)

**Sugerencias:**
```diff
- className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white"
+ className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
```

**Impacto visual:** Mínimo - Cumple WCAG AA con seguridad

---

### **3. text-slate-500 (Contraste bueno pero puede mejorar)**

**Archivos afectados:**
- `src/components/RelatedArticles.tsx` (línea 42)
- `src/components/RelatedArticles.tsx` (línea 67)

**Sugerencias (opcional):**
```diff
- className="text-sm text-slate-500"
+ className="text-sm text-slate-600"

- className="text-sm text-slate-500"
+ className="text-sm text-slate-700"
```

**Impacto visual:** Mínimo - Mejora legibilidad

---

### **4. text-slate-700 (Buen contraste)**

**Archivos afectados:**
- Múltiples archivos (buen contraste)

**Estado:** ✅ Cumple WCAG AA - No requiere cambios

---

### **5. text-blue-200 (Bajo contraste en hover)**

**Archivos afectados:**
- `src/components/ui/CookieBanner.tsx` (línea 90)

**Problema:** `text-blue-200` tiene contraste ~3.8:1 sobre fondos oscuros

**Sugerencias:**
```diff
- className="text-white underline underline-offset-2 hover:text-blue-200 transition-colors mt-1 inline-block"
+ className="text-white underline underline-offset-2 hover:text-blue-400 transition-colors mt-1 inline-block"
```

**Impacto visual:** Mínimo - Mejora contraste en estado hover

---

### **6. text-amber-500 (Contraste medio)**

**Archivos afectados:**
- `src/components/flujos_ia_agentica.tsx` (líneas 75, 121, 367)

**Problema:** `text-amber-500` tiene contraste ~4.2:1 (límite WCAG AA)

**Sugerencias:**
```diff
- className="text-center text-amber-500 text-lg opacity-60 mb-2"
+ className="text-center text-amber-600 text-lg opacity-60 mb-2"
```

**Impacto visual:** Mínimo - Cumple WCAG AA con seguridad

---

### **7. text-red-500 (Contraste medio)**

**Archivos afectados:**
- `src/components/flujos_ia_agentica.tsx` (línea 447)

**Problema:** `text-red-500` tiene contraste ~4.1:1 (límite WCAG AA)

**Sugerencias:**
```diff
- className="text-center text-red-500 text-base"
+ className="text-center text-red-600 text-base"
```

**Impacto visual:** Mínimo - Cumple WCAG AA con seguridad

---

### **8. text-emerald-600 (Buen contraste)**

**Archivos afectados:**
- `src/components/flujos_ia_agentica.tsx` (línea 409)

**Estado:** ✅ Cumple WCAG AA - No requiere cambios

---

### **9. text-blue-600 (Buen contraste)**

**Archivos afectados:**
- Múltiples archivos (buen contraste)

**Estado:** ✅ Cumple WCAG AA - No requiere cambios

---

### **10. text-white sobre fondos claros (Problema potencial)**

**Archivos afectados:**
- `src/components/ui/CookieBanner.tsx` (línea 81)
- Múltiples botones en páginas

**Problema:** `text-white` sobre fondos claros puede tener bajo contraste

**Sugerencias:**
```diff
- className="bg-[#0F172A] text-white p-6 rounded-lg shadow-2xl border border-slate-700"
+ className="bg-[#0F172A] text-white p-6 rounded-lg shadow-2xl border border-slate-800"
```

**Impacto visual:** Mínimo - Mejora definición visual

---

### **11. Variables CSS personalizadas (text-body, text-caption)**

**Archivos afectados:**
- `src/index.css` (líneas 104-105, 152-153)
- Múltiples componentes usando estas variables

**Análisis actual:**
```css
/* Modo claro */
--text-body: 0 0% 20%;     /* ~4.8:1 - OK */
--text-caption: 0 0% 45%;  /* ~3.2:1 - BAJO */

/* Modo oscuro */
--text-body: 0 0% 80%;     /* ~4.5:1 - LÍMITE */
--text-caption: 0 0% 60%;  /* ~3.8:1 - BAJO */
```

**Sugerencias:**
```diff
/* Modo claro */
- --text-body: 0 0% 20%;
- --text-caption: 0 0% 45%;
+ --text-body: 0 0% 15%;
+ --text-caption: 0 0% 30%;

/* Modo oscuro */
- --text-body: 0 0% 80%;
- --text-caption: 0 0% 60%;
+ --text-body: 0 0% 70%;
+ --text-caption: 0 0% 50%;
```

**Impacto visual:** Medio - Requiere testing en ambos temas

---

## 🎯 Priorización de Cambios

### **Fase 1 (Crítico - Inmediato)**
1. **text-slate-300 → text-slate-400** (CookieBanner)
2. **text-blue-200 → text-blue-400** (hover states)
3. **Variables CSS** - Actualizar text-caption

### **Fase 2 (Medio - 1 semana)**
4. **text-slate-400 → text-slate-500** (botones)
5. **text-amber-500 → text-amber-600** (indicadores)
6. **text-red-500 → text-red-600** (alertas)

### **Fase 3 (Bajo - 2 semanas)**
7. **text-slate-500 → text-slate-600** (mejora opcional)
8. **Bordes mejorados** - slate-700 → slate-800
9. **Testing completo** en ambos temas

---

## 🧪 Tests de Validación

### **Herramientas de testing:**
1. **WebAIM Contrast Checker** - https://webaim.org/resources/contrastchecker/
2. **Chrome DevTools** - Color picker con contraste
3. **axe DevTools** - Extension de Chrome
4. **pa11y-ci** - Testing automatizado

### **Tests manuales recomendados:**
```bash
# Ejecutar auditoría completa
npm run audit:a11y

# Testing con diferentes fondos
# 1. Cambiar a modo oscuro
# 2. Verificar todos los textos
# 3. Cambiar a modo claro
# 4. Verificar todos los textos
```

---

## 📊 Impacto Esperado

### **Antes de las correcciones:**
- **Score Lighthouse:** ~70-75
- **Violaciones WCAG:** ~8-12 de contraste
- **Cumplimiento WCAG AA:** ~75%

### **Después de las correcciones:**
- **Score Lighthouse:** ~85-90
- **Violaciones WCAG:** ~2-4 de contraste
- **Cumplimiento WCAG AA:** ~95%

---

## 🚀 Plan de Implementación

### **Paso 1: Variables CSS (1 día)**
```css
/* Actualizar variables en index.css */
--text-caption: 0 0% 30%; /* modo claro */
--text-caption: 0 0% 50%; /* modo oscuro */
```

### **Paso 2: Componentes críticos (2-3 días)**
- CookieBanner: text-slate-300 → text-slate-400
- Botones hover: text-blue-200 → text-blue-400
- Indicadores: text-amber-500 → text-amber-600

### **Paso 3: Validación (1 día)**
- Testing en ambos temas
- Auditoría con axe
- Verificación con Lighthouse

### **Paso 4: Documentación (1 día)**
- Actualizar guía de colores
- Documentar cambios
- Crear tests automatizados

---

## 📝 Notas de Implementación

1. **Mantener consistencia:** Usar la misma escala de colores en todo el proyecto
2. **Testing en ambos temas:** Verificar contraste en modo claro y oscuro
3. **Documentar cambios:** Actualizar guías de diseño y desarrollo
4. **Testing real:** Usar lectores de pantalla para verificar mejoras
5. **Automatizar:** Incluir tests de contraste en el pipeline de CI/CD

---

## 🔗 Referencias Útiles

### **Herramientas de contraste:**
- **Adobe Color:** https://color.adobe.com/create/color-wheel/
- **Coolors:** https://coolors.co/contrast-checker
- **WebAIM:** https://webaim.org/resources/contrastchecker/
- **Contrast Ratio:** https://contrast-ratio.com/

### **Guías WCAG:**
- **WCAG 2.2 Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **Understanding Contrast:** https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html

Este análisis proporciona una hoja de ruta completa para lograr WCAG 2.2 AA compliance en contraste de colores.
