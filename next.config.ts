import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dominios externos permitidos para next/image
    remotePatterns: [
      {
        // Imágenes de las noticias (biblioteca de medios de WordPress)
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
};

export default nextConfig;
