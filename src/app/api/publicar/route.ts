// ============================================================================
// POST /api/publicar
// Paso final del flujo de publicación: crea el post en WordPress con estado
// "publish" y registra el resultado (éxito o error) en Supabase para que
// aparezca en el historial de /admin.
// ============================================================================

import { NextResponse } from "next/server";
import { wpAuthedFetch } from "@/lib/api/wp-admin";
import { logPublicacion } from "@/lib/log";

/** Cuerpo que envía el formulario de /publicar. */
type PublishBody = {
  title?: string;
  excerpt?: string;
  content?: string;
  categoryId?: number;
  tags?: number[];
  featuredMediaId?: number;
};

type WpPostResponse = {
  id: number;
  link: string;
};

export async function POST(request: Request) {
  // El título se guarda fuera del try para poder incluirlo en el log de error
  let title: string | undefined;

  try {
    const body = (await request.json()) as PublishBody;
    title = body.title?.trim();

    if (!title || !body.content?.trim() || !body.categoryId) {
      return NextResponse.json(
        { error: "Título, cuerpo y categoría son obligatorios." },
        { status: 400 },
      );
    }

    // Crea el post directamente publicado (sin pasar por borrador)
    const response = await wpAuthedFetch("posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt: body.excerpt ?? "",
        content: body.content,
        status: "publish",
        categories: [body.categoryId],
        tags: body.tags ?? [],
        ...(body.featuredMediaId
          ? { featured_media: body.featuredMediaId }
          : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      const message = `WordPress ${response.status}: ${detail.slice(0, 400)}`;
      await logPublicacion({
        status: "error",
        title,
        error_step: "publicar",
        error_message: message,
      });
      return NextResponse.json(
        { error: `No se pudo publicar la nota (WordPress ${response.status}).` },
        { status: 502 },
      );
    }

    const post = (await response.json()) as WpPostResponse;

    await logPublicacion({
      status: "success",
      title,
      wp_url: post.link,
    });

    return NextResponse.json({ url: post.link, id: post.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    await logPublicacion({
      status: "error",
      title,
      error_step: "publicar",
      error_message: message,
    });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
