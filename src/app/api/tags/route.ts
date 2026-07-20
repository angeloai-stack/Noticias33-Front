// ============================================================================
// GET /api/tags?name=<nombre>
// Resuelve el nombre de un tag a su ID de WordPress: si ya existe lo
// devuelve, y si no lo crea. El formulario de publicación llama a este
// endpoint una vez por cada tag antes de publicar la nota.
// ============================================================================

import { NextResponse } from "next/server";
import { wpAuthedFetch } from "@/lib/api/wp-admin";
import { logPublicacion } from "@/lib/log";

type WpTag = {
  id: number;
  name: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return NextResponse.json(
      { error: "Falta el parámetro 'name'." },
      { status: 400 },
    );
  }

  try {
    // Buscar el tag existente (coincidencia exacta, sin distinguir mayúsculas)
    const searchResponse = await wpAuthedFetch(
      `tags?search=${encodeURIComponent(name)}&per_page=100`,
    );

    if (!searchResponse.ok) {
      throw new Error(`WordPress respondió ${searchResponse.status}`);
    }

    const found = (await searchResponse.json()) as WpTag[];
    const match = found.find(
      (tag) => tag.name.toLowerCase() === name.toLowerCase(),
    );

    if (match) {
      return NextResponse.json({ id: match.id });
    }

    // Crear el tag si no existe
    const createResponse = await wpAuthedFetch("tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!createResponse.ok) {
      const detail = await createResponse.text();
      throw new Error(
        `No se pudo crear el tag (${createResponse.status}): ${detail.slice(0, 300)}`,
      );
    }

    const created = (await createResponse.json()) as WpTag;
    return NextResponse.json({ id: created.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    await logPublicacion({
      status: "error",
      error_step: "tags",
      error_message: message,
    });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
