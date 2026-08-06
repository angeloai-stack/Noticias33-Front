// ============================================================================
// Tarjeta de Reels de la barra lateral: incrusta un reel real de Facebook
// (Noticias33) vía el reproductor oficial embebible de Facebook, sin
// necesidad de SDK ni token de acceso.
// ============================================================================

/** Reel a mostrar. Cambiar aquí cuando se quiera destacar otro. */
const FACEBOOK_REEL_URL = "https://www.facebook.com/reel/1033721036106063";

// Proporción recomendada por el propio generador de embeds de Facebook
// para reels (267x476 ≈ 9:16 más el encabezado/controles del reproductor).
const EMBED_WIDTH = 233;
const EMBED_HEIGHT = 416;

/** Construye la URL del reproductor oficial embebible de Facebook. */
function buildFacebookVideoEmbedUrl(href: string, width: number): string {
  const params = new URLSearchParams({
    href,
    show_text: "0",
    width: String(width),
  });

  return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
}

export function ReelsCard() {
  return (
    <section aria-label="Reels" className="w-58.25">
      <h3 className="text-[19px] font-bold uppercase leading-normal text-black">
        Reels
      </h3>
      <div className="mt-3 overflow-hidden rounded-[14px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.45)]">
        <iframe
          src={buildFacebookVideoEmbedUrl(FACEBOOK_REEL_URL, EMBED_WIDTH)}
          width={EMBED_WIDTH}
          height={EMBED_HEIGHT}
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          title="Reel de Noticias 33 en Facebook"
        />
      </div>
    </section>
  );
}
