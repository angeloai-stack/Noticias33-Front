// ============================================================================
// Marcador de posición para los espacios publicitarios del diseño.
// Cuando exista un proveedor de anuncios, este componente se sustituirá por
// el embed real conservando las mismas dimensiones.
// ============================================================================

type AdPlaceholderProps = {
  /** Dimensiones del hueco publicitario (clases de Tailwind). */
  className?: string;
};

export function AdPlaceholder({ className = "" }: AdPlaceholderProps) {
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
