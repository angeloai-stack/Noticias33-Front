// ============================================================================
// Bloque azul de suscripción al newsletter que aparece antes del footer en
// todas las páginas. La imagen de fondo y los titulares son estáticos; el
// formulario (NewsletterForm) es un componente de cliente que envía los
// datos a /api/newsletter.
// ============================================================================

import Image from "next/image";
import { NewsletterForm } from "@/components/layout/newsletter-form";

export function Newsletter() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="relative overflow-hidden bg-n33-blue"
    >
      <Image
        src="/design/newsletter-bg.jpg"
        alt=""
        fill
        className="animate-ken-burns object-cover object-[20%_center] sm:object-center"
        sizes="100vw"
      />

      {/* Degradado hacia el azul de marca detrás del texto/formulario, para
          que nunca queden literalmente encimados sobre las personas de la
          foto, sin importar cómo recorte object-cover en cada ancho. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-n33-blue from-40% via-n33-blue/90 via-70% to-n33-blue/20 sm:from-n33-blue sm:from-0% sm:via-n33-blue/60 sm:via-40% sm:to-transparent"
      />

      <div className="relative mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-10 px-6 py-14 sm:py-24 lg:px-[190px]">
        <div className="animate-fade-up w-full sm:w-auto">
          <h2
            id="newsletter-heading"
            className="font-condensed uppercase text-white"
          >
            <span className="block text-[20px] font-bold leading-tight sm:text-[30px]">
              Síguenos para mantenerte
            </span>
            <span className="block text-[46px] font-bold leading-[0.85] sm:text-[71px]">
              informado
            </span>
          </h2>

          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
