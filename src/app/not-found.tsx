// ============================================================================
// Página 404: se muestra cuando la ruta no existe o cuando una página llama
// a notFound() (ej. noticia o categoría inexistente).
// ============================================================================

import Link from "next/link";

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
    </div>
  );
}
