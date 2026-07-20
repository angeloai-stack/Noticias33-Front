// ============================================================================
// Layout raíz: define el <html>/<body>, carga las fuentes con next/font,
// establece los metadatos por defecto (título, descripción) y envuelve todas
// las páginas con el armazón del sitio (header, newsletter y footer).
// ============================================================================

import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";
import { websiteJsonLd } from "@/lib/seo";
import "./globals.css";

// Fuente principal del cuerpo (variable CSS consumida en globals.css)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Sustituto web de Avenir Next Condensed (titulares del newsletter)
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.fullName,
    // Las páginas internas anteponen su título: "Deportes | Noticias 33"
    template: `%s | ${siteConfig.fullName}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-n33-background text-n33-foreground font-sans">
        {/* Datos estructurados globales: organización + sitio con buscador */}
        <JsonLd data={websiteJsonLd()} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
