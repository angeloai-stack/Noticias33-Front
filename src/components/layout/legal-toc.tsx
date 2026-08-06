// ============================================================================
// Índice de contenido para páginas legales largas (Política de privacidad,
// Términos de uso). En móvil es un acordeón plegable arriba del texto; en
// escritorio, una barra lateral fija junto al contenido. Enlaza por ancla a
// los <h2 id="..."> de cada sección.
// ============================================================================

export type LegalTocItem = {
  id: string;
  label: string;
};

export function LegalToc({ items }: { items: LegalTocItem[] }) {
  return (
    <>
      {/* Móvil: acordeón plegable arriba del contenido */}
      <details className="mb-8 rounded-2xl border border-n33-border bg-n33-surface lg:hidden">
        <summary className="cursor-pointer list-none px-5 py-4 font-helvetica text-sm font-bold text-n33-blue">
          Índice de contenido
        </summary>
        <ul className="border-t border-n33-border px-5 py-3">
          {items.map((item) => (
            <li key={item.id} className="py-1.5">
              <a
                href={`#${item.id}`}
                className="text-sm text-n33-muted transition-colors duration-200 hover:text-n33-primary"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </details>

      {/* Escritorio: barra lateral fija */}
      <nav
        aria-label="Índice de contenido"
        className="hidden lg:sticky lg:top-28 lg:block lg:self-start"
      >
        <p className="font-helvetica text-xs font-bold uppercase tracking-wide text-n33-muted">
          Contenido
        </p>
        <ul className="mt-3 space-y-2.5 border-l border-n33-border pl-4">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm text-n33-muted transition-colors duration-200 hover:text-n33-primary"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
