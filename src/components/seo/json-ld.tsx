// ============================================================================
// <JsonLd>: inserta datos estructurados (schema.org) como script
// application/ld+json. Los buscadores y las IA los usan para entender el
// contenido (organización, noticias, etc.) y mostrar resultados enriquecidos.
// ============================================================================

type JsonLdProps = {
  /** Objeto schema.org ya construido (con @context y @type). */
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Se escapa "<" para impedir inyección de HTML dentro del script
        // (recomendación de la guía oficial de Next.js para JSON-LD)
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
