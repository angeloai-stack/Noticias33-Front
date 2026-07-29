// ============================================================================
// Espacio publicitario del diseño. Sin `ad`, muestra el marcador de posición
// ("Publicidad" con brillo); con `ad`, muestra el creativo real (imagen +
// enlace) recortado a las mismas dimensiones con object-cover.
// ============================================================================

import Image from "next/image";
import Link from "next/link";

/** Anuncio real a mostrar en el espacio. */
type Ad = {
  /** Imagen del creativo, dentro de /public (ej. "/ads/archivo.jpg"). */
  imageUrl: string;
  /** Texto alternativo describiendo al anunciante. */
  alt: string;
  /** Destino al hacer clic. */
  href: string;
  /**
   * "cover" (por defecto) rellena el espacio recortando la imagen si la
   * proporción no coincide; "contain" la muestra completa, centrada, sin
   * recortar (puede dejar franjas vacías si la proporción es muy distinta).
   */
  fit?: "cover" | "contain";
  /** Fondo (clase Tailwind, ej. "bg-black") para las franjas que deja "contain". */
  background?: string;
};

type AdPlaceholderProps = {
  /** Dimensiones del hueco publicitario (clases de Tailwind). */
  className?: string;
  /** Anuncio a mostrar; si se omite, se ve el marcador de posición. */
  ad?: Ad;
};

export function AdPlaceholder({ className = "", ad }: AdPlaceholderProps) {
  if (ad) {
    return (
      <Link
        href={ad.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`group relative block overflow-hidden rounded-[12px] ${ad.background ?? ""} ${className}`}
      >
        <Image
          src={ad.imageUrl}
          alt={ad.alt}
          fill
          className={`${ad.fit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
        />
      </Link>
    );
  }

  return (
    <div
      className={`ad-shimmer flex items-center justify-center rounded-[12px] ${className}`}
    >
      <span className="font-helvetica text-[21.77px] text-black/60">
        Publicidad
      </span>
    </div>
  );
}
