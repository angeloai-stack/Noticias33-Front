// ============================================================================
// Tarjeta vertical (imagen 16:9 + tag + título + resumen + fecha).
// Se usa en los listados de categoría y en los resultados de búsqueda.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { CategoryTag } from "@/components/news/category-tag";
import type { Article } from "@/types/news";

type ArticleCardProps = {
  article: Article;
};

/** Fecha en formato largo: "20 de julio de 2026". */
function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/** Tarjeta vertical para listados de categoría y búsqueda. */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group rounded-[14px] p-2 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_18px_40px_-16px_rgba(31,95,170,0.35)]">
      <Link
        href={`/noticia/${article.slug}`}
        className="relative block aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-n33-ad"
      >
        {article.coverImageUrl && (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </Link>

      <div className="mt-3">
        <CategoryTag category={article.category} />
        <h2 className="mt-2 text-[16px] font-bold uppercase leading-[1.25] text-black">
          <Link
            href={`/noticia/${article.slug}`}
            className="transition-colors duration-300 group-hover:text-n33-blue"
          >
            {article.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-[12px] leading-[1.5] text-black/80">
          {article.excerpt}
        </p>
        <time
          dateTime={article.publishedAt}
          className="mt-2 block text-[12px] text-n33-muted"
        >
          {formatDate(article.publishedAt)}
        </time>
      </div>
    </article>
  );
}
