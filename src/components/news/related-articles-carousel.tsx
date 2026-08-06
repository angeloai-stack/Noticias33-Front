"use client";

// ============================================================================
// Carrusel de "Artículos relacionados y más del autor". Recibe ambas listas
// ya resueltas por el Server Component (getRelatedArticles) y solo maneja el
// filtro entre ellas y el desplazamiento horizontal (scroll nativo + snap,
// sin librerías externas).
// ============================================================================

import { useRef, useState } from "react";
import { ArticleCard } from "@/components/news/article-card";
import type { Article } from "@/types/news";

type RelatedArticlesCarouselProps = {
  /** Otros posts de la misma categoría. */
  related: Article[];
  /** Otros posts del mismo autor (puede venir vacío). */
  byAuthor: Article[];
};

type Tab = "related" | "author";

/** Cuánto se desplaza el carrusel por cada clic en las flechas. */
const SCROLL_STEP = 320;

export function RelatedArticlesCarousel({
  related,
  byAuthor,
}: RelatedArticlesCarouselProps) {
  const [activeTab, setActiveTab] = useState<Tab>("related");
  const trackRef = useRef<HTMLDivElement>(null);
  const hasAuthorTab = byAuthor.length > 0;
  const articles = activeTab === "author" ? byAuthor : related;

  function selectTab(tab: Tab) {
    setActiveTab(tab);
    trackRef.current?.scrollTo({ left: 0 });
  }

  function scrollByStep(direction: 1 | -1) {
    trackRef.current?.scrollBy({
      left: direction * SCROLL_STEP,
      behavior: "smooth",
    });
  }

  if (related.length === 0 && byAuthor.length === 0) {
    return null;
  }

  return (
    <section aria-label="Artículos relacionados y más del autor" className="mt-12">
      <h2 className="text-xl font-black uppercase tracking-tight text-black">
        Artículos relacionados y más del autor
      </h2>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filtrar artículos del carrusel"
          className="flex gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "related"}
            onClick={() => selectTab("related")}
            className={tabClassName(activeTab === "related")}
          >
            Relacionados
          </button>

          {hasAuthorTab && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "author"}
              onClick={() => selectTab("author")}
              className={tabClassName(activeTab === "author")}
            >
              Autor
            </button>
          )}
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Ver artículos anteriores"
            onClick={() => scrollByStep(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-blue hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Ver más artículos"
            onClick={() => scrollByStep(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-blue hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {articles.length > 0 ? (
        <div
          ref={trackRef}
          className="scrollbar-hide mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {articles.map((article) => (
            <div key={article.id} className="w-65 shrink-0 snap-start sm:w-70">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm text-n33-muted">
          No hay más artículos de este autor por ahora.
        </p>
      )}
    </section>
  );
}

/** Clases del botón de filtro, según si es la pestaña activa. */
function tabClassName(active: boolean) {
  const base =
    "rounded-full px-4 py-2 text-[13px] font-bold uppercase tracking-wide transition-all duration-300";

  return active
    ? `${base} bg-n33-blue text-white shadow-[0_10px_24px_-12px_rgba(23,156,255,0.6)]`
    : `${base} border border-black/10 text-n33-muted hover:-translate-y-0.5 hover:border-n33-blue hover:text-n33-blue`;
}
