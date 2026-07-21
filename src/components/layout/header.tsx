"use client";

// ============================================================================
// Cabecera del sitio. Consta de tres franjas:
//   1. Barra superior con la fecha y la marquesina "Información al momento".
//   2. Barra azul fija (sticky) con el logo, el buscador y la hamburguesa.
//   3. Menú de categorías: mega-menú desplegable en escritorio y acordeón
//      en móvil. Ambos se alimentan de mainNav (src/lib/config/site.ts).
// Es componente de cliente porque maneja estado (menús abiertos/cerrados).
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mainNav } from "@/lib/config/site";

/** Fecha de hoy en formato editorial: "Martes 23 de junio del 2026". */
function formatToday() {
  const formatted = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  // "martes, 23 de junio de 2026" → "Martes 23 de junio del 2026"
  const cleaned = formatted.replace(",", "").replace(" de 2", " del 2");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

type ToggleCircleProps = {
  expanded: boolean;
};

/** Botón circular del menú: azul con "+" (plegado) o rojo con "×" (desplegado). */
function ToggleCircle({ expanded }: ToggleCircleProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-[20px] shrink-0 items-center justify-center rounded-full text-[15px] font-bold leading-none text-white transition-all duration-300 ${
        expanded ? "rotate-[135deg] bg-n33-primary" : "rotate-0 bg-n33-tag"
      }`}
    >
      +
    </span>
  );
}

/**
 * Formulario de búsqueda que envía a /buscar?q=...
 * Recibe un id único porque se renderiza dos veces (escritorio y móvil).
 */
function SearchForm({ id, className }: { id: string; className?: string }) {
  return (
    <form action="/buscar" className={className}>
      <label htmlFor={id} className="sr-only">
        Buscar
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Busca por país, estado, ciudad, categoría o clima"
        className="h-[40px] w-full rounded-[13px] bg-white/95 px-[19px] text-[15px] font-light text-n33-foreground shadow-inner outline-none ring-n33-tag transition-all duration-300 placeholder:text-black/50 focus:bg-white focus:shadow-lg focus:ring-2"
      />
    </form>
  );
}

type HeaderProps = {
  /** Titular más reciente para la marquesina; null oculta el ticker. */
  headline: string | null;
};

export function Header({ headline }: HeaderProps) {
  // Mega-menú de escritorio (Figma: "Menú plegado" / "desplegado")
  const [expanded, setExpanded] = useState(false);
  // Menú móvil tipo acordeón
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <>
      {/* Barra superior: fecha + información al momento */}
      <div className="flex flex-col gap-1 bg-n33-background px-4 py-2.5 sm:flex-row sm:items-center sm:gap-8 sm:px-6 sm:py-3 lg:px-12">
        <p className="shrink-0 font-helvetica text-[13px] italic text-[#353535] sm:text-[16px]">
          {formatToday()}
        </p>
        {headline && (
          <div className="flex min-w-0 flex-1 items-center gap-2 text-[13px] text-[#353535] sm:gap-3 sm:text-[16px]">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-n33-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-n33-primary" />
            </span>
            <span className="shrink-0 font-bold">Información al momento:</span>
            <div className="ticker-mask min-w-0 flex-1 overflow-hidden">
              <div className="ticker-track flex w-max gap-24">
                <span className="whitespace-nowrap">{headline}</span>
                <span aria-hidden="true" className="whitespace-nowrap">
                  {headline}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cabecera fija: barra azul + menú */}
      <header className="sticky top-0 z-50">
        <div className="bg-n33-blue/95 shadow-lg backdrop-blur-md">
          <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 sm:px-6 lg:gap-8 lg:px-12">
            <Link
              href="/"
              className="flex shrink-0 flex-col items-center gap-1 transition-transform duration-300 hover:scale-[1.03]"
            >
              <Image
                src="/design/logo-n33-header.svg"
                alt="N33 Noticias 33"
                width={366}
                height={44}
                priority
                className="h-[30px] w-auto drop-shadow-md sm:h-[38px] lg:h-[44px]"
              />
              <span className="hidden text-center text-[16px] font-bold text-white sm:block">
                Noticias de México y el mundo
              </span>
            </Link>

            <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-4 lg:gap-6">
              <span className="hidden shrink-0 font-helvetica text-[20px] font-medium text-white xl:inline">
                Nacional
              </span>

              <SearchForm
                id="header-search"
                className="hidden min-w-0 max-w-[631px] flex-1 md:block"
              />

              {/* Botón hamburguesa (móvil) */}
              <button
                type="button"
                aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
                className="shrink-0 cursor-pointer p-1 transition-transform duration-200 active:scale-90 lg:hidden"
              >
                {mobileOpen ? (
                  <span className="block text-[28px] leading-[25px] text-white">
                    ×
                  </span>
                ) : (
                  <Image
                    src="/design/menu-icon.svg"
                    alt=""
                    width={38}
                    height={25}
                    className="h-[21px] w-[32px] sm:h-[25px] sm:w-[38px]"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Buscador en fila propia (móvil) */}
          <div className="px-4 pb-4 md:hidden">
            <SearchForm id="header-search-mobile" />
          </div>
        </div>

        {/* Menú de categorías — escritorio (mega-menú plegado/desplegado) */}
        <nav
          aria-label="Categorías"
          className="relative hidden bg-white/90 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.18)] backdrop-blur-md lg:block"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="flex h-[57px] items-center gap-6">
              <button
                type="button"
                aria-label={expanded ? "Plegar menú" : "Desplegar menú"}
                aria-expanded={expanded}
                onClick={() => setExpanded((open) => !open)}
                className="cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-90"
              >
                <ToggleCircle expanded={expanded} />
              </button>

              <ul className="grid flex-1 grid-cols-10 items-center gap-x-6 whitespace-nowrap">
                {mainNav.map((item) => (
                  <li key={item.label} className="min-w-0">
                    <Link
                      href={item.href}
                      className="relative inline-block font-helvetica text-[21.77px] font-bold text-n33-blue transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-[2.5px] after:w-full after:origin-left after:scale-x-0 after:bg-n33-primary after:transition-transform after:duration-300 hover:text-n33-primary hover:after:scale-x-100"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Panel desplegado: columnas de subcategorías */}
          {expanded && (
            <div className="animate-menu-down absolute inset-x-0 top-full bg-white/95 shadow-[0px_18px_30px_-12px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <div className="flex gap-x-6 pb-10 pt-6">
                  <span aria-hidden="true" className="w-[20px] shrink-0" />
                  <div className="grid flex-1 grid-cols-10 gap-x-6">
                    {mainNav.map((item) => (
                      <ul key={item.label} className="flex flex-col gap-[26px]">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={() => setExpanded(false)}
                              className="font-helvetica text-[18px] leading-normal text-n33-blue transition-all duration-200 hover:translate-x-1 hover:text-n33-primary"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Menú de categorías — móvil (acordeón) */}
        {mobileOpen && (
          <nav
            aria-label="Categorías"
            className="animate-menu-down absolute inset-x-0 top-full max-h-[calc(100vh-90px)] overflow-y-auto bg-white/95 shadow-[0px_18px_30px_-12px_rgba(0,0,0,0.3)] backdrop-blur-md lg:hidden"
          >
            <ul className="divide-y divide-n33-border">
              {mainNav.map((item) => {
                const isOpen = openSection === item.label;
                return (
                  <li key={item.label}>
                    <div className="flex items-center justify-between px-4">
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 py-3.5 font-helvetica text-[18px] font-bold text-n33-blue transition-colors duration-200 active:text-n33-primary"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={
                          isOpen
                            ? `Cerrar subcategorías de ${item.label}`
                            : `Abrir subcategorías de ${item.label}`
                        }
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenSection(isOpen ? null : item.label)
                        }
                        className="cursor-pointer p-3 transition-transform duration-200 active:scale-90"
                      >
                        <ToggleCircle expanded={isOpen} />
                      </button>
                    </div>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden bg-n33-background">
                        <ul className="flex flex-col gap-1 px-6 py-3">
                          {item.children.map((child) => (
                            <li key={child.label}>
                              <Link
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-1.5 font-helvetica text-[16px] text-n33-blue transition-colors duration-200 active:text-n33-primary"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
