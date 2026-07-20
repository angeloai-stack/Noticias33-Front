// ============================================================================
// GET /api/categorias
// Devuelve las categorías de WordPress en formato { id, name } para llenar
// el selector del formulario de publicación (/publicar).
// ============================================================================

import { NextResponse } from "next/server";
import { wpApiUrl } from "@/lib/api/wp-admin";

type WpCategory = {
  id: number;
  name: string;
  slug: string;
};

export async function GET() {
  try {
    // Endpoint público de WordPress; se cachea 5 minutos
    const response = await fetch(
      `${wpApiUrl("categories")}?per_page=100&hide_empty=false`,
      { next: { revalidate: 300 } },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `WordPress respondió ${response.status}` },
        { status: 502 },
      );
    }

    const categories = (await response.json()) as WpCategory[];
    // "uncategorized" es la categoría por defecto de WordPress; no se ofrece
    const result = categories
      .filter((category) => category.slug !== "uncategorized")
      .map((category) => ({ id: category.id, name: category.name }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
