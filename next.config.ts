import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dominios externos permitidos para next/image
    remotePatterns: [
      {
        // Imágenes de las noticias (biblioteca de medios de WordPress)
        protocol: "https",
        hostname: "cms.noticias33.com",
      },
      {
        // Compatibilidad con imágenes antiguas que aún referencien el dominio raíz
        protocol: "https",
        hostname: "noticias33.com",
      },
      {
        // Avatares de los autores (Gravatar)
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
    ],
  },

  // Los permalinks originales de WordPress tienen la forma
  // /{categoria}/{yyyy}/{mm}/{dd}/{slug}/. Se redirigen a la ruta del front
  // para no perder el tráfico e indexación ya existentes de Google.
  async redirects() {
    return [
      {
        source: "/:category/:yyyy(\\d{4})/:mm(\\d{2})/:dd(\\d{2})/:slug",
        destination: "/noticia/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
