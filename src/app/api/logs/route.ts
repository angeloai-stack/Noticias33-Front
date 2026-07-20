// ============================================================================
// GET /api/logs?status=&from=&to=
// Lee el historial de publicaciones desde Supabase para el panel /admin.
// Filtros opcionales: status (success|error) y rango de fechas (YYYY-MM-DD).
// ============================================================================

import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase";

/** Fila de la tabla publicaciones_log tal como la devuelve Supabase. */
export type LogEntry = {
  id: string;
  created_at: string;
  status: "success" | "error";
  title: string | null;
  wp_url: string | null;
  error_message: string | null;
  error_step: string | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Query en sintaxis PostgREST: más recientes primero, máximo 500 filas
  const params = new URLSearchParams();
  params.set("select", "*");
  params.set("order", "created_at.desc");
  params.set("limit", "500");

  if (status === "success" || status === "error") {
    params.set("status", `eq.${status}`);
  }
  if (from) {
    params.append("created_at", `gte.${from}`);
  }
  if (to) {
    // Incluir el día completo de la fecha "hasta"
    params.append("created_at", `lte.${to}T23:59:59`);
  }

  const result = await supabaseSelect<LogEntry>(
    "publicaciones_log",
    params.toString(),
  );

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "No se pudieron leer los logs." },
      { status: 503 },
    );
  }

  return NextResponse.json(result.data);
}
