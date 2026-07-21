"use client";

// ============================================================================
// Panel de administración (/admin): historial de publicaciones y errores.
// Lee los registros de GET /api/logs (tabla publicaciones_log de Supabase),
// con filtro por rango de fechas en el servidor y pestañas Publicaciones /
// Errores que se alternan en el cliente sin volver a pedir datos.
// ============================================================================

import { useCallback, useEffect, useState } from "react";

/** Fila de publicaciones_log tal como la devuelve /api/logs. */
type LogEntry = {
  id: string;
  created_at: string;
  status: "success" | "error";
  title: string | null;
  wp_url: string | null;
  error_message: string | null;
  error_step: string | null;
};

type Tab = "publicaciones" | "errores";

/** Fecha y hora legibles en español: "16 jul 2026, 3:30 p.m.". */
function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("publicaciones");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /** Pide los registros a /api/logs, opcionalmente acotados por fechas. */
  const loadLogs = useCallback(
    async (fromDate: string, toDate: string) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (fromDate) {
        params.set("from", fromDate);
      }
      if (toDate) {
        params.set("to", toDate);
      }

      try {
        const response = await fetch(`/api/logs?${params.toString()}`);
        if (!response.ok) {
          const body = (await response.json()) as { error?: string };
          throw new Error(body.error ?? `Error ${response.status}`);
        }
        setLogs((await response.json()) as LogEntry[]);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar los registros.",
        );
        setLogs([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Carga inicial sin filtros. Es una descarga de datos al montar (la puesta
  // en "cargando" es intencional), no un ciclo de renders en cascada.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLogs("", "");
  }, [loadLogs]);

  // La pestaña activa solo filtra en memoria lo ya descargado
  const visible = logs.filter((log) =>
    tab === "publicaciones" ? log.status === "success" : log.status === "error",
  );

  return (
    <div className="animate-fade-up mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        Administración
      </h1>
      <p className="mt-2 text-sm text-n33-muted">
        Historial de publicaciones y errores del sistema.
      </p>

      {/* Pestañas */}
      <div className="mt-8 flex gap-2">
        <button
          type="button"
          onClick={() => setTab("publicaciones")}
          className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
            tab === "publicaciones"
              ? "bg-n33-blue text-white shadow-md"
              : "bg-white text-n33-blue shadow-sm hover:shadow-md"
          }`}
        >
          Publicaciones
        </button>
        <button
          type="button"
          onClick={() => setTab("errores")}
          className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
            tab === "errores"
              ? "bg-n33-primary text-white shadow-md"
              : "bg-white text-n33-primary shadow-sm hover:shadow-md"
          }`}
        >
          Errores
        </button>
      </div>

      {/* Filtro por fechas */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          loadLogs(from, to);
        }}
        className="mt-6 flex flex-wrap items-end gap-3"
      >
        <div>
          <label
            htmlFor="filter-from"
            className="mb-1 block text-xs font-bold text-n33-muted"
          >
            Desde
          </label>
          <input
            id="filter-from"
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="h-[40px] rounded-lg border border-n33-border bg-white px-3 text-sm shadow-sm outline-none ring-n33-blue transition-all focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="filter-to"
            className="mb-1 block text-xs font-bold text-n33-muted"
          >
            Hasta
          </label>
          <input
            id="filter-to"
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="h-[40px] rounded-lg border border-n33-border bg-white px-3 text-sm shadow-sm outline-none ring-n33-blue transition-all focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="h-[40px] cursor-pointer rounded-lg bg-n33-blue px-5 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        >
          Filtrar
        </button>
        <button
          type="button"
          onClick={() => {
            setFrom("");
            setTo("");
            loadLogs("", "");
          }}
          className="h-[40px] cursor-pointer rounded-lg border border-n33-border bg-white px-5 text-sm font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        >
          Limpiar
        </button>
      </form>

      {/* Contenido */}
      <div className="mt-8">
        {loading && <p className="text-n33-muted">Cargando registros...</p>}

        {!loading && error && (
          <p className="rounded-xl bg-n33-primary/10 px-4 py-3 text-sm font-medium text-n33-primary-dark">
            {error}
          </p>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-n33-border bg-white p-8 text-center text-n33-muted">
            No hay registros para mostrar.
          </p>
        )}

        {!loading && !error && visible.length > 0 && (
          <ul className="flex flex-col gap-3">
            {visible.map((log) => (
              <li
                key={log.id}
                className="rounded-xl bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-n33-foreground">
                    {log.title || "(Sin título)"}
                  </p>
                  <time className="text-xs text-n33-muted">
                    {formatDateTime(log.created_at)}
                  </time>
                </div>

                {tab === "publicaciones" && log.wp_url && (
                  <a
                    href={log.wp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block break-all text-sm text-n33-blue underline-offset-2 transition-colors hover:text-n33-primary hover:underline"
                  >
                    {log.wp_url}
                  </a>
                )}

                {tab === "errores" && (
                  <div className="mt-2 flex flex-col gap-1">
                    {log.error_step && (
                      <span className="inline-flex w-fit rounded-full bg-n33-primary/10 px-3 py-0.5 text-xs font-bold uppercase text-n33-primary-dark">
                        Paso: {log.error_step}
                      </span>
                    )}
                    <p className="break-all text-sm text-n33-muted">
                      {log.error_message}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
