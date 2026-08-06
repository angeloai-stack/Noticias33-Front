// ============================================================================
// Ícono de red social recortado del sprite compartido (ver social-links.ts).
// El color lo hereda de `currentColor`, así se puede reutilizar sobre fondos
// distintos (footer en blanco, tarjetas de contacto en azul, etc.).
// ============================================================================

import type { SocialLink } from "@/lib/config/social-links";

type SocialIconProps = {
  icon: SocialLink;
  className?: string;
};

export function SocialIcon({ icon, className = "h-6 w-6" }: SocialIconProps) {
  return (
    <svg
      viewBox={icon.viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d={icon.d} fill="currentColor" />
    </svg>
  );
}
