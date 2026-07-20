// ============================================================================
// Detalle de una noticia (/noticia/[slug]). Renderiza el contenido HTML tal
// como lo entrega WordPress (estilizado con la clase prose-n33) y genera los
// metadatos Open Graph para compartir en redes sociales.
// ============================================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { getArticleBySlug } from "@/lib/api/news";
import { newsArticleJsonLd } from "@/lib/seo";

// El contenido de una nota rara vez cambia: se regenera cada 5 minutos
export const revalidate = 300;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

/** Metadatos dinámicos: título, descripción y Open Graph de la noticia. */
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Noticia no encontrada" };
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="animate-fade-up mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Datos estructurados NewsArticle para resultados enriquecidos */}
      <JsonLd data={newsArticleJsonLd(article)} />

      <div className="flex items-center gap-3 text-sm">
        <Link
          href={`/categoria/${article.category.slug}`}
          className="font-semibold uppercase tracking-wide text-n33-primary transition-colors duration-300 hover:text-n33-primary-dark"
        >
          {article.category.name}
        </Link>
        <span aria-hidden="true" className="text-n33-muted">
          ·
        </span>
        <time dateTime={article.publishedAt} className="text-n33-muted">
          {new Intl.DateTimeFormat("es-MX", {
            dateStyle: "long",
            timeStyle: "short",
          }).format(new Date(article.publishedAt))}
        </time>
      </div>

      <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
        {article.title}
      </h1>

      {article.author && (
        <p className="mt-3 text-sm text-n33-muted">Por {article.author.name}</p>
      )}

      {article.coverImageUrl && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-n33-muted/10 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.4)]">
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {article.content ? (
        <div
          className="prose-n33 mt-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <p className="mt-8 text-base leading-8">{article.excerpt}</p>
      )}
    </article>
  );
}
