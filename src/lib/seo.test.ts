import { describe, expect, it } from "vitest";
import {
  categoryJsonLd,
  newsArticleJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import type { Article } from "@/types/news";

// En el entorno de pruebas NEXT_PUBLIC_SITE_URL no está definida, por lo que
// siteConfig.url cae en el valor por defecto.
const BASE = "http://localhost:3000";

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: "1",
    title: "Titular de prueba",
    slug: "titular-de-prueba",
    excerpt: "Resumen de prueba",
    content: "<p>Cuerpo</p>",
    coverImageUrl: "https://noticias33.com/img.jpg",
    publishedAt: "2026-06-12T14:40:46Z",
    updatedAt: "2026-06-13T09:00:00Z",
    category: { id: "5", name: "Deportes", slug: "deportes" },
    author: { id: "7", name: "Ana Reportera" },
    ...overrides,
  };
}

describe("websiteJsonLd", () => {
  const data = websiteJsonLd();

  it("declara el contexto schema.org con un @graph", () => {
    expect(data["@context"]).toBe("https://schema.org");
    expect(Array.isArray(data["@graph"])).toBe(true);
  });

  it("incluye la organización y el sitio web enlazados", () => {
    const graph = data["@graph"] as Array<Record<string, unknown>>;
    const org = graph.find((n) => n["@type"] === "NewsMediaOrganization");
    const site = graph.find((n) => n["@type"] === "WebSite");

    expect(org?.["@id"]).toBe(`${BASE}/#organization`);
    expect(site?.publisher).toEqual({ "@id": `${BASE}/#organization` });
  });

  it("expone el buscador interno como SearchAction", () => {
    const graph = data["@graph"] as Array<Record<string, unknown>>;
    const site = graph.find((n) => n["@type"] === "WebSite");
    const action = site?.potentialAction as Record<string, unknown>;
    const target = action.target as Record<string, unknown>;

    expect(action["@type"]).toBe("SearchAction");
    expect(target.urlTemplate).toBe(
      `${BASE}/buscar?q={search_term_string}`,
    );
  });
});

describe("newsArticleJsonLd", () => {
  it("mapea los campos principales de la noticia", () => {
    const data = newsArticleJsonLd(makeArticle());

    expect(data["@type"]).toBe("NewsArticle");
    expect(data.headline).toBe("Titular de prueba");
    expect(data.articleSection).toBe("Deportes");
    expect(data.datePublished).toBe("2026-06-12T14:40:46Z");
    expect(data.dateModified).toBe("2026-06-13T09:00:00Z");
    expect(data.image).toEqual(["https://noticias33.com/img.jpg"]);
    expect((data.mainEntityOfPage as Record<string, unknown>)["@id"]).toBe(
      `${BASE}/noticia/titular-de-prueba`,
    );
  });

  it("usa la fecha de publicación como dateModified si no hay actualización", () => {
    const data = newsArticleJsonLd(makeArticle({ updatedAt: undefined }));
    expect(data.dateModified).toBe("2026-06-12T14:40:46Z");
  });

  it("marca al autor como Person cuando existe", () => {
    const data = newsArticleJsonLd(makeArticle());
    expect(data.author).toEqual([{ "@type": "Person", name: "Ana Reportera" }]);
  });

  it("recurre a la organización como autor cuando la nota no tiene firma", () => {
    const data = newsArticleJsonLd(makeArticle({ author: undefined }));
    expect(data.author).toEqual([
      { "@type": "Organization", name: "Noticias 33" },
    ]);
  });

  it("deja la imagen como undefined cuando no hay portada", () => {
    const data = newsArticleJsonLd(makeArticle({ coverImageUrl: undefined }));
    expect(data.image).toBeUndefined();
  });
});

describe("categoryJsonLd", () => {
  it("genera una CollectionPage con la lista ordenada de noticias", () => {
    const articles = [
      makeArticle({ slug: "nota-a", title: "Nota A" }),
      makeArticle({ slug: "nota-b", title: "Nota B" }),
    ];
    const data = categoryJsonLd("Deportes", "deportes", articles);

    expect(data["@type"]).toBe("CollectionPage");
    expect(data.url).toBe(`${BASE}/categoria/deportes`);

    const list = data.mainEntity as { itemListElement: Array<Record<string, unknown>> };
    expect(list.itemListElement).toHaveLength(2);
    expect(list.itemListElement[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      url: `${BASE}/noticia/nota-a`,
      name: "Nota A",
    });
    expect(list.itemListElement[1].position).toBe(2);
  });

  it("produce una lista vacía cuando no hay noticias", () => {
    const data = categoryJsonLd("Clima", "clima", []);
    const list = data.mainEntity as { itemListElement: unknown[] };
    expect(list.itemListElement).toEqual([]);
  });
});
