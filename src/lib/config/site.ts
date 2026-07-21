// ============================================================================
// Configuración estática del sitio: identidad, metadatos por defecto y la
// estructura de navegación (menú principal con subcategorías y footer).
// Editar aquí para agregar/quitar categorías del menú sin tocar componentes.
// ============================================================================

/** Identidad del sitio usada en metadatos y textos. */
export const siteConfig = {
  name: "N33",
  fullName: "Noticias 33",
  description:
    "Noticias de México y el mundo. Información actualizada las 24 horas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "es-MX",
} as const;

/** Subcategoría del mega-menú. */
export type NavChild = {
  label: string;
  href: string;
};

/** Categoría del menú principal con sus subcategorías. */
export type NavItem = {
  label: string;
  href: string;
  children: NavChild[];
};

/** Atajo: genera un enlace a la búsqueda con el término dado. */
function search(term: string): string {
  return `/buscar?q=${encodeURIComponent(term)}`;
}

// Menú principal con subcategorías según el diseño de Figma (nodo 48:130).
// Las categorías "Estatal" y "EE.UU" no existen en el backend, por lo que
// apuntan a las más cercanas; las subcategorías enlazan a la búsqueda.
export const mainNav: NavItem[] = [
  {
    label: "Editorial",
    href: "/categoria/editorial",
    children: [
      { label: "Editorial", href: "/categoria/editorial" },
      { label: "Columnistas", href: search("columnistas") },
    ],
  },
  {
    label: "Estatal",
    href: "/categoria/gobierno",
    children: [
      { label: "Tijuana", href: search("Tijuana") },
      { label: "Rosarito", href: search("Rosarito") },
      { label: "Ensenada", href: search("Ensenada") },
      { label: "San Quintín", href: search("San Quintín") },
      { label: "Tecate", href: search("Tecate") },
      { label: "Mexicali", href: search("Mexicali") },
      { label: "San Felipe", href: search("San Felipe") },
    ],
  },
  {
    label: "Nacional",
    href: "/categoria/nacional",
    children: [
      { label: "Estados", href: search("estados") },
      { label: "Gobierno", href: "/categoria/gobierno" },
      { label: "Política", href: "/categoria/politica" },
      { label: "Seguridad", href: search("seguridad") },
      { label: "Economía", href: search("economía") },
    ],
  },
  {
    label: "EE.UU",
    href: "/categoria/global",
    children: [
      { label: "Política", href: search("política Estados Unidos") },
      { label: "Economía", href: search("economía Estados Unidos") },
      { label: "Seguridad", href: search("seguridad Estados Unidos") },
      { label: "Inmigración", href: search("inmigración") },
      { label: "California", href: search("California") },
      { label: "Comunidad latina", href: search("comunidad latina") },
      { label: "Turismo", href: search("turismo") },
    ],
  },
  {
    label: "Política",
    href: "/categoria/politica",
    children: [
      { label: "Presidencia", href: search("presidencia") },
      { label: "Senado", href: search("senado") },
      { label: "Cámara de diputados", href: search("cámara de diputados") },
      { label: "Poder Judicial", href: search("poder judicial") },
      { label: "INE", href: search("INE") },
      { label: "Partidos políticos", href: search("partidos políticos") },
      { label: "Elecciones", href: search("elecciones") },
      { label: "Transparencia", href: search("transparencia") },
    ],
  },
  {
    label: "Global",
    href: "/categoria/global",
    children: [
      { label: "América", href: search("América") },
      { label: "Europa", href: search("Europa") },
      { label: "Asia", href: search("Asia") },
      { label: "Medio Oriente", href: search("Medio Oriente") },
      { label: "Conflictos", href: search("conflictos") },
      { label: "Diplomacia", href: search("diplomacia") },
    ],
  },
  {
    label: "Deportes",
    href: "/categoria/deportes",
    children: [
      { label: "Fútbol", href: search("fútbol") },
      { label: "NFL", href: search("NFL") },
      { label: "NBA", href: search("NBA") },
      { label: "MLB", href: search("MLB") },
      { label: "Boxeo", href: search("boxeo") },
      { label: "MMA", href: search("MMA") },
      { label: "Motor", href: search("motor") },
      { label: "Tenis", href: search("tenis") },
      { label: "Local", href: search("deportes Tijuana") },
      { label: "Resultados", href: search("resultados") },
    ],
  },
  {
    label: "Sociales",
    href: "/categoria/sociales",
    children: [
      { label: "En Sociedad", href: search("en sociedad") },
      { label: "Gente", href: search("gente") },
      { label: "Eventos", href: search("eventos") },
      { label: "Lifestyle", href: search("lifestyle") },
    ],
  },
  {
    label: "Tecnología",
    href: "/categoria/tecnologia",
    children: [
      { label: "Innovación", href: search("innovación") },
      { label: "Inteligencia Artificial", href: search("inteligencia artificial") },
      { label: "Gadgets", href: search("gadgets") },
      { label: "Software", href: search("software") },
      { label: "Apps", href: search("apps") },
      { label: "Ciencia y Tecnología", href: search("ciencia y tecnología") },
      { label: "Videojuegos", href: search("videojuegos") },
      { label: "Ciberseguridad", href: search("ciberseguridad") },
      { label: "Empresas Tech", href: search("empresas tech") },
    ],
  },
  {
    label: "Policiaca",
    href: "/categoria/policiaca",
    children: [
      { label: "Seguridad Pública", href: search("seguridad pública") },
      { label: "Narcomenudeo", href: search("narcomenudeo") },
      { label: "Homicidios", href: search("homicidios") },
      { label: "Accidentes", href: search("accidentes") },
      { label: "Fiscalía", href: search("fiscalía") },
      { label: "Detenciones", href: search("detenciones") },
      { label: "Operativos", href: search("operativos") },
    ],
  },
];

// Orden de categorías del footer según el diseño.
export const footerNav = [
  { label: "Editorial", href: "/categoria/editorial" },
  { label: "Estatal", href: "/categoria/gobierno" },
  { label: "Nacional", href: "/categoria/nacional" },
  { label: "Global", href: "/categoria/global" },
  { label: "Deportes", href: "/categoria/deportes" },
  { label: "Sociales", href: "/categoria/sociales" },
  { label: "Tecnología", href: "/categoria/tecnologia" },
  { label: "Política", href: "/categoria/politica" },
  { label: "Policiaca", href: "/categoria/policiaca" },
] as const;
