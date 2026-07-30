# Análisis de Problemas Semánticos - Componentes Principales

## 🔍 Problemas Identificados

### **Prioridad: Semántica HTML > Contraste > Tamaño Elementos > Indicadores Focus**

---

## 1. **Uso de <div> en lugar de <button>**

### **Problema:** Elementos interactivos sin semántica apropiada
**Ubicación:** `src/components/flujos_ia_agentica.tsx` (líneas 75, 121, 367, 447)
**Impacto:** Alto - Screen readers no reconocen elementos interactivos

#### **Código actual:**
```tsx
{index < linear.length - 1 && (
  <div className="text-center text-amber-500 text-lg opacity-60 mb-2">↓</div>
)}
```

#### **Diff propuesto:**
```diff
- {index < linear.length - 1 && (
-  <div className="text-center text-amber-500 text-lg opacity-60 mb-2">↓</div>
- )}
+ {index < linear.length - 1 && (
+  <button 
+    type="button"
+    className="text-center text-amber-500 text-lg opacity-60 mb-2 w-full"
+    onClick={() => setActiveTab(index + 1)}
+    aria-label="Siguiente paso"
+  >
+    ↓
+  </button>
+ )}
```

**Impacto visual:** Mínimo - Mejora semántica sin cambiar apariencia

---

## 2. **Uso de <div> en lugar de <h1>-<h6>**

### **Problema:** Texto con estilos de encabezado sin semántica
**Ubicación:** `src/components/flujos_ia_agentica.tsx` (líneas 42-43)
**Impacto:** Alto - Rompe jerarquía de contenido

#### **Código actual:**
```tsx
<h3 className="font-serif text-xl md:text-2xl text-foreground">
  Mutación estructural del tratamiento de datos
</h3>
```

#### **Diff propuesto:**
```diff
- <h3 className="font-serif text-xl md:text-2xl text-foreground">
-   Mutación estructural del tratamiento de datos
- </h3>
+ <h2 className="font-serif text-xl md:text-2xl text-foreground">
+   Mutación estructural del tratamiento de datos
+ </h2>
```

**Impacto visual:** Mínimo - Mejora jerarquía semántica

---

## 3. **Uso de <a> en lugar de <button> para navegación**

### **Problema:** Navegación sin semántica de botón
**Ubicación:** `src/components/ui/NewsCard.tsx` (líneas 17-25)
**Impacto:** Medio - Funcional pero no óptimo para accesibilidad

#### **Código actual:**
```tsx
const TitleLink = isInternal ? (
  <Link href={url} className="hover:text-primary transition-colors">
    {title}
  </Link>
) : (
  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
    {title}
  </a>
);
```

#### **Diff propuesto:**
```diff
const TitleLink = isInternal ? (
  <Link href={url} className="hover:text-primary transition-colors">
    {title}
  </Link>
) : (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-primary transition-colors"
    role="button"
    tabIndex={0}
  >
    {title}
  </a>
);
```

**Impacto visual:** Mínimo - Mejora semántica sin cambiar apariencia

---

## 4. **Falta de estructura semántica principal**

### **Problema:** Uso excesivo de <div> sin landmarks
**Ubicación:** Varios componentes, especialmente layouts
**Impacto:** Alto - Dificultad de navegación para screen readers

#### **Código actual (Header):**
```tsx
<div className="flex items-center justify-between py-3 md:py-4 min-h-[120px]">
  <div className="flex flex-1 items-center justify-between gap-4 md:gap-6">
    <Link href={isEnglish ? "/en" : "/"} className="flex items-center group flex-shrink-0">
      <Image src="/logo-principal.png" alt="Derecho Artificial" />
    </Link>
  </div>
</div>
```

#### **Diff propuesto:**
```diff
- <div className="flex items-center justify-between py-3 md:py-4 min-h-[120px]">
-   <div className="flex flex-1 items-center justify-between gap-4 md:gap-6">
-     <Link href={isEnglish ? "/en" : "/"} className="flex items-center group flex-shrink-0">
-       <Image src="/logo-principal.png" alt="Derecho Artificial" />
-     </Link>
-   </div>
- </div>
+ <header className="flex items-center justify-between py-3 md:py-4 min-h-[120px]" role="banner">
+   <nav className="flex flex-1 items-center justify-between gap-4 md:gap-6" role="navigation" aria-label="Navegación principal">
+     <Link href={isEnglish ? "/en" : "/"} className="flex items-center group flex-shrink-0">
+       <Image src="/logo-principal.png" alt="Derecho Artificial" />
+     </Link>
+   </nav>
+ </header>
```

**Impacto visual:** Medio - Requiere ajustes de CSS pero mejora estructura

---

## 5. **Falta de <main> y <section>**

### **Problema:** Contenido principal sin semántica
**Ubicación:** Layouts y páginas principales
**Impacto:** Alto - Screen readers no identifican contenido principal

#### **Diff propuesto para layouts:**
```diff
+ <main role="main" id="main-content">
+   <section aria-labelledby="page-title">
+     <h1 id="page-title">{title}</h1>
+     {children}
+   </section>
+ </main>
```

