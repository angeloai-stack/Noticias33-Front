// ============================================================================
// Utilidades de servidor para operaciones autenticadas contra WordPress
// (subir imágenes, crear tags, publicar notas). Requiere WP_URL, WP_USER y
// WP_APP_PASSWORD. Este módulo solo se importa desde API routes, por lo que
// las credenciales nunca llegan al navegador.
// ============================================================================

const WP_URL = process.env.WP_URL ?? "https://noticias33.com";

/** Construye la URL absoluta de un endpoint de la API de WordPress. */
export function wpApiUrl(path: string): string {
  return `${WP_URL.replace(/\/$/, "")}/wp-json/wp/v2/${path.replace(/^\//, "")}`;
}

/**
 * Cabecera de autenticación HTTP Basic con el Application Password de
 * WordPress (usuario:contraseña en base64).
 */
export function wpAuthHeader(): string {
  const user = process.env.WP_USER;
  const password = process.env.WP_APP_PASSWORD;

  if (!user || !password) {
    throw new Error(
      "Faltan las variables WP_USER y/o WP_APP_PASSWORD en el entorno.",
    );
  }

  return `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;
}

/**
 * fetch autenticado contra WordPress. Nunca se cachea porque son
 * operaciones de escritura o lecturas que deben ser siempre frescas.
 */
export async function wpAuthedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(wpApiUrl(path), {
    ...init,
    headers: {
      Authorization: wpAuthHeader(),
      ...init.headers,
    },
    cache: "no-store",
  });
}
