// ============================================================================
// Bloque azul del final de la portada: contenedor con degradado y esquinas
// redondeadas que lista noticias de relevancia media-baja en formato
// horizontal (miniatura + tag + título + resumen) sobre fondo oscuro.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { CategoryTag } from "@/components/news/category-tag";
import type { Article } from "@/types/news";

type BlueSectionProps = {
  articles: Article[];
};
export function BlueSection({ articles }: BlueSectionProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Más noticias"
      className="rounded-[24px] bg-gradient-to-br from-n33-blue to-n33-blue-dark px-5 py-10 shadow-[0_30px_60px_-30px_rgba(31,95,170,0.6)] sm:rounded-[41px] sm:px-12 sm:py-[82px] lg:px-[76px]"
    >
      <div className="flex flex-col gap-10 sm:gap-16">
        {articles.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col gap-4 rounded-[16px] transition-all duration-300 hover:bg-white/5 md:-m-4 md:flex-row md:gap-[31px] md:p-4"
          >
            <Link
              href={`/noticia/${article.slug}`}
              className="relative aspect-[286/161] w-full shrink-0 overflow-hidden rounded-[10px] bg-white/10 shadow-lg md:h-[161px] md:w-[286px]"
            >
              {article.coverImageUrl && (
                <Image
                  src={article.coverImageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 286px"
                />
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <CategoryTag category={article.category} />
              <h3 className="mt-3 max-w-[566px] text-[17px] font-bold uppercase leading-[1.25] text-white sm:text-[20px]">
                <Link
                  href={`/noticia/${article.slug}`}
                  className="transition-colors duration-300 hover:text-white/75"
                >
                  {article.title}
                </Link>
              </h3>
              <p className="mt-3 line-clamp-4 max-w-[566px] text-[12px] leading-[1.55] text-white/85">
                {article.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
