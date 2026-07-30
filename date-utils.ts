/**
 * Utilidades para manejar fechas en el proyecto
 * Este archivo centraliza todo el manejo de fechas para evitar problemas de inconsistencia
 */

/**
 * Formatea una fecha ISO a formato legible en español
 * @param dateString - Fecha en formato ISO (YYYY-MM-DD) o Date object
 * @returns Fecha formateada como "7 de febrero de 2026"
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} de ${month} de ${year}`;
}

/**
 * Ordena un array de objetos por fecha de más reciente a más antigua
 * @param items - Array de objetos con propiedad 'date' o 'publishedDate'
 * @param dateKey - Nombre de la propiedad que contiene la fecha (default: 'date')
 * @returns Array ordenado de más reciente a más antigua
 */
export function sortByDateDescending<T extends Record<string, unknown>>(
  items: T[],
  dateKey: keyof T = 'date' as keyof T
): T[] {
  return [...items].sort((a, b) => {
    const valA = (a as Record<string, unknown>)[dateKey as string];
    const valB = (b as Record<string, unknown>)[dateKey as string];
    const dateA =
      typeof valA === 'string'
        ? new Date(valA).getTime()
        : valA instanceof Date
          ? valA.getTime()
          : 0;
    const dateB =
      typeof valB === 'string'
        ? new Date(valB).getTime()
        : valB instanceof Date
          ? valB.getTime()
          : 0;
    return dateB - dateA; // Orden descendente (más reciente primero)
  });
}

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD)
 * @param date - Date object o string
 * @returns Fecha en formato ISO
 */
export function toISODate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Verifica si una fecha es válida
 * @param dateString - String de fecha a validar
 * @returns true si la fecha es válida
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Obtiene la fecha actual en formato ISO
 * NOTA: Solo usar para timestamps reales, NO para fechas de publicación de contenido
 * @returns Fecha actual en formato ISO (YYYY-MM-DD)
 */
export function getCurrentDate(): string {
  return toISODate(new Date());
}
