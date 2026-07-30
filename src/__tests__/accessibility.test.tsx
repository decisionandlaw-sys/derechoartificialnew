/**
 * Template de Tests de Accesibilidad con jest-axe y React Testing Library
 * 
 * Este archivo sirve como ejemplo y template para crear tests de accesibilidad
 * en todos los componentes del proyecto Derecho Artificial.
 * 
 * ¿Cómo usar este template?
 * 1. Copia y renombra este archivo para tu componente: [nombre-componente].accessibility.test.tsx
 * 2. Importa tu componente específico en lugar del componente de ejemplo
 * 3. Adapta el renderizado según las props de tu componente
 * 4. Añade casos de prueba específicos para los diferentes estados de tu componente
 * 5. Ejecuta: npm test o npm test -- [nombre-componente]
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extender los matchers de Jest para incluir los de axe
expect.extend(toHaveNoViolations);

// Componente de ejemplo - Reemplazar con tu componente real
const ExampleAccessibleComponent = () => (
  <main>
    <header>
      <h1>Título Principal</h1>
      <nav aria-label="Navegación principal">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/about">Acerca de</a></li>
        </ul>
      </nav>
    </header>
    
    <section>
      <h2>Contenido Principal</h2>
      <form>
        <label htmlFor="email-input">
          Correo electrónico:
          <input
            id="email-input"
            type="email"
            required
            aria-describedby="email-help"
          />
        </label>
        <div id="email-help">
          Ingresa tu correo electrónico para recibir notificaciones
        </div>
        
        <button type="submit" aria-label="Enviar formulario">
          Enviar
        </button>
      </form>
    </section>
  </main>
);

describe('Tests de Accesibilidad - Template', () => {
  /**
   * Test básico de accesibilidad con axe
   * 
   * Este test verifica que el componente no tenga violaciones de accesibilidad
   * según las WCAG 2.1 Level AA.
   * 
   * axe.run() devuelve un objeto con:
   * - violations: Array de violaciones encontradas
   * - passes: Array de reglas que pasaron
   * - incomplete: Array de reglas que no pudieron ser evaluadas
   */
  test('el componente no debe tener violaciones de accesibilidad', async () => {
    // Renderizar el componente
    const { container } = render(<ExampleAccessibleComponent />);
    
    // Ejecutar axe sobre el contenedor renderizado
    const results = await axe(container);
    
    // Verificar que no haya violaciones
    expect(results).toHaveNoViolations();
  });

  /**
   * Test de componente en diferentes estados
   * 
   * Es importante testear todos los estados posibles del componente:
   * - Estado inicial/carga
   * - Estado con datos
   * - Estado de error
   * - Estado vacío
   */
  test('el formulario debe ser accesible en diferentes estados', async () => {
    // Test con formulario vacío
    const { container: emptyContainer } = render(<ExampleAccessibleComponent />);
    expect(await axe(emptyContainer)).toHaveNoViolations();

    // Test con formulario con datos (simular usuario que llena campos)
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    await userEvent.type(emailInput, 'test@example.com');
    
    const { container: filledContainer } = screen.getByRole('main');
    expect(await axe(filledContainer)).toHaveNoViolations();
  });

  /**
   * Test de interactividad y navegación por teclado
   * 
   * Verifica que los elementos interactivos sean accesibles por teclado
   * y tengan los atributos ARIA apropiados
   */
  test('los elementos interactivos deben ser accesibles por teclado', async () => {
    render(<ExampleAccessibleComponent />);
    
    // Verificar que los enlaces tengan texto descriptivo
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.textContent?.trim()).toBeTruthy();
    });

    // Verificar que el botón sea accesible
    const button = screen.getByRole('button', { name: /enviar/i });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label');
  });

  /**
   * Test de estructura semántica y headers
   * 
   * Verifica que la estructura del documento sea semánticamente correcta
   * y siga una jerarquía lógica de encabezados
   */
  test('debe tener estructura semántica correcta', async () => {
    const { container } = render(<ExampleAccessibleComponent />);
    const results = await axe(container);
    
    // Verificar que no haya violaciones específicas de estructura
    const headingViolations = results.violations.filter(
      violation => violation.id === 'heading-order'
    );
    
    expect(headingViolations).toHaveLength(0);
  });

  /**
   * Test de contraste de colores (si aplica)
   * 
   * axe automáticamente verifica el contraste de colores
   * pero puedes añadir tests específicos si tu componente
   * tiene colores personalizados
   */
  test('debe cumplir con ratios de contraste', async () => {
    const { container } = render(<ExampleAccessibleComponent />);
    const results = await axe(container);
    
    // Filtrar violaciones de contraste
    const contrastViolations = results.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toHaveLength(0);
  });
});

/**
 * Guía para añadir más tests de accesibilidad:
 * 
 * 1. TESTS BÁSICOS (obligatorios para todos los componentes):
 *    - Verificar que no haya violaciones con axe.run()
 *    - Testear todos los estados del componente
 *    - Verificar elementos interactivos
 * 
 * 2. TESTS ESPECÍFICOS (según el componente):
 *    - Formularios: labels asociadas, errores, validación
 *    - Navegación: menús accesibles, breadcrumbs
 *    - Tablas: captions, headers, scope
 *    - Imágenes: alt text descriptivo
 *    - Modales: focus trapping, close button
 *    - Tooltips: asociados a trigger, accesibles por teclado
 * 
 * 3. CONSIDERACIONES ESPECIALES:
 *    - Componentes con contenido dinámico: live regions
 *    - Componentes con temporizadores: controles de pausa
 *    - Componentes con audio/video: controles y transcripciones
 *    - Componentes con gráficos: descripciones alternativas
 * 
 * 4. BUENAS PRÁCTICAS:
 *    - Usa userEvent en lugar de fireEvent para interacciones más realistas
 *    - Testea con diferentes tamaños de pantalla si aplica
 *    - Verifica focus management en componentes complejos
 *    - Asegura que los errores sean comunicados a screen readers
 * 
 * 5. EJECUCIÓN:
 *    - Individual: npm test -- [nombre-archivo]
 *    - Todos: npm test
 *    - Cobertura: npm test -- --coverage
 *    - Watch mode: npm test -- --watch
 */

// Importar userEvent para interacciones más realistas
import userEvent from '@testing-library/user-event';
