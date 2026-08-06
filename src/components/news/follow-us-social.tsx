// ============================================================================
// Invitación a seguir a Noticias 33 en redes sociales. Va debajo del anuncio
// de cada riel lateral del detalle de artículo, como una tarjeta propia y
// compacta (sin estirarse a lo largo del riel). Las 4 redes van siempre
// juntas, con el color de marca de cada una y un ligero crecimiento al pasar
// el cursor o tocarlas en móvil.
// ============================================================================

import { SocialIcon } from "@/components/ui/social-icon";
import { socialLinks } from "@/lib/config/social-links";

/** Color (o gradiente) oficial de cada red, aplicado como fondo del ícono. */
const BRAND_BACKGROUND: Record<string, string> = {
  Facebook: "bg-[#1877F2]",
  Instagram: "bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
  TikTok: "bg-black",
  YouTube: "bg-[#FF0000]",
};

export function FollowUsSocial() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[14px] border border-black/10 bg-n33-blue/5 p-4">
      <p className="text-[12px] font-bold uppercase tracking-wide text-black">
        Síguenos
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {socialLinks.map((network) => (
          <a
            key={network.name}
            href={network.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Síguenos en ${network.name}`}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-110 active:scale-110 ${
              BRAND_BACKGROUND[network.name] ?? "bg-n33-blue"
            }`}
          >
            <SocialIcon icon={network} className="h-5 w-5" />
          </a>
        ))}
      </div>
    </div>
  );
}
