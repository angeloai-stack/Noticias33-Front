// ============================================================================
// Banner de encabezado para páginas institucionales/legales (Contacto, Sobre
// nosotros, Política de privacidad, Términos de uso). Reemplaza el <h1>
// plano por una franja azul consistente con la identidad del sitio.
// ============================================================================

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="bg-n33-blue">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8">
        <p className="font-helvetica text-xs font-bold uppercase tracking-widest text-white/70 sm:text-sm">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-condensed text-3xl font-bold uppercase text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
