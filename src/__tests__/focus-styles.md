# Análisis de Estilos Focus - Elementos Interactivos

## 🔍 Elementos Identificados sin Estilos Focus Adecuados

### **Estándar WCAG 2.2 AA:**
- **Focus visible:** Indicador claro de focus
- **Contraste de focus:** Mínimo 3:1
- **Consistencia:** Mismo estilo en todo el sitio

---

## 📋 Lista de Elementos y Soluciones

### **1. Componente Button (utils.ts)**

**Ubicación:** `src/lib/utils.ts` (línea 10)
**Estado actual:** ✅ Tiene estilos focus básicos

**Código actual:**
```tsx
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

**Mejora sugerida:**
```diff
- "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
+ "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
```

**Impacto visual:** Mínimo - Mejora visibilidad del focus

---

### **2. Componente Input (input.tsx)**

**Ubicación:** `src/components/ui/input.tsx` (línea 11)
**Estado actual:** ✅ Tiene estilos focus básicos

**Código actual:**
```tsx
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

**Mejora sugerida:**
```diff
- "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
+ "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
```

**Impacto visual:** Mínimo - Mejora visibilidad del focus

---

### **3. SearchBar Input (SearchBar.tsx)**

**Ubicación:** `src/components/SearchBar.tsx` (línea 131)
**Estado actual:** ✅ Tiene estilos focus-through

**Código actual:**
```tsx
className="flex items-center gap-2 rounded-md border border-input bg-background px-2 py-1 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
```

**Mejora sugerida:**
```diff
- "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
+ "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-background"
```

**Impacto visual:** Mínimo - Mejora visibilidad del focus

---

### **4. Botones en SearchBar (SearchBar.tsx)**

**Ubicación:** `src/components/SearchBar.tsx` (línea 163)
**Estado actual:** ❌ No tiene estilos focus

**Código actual:**
```tsx
<button
  key={`${result.category}-${result.slug}`}
  type="button"
  onClick={() => handleNavigate(result)}
  className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm hover:bg-accent"
>
```

**Mejora sugerida:**
```diff
- className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm hover:bg-accent"
+ className="flex w-full flex-col items-start gap-1 px-4 py-3 text-left text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

**Impacto visual:** Mínimo - Añade focus visible

---

### **5. Botones en normativa_ia_agentica.tsx**

**Ubicación:** `src/components/normativa_ia_agentica.tsx` (línea 381)
**Estado actual:** ❌ No tiene estilos focus

**Código actual:**
```tsx
<button
  type="button"
  onClick={() => setOpen(isOpen ? null : inst.id)}
  className="flex w-full items-start gap-3 px-4 py-3 text-left"
>
```

**Mejora sugerida:**
```diff
- className="flex w-full items-start gap-3 px-4 py-3 text-left"
+ className="flex w-full items-start gap-3 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

**Impacto visual:** Mínimo - Añade focus visible

---

### **6. Botones en flujos_ia_agentica.tsx**

**Ubicación:** `src/components/flujos_ia_agentica.tsx` (línea 589)
**Estado actual:** ❌ No tiene estilos focus

**Código actual:**
```tsx
<button
  key={p.num}
  type="button"
  onClick={() => setActive(isActive ? null : index)}
  className="flex w-full items-center justify-center rounded-full border text-[11px] text-amber-700 transition-transform"
>
```

**Mejora sugerida:**
```diff
- className="flex w-full items-center justify-center rounded-full border text-[11px] text-amber-700 transition-transform"
+ className="flex w-full items-center justify-center rounded-full border text-[11px] text-amber-700 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

**Impacto visual:** Mínimo - Añade focus visible

---

### **7. Botón móvil en Header.tsx**

**Ubicación:** `src/components/layout/Header.tsx` (línea 166)
**Estado actual:** ❌ No tiene estilos focus

**Código actual:**
```tsx
<button
  type="button"
  className="lg:hidden p-2 -mr-2 text-foreground hover:text-primary transition-colors"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
>
```

**Mejora sugerida:**
```diff
- className="lg:hidden p-2 -mr-2 text-foreground hover:text-primary transition-colors"
+ className="lg:hidden p-2 -mr-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
```

**Impacto visual:** Mínimo - Añade focus visible

---

### **8. Enlaces en Breadcrumbs.tsx**

**Ubicación:** `src/components/Breadcrumbs.tsx` (línea 25)
**Estado actual:** ❌ No tiene estilos focus

**Código actual:**
```tsx
<a href={item.href} className="hover:underline text-blue-600">{item.label}</a>
```

**Mejora sugerida:**
```diff
- className="hover:underline text-blue-600"
+ className="hover:underline text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
```

**Impacto visual:** Mínimo - Añade focus visible

---

### **9. Enlaces en NewsCard.tsx**

**Ubicación:** `src/components/ui/NewsCard.tsx` (línea 22)
**Estado actual:** ❌ No tiene estilos focus

**Código actual:**
```tsx
<a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
  {title}
