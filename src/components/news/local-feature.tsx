// ============================================================================
// Noticia destacada "Local": imagen grande a la izquierda, tag rojo grande
// y texto a la derecha (en móvil se apilan). El tag muestra siempre "Local"
// aunque enlaza a la categoría real del artículo.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { CategoryTag } from "@/components/news/category-tag";
import type { Article } from "@/types/news";

type LocalFeatureProps = {
  article: Article;
};
export function LocalFeature({ article }: LocalFeatureProps) {
  return (
    <article className="group border-t border-black/60 pt-[38px]">
      <div className="flex flex-col gap-5 md:flex-row">
        <Link
          href={`/noticia/${article.slug}`}
          className="relative aspect-[394/341] w-full shrink-0 overflow-hidden rounded-[14px] bg-n33-ad shadow-[0_16px_35px_-18px_rgba(0,0,0,0.4)] transition-all duration-500 hover:shadow-[0_24px_50px_-18px_rgba(243,61,91,0.4)] md:h-[341px] md:w-[394px]"
        >
          {article.coverImageUrl && (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 394px"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <div className="min-w-0 flex-1">
          <CategoryTag
            category={{ ...article.category, name: "Local" }}
            size="lg"
          />
          <h2 className="mt-4 font-helvetica text-[18px] font-bold uppercase leading-normal text-black md:mt-8 md:text-[21.77px]">
            <Link
              href={`/noticia/${article.slug}`}
              className="transition-colors duration-300 hover:text-n33-primary"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mt-4 line-clamp-6 font-helvetica text-[16px] font-light leading-normal text-black/85 md:mt-6">
            {article.excerpt}
          </p>
        </div>
      </div>
    </article>
  );
}
