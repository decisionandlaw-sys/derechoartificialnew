# Análisis de Tamaños de Elementos Interactivos - WCAG 2.2 AA

## 🔍 Estándar WCAG 2.2 AA para Tamaño de Touch

### **Requisito mínimo:**
- **Área táctil:** Mínimo 24x24 píxeles
- **Espaciado:** Mínimo 8px entre elementos táctiles
- **Tamaño de fuente:** Mínimo 16px para elementos táctiles

---

## 📋 Análisis de Elementos Interactivos

### **1. Componente Button (utils.ts)**

**Tamaño actual:** `h-10 px-4 py-2`
- **Altura:** 40px (✅ cumple WCAG)
- **Padding:** 8px horizontal, 8px vertical (✅ cumple WCAG)
- **Área total:** ~56x40px (✅ cumple WCAG)

**Estado:** ✅ **CUMPLE** WCAG 2.2 AA

---

### **2. Componente Input (input.tsx)**

**Tamaño actual:** `h-10 w-full px-3 py-2`
- **Altura:** 40px (✅ cumple WCAG)
- **Padding:** 12px horizontal, 8px vertical (✅ cumple WCAG)
- **Área total:** Variable ancho, ~40px alto (✅ cumple WCAG)

**Estado:** ✅ **CUMPLE** WCAG 2.2 AA

---

### **3. Componente Checkbox (checkbox.tsx)**

**Tamaño actual:** `h-4 w-4`
- **Altura:** 16px (❌ NO cumple WCAG - necesita 24px mínimo)
- **Ancho:** 16px (❌ NO cumple WCAG - necesita 24px mínimo)
- **Área total:** 16x16px (❌ NO cumple WCAG)

**Problema:** Demasiado pequeño para触摸 en dispositivos móviles

**Sugerencia:**
```diff
- "peer h-4 w-4 shrink-0 rounded-sm border border-primary"
+ "peer h-6 w-6 shrink-0 rounded-sm border border-primary"
```

**Impacto visual:** Medio - Aumenta tamaño pero mejora usabilidad móvil

---

### **4. Componente Radio (radio-group.tsx)**

**Tamaño actual:** `h-4 w-4`
- **Altura:** 16px (❌ NO cumple WCAG)
- **Ancho:** 16px (❌ NO cumple WCAG)
- **Área total:** 16x16px (❌ NO cumple WCAG)

**Problema:** Demasiado pequeño para触摸 en dispositivos móviles

**Sugerencia:**
```diff
- "aspect-square h-4 w-4 rounded-full border border-primary"
+ "aspect-square h-6 w-6 rounded-full border border-primary"
```

**Impacto visual:** Medio - Aumenta tamaño pero mejora usabilidad móvil

---

### **5. Componente Switch (switch.tsx)**

**Tamaño actual:** `h-5 w-5`
- **Altura:** 20px (❌ NO cumple WCAG - necesita 24px mínimo)
- **Ancho:** 20px (❌ NO cumple WCAG - necesita 24px mínimo)
- **Área total:** 20x20px (❌ NO cumple WCAG)

**Problema:** Demasiado pequeño para触摸 en dispositivos móviles

**Sugerencia:**
```diff
- "pointer-events-none block h-5 w-5 rounded-full"
+ "pointer-events-none block h-6 w-6 rounded-full"
```

**Impacto visual:** Medio - Aumenta tamaño pero mejora usabilidad móvil

---

### **6. Componente Slider (slider.tsx)**

**Tamaño actual:** `h-5 w-5` (thumb)
- **Altura:** 20px (❌ NO cumple WCAG)
- **Ancho:** 20px (❌ NO cumple WCAG)
- **Área total:** 20x20px (❌ NO cumple WCAG)

**Problema:** Thumb demasiado pequeño para触摸 en dispositivos móviles

**Sugerencia:**
```diff
- "block h-5 w-5 rounded-full border-2 border-primary bg-background"
+ "block h-6 w-6 rounded-full border-2 border-primary bg-background"
```

**Impacto visual:** Medio - Aumenta tamaño pero mejora usabilidad móvil

---

### **7. Componente Select (select.tsx)**

**Tamaño actual:** `py-1.5` (items), `h-4 w-4` (iconos)
- **Altura items:** ~24px con padding (✅ cumple WCAG)
- **Iconos:** 16px (❌ NO cumple WCAG)

**Problema:** Iconos de navegación demasiado pequeños

**Sugerencia para iconos:**
```diff
- <ChevronDown className="h-4 w-4 opacity-50" />
- <ChevronUp className="h-4 w-4" />
- <Check className="h-4 w-4" />
+ <ChevronDown className="h-5 w-5 opacity-50" />
+ <ChevronUp className="h-5 w-5" />
+ <Check className="h-5 w-5" />
```

**Impacto visual:** Mínimo - Iconos más grandes sin afectar layout

---

### **8. Componente Tabs (tabs.tsx)**

**Tamaño actual:** `px-3 py-1.5`
- **Altura:** ~24px con padding (✅ cumple WCAG)
- **Padding:** 12px horizontal (✅ cumple WCAG)
- **Área total:** Variable ancho, ~24px alto (✅ cumple WCAG)

**Estado:** ✅ **CUMPLE** WCAG 2.2 AA

---

### **9. Componente SearchBar (SearchBar.tsx)**

**Tamaño actual:** `px-2 py-1` (input)
- **Altura:** ~32px con padding (✅ cumple WCAG)
- **Padding:** 8px horizontal (✅ cumple WCAG)
- **Área total:** Variable ancho, ~32px alto (✅ cumple WCAG)

