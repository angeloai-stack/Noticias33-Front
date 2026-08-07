"use client";

// ============================================================================
// Modal promocional "Anúnciate con nosotros". Se muestra una vez por sesión
// de navegación (sessionStorage) poco después de cargar el sitio, y se cierra
// con el botón ×, la tecla Escape o un clic fuera de la tarjeta.
// ============================================================================

import { useEffect, useState } from "react";
import { ADVERTISING_WHATSAPP } from "@/lib/config/ads";

const SESSION_KEY = "n33-ad-modal-shown";

export function AdModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(SESSION_KEY, "1");
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-modal-title"
      className="animate-fade-up fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="animate-menu-down relative flex w-full max-w-175 flex-col overflow-hidden rounded-2xl bg-n33-surface shadow-2xl md:min-h-125"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-xl leading-none text-n33-foreground shadow-md transition-transform duration-200 hover:scale-110 hover:text-n33-primary"
        >
          ×
        </button>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-10 text-center sm:px-10">
          <p className="font-helvetica text-2xl font-black italic leading-none">
            <span className="text-n33-blue">N</span>
            <span className="text-n33-primary">33</span>
          </p>

          {/* Mini mockup de los espacios publicitarios disponibles en el sitio */}
          <div className="w-full max-w-105 overflow-hidden rounded-xl border border-n33-border bg-white shadow-inner">
            <div className="flex items-center gap-1.5 bg-n33-background px-3 py-2">
              <span className="size-2 rounded-full bg-n33-primary" />
              <span className="size-2 rounded-full bg-n33-tag" />
              <span className="size-2 rounded-full bg-n33-blue" />
            </div>
            <div className="flex flex-col gap-2 p-3">
              <div className="rounded-md bg-n33-primary py-3 text-center text-[10px] font-bold text-white">
                Banner Hero
              </div>
              <div className="flex gap-2">
                <div className="flex w-10 items-center justify-center rounded-md bg-n33-background text-center text-[8px] font-semibold text-n33-muted [writing-mode:vertical-rl]">
                  Side ad
                </div>
                <div className="min-h-16 flex-1 rounded-md bg-n33-ad" />
                <div className="flex w-14 items-center justify-center rounded-md bg-[#0b1220] text-center text-[8px] font-semibold text-white">
                  Square
                </div>
              </div>
              <div className="rounded-md bg-n33-blue py-4 text-center text-[10px] font-bold text-white">
                Banner XL
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2
              id="ad-modal-title"
              className="font-helvetica text-2xl font-bold text-n33-blue"
            >
              Anúnciate con nosotros
            </h2>
            <p className="max-w-105 text-sm text-n33-muted">
              Llega a miles de lectores en Tijuana y Baja California. Conoce
              los espacios publicitarios disponibles en nuestra página web.
            </p>
          </div>

          <a
            href={ADVERTISING_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="rounded-full bg-n33-primary px-8 py-3 font-helvetica text-sm font-bold uppercase tracking-wide text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-primary-dark hover:shadow-lg"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>
  );
}
