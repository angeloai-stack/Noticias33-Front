// ============================================================================
// POST /api/revalidate
// Webhook para que WordPress avise al front cuando se publica o edita una
// noticia directamente desde wp-admin (fuera del flujo de /publicar de esta
// app). Invalida el caché de portada, categorías y noticias.
// Protegido con REVALIDATE_SECRET (?secret=... o header Authorization: Bearer).
// ============================================================================

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function isAuthorized(request: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;

  const { searchParams } = new URL(request.url);
  const provided =
    searchParams.get("secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return provided === secret;
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // `{ expire: 0 }` fuerza expiración inmediata (recomendado para webhooks).
  revalidateTag("posts", { expire: 0 });
  revalidatePath("/");

  return NextResponse.json({ revalidated: true, tag: "posts" });
}

export async function POST(request: Request) {
  return handle(request);
}

// Algunos plugins de webhooks de WordPress solo permiten peticiones GET.
export async function GET(request: Request) {
  return handle(request);
}
