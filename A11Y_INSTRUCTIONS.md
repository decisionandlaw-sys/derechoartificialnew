# Instrucciones para Tests de Accesibilidad

## Configuración Completa

### 1. Dependencias Instaladas
- ✅ `@axe-core/cli` - Para auditoría con axe
- ✅ `pa11y-ci` - Para tests automatizados
- ✅ `eslint-plugin-jsx-a11y` - Para ESLint
- ✅ `@testing-library/react` - Para tests unitarios
- ✅ `jest-axe` - Para integración con Jest

### 2. Archivos de Configuración
- ✅ `.pa11yci.json` - Configuración de pa11y-ci
- ✅ `.gitignore` - Excluye `/a11y-reports/`
- ✅ `package.json` - Scripts de testing
- ✅ `eslint.config.js` - Reglas de accesibilidad
- ✅ `.github/workflows/accessibility.yml` - CI/CD

---

## Uso Local

### 1. Ejecutar tests de Jest con axe
```bash
npm test
```

### 2. Ejecutar auditoría con pa11y-ci
```bash
# Básico
npx pa11y-ci --config .pa11yci.json

# Con threshold específico
npx pa11y-ci --config .pa11yci.json --threshold 5

# Solo una URL
npx pa11y-ci https://derechoartificial.com --standard WCAG2.2AA
```

### 3. Ejecutar auditoría con axe
```bash
# Usando el script de package.json
npm run audit:a11y

# Directamente
npx axe https://derechoartificial.com --output json --output-file a11y-reports/report.json
```

---

## Uso con Lighthouse (Chrome DevTools)

### 1. Abrir Lighthouse
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Haz clic en "Generate report"
4. Selecciona la categoría "Accessibility"
5. Revisa el reporte detallado

### 2. Qué revisar en el reporte
- **Violaciones WCAG**: Errores de accesibilidad
- **Elementos con problemas**: Componentes específicos
- **Sugerencias de mejora**: Recomendaciones
- **Puntuación**: Score general de accesibilidad

---

## Comandos Útiles

### Ver solo errores críticos
```bash
npx pa11y-ci --config .pa11yci.json --level error
```

### Incluir screenshots de violaciones
```bash
npx pa11y-ci --config .pa11yci.json --add-screenshot
```

### Ejecutar en modo verbose
```bash
npx pa11y-ci --config .pa11yci.json --verbose
```

### Ejecutar tests específicos
```bash
npm test -- accessibility.test.tsx
```

---

## Solución de Problemas Comunes

### 1. "color-contrast"
**Problema**: Bajo contraste entre texto y fondo
**Solución**: 
```css
/* Usar herramientas como WebAIM Contrast Checker */
.texto {
  color: #000000;  /* Negro puro */
  background: #ffffff; /* Blanco puro */
}
```

### 2. "label-has-associated-control"
**Problema**: Inputs sin labels asociadas
**Solución**:
```jsx
// ❌ Incorrecto
<input type="email" placeholder="Correo" />

// ✅ Correcto
<label htmlFor="email">Correo</label>
<input id="email" type="email" />
```

### 3. "button-name"
**Problema**: Botones sin texto descriptivo
**Solución**:
```jsx
// ❌ Incorrecto
<button onClick={handleSubmit} />

// ✅ Correcto
<button onClick={handleSubmit} aria-label="Enviar formulario">
  Enviar
</button>
```

### 4. "alt-text"
**Problema**: Imágenes sin alt text
**Solución**:
```jsx
// ❌ Incorrecto
<img src="logo.png" />

// ✅ Correcto
<img src="logo.png" alt="Logo de Derecho Artificial" />
```

### 5. "heading-order"
**Problema**: Jerarquía incorrecta de encabezados
**Solución**:
```jsx
// ❌ Incorrecto
<h3>Título Principal</h3>
<h1>Subtítulo</h1>

// ✅ Correcto
<h1>Título Principal</h1>
<h2>Subtítulo</h2>
```

---

## Buenas Prácticas

### 1. Antes de cada deploy
```bash
# Ejecutar todos los tests
npm test

# Ejecutar auditoría completa
npm run audit:a11y

# Verificar linting
npm run lint
```

### 2. Revisión de reportes
- **HTML**: Abre `a11y-reports/report.html` en navegador
- **JSON**: Revisa `a11y-reports/report.json`
- **CSV**: Abre `a11y-reports/report.csv` en Excel

### 3. Testing con lectores de pantalla
- **NVDA** (Windows): Gratuito
- **JAWS** (Windows): Comercial
- **VoiceOver** (Mac): Integrado
- **TalkBack** (Android): Integrado

### 4. Verificación de navegación por teclado
1. Usa `Tab` para navegar
2. Usa `Enter` o `Space` para activar
3. Usa `Esc` para cerrar modales
4. Usa `Arrow keys` para menús y componentes

### 5. Validación de contraste
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Chrome DevTools**: Color picker con contraste
- **Adobe Color**: Herramienta de contraste integrada

---

## Integración CI/CD

### GitHub Actions
El workflow `.github/workflows/accessibility.yml` se ejecuta automáticamente:
- En cada `push` a `main` o `develop`
- En cada `pull request` a `main` o `develop`

### Resultados esperados
- ✅ **Build verde**: Todos los checks de accesibilidad pasan
- ❌ **Build rojo**: Hay violaciones que deben corregirse
- 📊 **Artifacts**: Reportes de cobertura disponibles

---

## Referencias Útiles

### Herramientas
- **axe DevTools**: Extensión de Chrome
- **Lighthouse**: Integrado en Chrome DevTools
- **WAVE**: https://wave.webaim.org/
- **Colour Contrast Analyser**: Extensión de Chrome

### Documentación
- **WCAG 2.2**: https://www.w3.org/WAI/WCAG21/quickref/
- **axe Documentation**: https://www.deque.com/axe/
- **pa11y-ci**: https://github.com/pa11y/pa11y-ci

### Checklists
- **A11y Project Checklist**: https://www.a11yproject.com/
- **WebAIM Checklist**: https://webaim.org/techniques/
