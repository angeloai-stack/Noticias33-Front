// ============================================================================
// Búsqueda de noticias (/buscar?q=...). El buscador del header y el del
// menú envían aquí; la consulta se ejecuta en el servidor contra la API
// de WordPress y los resultados se muestran como tarjetas.
// ============================================================================

import type { Metadata } from "next";
import { AdPlaceholder } from "@/components/news/ad-placeholder";
import { ArticleCard } from "@/components/news/article-card";
import { searchArticles } from "@/lib/api/news";
import { ADS } from "@/lib/config/ads";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busca noticias en Noticias 33.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  // Sin consulta no se pide nada: se muestra solo el formulario
  const results = query ? await searchArticles(query) : null;

  return (
    <div className="animate-fade-up mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        Buscar noticias
      </h1>

      <form action="/buscar" className="mt-8 max-w-2xl">
        <label htmlFor="search" className="sr-only">
          Buscar
        </label>
        <div className="flex gap-3">
          <input
            id="search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Escribe palabras clave..."
            className="w-full rounded-xl border border-n33-border bg-n33-surface px-4 py-3 text-n33-foreground shadow-sm outline-none ring-n33-primary transition-all duration-300 placeholder:text-n33-muted focus:shadow-lg focus:ring-2"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-[9px] bg-n33-primary px-6 py-3 text-[13px] font-bold uppercase text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-primary-dark hover:shadow-[0_12px_25px_-8px_rgba(243,61,91,0.6)] active:translate-y-0 active:scale-95"
          >
            Buscar
          </button>
        </div>
      </form>

      {results && (
        <section aria-live="polite" className="mt-10">
          <p className="text-sm text-n33-muted">
            {results.meta.total}{" "}
            {results.meta.total === 1 ? "resultado" : "resultados"} para
            &ldquo;{query}&rdquo;
          </p>

          {results.data.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.data.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  priority={index === 0}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Publicidad: siempre visible, haya o no una búsqueda en curso */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
        <AdPlaceholder className="h-69.75 w-29" ad={ADS.voltlabRail} sizes="116px" />
        <AdPlaceholder
          className="h-92 w-63.25"
          ad={ADS.voltlabSidebar}
          sizes="253px"
        />
      </div>
      <div className="mt-6 flex justify-center">
        <AdPlaceholder
          className="aspect-1034/145 w-full max-w-258.5"
          ad={ADS.propertyDreamz}
          sizes="(min-width: 1034px) 1034px, 100vw"
        />
      </div>
    </div>
  );
}
