/**
 * @author  Jose Alfredo Romero Gonzalez
 * @title   Full Stack Developer
 * @project Task Manager Pro
 * @year    2026
 */

/**
 * Estructura estándar de respuestas para toda la API.
 */
interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]> | null;
}

/**
 * Genera una respuestas de éxito estandarizada
 * @param message - Mensaje deescriptivo de la operación
 * @param data    - Datos a regresar (opcional)
 */
export const success = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

/**
 * Genera una respuesta de error estandarizada.
 * @param message - Mensaje descriptivo del error
 * @param errors  - Errores de validación por campo (opcional)
 */
export const error = (
  message: string,
  errors?: Record<string, string[]> | null,
) => ({
  success: false,
  message,
  errors: errors ?? null,
});
