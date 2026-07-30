# N33 — Noticias 33 Front-end

Rediseño completo del front-end del noticiero **N33** (Noticias 33), construido con Next.js, React, TypeScript y Tailwind CSS a partir del diseño de Figma "N33 Mockup". Es el sitio público de noticias; la publicación y administración de contenido se hacen directamente en el backend (WordPress) que este front consume.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **WordPress REST API** como backend de contenidos (noticias33.com)
- **Supabase** (vía API REST, sin dependencias) para los suscriptores del newsletter

## Requisitos

- Node.js 20+
- npm

## Inicio rápido

```bash
npm install
cp .env.example .env.local   # completar credenciales
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Ámbito | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Pública | URL pública del sitio |
| `NEXT_PUBLIC_API_URL` | Pública | API REST de WordPress (por defecto `https://noticias33.com/wp-json/wp/v2`) |
| `SUPABASE_URL` | Servidor | URL del proyecto Supabase |
| `SUPABASE_SERVICE_KEY` | Servidor | Service Role Key de Supabase (secreta, nunca en el cliente) |
| `REVALIDATE_SECRET` | Servidor | Secreto del webhook `/api/revalidate` |

Las credenciales nunca se versionan: van en `.env.local` (desarrollo) y en las Environment Variables de Vercel (producción). Si Supabase no está configurado, el sitio funciona igual: solo el newsletter responde "servicio no disponible".

## Estructura del proyecto

```
src/
├── app/                         # Rutas (App Router)
│   ├── page.tsx                 # Portada (ISR cada 60 s)
│   ├── noticia/[slug]/          # Detalle de noticia (ISR cada 5 min)
│   ├── categoria/[slug]/        # Listado por categoría con paginación
│   ├── buscar/                  # Búsqueda (?q=...)
│   ├── sitemap.ts               # Sitemap dinámico (/sitemap.xml)
│   ├── robots.ts                # robots.txt (bloquea rutas internas)
│   ├── not-found.tsx            # Página 404
│   └── api/                     # API internas (solo servidor)
│       ├── geo/                 # GET  ciudad más cercana según IP (Vercel)
│       ├── revalidate/          # POST/GET webhook de WordPress
│       └── newsletter/          # POST alta de suscriptor en Supabase
├── components/
│   ├── layout/                  # Header (mega-menú + ticker), Footer,
│   │                            # Newsletter + formulario, SiteShell
│   ├── news/                    # Tarjetas y secciones de la portada
│   ├── seo/                     # JsonLd (datos estructurados)
│   └── ui/                      # Reveal (animación al hacer scroll)
├── lib/
│   ├── api/
│   │   ├── client.ts            # Cliente HTTP de lectura (con caché ISR)
│   │   ├── news.ts              # Capa de datos de noticias
│   │   ├── mappers.ts           # WpPost → Article
│   │   ├── wp-types.ts          # Tipos de la API de WordPress
│   │   └── weather.ts           # Clima (Open-Meteo) + ciudad más cercana
│   ├── config/
│   │   ├── site.ts              # Identidad y navegación (menú/footer)
│   │   └── env.ts               # Variables de entorno públicas
│   ├── hooks/
│   │   └── use-nearest-city.ts  # Ciudad más cercana según IP (cliente)
│   ├── supabase.ts              # Cliente REST mínimo de Supabase
│   └── seo.ts                   # Constructores de esquemas schema.org
└── types/
    └── news.ts                  # Modelo de dominio (Article, Category...)
```

## Sitio público

- **Portada**: reproduce la jerarquía del diseño de Figma — fila de dos noticias, destacada "Local", noticia principal, listado a dos columnas, barra lateral (Reels, clima, publicidad) y bloque azul final. Responsive con enfoque mobile-first.
- **Header**: fecha del día, marquesina "Información al momento" con el último titular, barra azul fija con buscador y menú de categorías con mega-menú (escritorio) o acordeón (móvil). La navegación se define en `src/lib/config/site.ts`.
- **Efectos**: animaciones de aparición al hacer scroll (`Reveal`), hover con elevación/zoom en tarjetas, shimmer en publicidad. Todo respeta `prefers-reduced-motion`.

