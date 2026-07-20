// ============================================================================
// Tarjeta horizontal pequeña (miniatura + tag + título + resumen). Se usa en
// la fila superior de la portada y en el listado a dos columnas. Al pasar el
// cursor se eleva con sombra y la miniatura hace zoom.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { CategoryTag } from "@/components/news/category-tag";
import type { Article } from "@/types/news";

type NewsRowCardProps = {
  article: Article;
};
export function NewsRowCard({ article }: NewsRowCardProps) {
  return (
    <article className="group flex gap-3 rounded-[10px] p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_28px_-12px_rgba(31,95,170,0.35)] sm:gap-[18px]">
      <Link
        href={`/noticia/${article.slug}`}
        className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-[8px] bg-n33-ad sm:h-[87px] sm:w-[155px]"
      >
        {article.coverImageUrl && (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            sizes="155px"
          />
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <CategoryTag category={article.category} />
        <h3 className="mt-[6px] text-[14px] font-bold uppercase leading-[1.25] text-black">
          <Link
            href={`/noticia/${article.slug}`}
            className="transition-colors duration-300 group-hover:text-n33-blue"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-[1.5] text-black/80">
          {article.excerpt}
        </p>
      </div>
    </article>
  );
}