**Botones de resultados:** `px-4 py-3`
- **Altura:** ~48px con padding (✅ cumple WCAG)
- **Padding:** 16px horizontal (✅ cumple WCAG)
- **Área total:** Variable ancho, ~48px alto (✅ cumple WCAG)

**Estado:** ✅ **CUMPLE** WCAG 2.2 AA

---

### **10. Botones específicos en componentes**

#### **Botón móvil Header.tsx:**
**Tamaño actual:** `p-2`
- **Altura:** ~32px con padding (✅ cumple WCAG)
- **Área total:** Variable ancho, ~32px alto (✅ cumple WCAG)

**Estado:** ✅ **CUMPLE** WCAG 2.2 AA

#### **Botones normativa_ia_agentica.tsx:**
**Tamaño actual:** `px-4 py-3`
- **Altura:** ~48px con padding (✅ cumple WCAG)
- **Padding:** 16px horizontal (✅ cumple WCAG)
- **Área total:** Variable ancho, ~48px alto (✅ cumple WCAG)

**Estado:** ✅ **CUMPLE** WCAG 2.2 AA

#### **Botones flujos_ia_agentica.tsx:**
**Tamaño actual:** `px-4 py-3`
- **Altura:** ~48px con padding (✅ cumple WCAG)
- **Padding:** 16px horizontal (✅ cumple WCAG)
- **Área total:** Variable ancho, ~48px alto (✅ cumple WCAG)

**Estado:** ✅ **CUMPLE** WCAG 2.2 AA

---

## 🎯 Priorización de Cambios

### **Fase 1 (Crítico - Inmediato)**
1. **Checkbox:** `h-4 w-4` → `h-6 w-6`
2. **Radio:** `h-4 w-4` → `h-6 w-6`
3. **Switch:** `h-5 w-5` → `h-6 w-6`

### **Fase 2 (Medio - 1 semana)**
4. **Slider thumb:** `h-5 w-5` → `h-6 w-6`
5. **Select icons:** `h-4 w-4` → `h-5 w-5`
6. **Testing móvil:** Verificar usabilidad en dispositivos táctiles

### **Fase 3 (Bajo - 2 semanas)**
7. **Consistencia:** Asegurar espaciado mínimo 8px
8. **Testing real:** Probar en diferentes dispositivos móviles
9. **Documentación:** Actualizar guías de diseño

---

## 📊 Impacto Esperado

### **Antes de las correcciones:**
- **Score Lighthouse:** ~85-90
- **Usabilidad móvil:** ~70-75%
- **Cumplimiento WCAG:** ~80%

### **Después de las correcciones:**
- **Score Lighthouse:** ~90-95
- **Usabilidad móvil:** ~90-95%
- **Cumplimiento WCAG:** ~95%

---

## 🚀 Plan de Implementación

### **Paso 1: Componentes de formulario (2-3 días)**
```tsx
// Checkbox
"peer h-6 w-6 shrink-0 rounded-sm border border-primary"

// Radio
"aspect-square h-6 w-6 rounded-full border border-primary"

// Switch
"pointer-events-none block h-6 w-6 rounded-full"
```

### **Paso 2: Componentes de navegación (2-3 días)**
```tsx
// Select icons
<ChevronDown className="h-5 w-5 opacity-50" />
<Check className="h-5 w-5" />

// Slider thumb
"block h-6 w-6 rounded-full border-2 border-primary bg-background"
```

### **Paso 3: Validación móvil (2 días)**
- Testing en dispositivos iOS y Android
- Verificar espaciado entre elementos
- Testing con diferentes tamaños de pantalla

### **Paso 4: Documentación (1 día)**
- Actualizar guías de diseño
- Documentar tamaños mínimos
- Crear checklist de testing móvil

---

## 📝 Notas de Implementación

### **Mantener consistencia visual:**
- Usar `h-6 w-6` para elementos interactivos pequeños
- Mantener espaciado mínimo de 8px entre elementos
- Asegurar que los cambios no rompan el diseño existente

### **Testing recomendado:**
- **Dispositivos:** iPhone SE, Android pequeño, tablets
- **Navegadores:** Chrome, Safari, Firefox mobile
- **Testing real:** Usar dedos, no solo mouse

### **Consideraciones especiales:**
- **Densidad de píxeles:** Considerar dispositivos de alta densidad
- **Modo oscuro:** Verificar contraste con nuevos tamaños
- **Accesibilidad:** Asegurar que los cambios no afecten lectores de pantalla

---

## 🔗 Referencias Útiles

### **Guías WCAG:**
- **WCAG 2.2 Touch Target Size:** https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- **Mobile Accessibility:** https://www.w3.org/WAI/WCAG21/Understanding/target-size sufficient.html

### **Herramientas de testing:**
- **Browser Stack:** https://browserstack.com/
- **Responsive Design Checker:** https://responsivedesignchecker.com/
- **Touch Target Size Tester:** Herramientas online de testing

### **Best practices:**
- **Apple HIG:** https://developer.apple.com/design/human-interface-guidelines/
- **Material Design:** https://material.io/design/usability/accessibility.html
- **Microsoft Fluent:** https://fluent2.microsoft.com/

Este análisis proporciona una guía completa para lograr WCAG 2.2 AA compliance en tamaños de elementos táctiles, priorizando la usabilidad en dispositivos móviles.
