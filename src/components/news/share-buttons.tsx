// ============================================================================
// Botones para compartir la noticia en redes sociales. Se ubican debajo de la
// foto principal del detalle de artículo. Cada uno abre el diálogo oficial de
// la red (sharer/intent) con la URL y el título de la nota ya precargados.
// ============================================================================

import { siteConfig } from "@/lib/config/site";

type ShareButtonsProps = {
  slug: string;
  title: string;
};

type ShareNetwork = {
  name: string;
  /** Texto del aria-label del botón; por defecto "Compartir en {name}". */
  ariaLabel?: string;
  buildHref: (encodedUrl: string, encodedTitle: string) => string;
  d: string;
};

const SHARE_NETWORKS: ShareNetwork[] = [
  {
    name: "Facebook",
    buildHref: (encodedUrl) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    d: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-2.196c0-2.454 1.5-3.802 3.7-3.802.996 0 1.85.074 2.096.107v2.421h-1.437c-1.129 0-1.348.537-1.348 1.324v1.734h2.697l-.352 2.667h-2.345v8.212C19.396 23.212 24 18.13 24 12A12 12 0 0 0 0 12c0 5.514 4.005 10.089 9.101 10.984v.007z",
  },
  {
    name: "Instagram",
    // Instagram no ofrece un enlace web para compartir una URL puntual (solo
    // desde su app móvil); este botón lleva al perfil oficial de Noticias 33.
    ariaLabel: "Visitar el Instagram de Noticias 33",
    buildHref: () => "https://www.instagram.com/noticias33oficial/",
    d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.148-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    name: "WhatsApp",
    buildHref: (encodedUrl, encodedTitle) =>
      `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-1.746-.87-2.885-1.556-4.037-3.556-.305-.526.305-.489.87-1.63.099-.199.05-.372-.05-.52-.075-.148-.669-1.612-.917-2.207-.242-.579-.487-.5-.669-.51-.173-.01-.372-.012-.57-.012-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.05 3.129 4.966 4.263 2.917 1.135 2.917.756 3.916.629.999-.126 3.28-1.336 3.744-2.63.464-1.294.464-2.404.325-2.628-.14-.223-.297-.198-.669-.348zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
  },
];

export function ShareButtons({ slug, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(`${siteConfig.url}/noticia/${slug}`);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-4 flex items-center gap-3" aria-label="Compartir esta noticia">
      <span className="text-sm font-semibold uppercase tracking-wide text-n33-muted">
        Compartir
      </span>
      {SHARE_NETWORKS.map((network) => (
        <a
          key={network.name}
          href={network.buildHref(encodedUrl, encodedTitle)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={network.ariaLabel ?? `Compartir en ${network.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-blue hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden="true">
            <path d={network.d} />
          </svg>
        </a>
      ))}
    </div>
  );
}
