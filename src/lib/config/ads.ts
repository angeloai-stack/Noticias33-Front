// ============================================================================
// Anuncios reales colocados en los espacios publicitarios de todo el sitio
// (no solo la portada). Cada imagen se eligió porque su proporción coincide
// con el hueco al que va, para que <AdPlaceholder> no la recorte mal con
// object-cover.
// ============================================================================

/** Enlace de contacto directo (WhatsApp) del anunciante Volt Lab Agency. */
const VOLTLAB_WHATSAPP = "https://wa.me/526647089550";

/** WhatsApp de Noticias 33 para contratar publicidad en el sitio. */
export const ADVERTISING_WHATSAPP =
  "https://wa.me/526643011616?text=" +
  encodeURIComponent(
    "Hola, quiero información sobre publicidad en Noticias 33.",
  );

export const ADS = {
  voltlabRail: {
    imageUrl: "/ads/voltlab-rail.jpg",
    alt: "Volt Lab Agency: publicidad, branding, sitios web, contenido, IA y automatización",
    href: VOLTLAB_WHATSAPP,
  },
  voltlabSidebar: {
    imageUrl: "/ads/voltlab-sidebar.jpg",
    alt: "Volt Lab Agency: agenda una asesoría sin costo",
    href: VOLTLAB_WHATSAPP,
  },
  propertyDreamz: {
    imageUrl: "/ads/property-dreamz-banner.jpg",
    alt: "Property Dreamz Realty Group: casas, terrenos, departamentos, comercial e inversión",
    href: "https://www.propertydreamz.com",
  },
} as const;
