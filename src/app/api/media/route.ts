// ============================================================================
// POST /api/media
// Recibe una imagen (FormData, campo "file") y la sube a la biblioteca de
// medios de WordPress. Devuelve { id, url }; el id se usa después como
// imagen destacada (featured_media) al crear la nota.
// ============================================================================

import { NextResponse } from "next/server";
import { wpAuthedFetch } from "@/lib/api/wp-admin";
import { logPublicacion } from "@/lib/log";

type WpMedia = {
  id: number;
  source_url: string;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Falta el archivo de imagen (campo 'file')." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Se sanea el nombre para evitar caracteres problemáticos en la cabecera
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-") || "imagen.jpg";

    // WordPress espera el binario crudo con el nombre en Content-Disposition
    const response = await wpAuthedFetch("media", {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeName}"`,
      },
      body: buffer,
    });

    if (!response.ok) {
      const detail = await response.text();
      await logPublicacion({
        status: "error",
        error_step: "media",
        error_message: `WordPress ${response.status}: ${detail.slice(0, 400)}`,
      });
      return NextResponse.json(
        { error: `No se pudo subir la imagen (WordPress ${response.status}).` },
        { status: 502 },
      );
    }

    const media = (await response.json()) as WpMedia;
    return NextResponse.json({ id: media.id, url: media.source_url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    await logPublicacion({
      status: "error",
      error_step: "media",
      error_message: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
