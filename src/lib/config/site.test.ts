import { describe, expect, it } from "vitest";
import { footerNav, mainNav, siteConfig } from "@/lib/config/site";

describe("siteConfig", () => {
  it("tiene la identidad básica del sitio", () => {
    expect(siteConfig.name).toBe("N33");
    expect(siteConfig.fullName).toBe("Noticias 33");
    expect(siteConfig.locale).toBe("es-MX");
  });
});

describe("mainNav", () => {
  it("todas las categorías tienen enlace absoluto y subcategorías", () => {
    expect(mainNav.length).toBeGreaterThan(0);

    for (const item of mainNav) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.children.length).toBeGreaterThan(0);

      for (const child of item.children) {
        expect(child.label.length).toBeGreaterThan(0);
        // Cada subcategoría enlaza a una categoría o a la búsqueda
        expect(
          child.href.startsWith("/categoria/") ||
            child.href.startsWith("/buscar?q="),
        ).toBe(true);
      }
    }
  });

  it("no repite etiquetas de categorías de primer nivel", () => {
    const labels = mainNav.map((item) => item.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("codifica correctamente los términos de búsqueda con acentos y espacios", () => {
    const politica = mainNav.find((item) => item.label === "Política");
    const camara = politica?.children.find(
      (child) => child.label === "Cámara de diputados",
    );

    expect(camara?.href).toBe(
      `/buscar?q=${encodeURIComponent("cámara de diputados")}`,
    );
    expect(camara?.href).toBe("/buscar?q=c%C3%A1mara%20de%20diputados");
  });
});

describe("footerNav", () => {
  it("todas las entradas apuntan a una página de categoría", () => {
    expect(footerNav.length).toBeGreaterThan(0);

    for (const item of footerNav) {
      expect(item.href.startsWith("/categoria/")).toBe(true);
    }
  });
});
