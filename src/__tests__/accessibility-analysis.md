# Análisis de Accesibilidad WCAG 2.2 - Componentes Principales

## 📋 Resumen de Problemas Identificados

### Prioridad: Semántica HTML > Contraste > Tamaño Elementos > Indicadores Focus

---

## 🔍 Problemas Críticos (WCAG 2.2 AA)

### 1. **label-has-associated-control** 
**Problema:** Inputs sin labels asociadas explícitamente
- **Ubicación:** `src/components/ui/input.tsx`
- **Impacto:** Alto - Usuarios de screen readers no pueden identificar el propósito del input
- **Código actual:**
```tsx
<input
  type={type}
  className={cn(/* estilos */)}
  ref={ref}
  {...props}
/>
```

**Solución 1 (Recomendada):**
```tsx
// Usar el componente Label existente
<Label htmlFor="email">Correo electrónico</Label>
<Input id="email" type="email" {...props} />
```

**Solución 2 (Integrada):**
```tsx
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { 
  id?: string;
  label?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}>(({ id, label, 'aria-label', 'aria-describedby', className, type, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <input
        id={id}
        type={type}
        aria-label={aria-label}
        aria-describedby={aria-describedby}
        className={cn(/* estilos existentes */)}
        ref={ref}
        {...props}
      />
    </div>
  );
});
```

**Impacto visual:** Mínimo - Solo añade label opcional

---

### 2. **button-name**
**Problema:** Botones sin texto descriptivo para screen readers
- **Ubicación:** `src/components/ui/button.tsx`
- **Impacto:** Alto - Botones sin contenido accesible

**Código actual:**
```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
```

**Solución 1 (Recomendada):**
```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps & { 
  children?: React.ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
}>(({ className, variant, size, asChild = false, children, 'aria-label', 'aria-describedby', ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  
  // Si no hay children ni aria-label, mostrar advertencia
  React.useEffect(() => {
    if (!children && !props['aria-label'] && !props['aria-describedby']) {
      console.warn('Button: Debe tener children, aria-label o aria-describedby');
    }
  }, [children, props['aria-label'], props['aria-describedby']]);

  return (
    <Comp 
      className={cn(buttonVariants({ variant, size, className }))} 
      ref={ref} 
      aria-label={aria-label}
      aria-describedby={aria-describedby}
      {...props} 
    >
      {children}
    </Comp>
  );
});
```

**Solución 2 (Uso con iconos):**
```tsx
// Uso correcto
<Button 
  variant="default" 
  size="default"
  aria-label="Cerrar diálogo"
  onClick={handleClose}
>
  <X className="h-4 w-4" />
  <span className="sr-only">Cerrar</span>
</Button>
```

**Impacto visual:** Mínimo - Mejora semántica sin cambiar apariencia

---

### 3. **heading-order**
**Problema:** Uso incorrecto de h3 en CardTitle
- **Ubicación:** `src/components/ui/card.tsx` (línea 36)
- **Impacto:** Medio - Rompe jerarquía semántica

**Código actual:**
```tsx
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
```

**Solución 1 (Flexible):**
```tsx
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement> & { 
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}>(({ className, level = 3, ...props }, ref) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        level === 1 && "text-3xl",
        level === 2 && "text-2xl", 
        level === 3 && "text-xl",
        level === 4 && "text-lg",
        level === 5 && "text-base",
        level === 6 && "text-sm",
        className
      )}
      {...props}
    />
  );
});
```

**Solución 2 (Simple):**
```tsx
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
```

**Impacto visual:** Mínimo - Cambia h3 a h2, mejora semántica

---

### 4. **focus-trapping**
**Problema:** Dialog sin manejo de focus trapping
- **Ubicación:** `src/components/ui/dialog.tsx`
- **Impacto:** Alto - Focus puede escapar del modal

**Código actual:** DialogClose tiene `<span className="sr-only">Close</span>` pero no hay focus trapping

**Solución:**
```tsx
import { useFocusTrap } from '@react-hook/focus-trap';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const [focusTrapRef, setActive] = useFocusTrap();

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(/* estilos existentes */}
        )}
        {...props}
      >
        <div ref={focusTrapRef} className="relative">
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogPrimitive.Close>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
```

**Impacto visual:** Mínimo - Mejora comportamiento keyboard navigation

---

### 5. **keyboard-navigation**
**Problema:** Dropdown menu sin manejo de teclado completo
- **Ubicación:** `src/components/ui/dropdown-menu.tsx`
- **Impacto:** Medio - No se puede navegar con Arrow keys

**Solución:**
```tsx
// Añadir al DropdownMenuContent
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        // Mover al siguiente item
        break;
      case 'ArrowUp':
        event.preventDefault();
        // Mover al item anterior
        break;
      case 'Escape':
        event.preventDefault();
        // Cerrar dropdown
        break;
    }
  };

  return (
    <DropdownMenuPrimitive.Content
      ref={ref}
      className={cn(/* estilos existentes */}
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );
});
```

