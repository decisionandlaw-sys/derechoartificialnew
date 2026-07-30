# 🚀 Accessibility Checklist - Derecho Artificial

## 📋 Herramientas Automatizadas

### **1. Linting (ESLint + JSX A11y)**
```bash
# Ejecutar linting con reglas de accesibilidad
npm run lint

# Verificar específicamente reglas a11y
npm run lint -- --rule="jsx-a11y/*"
```

**Qué verifica:**
- Uso correcto de elementos semánticos
- Atributos ARIA requeridos
- Roles y propiedades accesibles
- Imágenes con alt text
- Formularios con labels adecuados
- Enfoque y tab order correctos

---

### **2. Testing Automatizado (Jest + axe)**
```bash
# Ejecutar todos los tests de accesibilidad
npm test

# Ejecutar solo tests de accesibilidad
npm test -- --testPathPattern="*.a11y.test.tsx"

# Ejecutar con cobertura
npm test -- --coverage -- --testPathPattern="*.a11y.test.tsx"
```

**Qué verifica:**
- Violaciones WCAG automáticamente
- Contraste de colores
- Tamaños de elementos táctiles
- Estructura semántica correcta
- Navegación por teclado
- Indicadores de focus visibles

---

### **3. Auditoría Continua (pa11y-ci)**
```bash
# Ejecutar auditoría completa del sitio
npm run audit:a11y

# Ejecutar en modo CI/CD
npm run audit:a11y --json > accessibility-report.json

# Verificar reporte
cat accessibility-report.json
```

**Qué verifica:**
- Cumplimiento WCAG 2.2 AA completo
- Todos los niveles de contraste
- Elementos interactivos accesibles
- Estructura de página semántica
- Enlaces y navegación

---

## 🔍 Auditoría Manual

### **4. Prueba de Navegación con Teclado**
```bash
# Abrir el sitio en navegador
npm run dev

# Probar navegación sistemática
1. Presionar Tab para recorrer todos los elementos interactivos
2. Verificar que el focus sea visible en cada elemento
3. Probar Enter/Space para activar botones y enlaces
4. Probar Escape para cerrar modales y menús
5. Probar flechas para navegación en menús y sliders
6. Probar Tab en formularios para cambiar entre campos
```

**Checklist de navegación:**
- [ ] El foco es visible en todos los elementos interactivos
- [ ] El orden del foco es lógico y predecible
- [ ] Todos los elementos interactivos son alcanzables con teclado
- [ ] Los modales atrapan el foco correctamente
- [ ] Se puede salir de modales con Escape
- [ ] Los saltos de línea en formularios funcionan correctamente

---

### **5. Prueba con Lector de Pantalla**

#### **NVDA (Windows) - Recomendado**
```bash
# Instalar NVDA (si no está instalado)
# Descargar desde: https://www.nvaccess.org/download/

# Configuración para testing:
1. Iniciar NVDA
2. Abrir el sitio en navegador
3. Usar NVDA + Firefox para mejor compatibilidad
```

**Procedimiento de testing:**
1. **Navegación por teclado:** Verificar que NVDA anuncie cada elemento
2. **Lectura de contenido:** Confirmar que lee todo el texto correctamente
3. **Estructura de página:** Verificar que anuncia encabezados y secciones
4. **Formularios:** Confirmar que anuncia campos y errores
5. **Enlaces:** Verificar que anuncia destino y propósito
6. **Imágenes:** Confirmar que lee alt text descriptivo

#### **AWS (Mac)**
```bash
# Activar VoiceOver
# System Preferences > Accessibility > VoiceOver > On

# Atajo: Cmd + F5
```

**Procedimiento de testing:**
1. Mismo procedimiento que con NVDA
2. Usar VoiceOver + Safari para compatibilidad
3. Verificar gestos táctiles en dispositivos móviles

---

### **6. Verificación de Contraste**

#### **axe DevTools (Extensión Chrome)**
```bash
# Instalar extensión
# Chrome Web Store > axe DevTools

# Procedimiento:
1. Abrir DevTools (F12)
2. Ir a tab "axe"
3. Hacer clic en "Analyze entire page"
4. Revisar violaciones de contraste
```

