// ============================================================================
// Cliente mínimo de Supabase vía su API REST (PostgREST), sin dependencias
// externas. Se usa para dos cosas: el log de publicaciones (/admin) y los
// suscriptores del newsletter. Requiere SUPABASE_URL y SUPABASE_SERVICE_KEY,
// que solo existen en el servidor (nunca se exponen al navegador).
// ============================================================================

type SupabaseConfig = {
  url: string;
  key: string;
};

/**
 * Lee la configuración del entorno. Devuelve null si Supabase no está
 * configurado, lo que permite que el resto del sitio funcione igual
 * (el newsletter y el admin responden "servicio no disponible").
 */
export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), key };
}

/** Cabeceras que exige PostgREST: apikey + Bearer con la service key. */
function headers(config: SupabaseConfig): HeadersInit {
  return {
    apikey: config.key,
    Authorization: `Bearer ${config.key}`,
    "Content-Type": "application/json",
  };
}

/**
 * Inserta una fila en la tabla indicada.
 * Devuelve el status HTTP para que el consumidor distinga casos como el
 * 409 (violación de índice único, ej. correo duplicado en suscriptores).
 */
export async function supabaseInsert(
  table: string,
  row: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; error?: string }> {
  const config = getSupabaseConfig();

  if (!config) {
    return { ok: false, status: 503, error: "Supabase no está configurado" };
  }

  const response = await fetch(`${config.url}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers(config), Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    const error = await response.text();
    return { ok: false, status: response.status, error };
  }

  return { ok: true, status: response.status };
}

/**
 * Consulta filas de una tabla. `query` es un query string con la sintaxis
 * de PostgREST, ej.: "select=*&order=created_at.desc&status=eq.error".
 */
export async function supabaseSelect<T>(
  table: string,
  query: string,
): Promise<{ ok: boolean; data: T[]; error?: string }> {
  const config = getSupabaseConfig();

  if (!config) {
    return { ok: false, data: [], error: "Supabase no está configurado" };
  }

  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    headers: headers(config),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.text();
    return { ok: false, data: [], error };
  }

  const data = (await response.json()) as T[];
  return { ok: true, data };
}
