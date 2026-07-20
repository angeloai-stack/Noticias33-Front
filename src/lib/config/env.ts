// ============================================================================
// Variables de entorno públicas (NEXT_PUBLIC_*) con valores por defecto.
// Las variables privadas del servidor (WP_USER, SUPABASE_*, etc.) se leen
// directamente en wp-admin.ts y supabase.ts para no exponerlas al cliente.
// ============================================================================

/** Lanza un error claro si la variable obligatoria no está definida. */
function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`La variable de entorno ${name} no está definida.`);
  }
  return value;
}

export const env = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ?? "https://noticias33.com/wp-json/wp/v2",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  get apiUrlRequired() {
    return requireEnv("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
  },
} as const;
