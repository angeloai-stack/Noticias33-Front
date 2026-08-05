// ============================================================================
// Página 404: se muestra cuando la ruta no existe o cuando una página llama
// a notFound() (ej. noticia o categoría inexistente).
// ============================================================================

import Link from "next/link";
import { AdPlaceholder } from "@/components/news/ad-placeholder";
import { ADS } from "@/lib/config/ads";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-n33-primary">
        404
      </p>
      <h1 className="mt-3 text-3xl font-black text-n33-foreground">
        Página no encontrada
      </h1>
      <p className="mt-4 text-n33-muted">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-n33-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-n33-primary-dark"
      >
        Ir al inicio
      </Link>

      {/* Publicidad */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
        <AdPlaceholder className="h-69.75 w-29" ad={ADS.voltlabRail} sizes="116px" />
        <AdPlaceholder
          className="h-92 w-63.25"
          ad={ADS.voltlabSidebar}
          sizes="253px"
        />
      </div>
      <div className="mt-6 flex justify-center">
        <AdPlaceholder
          className="aspect-1034/145 w-full max-w-258.5"
          ad={ADS.propertyDreamz}
          sizes="(min-width: 1034px) 1034px, 100vw"
        />
      </div>
    </div>
  );
}
