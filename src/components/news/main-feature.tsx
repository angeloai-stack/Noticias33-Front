// ============================================================================
// Noticia principal de la portada: imagen panorámica con degradado para
// legibilidad, tag rojo y autor superpuestos, titular grande con subrayado
// animado y zoom suave de la imagen al pasar el cursor.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/news";

type MainFeatureProps = {
  article: Article;
};
export function MainFeature({ article }: MainFeatureProps) {
  return (
    <article className="group">
      <Link
        href={`/noticia/${article.slug}`}
        className="relative block aspect-[16/9] w-full overflow-hidden rounded-[14px] bg-n33-ad shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)] transition-shadow duration-500 hover:shadow-[0_28px_60px_-20px_rgba(31,95,170,0.45)] sm:aspect-auto sm:h-[384px]"
      >
        {article.coverImageUrl && (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 853px"
          />
        )}

        {/* Degradado para legibilidad del tag y autor */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-4 left-[15px] flex items-center gap-4 sm:bottom-6 sm:gap-6">
          <span className="inline-flex h-[33px] items-center bg-n33-primary px-4 font-helvetica text-[16px] font-bold text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-[41px] sm:min-w-[137px] sm:px-[29px] sm:text-[21.98px]">
            {article.category.name}
          </span>
          {article.author && (
            <span className="flex items-center gap-3">
              {article.author.avatarUrl && (
                <Image
                  src={article.author.avatarUrl}
                  alt=""
                  width={50}
                  height={50}
                  className="size-[36px] rounded-full object-cover ring-2 ring-white/60 sm:size-[50px]"
                />
              )}
              <span className="font-helvetica text-[16px] font-light text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)] sm:text-[23.05px]">
                Por: {article.author.name}
              </span>
            </span>
          )}
        </div>
      </Link>

      <h2 className="mt-4 font-helvetica text-[26px] font-bold leading-[1.2] text-black sm:mt-6 sm:text-[42.96px]">
        <Link
          href={`/noticia/${article.slug}`}
          className="bg-gradient-to-r from-n33-blue to-n33-blue bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size,color] duration-500 hover:text-n33-blue hover:bg-[length:100%_3px]"
        >
          {article.title}
        </Link>
      </h2>

      <p className="mt-4 max-w-[600px] text-[15px] leading-[1.55] text-black/85 sm:mt-8">
        {article.excerpt}
      </p>
    </article>
  );
}