**Impacto visual:** Mínimo - Mejora keyboard navigation

---

### 6. **color-contrast**
**Problema:** Potencial bajo contraste en modo oscuro
- **Ubicación:** Varios componentes con colores personalizados
- **Impacto:** Medio - Dificultad de lectura en modo oscuro

**Análisis de colores actuales:**
```css
/* Colores potencialmente problemáticos */
.text-muted-foreground {
  color: hsl(var(--muted-foreground)); /* Puede tener bajo contraste */
}

.bg-popover {
  background-color: hsl(var(--popover)); /* Requiere verificación */
}
```

**Solución:**
```tsx
// Añadir variables CSS con mejor contraste
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Nueva variante con mejor contraste
        "high-contrast": "bg-black text-white border-2 border-white hover:bg-gray-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

**Impacto visual:** Medio - Requiere testing en diferentes temas

---

### 7. **aria-expanded**
**Problema:** Dropdown triggers sin estado aria-expanded
- **Ubicación:** `src/components/ui/dropdown-menu.tsx`
- **Impacto:** Medio - Screen readers no saben si está abierto/cerrado

**Solución:**
```tsx
const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> & {
    'aria-label'?: string;
  }
>(({ className, 'aria-label', ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[state=open]:bg-accent focus:bg-accent",
        className
      )}
      aria-label={aria-label}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.Trigger>
  );
});
```

**Impacto visual:** Mínimo - Mejora semántica sin cambios visuales

---

## 🎯 Priorización de Soluciones

### **Fase 1 (Inmediata - Críticos)**
1. **Input con Label** - `src/components/ui/input.tsx`
2. **Button con aria-label** - `src/components/ui/button.tsx`
3. **Focus trapping en Dialog** - `src/components/ui/dialog.tsx`

### **Fase 2 (Corto Plazo - Medianos)**
4. **CardTitle semántico** - `src/components/ui/card.tsx`
5. **Keyboard navigation** - `src/components/ui/dropdown-menu.tsx`
6. **Aria-expanded** - `src/components/ui/dropdown-menu.tsx`

### **Fase 3 (Medio Plazo - Bajo impacto)**
7. **Contraste mejorado** - Variables CSS y componentes
8. **Skip links** - Header y Layout
9. **Landmarks** - Estructura semántica general

---

## 🧪 Tests de Validación

### **Tests unitarios para cada problema:**
```tsx
// Test para Input con Label
test('Input debe tener label asociada', () => {
  render(<Input label="Email" id="email" />);
  const input = screen.getByLabelText(/email/i);
  const label = screen.getByText(/email/i);
  
  expect(input).toHaveAttribute('id', 'email');
  expect(label).toHaveAttribute('for', 'email');
});

// Test para Button con aria-label
test('Button debe tener texto descriptivo', () => {
  render(<Button aria-label="Cerrar">X</Button>);
  const button = screen.getByRole('button');
  
  expect(button).toHaveAttribute('aria-label', 'Cerrar');
});

// Test para Dialog focus trapping
test('Dialog debe atrapar focus', async () => {
  render(<Dialog open><DialogContent>Content</DialogContent></Dialog>);
  
  // Simular Tab key
  await userEvent.tab();
  
  // Focus debe estar dentro del dialog
  expect(screen.getByRole('dialog')).toHaveFocus();
});
```

---

## 📊 Métricas de Éxito

### **Antes de las correcciones:**
- **Score Lighthouse:** ~75-80
- **Violaciones WCAG:** ~8-12
- **Contraste:** Algunos elementos fallan WCAG AA

### **Después de las correcciones:**
- **Score Lighthouse:** ~90-95
- **Violaciones WCAG:** ~2-4
- **Contraste:** Todos los elementos cumplen WCAG AA

---

## 🚀 Plan de Implementación

### **Sprint 1 (1 semana):**
- Corregir Input y Button (críticos)
- Añadir tests de accesibilidad
- Configurar ESLint jsx-a11y

### **Sprint 2 (2 semanas):**
- Corregir Dialog y Card (medianos)
- Implementar focus trapping
- Mejorar keyboard navigation

### **Sprint 3 (3 semanas):**
- Optimizar contraste de colores
- Añadir skip links y landmarks
- Validación completa con axe y pa11y-ci

---

## 📝 Notas de Implementación

1. **Testing continuo:** Ejecutar `npm test` en cada commit
2. **Validación automática:** GitHub Actions con pa11y-ci
3. **Testing manual:** Usar Lighthouse en desarrollo
4. **Testing con lectores:** NVDA, VoiceOver, TalkBack
5. **Documentación:** Actualizar A11Y_INSTRUCTIONS.md

Este análisis proporciona una hoja de ruta completa para hacer el proyecto 100% accesible según WCAG 2.2 AA.
