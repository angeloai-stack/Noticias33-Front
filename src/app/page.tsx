// ============================================================================
// Portada del sitio. Reproduce la jerarquía del diseño de Figma:
//   - Rail de publicidad (izquierda, solo pantallas grandes).
//   - Dos noticias medianas → destacada local → noticia principal →
//     listado a dos columnas.
//   - Barra lateral derecha: Reels, clima y publicidad (en móvil, Reels y
//     clima pasan al flujo principal).
//   - Bloque azul con noticias de relevancia media-baja.
// Los datos vienen de WordPress y la página se regenera cada 60 segundos.
// ============================================================================

import { AdPlaceholder } from "@/components/news/ad-placeholder";
import { BlueSection } from "@/components/news/blue-section";
import { LocalFeature } from "@/components/news/local-feature";
import { MainFeature } from "@/components/news/main-feature";
import { NewsRowCard } from "@/components/news/news-row-card";
import { ReelsCard } from "@/components/news/reels-card";
import { WeatherCard } from "@/components/news/weather-card";
import { Reveal } from "@/components/ui/reveal";
import { getArticlesByCategory, getLatestArticles } from "@/lib/api/news";
import type { Article } from "@/types/news";

// Regenera la portada como máximo cada 60 segundos (ISR)
export const revalidate = 60;

/** Última noticia de la categoría Clima para la tarjeta de la barra lateral. */
async function getClimaArticle(): Promise<Article | null> {
  try {
    const result = await getArticlesByCategory("clima", 1, 1);
    return result?.data[0] ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  // Ambas peticiones en paralelo para no sumar latencias
  const [{ data: articles }, climaArticle] = await Promise.all([
    getLatestArticles(1, 17),
    getClimaArticle(),
  ]);

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 py-20 text-center">
        <p className="text-n33-muted">No hay noticias disponibles por ahora.</p>
      </div>
    );
  }

  // Reparto de las 17 noticias entre las zonas del diseño
  const topRow = articles.slice(0, 2); // fila superior (2 tarjetas)
  const localArticle = articles[2]; // destacada "Local"
  const mainArticle = articles[3]; // noticia principal
  const listado = articles.slice(4, 14); // listado a dos columnas (10)
  const blueArticles = articles.slice(14, 17); // bloque azul (3)

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      {/* Zona superior: rail de publicidad, contenido y barra lateral */}
      <div className="flex gap-8">
        {/* Rail izquierdo de publicidad */}
        <aside
          aria-label="Publicidad"
          className="hidden w-[116px] shrink-0 flex-col gap-9 xl:flex"
        >
          <AdPlaceholder className="h-[279px]" />
          <AdPlaceholder className="h-[965px]" />
        </aside>

        {/* Columna principal */}
        <div className="min-w-0 flex-1">
          {/* Fila superior: dos noticias de relevancia media alta */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {topRow.map((article, index) => (
              <Reveal key={article.id} delay={index * 100}>
                <NewsRowCard article={article} />
              </Reveal>
            ))}
          </div>

          {/* Noticia destacada local */}
          {localArticle && (
            <Reveal className="mt-10">
              <LocalFeature article={localArticle} />
            </Reveal>
          )}

          {/* Noticia principal */}
          {mainArticle && (
            <Reveal className="mt-12">
              <MainFeature article={mainArticle} />
            </Reveal>
          )}

          {/* Listado de noticias en dos columnas */}
          {listado.length > 0 && (
            <div className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-2 lg:mt-14 lg:gap-y-[93px]">
              {listado.map((article, index) => (
                <Reveal key={article.id} delay={(index % 2) * 100}>
                  <NewsRowCard article={article} />
                </Reveal>
              ))}
            </div>
          )}

          {/* Reels y clima en flujo móvil */}
          <div className="mt-12 flex flex-col items-center gap-12 sm:flex-row sm:items-start sm:justify-center lg:hidden">
            <Reveal>
              <ReelsCard />
            </Reveal>
            <Reveal delay={120}>
              <WeatherCard article={climaArticle} />
            </Reveal>
          </div>
        </div>

        {/* Barra lateral derecha */}
        <aside className="hidden w-[286px] shrink-0 flex-col gap-10 lg:flex">
          <Reveal>
            <ReelsCard />
          </Reveal>
          <Reveal delay={120}>
            <WeatherCard article={climaArticle} />
          </Reveal>
          <AdPlaceholder className="h-[368px] w-[253px]" />
          <AdPlaceholder className="h-[368px] w-[253px]" />
        </aside>
      </div>

      {/* Publicidad horizontal */}
      <div className="mt-10 flex justify-center lg:mt-16">
        <AdPlaceholder className="h-[100px] w-full max-w-[1034px] sm:h-[145px]" />
      </div>

      {/* Bloque azul: noticias de relevancia media baja */}
      <Reveal className="mt-10 lg:mt-16">
        <BlueSection articles={blueArticles} />
      </Reveal>

      {/* Publicidad horizontal */}
      <div className="mt-10 flex justify-center lg:mt-16">
        <AdPlaceholder className="h-[100px] w-full max-w-[1034px] sm:h-[145px]" />
      </div>
    </div>
  );
}
