// ============================================================================
// Registro de publicaciones en Supabase (tabla publicaciones_log).
// Cada intento de publicar deja un rastro (éxito o error) que después se
// consulta desde el panel /admin.
// ============================================================================

import { supabaseInsert } from "@/lib/supabase";

/** Estructura de una entrada del log; refleja las columnas de la tabla. */
type PublishLog = {
  status: "success" | "error";
  title?: string;
  wp_url?: string;
  error_message?: string;
  error_step?: "media" | "tags" | "publicar";
};

/**
 * Guarda el resultado de una publicación en Supabase (tabla publicaciones_log).
 * Nunca lanza: si Supabase no está configurado o falla, solo lo reporta en consola
 * para no bloquear el flujo de publicación.
 */
export async function logPublicacion(entry: PublishLog): Promise<void> {
  try {
    const result = await supabaseInsert("publicaciones_log", entry);
    if (!result.ok) {
      console.warn("No se pudo guardar el log en Supabase:", result.error);
    }
  } catch (error) {
    console.warn("Error al guardar log en Supabase:", error);
  }
}