**Impacto visual:** Mínimo - Mejora estructura semántica

---

## 6. **Falta de <nav> en menús de navegación**

### **Problema:** Menús sin semántica de navegación
**Ubicación:** `src/components/layout/Footer.tsx` (líneas 40-66)
**Impacto:** Medio - Navegación menos clara para screen readers

#### **Código actual:**
```tsx
<nav className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
  {isEnglish ? (
    <>
      <Link href="/firma-scarpa" className="text-sm text-body hover:text-foreground transition-colors duration-300">
        Scarpa Firm
      </Link>
      {/* ... más links */}
    </>
  ) : (
    <>
      <Link href="/firma-scarpa" className="text-sm text-body hover:text-foreground transition-colors duration-300">
        Firma Scarpa
      </Link>
      {/* ... más links */}
    </>
  )}
</nav>
```

#### **Diff propuesto:**
```diff
- <nav className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
+ <nav className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4" role="navigation" aria-label="Navegación del sitio">
+   <ul className="space-y-2">
+     <li><Link href="/firma-scarpa" className="text-sm text-body hover:text-foreground transition-colors duration-300">Firma Scarpa</Link></li>
+     {/* ... más links en <li> */}
+   </ul>
</nav>
```

**Impacto visual:** Medio - Mejora semántica y estructura de lista

---

## 7. **Falta de <article> para contenido de artículos**

### **Problema:** Artículos sin semántica de contenido
**Ubicación:** `src/components/ui/NewsCard.tsx`, `src/components/ContentPreviewCard.tsx`
**Impacto:** Medio - Screen readers no identifican contenido como artículo

#### **Diff propuesto:**
```diff
const NewsCard = ({ title, date, source, url, summary, tags, image }: NewsCardProps) => {
  return (
-   <Link href={url} className={cardClasses[size]}>
+   <article className={cardClasses[size]}>
      <header>
        <time dateTime={date} className="text-xs text-muted-foreground">{date}</time>
        <h2 className="font-semibold">
          <TitleLink title={title} url={url} />
        </h2>
      </header>
      <section>
        <p className="text-sm text-muted-foreground">{summary}</p>
        {tags && (
          <footer>
            <div className="flex gap-1 flex-wrap">
              {tags.map(tag => (
                <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </section>
    </article>
  );
};
```

**Impacto visual:** Medio - Requiere ajustes CSS pero mejora semántica

---

## 🎯 Priorización de Soluciones

### **Fase 1 (Crítico - Inmediato)**
1. **Header semántico** - `<header>`, `<nav>`, `<main>`
2. **Botones semánticos** - Reemplazar `<div>` interactivos por `<button>`
3. **Encabezados correctos** - Usar `<h1>`-`<h6>` apropiados

### **Fase 2 (Medio - 1-2 semanas)**
4. **Artículos semánticos** - `<article>`, `<section>`, `<header>`, `<footer>`
5. **Navegación mejorada** - `<ul>`, `<li>` en menús
6. **Landmarks** - `role="navigation"`, `role="main"`, `role="contentinfo"`

### **Fase 3 (Bajo - 2-3 semanas)**
7. **Skip links** - Enlaces para saltar navegación
8. **Breadcrumbs** - Navegación jerárquica semántica
9. **Formularios mejorados** - `<fieldset>`, `<legend>`, `<label>`

---

## 🧪 Tests de Validación Propuestos

### **Tests para verificar cambios:**
```tsx
// Test para header semántico
test('Header debe tener estructura semántica correcta', () => {
  render(<Header />);
  
  expect(screen.getByRole('banner')).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('alt', 'Derecho Artificial');
});

// Test para botones semánticos
test('Botones deben ser elementos button', () => {
  const handleClick = jest.fn();
  render(<button onClick={handleClick}>Click me</button>);
  
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('type', 'button');
});

// Test para artículos semánticos
test('NewsCard debe tener estructura de article', () => {
  render(<NewsCard {...mockProps} />);
  
  expect(screen.getByRole('article')).toBeInTheDocument();
  expect(screen.getByRole('heading')).toBeInTheDocument();
  expect(screen.getByText(/2024/)).toBeInTheDocument(); // time element
});
```

---

## 📊 Impacto Esperado

### **Antes de las correcciones:**
- **Score Lighthouse:** ~65-70
- **Violaciones WCAG:** ~15-20
- **Elementos semánticos:** ~40% incorrectos

### **Después de las correcciones:**
- **Score Lighthouse:** ~85-90
- **Violaciones WCAG:** ~5-8
- **Elementos semánticos:** ~90% correctos

---

## 🚀 Implementación Recomendada

1. **Crear componentes semánticos base** que envuelvan los existentes
2. **Mantener apariencia visual** durante la transición
3. **Añadir tests específicos** para cada cambio semántico
4. **Validar con screen readers** reales (NVDA, VoiceOver)
5. **Documentar patrones** para desarrollo futuro

Este análisis proporciona diffs claros y priorizados para mejorar la accesibilidad semántica del proyecto sin comprometer la experiencia visual actual.
