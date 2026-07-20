// ============================================================================
// Tarjeta de clima de la barra lateral. Si existe una noticia reciente en la
// categoría "Clima" enlaza a ella con su imagen; si no, usa el mapa estático
// del diseño y enlaza al listado de la categoría.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { CategoryTag } from "@/components/news/category-tag";
import type { Article } from "@/types/news";

type WeatherCardProps = {
  /** Noticia de clima más reciente, o null si no hay/falla la API. */
  article: Article | null;
};
export function WeatherCard({ article }: WeatherCardProps) {
  const href = article ? `/noticia/${article.slug}` : "/categoria/clima";
  const imageUrl = article?.coverImageUrl ?? "/design/clima-mapa.png";

  return (
    <section aria-label="Clima" className="w-[286px]">
      <Link
        href={href}
        className="group relative block h-[181px] w-full overflow-hidden rounded-[14px] shadow-[0_16px_35px_-18px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_45px_-18px_rgba(23,156,255,0.45)]"
      >
        <Image
          src={imageUrl}
          alt="Clima en Baja California"
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="286px"
        />
      </Link>
      <div className="mt-2">
        <CategoryTag category={{ id: "3", name: "Clima", slug: "clima" }} />
      </div>
      <h3 className="mt-3 text-[19px] font-bold uppercase leading-normal text-black">
        <Link
          href={href}
          className="transition-colors duration-300 hover:text-n33-blue"
        >
          Clima para esta semana
          <br />
          en Baja California
        </Link>
      </h3>
    </section>
  );
}
