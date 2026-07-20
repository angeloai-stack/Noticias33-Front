// ============================================================================
// Etiqueta de categoría que enlaza a /categoria/[slug]. Dos variantes según
// el diseño: "sm" (azul, para tarjetas) y "lg" (roja, para destacadas).
// ============================================================================

import Link from "next/link";
import type { Category } from "@/types/news";

type CategoryTagProps = {
  category: Category;
  /** "sm": tag azul pequeño; "lg": tag rojo grande (noticia local/destacada) */
  size?: "sm" | "lg";
};

export function CategoryTag({ category, size = "sm" }: CategoryTagProps) {
  if (size === "lg") {
    return (
      <Link
        href={`/categoria/${category.slug}`}
        className="inline-flex h-[33px] min-w-[137px] items-center bg-n33-primary px-[18px] font-helvetica text-[21.98px] font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110"
      >
        {category.name}
      </Link>
    );
  }

  return (
    <Link
      href={`/categoria/${category.slug}`}
      className="inline-flex h-[23.5px] min-w-[79px] items-center justify-center bg-n33-tag px-3 text-[10px] font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:brightness-110"
    >
      {category.name}
    </Link>
  );
}