#### **WAVE (WebAIM)**
```bash
# Abrir herramienta online
# https://wave.webaim.org/

# Procedimiento:
1. Ingresar URL del sitio
2. Hacer clic en "Enter URL"
3. Revisar reporte detallado de contraste
4. Verificar problemas específicos de color
```

#### **Colour Contrast Analyser**
```bash
# Extensión Chrome
# Chrome Web Store > Colour Contrast Analyser

# Procedimiento:
1. Activar herramienta
2. Seleccionar elemento con texto
3. Verificar ratio de contraste
4. Apuntar a elementos problemáticos
```

---

## 📋 Checklist WCAG 2.2 AA

### **✅ Semántica HTML Correcta**
- [ ] `<header>` con `role="banner"` para encabezado del sitio
- [ ] `<nav>` con `role="navigation"` para navegación principal
- [ ] `<main>` o `<div role="main">` para contenido principal
- [ ] `<footer>` con `role="contentinfo"` para pie de página
- [ ] `<article>` para contenido autónomo (posts, noticias)
- [ ] `<section>` para secciones temáticas
- [ ] `<h1>`-`<h6>` en jerarquía correcta sin saltos
- [ ] `<button>` para acciones, no `<div onclick>`
- [ ] `<a>` para enlaces, no `<div onclick>`
- [ ] `<label>` asociado a cada `<input>`
- [ ] `<img>` con `alt` descriptivo

### **🎨 Contraste de Colores Mínimo 4.5:1**
- [ ] Texto normal: ratio ≥ 4.5:1 sobre fondo
- [ ] Texto grande: ratio ≥ 3:1 sobre fondo
- [ ] Elementos de UI: ratio ≥ 3:1 sobre fondo
- [ ] Componentes interactivos: contraste suficiente
- [ ] Enlaces: contrastan bien en hover y focus
- [ ] Botones: texto legible sobre colores de fondo
- [ ] Indicadores de focus: visibles sobre cualquier fondo

### **👆 Elementos Táctiles ≥24x24px**
- [ ] Botones: mínimo 24x24px (40px con padding)
- [ ] Links: área de clic ≥24x24px
- [ ] Inputs: altura mínima 24px (h-6 o más)
- [ ] Checkbox: mínimo 24x24px
- [ ] Radio buttons: mínimo 24x24px
- [ ] Switch: mínimo 24x24px
- [ ] Slider thumb: mínimo 24x24px
- [ ] Select dropdown: área de clic ≥24x24px
- [ ] Iconos: suficientemente grandes para ser clickeables

### **🎯 Focus Visible y Consistente**
- [ ] Indicador azul: `focus:ring-2 focus:ring-blue-500`
- [ ] Offset adecuado: `focus:ring-offset-2`
- [ ] Sin outline: `focus:outline-none`
- [ ] Consistente: mismo estilo en todo el sitio
- [ ] Alto contraste: visible sobre fondos claros y oscuros
- [ ] No invasivo: no distrae del contenido principal

### **⌨️ Navegación por Teclado Completa**
- [ ] Tab navigation: todos los elementos interactivos alcanzables
- [ ] Order lógico: secuencia de foco predecible
- [ ] Enter/Space: activan botones y enlaces
- [ ] Escape: cierra modales y vuelve al foco anterior
- [ ] Flechas: navegación en menús, sliders, tabs
- [ ] Tab en formularios: movimiento entre campos
- [ ] Skip links: enlaces para saltar navegación
- [ ] Focus trapping: modales retienen foco correctamente

### **🏷️ Labels y Texto Alternativo**
- [ ] Form inputs: cada `<input>` tiene `<label>` asociado
- [ ] ARIA labels: elementos complejos tienen `aria-label` descriptivo
- [ ] Placeholder: descriptivo pero no reemplaza a `<label>`
- [ ] Error messages: asociados a campos con `aria-describedby`
- [ ] Button text: descriptivo, no genérico "click aquí"
- [ ] Icon buttons: `aria-label` si no tienen texto visible
- [ ] Images: `alt` descriptivo para contenido funcional
- [ ] Decorative images: `alt=""` si son puramente decorativas

