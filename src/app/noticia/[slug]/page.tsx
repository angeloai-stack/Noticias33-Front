// ============================================================================
// Detalle de una noticia (/noticia/[slug]). Renderiza el contenido HTML tal
// como lo entrega WordPress (estilizado con la clase prose-n33) y genera los
// metadatos Open Graph para compartir en redes sociales.
// ============================================================================

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdPlaceholder } from "@/components/news/ad-placeholder";
import { FollowUsSocial } from "@/components/news/follow-us-social";
import { RelatedArticlesCarousel } from "@/components/news/related-articles-carousel";
import { ShareButtons } from "@/components/news/share-buttons";
import { JsonLd } from "@/components/seo/json-ld";
import { getArticleBySlug, getRelatedArticles } from "@/lib/api/news";
import { ADS } from "@/lib/config/ads";
import { newsArticleJsonLd } from "@/lib/seo";

// El contenido de una nota rara vez cambia: se regenera cada 5 minutos
export const revalidate = 300;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Corta el HTML del contenido justo después del n-ésimo párrafo, para poder
 * insertar un anuncio a la mitad de la nota. Si el contenido tiene menos
 * párrafos que `paragraphIndex`, devuelve todo en `before` y `after` vacío
 * (no se inserta el anuncio intermedio).
 */
function splitContentAtParagraph(html: string, paragraphIndex: number) {
  const lowerHtml = html.toLowerCase();
  const closingTag = "</p>";
  let cursor = 0;

  for (let i = 0; i < paragraphIndex; i++) {
    const nextIndex = lowerHtml.indexOf(closingTag, cursor);
    if (nextIndex === -1) {
      return { before: html, after: "" };
    }
    cursor = nextIndex + closingTag.length;
  }

  return { before: html.slice(0, cursor), after: html.slice(cursor) };
}

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

  const { related, byAuthor } = await getRelatedArticles(article);

  // El anuncio intermedio se inserta tras el 3er párrafo del cuerpo, si lo hay
  const { before: contentBeforeAd, after: contentAfterAd } = article.content
    ? splitContentAtParagraph(article.content, 3)
    : { before: "", after: "" };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10">
      {/* Publicidad horizontal, arriba de la nota */}
      <div className="mb-8 flex justify-center lg:mb-10">
        <AdPlaceholder
          className="aspect-1034/145 w-full max-w-258.5"
          ad={ADS.propertyDreamz}
          sizes="(min-width: 1034px) 1034px, 100vw"
        />
      </div>

      <div className="flex gap-8">
        {/* Riel izquierdo: publicidad */}
        <aside
          aria-label="Publicidad"
          className="hidden w-29 shrink-0 flex-col gap-6 xl:flex"
        >
          <AdPlaceholder
            className="h-69.75 w-29"
            ad={ADS.voltlabRail}
            sizes="116px"
          />
        </aside>

        <article className="animate-fade-up min-w-0 max-w-3xl flex-1 py-4">
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
            <>
              <div
                className="prose-n33 mt-8"
                dangerouslySetInnerHTML={{ __html: contentBeforeAd }}
              />

              {/* Publicidad, a la mitad del cuerpo de la noticia */}
              {contentAfterAd && (
                <>
                  <div className="my-8 flex justify-center">
                    <AdPlaceholder
                      className="aspect-1034/145 w-full max-w-md"
                      ad={ADS.propertyDreamz}
                      sizes="(max-width: 768px) 100vw, 448px"
                    />
                  </div>
                  <div
                    className="prose-n33"
                    dangerouslySetInnerHTML={{ __html: contentAfterAd }}
                  />
                </>
              )}
            </>
          ) : (
            <p className="mt-8 text-base leading-8 text-justify">{article.excerpt}</p>
          )}

          <ShareButtons slug={article.slug} title={article.title} />

          {/* Publicidad, tras el cuerpo de la noticia */}
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
              className="aspect-1034/145 w-full"
              ad={ADS.propertyDreamz}
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>

          {/* Artículos relacionados y más del autor */}
          <RelatedArticlesCarousel related={related} byAuthor={byAuthor} />
        </article>

        {/* Riel derecho: publicidad y redes sociales */}
        <aside
          aria-label="Publicidad y redes sociales"
          className="hidden w-63.25 shrink-0 flex-col gap-6 lg:flex"
        >
          <AdPlaceholder
            className="h-92 w-63.25"
            ad={ADS.voltlabSidebar}
            sizes="253px"
          />
          <FollowUsSocial />
        </aside>
      </div>
    </div>
  );
}
