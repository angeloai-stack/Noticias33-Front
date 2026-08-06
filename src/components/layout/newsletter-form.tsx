"use client";

// ============================================================================
// Formulario de suscripción al newsletter. Envía nombre, correo y teléfono
// a POST /api/newsletter (que guarda en Supabase) y muestra el estado:
// enviando, éxito (mensaje de confirmación) o error (correo duplicado,
// servicio no disponible, etc.).
// ============================================================================

import { useState } from "react";

/** Ciclo de vida del envío del formulario. */
type Status = "idle" | "sending" | "success" | "error";

export function NewsletterForm() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, telefono }),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(body.error ?? "No se pudo completar la suscripción.");
        return;
      }

      setStatus("success");
      setNombre("");
      setCorreo("");
      setTelefono("");
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo.");
    }
  };

  // Tras un envío exitoso se reemplaza el formulario por la confirmación
  if (status === "success") {
    return (
      <div
        role="status"
        className="animate-fade-up mt-9 flex w-full max-w-70 sm:max-w-87.25 flex-col items-center gap-3 rounded-xl bg-white/15 p-6 text-center backdrop-blur-sm"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-white text-2xl text-n33-primary">
          ✓
        </span>
        <p className="font-bold text-white">¡Suscripción registrada!</p>
        <p className="text-sm text-white/85">
          Pronto recibirás nuestras noticias en tu correo.
        </p>
      </div>
    );
  }

  // Estilo compartido por los tres campos del formulario. Alto de 44px
  // (en vez de 40px) para cumplir el tamaño mínimo de área táctil en móvil.
  const inputClass =
    "h-11 rounded-[3px] bg-white/90 px-[17px] text-[12px] font-light text-n33-foreground outline-none ring-n33-primary transition-all duration-300 placeholder:text-black/40 focus:bg-white focus:shadow-lg focus:ring-2";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 flex w-full max-w-70 sm:max-w-87.25 flex-col gap-3 sm:mt-9"
    >
      <label className="sr-only" htmlFor="newsletter-nombre">
        Nombre
      </label>
      <input
        id="newsletter-nombre"
        name="nombre"
        type="text"
        autoComplete="name"
        required
        value={nombre}
        onChange={(event) => setNombre(event.target.value)}
        placeholder="Nombre"
        className={inputClass}
      />
      <label className="sr-only" htmlFor="newsletter-correo">
        Correo
      </label>
      <input
        id="newsletter-correo"
        name="correo"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={correo}
        onChange={(event) => setCorreo(event.target.value)}
        placeholder="Correo"
        className={inputClass}
      />
      <label className="sr-only" htmlFor="newsletter-telefono">
        Teléfono
      </label>
      <input
        id="newsletter-telefono"
        name="telefono"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        value={telefono}
        onChange={(event) => setTelefono(event.target.value)}
        placeholder="Teléfono"
        className={inputClass}
      />

      {status === "error" && message && (
        <p
          role="alert"
          className="rounded-lg bg-white/90 px-3 py-2 text-center text-xs font-bold text-n33-primary-dark"
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mx-auto mt-4 h-11 w-full max-w-59.25 cursor-pointer rounded-[9px] bg-n33-primary text-[13px] font-bold uppercase text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-primary-dark hover:shadow-[0_14px_30px_-8px_rgba(243,61,91,0.6)] active:translate-y-0 active:scale-95 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {status === "sending" ? "Enviando..." : "Suscríbete al newsletter"}
      </button>
    </form>
  );
}
