// ============================================================================
// Cliente HTTP genérico para la API REST pública de WordPress (solo lectura).
// Centraliza la construcción de URLs, el manejo de errores y el caché de
// Next.js (revalidate) para que el resto del código solo pida datos.
// ============================================================================

import { env } from "@/lib/config/env";

/** Opciones estándar de fetch + parámetros de query string opcionales. */
type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
};

/**
 * Error tipado que conserva el código HTTP y el cuerpo de la respuesta.
 * Permite a los consumidores reaccionar según el status (ej. 400 en búsquedas).
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Construye la URL final: base de la API + ruta + parámetros de query. */
function buildUrl(path: string, params?: RequestOptions["params"]) {
  const base = env.apiUrl.endsWith("/") ? env.apiUrl : `${env.apiUrl}/`;
  const url = new URL(path.replace(/^\//, ""), base);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      // Se omiten los parámetros sin valor para no ensuciar la URL
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Ejecuta la petición y valida la respuesta.
 * Por defecto cachea 60 segundos (ISR de Next.js), salvo que el consumidor
 * pase su propia configuración en `next`.
 */
async function request(path: string, options: RequestOptions = {}) {
  const { params, headers, ...init } = options;
  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      Accept: "application/json",
      ...headers,
    },
    next: { revalidate: 60, ...init.next },
  });

  if (!response.ok) {
    // Se intenta leer el cuerpo del error para dar contexto en el ApiError
    let body: unknown;

    try {
      body = await response.json();
    } catch {
      body = undefined;
    }

    throw new ApiError(
      `Error en la API (${response.status})`,
      response.status,
      body,
    );
  }

  return response;
}

/** Petición GET tipada que devuelve directamente el JSON de la respuesta. */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await request(path, options);
  return response.json() as Promise<T>;
}

/**
 * Igual que apiFetch, pero expone los headers de paginación de WordPress
 * (X-WP-Total y X-WP-TotalPages).
 */
export async function apiFetchPaginated<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; total: number; totalPages: number }> {
  const response = await request(path, options);
  const data = (await response.json()) as T;

  return {
    data,
    total: Number(response.headers.get("X-WP-Total") ?? 0),
    totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 1),
  };
}

export { ApiError };