## SEO

- **Sitemap dinámico** (`/sitemap.xml`): portada, categorías y las últimas 100 noticias con su fecha real de modificación; se regenera cada hora.
- **robots.txt** (`/robots.txt`): permite todo el sitio público, bloquea `/api/`, y apunta al sitemap.
- **Datos estructurados (JSON-LD)**: `NewsMediaOrganization` + `WebSite` con `SearchAction` en el layout (habilita el cuadro de búsqueda en Google), `NewsArticle` en cada noticia y `CollectionPage`/`ItemList` en las categorías. Los constructores viven en `src/lib/seo.ts`.
- **Metadatos**: títulos con plantilla, descripciones y Open Graph por noticia.

Valida los esquemas con la [prueba de resultados enriquecidos](https://search.google.com/test/rich-results) de Google.

## Newsletter

El formulario del bloque azul (presente en todas las páginas) envía a `POST /api/newsletter`, que valida los datos y guarda el suscriptor en la tabla `suscriptores` de Supabase. El índice único sobre el correo evita duplicados (el usuario ve "Este correo ya está suscrito").

```sql
create table suscriptores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nombre text not null,
  correo text not null unique,
  telefono text
);
create index idx_suscriptores_created_at on suscriptores (created_at desc);
alter table suscriptores enable row level security;
```

## Integración con el backend

El backend es el WordPress existente de [noticias33.com](https://noticias33.com), consumido vía su API REST (`/wp-json/wp/v2`).

**Lectura** (`src/lib/api/news.ts`, sin autenticación):

- `GET /posts?_embed` — últimas noticias (paginado con `page` y `per_page`)
- `GET /posts?slug=...&_embed` — detalle de noticia
- `GET /posts?categories=...&_embed` — noticias por categoría
- `GET /posts?search=...&_embed` — búsqueda
- `GET /categories` — categorías

La publicación y administración de contenido (crear/editar notas, medios, categorías, tags) se hace directamente en wp-admin de WordPress; este proyecto es solo de lectura.

Los posts de WordPress se mapean al tipo `Article` en `src/lib/api/mappers.ts`; la paginación usa los headers `X-WP-Total` y `X-WP-TotalPages`.

Categorías activas del sitio: Policiaca, Gobierno, Sociales, Global, Política, Nacional, Deportes, Clima y Tecnología.

## Diseño (Figma)

Basado en el mockup "N33 Mockup" (nodos 170:48 portada y 48:130 menú). Los tokens de color viven en `src/app/globals.css` (`--n33-*`) y los assets exportados del diseño en `public/design/`. Tipografías: Inter (cuerpo), Helvetica Neue con fallbacks del sistema (titulares) y Oswald como sustituto web de Avenir Next Condensed (newsletter).

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | ESLint |
| `npm run test` | Pruebas unitarias (Vitest) |
| `npm run test:watch` | Pruebas en modo watch |

## Pruebas

Pruebas unitarias con [Vitest](https://vitest.dev) centradas en la lógica pura (sin depender del DOM ni de la red). Los archivos viven junto al código como `*.test.ts`:

- `src/lib/api/mappers.test.ts` — mapeo de posts de WordPress a `Article` (limpieza de HTML, entidades, categorías, autor, fechas UTC).
- `src/lib/seo.test.ts` — esquemas JSON-LD (organización, `NewsArticle`, `CollectionPage`).
- `src/lib/config/site.test.ts` — integridad de la navegación y codificación de búsquedas.
- `src/lib/supabase.test.ts` — lectura de configuración de Supabase.

```bash
npm run test        # una sola pasada
npm run test:watch  # re-ejecuta al guardar
```

## Próximos pasos

1. Integrar el proveedor real de publicidad en los espacios `AdPlaceholder`
2. Conectar la tarjeta de Reels con contenido real (Instagram/TikTok)
3. Páginas legales del footer (contacto, términos, privacidad)