</a>
```

**Mejora sugerida:**
```diff
- className="hover:text-primary transition-colors"
+ className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
```

**Impacto visual:** Mínimo - Añade focus visible

---

## 🎯 Priorización de Cambios

### **Fase 1 (Crítico - Inmediato)**
1. **Button base** - Actualizar ring color a blue-500
2. **Input base** - Actualizar ring color a blue-500
3. **SearchBar** - Actualizar ring color a blue-500

### **Fase 2 (Medio - 1 semana)**
4. **Botones de resultados** - Añadir estilos focus
5. **Botones de acordeones** - Añadir estilos focus
6. **Botón móvil** - Añadir estilos focus

### **Fase 3 (Bajo - 2 semanas)**
7. **Enlaces externos** - Añadir estilos focus
8. **Enlaces breadcrumbs** - Añadir estilos focus
9. **Testing completo** - Validar navegación por teclado

---

## 🧪 Implementación Sugerida

### **Opción 1: Actualizar variables base (Recomendado)**

```tsx
// En utils.ts
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  // ... resto del código
);
```

### **Opción 2: Clase de focus global**

```css
/* En globals.css */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* Aplicar a todos los elementos interactivos */
button:focus,
input:focus,
a:focus,
textarea:focus,
select:focus {
  @apply focus-ring;
}
```

### **Opción 3: Mix de ambos (Óptimo)**

```tsx
// Variables base con focus azul
const focusRing = "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

// Aplicar en componentes específicos
<button className={`${baseClasses} ${focusRing}`}>
```

---

## 📊 Impacto Esperado

### **Antes de las correcciones:**
- **Score Lighthouse:** ~80-85
- **Violaciones WCAG:** ~3-5 de focus
- **Experiencia keyboard:** Difícil de ver focus

### **Después de las correcciones:**
- **Score Lighthouse:** ~90-95
- **Violaciones WCAG:** ~0-1 de focus
- **Experiencia keyboard:** Focus claramente visible

---

## 🚀 Plan de Implementación

### **Paso 1: Variables base (1 día)**
```tsx
// Actualizar buttonVariants en utils.ts
"focus-visible:ring-blue-500 focus-visible:ring-offset-2"
```

### **Paso 2: Componentes críticos (2-3 días)**
- Button, Input, SearchBar
- Botones interactivos específicos
- Testing de navegación por teclado

### **Paso 3: Enlaces y botones secundarios (2 días)**
- Enlaces externos e internos
- Botones de acordeones y menús
- Botón móvil

### **Paso 4: Validación (1 día)**
- Testing completo con Tab y Shift+Tab
- Verificación de contraste de focus
- Testing con lectores de pantalla

---

## 🧪 Tests de Validación

### **Tests manuales:**
1. **Navegación por teclado:** Tab, Shift+Tab, Enter, Space
2. **Visibilidad del focus:** Verificar anillo azul visible
3. **Contraste del focus:** Azul sobre fondos claros/oscuros
4. **Consistencia:** Mismo estilo en todo el sitio

### **Tests automatizados:**
```tsx
// Test para focus visible
test('Button debe tener anillo de focus visible', () => {
  render(<Button>Click me</Button>);
  
  const button = screen.getByRole('button');
  fireEvent.focus(button);
  
  expect(button).toHaveClass('focus:ring-2');
  expect(button).toHaveClass('focus:ring-blue-500');
});

// Test para navegación por teclado
test('Se puede navegar por teclado', async () => {
  render(<SearchBar />);
  
  await userEvent.tab();
  expect(screen.getByRole('searchbox')).toHaveFocus();
});
```

---

## 📝 Notas de Implementación

1. **Consistencia visual:** Usar el mismo color de focus (blue-500)
2. **Contraste adecuado:** Azul #3B82F6 tiene excelente contraste
3. **No invasivo:** Los estilos son sutiles pero visibles
4. **Testing real:** Probar con diferentes navegadores
5. **Documentación:** Actualizar guías de diseño

---

## 🔗 Referencias Útiles

### **Herramientas de focus:**
- **a11yproject:** https://www.a11yproject.org/
- **WebAIM Keyboard:** https://webaim.org/techniques/keyboard/
- **Focus Management:** https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/

### **Ejemplos de implementación:**
- **Tailwind CSS Focus:** https://tailwindcss.com/docs/focus/
- **Radix UI Focus:** https://www.radix-ui.com/primitives/docs/focus-scope
- **React Hook Form:** https://react-hook-form.com/

Este análisis proporciona una guía completa para implementar estilos de focus consistentes y accesibles en todo el proyecto.
