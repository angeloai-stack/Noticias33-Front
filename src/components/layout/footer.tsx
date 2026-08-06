// ============================================================================
// Pie de página rojo: categorías, enlaces legales, logo, redes sociales,
// copyright y crédito de la agencia.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/ui/social-icon";
import { socialLinks } from "@/lib/config/social-links";
import { footerNav } from "@/lib/config/site";

/** Enlaces legales/institucionales de la segunda fila. */
const secondaryLinks = [
  { label: "Contacto", href: "/contacto" },
  { label: "Sobre nosotros", href: "/sobre-nosotros" },
  { label: "Términos de uso", href: "/terminos-de-uso" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
];

export function Footer() {
  return (
    <footer className="bg-n33-primary text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-10 sm:py-12 lg:px-[170px]">
        {/* Categorías: siempre en una sola línea, con scroll horizontal si no cabe */}
        <nav aria-label="Categorías del pie de página">
          <ul className="scrollbar-hide flex flex-nowrap gap-x-5 overflow-x-auto sm:gap-x-6">
            {footerNav.map((item) => (
              <li key={item.label} className="shrink-0">
                <Link
                  href={item.href}
                  className="inline-block font-helvetica text-[13px] font-bold whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 hover:underline hover:opacity-90 sm:text-[15px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <hr className="mt-6 border-white sm:mt-8" />

        {/* Enlaces secundarios */}
        <nav aria-label="Enlaces legales" className="mt-6 sm:mt-9">
          <ul className="flex flex-wrap gap-x-10 gap-y-3 sm:gap-x-14">
            {secondaryLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="inline-block font-helvetica text-[17px] font-light transition-all duration-300 hover:-translate-y-0.5 hover:underline hover:opacity-90 sm:text-[21.77px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logo + redes sociales */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-8 sm:mt-12">
          <Image
            src="/design/logo-n33-footer.png"
            alt="N33 Noticias 33"
            width={93}
            height={105}
            className="h-[80px] w-auto object-contain drop-shadow-lg transition-transform duration-500 hover:scale-105 sm:h-[105px] sm:w-[93px]"
          />
          <div
            className="flex items-center gap-3 sm:gap-4"
            aria-label="Síguenos en redes sociales"
          >
            {socialLinks.map((icon) => (
              <a
                key={icon.name}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={icon.name}
                className="text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-80"
              >
                <SocialIcon icon={icon} className="h-8.5 w-8.5 sm:h-10.75 sm:w-10.75" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 sm:mt-10">
          <p className="font-helvetica text-[15px] font-light sm:text-[21.77px]">
            ® Noticias 33&nbsp;&nbsp;www.noticias33.com
          </p>
          <p className="font-helvetica text-[15px] font-light sm:text-[21.77px]">
            Todos los derechos reservados
          </p>
        </div>

        {/* Crédito de la agencia */}
        <div className="mt-2 text-right text-[11px]">
          <a
            href="https://voltlabagency.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Sitio por: Volt Lab Agency
          </a>
        </div>
      </div>
    </footer>
  );
}
