import { describe, expect, it } from "vitest";
import { mapWpPostToArticle } from "@/lib/api/mappers";
import type { WpPost } from "@/lib/api/wp-types";

/** Crea un WpPost de prueba, permitiendo sobrescribir cualquier campo. */
function makePost(overrides: Partial<WpPost> = {}): WpPost {
  return {
    id: 42,
    date_gmt: "2026-06-12T14:40:46",
    modified_gmt: "2026-06-13T09:00:00",
    slug: "una-noticia",
    link: "https://noticias33.com/una-noticia",
    sticky: false,
    title: { rendered: "Título de prueba" },
    content: { rendered: "<p>Cuerpo</p>" },
    excerpt: { rendered: "<p>Resumen</p>" },
    categories: [6],
    _embedded: {
      "wp:term": [
        [{ id: 6, name: "Gobierno", slug: "gobierno", taxonomy: "category" }],
      ],
    },
    ...overrides,
  };
}

describe("mapWpPostToArticle", () => {
  it("mapea los campos básicos y convierte el id a string", () => {
    const article = mapWpPostToArticle(makePost());

    expect(article.id).toBe("42");
    expect(article.slug).toBe("una-noticia");
    expect(article.title).toBe("Título de prueba");
    expect(article.content).toBe("<p>Cuerpo</p>");
  });

  it("añade la 'Z' de UTC a las fechas GMT de WordPress", () => {
    const article = mapWpPostToArticle(makePost());

    expect(article.publishedAt).toBe("2026-06-12T14:40:46Z");
    expect(article.updatedAt).toBe("2026-06-13T09:00:00Z");
    // Debe ser una fecha válida al parsearla
    expect(Number.isNaN(new Date(article.publishedAt).getTime())).toBe(false);
  });

  it("limpia las etiquetas HTML del título y el extracto", () => {
    const article = mapWpPostToArticle(
      makePost({
        title: { rendered: "<b>Hola</b> mundo" },
        excerpt: { rendered: "<p>Un <em>resumen</em> corto</p>" },
      }),
    );

    expect(article.title).toBe("Hola mundo");
    expect(article.excerpt).toBe("Un resumen corto");
  });

  it("decodifica las entidades HTML más comunes", () => {
    const article = mapWpPostToArticle(
      makePost({
        title: { rendered: "Tacos &amp; salsa&nbsp;picante &#8220;especial&#8221;" },
        // WordPress trunca los extractos con la elipsis entre corchetes
        excerpt: { rendered: "Frase &#8216;citada&#8217; [&hellip;]" },
      }),
    );

    expect(article.title).toBe('Tacos & salsa picante "especial"');
    expect(article.excerpt).toBe("Frase 'citada' …");
  });

  it("usa la categoría 'General' cuando el post no tiene términos", () => {
    const article = mapWpPostToArticle(
      makePost({ _embedded: {} }),
    );

    expect(article.category).toEqual({
      id: "0",
      name: "General",
      slug: "general",
    });
  });

  it("toma la categoría e ignora los términos que son etiquetas (tags)", () => {
    const article = mapWpPostToArticle(
      makePost({
        _embedded: {
          "wp:term": [
            [
              { id: 99, name: "Exclusiva", slug: "exclusiva", taxonomy: "post_tag" },
              { id: 5, name: "Deportes", slug: "deportes", taxonomy: "category" },
            ],
          ],
        },
      }),
    );

    expect(article.category).toEqual({
      id: "5",
      name: "Deportes",
      slug: "deportes",
    });
  });

  it("mapea el autor con su avatar de 48px", () => {
    const article = mapWpPostToArticle(
      makePost({
        _embedded: {
          author: [
            {
              id: 7,
              name: "Ana Reportera",
              avatar_urls: { "48": "https://gravatar.com/a48.jpg" },
            },
          ],
        },
      }),
    );

    expect(article.author).toEqual({
      id: "7",
      name: "Ana Reportera",
      avatarUrl: "https://gravatar.com/a48.jpg",
    });
  });

  it("deja el autor como undefined cuando no viene embebido", () => {
    const article = mapWpPostToArticle(makePost({ _embedded: {} }));
    expect(article.author).toBeUndefined();
  });

  it("extrae la imagen destacada y refleja el estado 'sticky'", () => {
    const withMedia = mapWpPostToArticle(
      makePost({
        sticky: true,
        _embedded: {
          "wp:featuredmedia": [{ source_url: "https://noticias33.com/img.jpg" }],
        },
      }),
    );

    expect(withMedia.coverImageUrl).toBe("https://noticias33.com/img.jpg");
    expect(withMedia.isFeatured).toBe(true);

    const withoutMedia = mapWpPostToArticle(makePost());
    expect(withoutMedia.coverImageUrl).toBeUndefined();
    expect(withoutMedia.isFeatured).toBe(false);
  });
});
