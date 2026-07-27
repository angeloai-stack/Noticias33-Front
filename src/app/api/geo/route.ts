// ============================================================================
// GET /api/geo
// Devuelve la ciudad cubierta más cercana según la geolocalización por IP que
// Vercel agrega a cada petición (headers x-vercel-ip-latitude/longitude).
// Solo funciona en producción/preview de Vercel; en local o fuera de Vercel
// no hay esos headers y se responde slug: null (el front cae a su default).
// ============================================================================

import { NextResponse } from "next/server";
import { getNearestCitySlug } from "@/lib/api/weather";

// Depende de headers por visitante: nunca debe cachearse.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const latHeader = request.headers.get("x-vercel-ip-latitude");
  const lonHeader = request.headers.get("x-vercel-ip-longitude");

  // Sin headers (fuera de Vercel, o local) no hay geolocalización: null.
  if (!latHeader || !lonHeader) {
    return NextResponse.json({ slug: null });
  }

  const lat = Number(latHeader);
  const lon = Number(lonHeader);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ slug: null });
  }

  return NextResponse.json({ slug: getNearestCitySlug(lat, lon) });
}
