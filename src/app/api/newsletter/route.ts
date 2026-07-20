// ============================================================================
// POST /api/newsletter
// Alta de suscriptores del newsletter: valida nombre y correo, y guarda la
// fila en la tabla `suscriptores` de Supabase. El índice único sobre el
// correo evita duplicados (Supabase responde 409 y se avisa al usuario).
// ============================================================================

import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

type NewsletterBody = {
  nombre?: string;
  correo?: string;
  telefono?: string;
};

/** Validación básica de formato de correo (algo@dominio.ext). */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NewsletterBody;
    const nombre = body.nombre?.trim();
    // El correo se normaliza a minúsculas para que el índice único funcione
    const correo = body.correo?.trim().toLowerCase();
    const telefono = body.telefono?.trim();

    if (!nombre || !correo) {
      return NextResponse.json(
        { error: "Nombre y correo son obligatorios." },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(correo)) {
      return NextResponse.json(
        { error: "El correo no tiene un formato válido." },
        { status: 400 },
      );
    }

    const result = await supabaseInsert("suscriptores", {
      nombre,
      correo,
      telefono: telefono || null,
    });

    if (!result.ok) {
      // 409 = correo duplicado (índice único en la tabla)
      if (result.status === 409) {
        return NextResponse.json(
          { error: "Este correo ya está suscrito al newsletter." },
          { status: 409 },
        );
      }

      if (result.status === 503) {
        return NextResponse.json(
          { error: "El servicio de suscripción no está disponible todavía." },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: "No se pudo guardar la suscripción. Intenta más tarde." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Solicitud inválida." },
      { status: 400 },
    );
  }
}
