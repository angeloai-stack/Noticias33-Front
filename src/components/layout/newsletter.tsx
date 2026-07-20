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
        className="object-cover"
        sizes="100vw"
      />

      <div className="relative mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-10 px-6 py-14 sm:py-24 lg:px-[190px]">
        <div className="w-full sm:w-auto">
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

        <div className="hidden flex-col items-center gap-2 lg:flex">
          <Image
            src="/design/logo-n33-footer.png"
            alt="N33 Noticias 33"
            width={140}
            height={158}
            className="h-auto w-[140px] object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
          />
          <p className="text-center text-[14px] text-white">
            @noticia33
            <br />
            www.noticias33.com
          </p>
        </div>
      </div>
    </section>
  );
}