### **📱 Responsive y Mobile**
- [ ] Touch targets: ≥24x24px en dispositivos móviles
- [ ] Zoom: hasta 200% sin romper layout
- [ ] Orientación: funciona en landscape y portrait
- [ ] Gestos: swipe, tap funcionan correctamente
- [ ] Viewport: meta tag configurado correctamente
- [ ] Text reflow: contenido se reorganiza al cambiar tamaño

### **🔊 Multimedia y Contenido Dinámico**
- [ ] Videos: controles accesibles, subtítulos opcionales
- [ ] Audio: controles de reproducción, transcripciones
- [ ] Animaciones: opción para reducir movimiento
- [ ] Auto-play: no se reproduce automáticamente
- [ ] Dynamic content: carga accesible con lectores de pantalla
- [ ] Loading states: indicadores visibles de progreso
- [ ] Error states: mensajes de error claros y accesibles

---

## 🚀 Ejecución Automatizada

### **Comando Completo:**
```bash
# Ejecutar todas las verificaciones de accesibilidad
npm run lint && npm test -- --testPathPattern="*.a11y.test.tsx" && npm run audit:a11y
```

### **Integración CI/CD:**
```bash
# En GitHub Actions (ya configurado)
- Lint en cada push/PR
- Tests en cada push/PR
- Auditoría pa11y-ci en cada deploy
- Reportes generados automáticamente
```

---

## 📊 Reportes y Métricas

### **Herramientas de Reporte:**
- **axe-core:** Violaciones específicas con línea de código
- **pa11y-ci:** Reporte JSON para integración continua
- **Lighthouse:** Score general de accesibilidad
- **Manual testing:** Observaciones cualitativas de usuarios reales

### **Métricas a Monitorear:**
- **Score Lighthouse:** ≥90 (accesibilidad excelente)
- **Violaciones axe:** 0-5 (mínimo posible)
- **WCAG compliance:** ≥95% (casi cumplimiento total)
- **User testing:** Satisfacción ≥4.5/5 en pruebas reales

---

## 🔄 Proceso de Mejora Continua

### **1. Diagnóstico Inicial**
```bash
# Ejecutar auditoría completa
npm run audit:a11y --json > baseline-a11y.json

# Analizar resultados
cat baseline-a11y.json | jq '.violations | length'
```

### **2. Priorización de Problemas**
1. **Críticos:** Violaciones WCAG severas
2. **Altos:** Problemas de contraste y navegación
3. **Medios:** Elementos pequeños de tactil
4. **Bajos:** Mejoras de UX y optimización

### **3. Implementación y Validación**
```bash
# Para cada cambio:
git checkout -b accessibility-improvement
# Hacer cambios
git commit -m "Fix: Improve button touch targets to 24x24px"
# Ejecutar tests
npm test -- --testPathPattern="*.a11y.test.tsx"
# Verificar mejoras
npm run audit:a11y
```

### **4. Documentación y Comunicación**
- **Changelog:** Registrar todas las mejoras de accesibilidad
- **Guidelines:** Documentar patrones y componentes accesibles
- **Training:** Material para equipo sobre accesibilidad web
- **User feedback:** Canal para reportar problemas de accesibilidad

---

## 📞 Referencias y Recursos

### **Herramientas Online:**
- **WAVE:** https://wave.webaim.org/
- **axe DevTools:** https://www.dequeued.com/axe-devtools/
- **Colour Contrast Analyser:** https://chrome.google.com/webstore/detail/...
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Silk - Accessibility Tester:** https://www.silktide.com/

### **Documentación WCAG:**
- **WCAG 2.2:** https://www.w3.org/WAI/WCAG22/Understanding/
- **Quick Reference:** https://www.w3.org/WAI/WCAG22/quickref/
- **Techniques:** https://www.w3.org/WAI/WCAG22/Techniques/

### **Guías de Implementación:**
- **A11y Project:** https://www.a11yproject.com/
- **WebAIM:** https://webaim.org/techniques/
- **MDN Accessibility:** https://developer.mozilla.org/en-US/docs/Web/Accessibility

### **Comunidad y Soporte:**
- **Stack Overflow:** Etiquetar preguntas con [accessibility] [wcag]
- **Discord/A11y:** Comunidad de desarrolladores accesibilidad
- **Twitter:** #a11y #webaccessibility #wcag

---

**Última actualización:** $(date)
**Versión:** 1.0.0
**Próxima revisión:** Mensual o según cambios significativos
