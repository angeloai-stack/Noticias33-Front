// ============================================================================
// Pie de página rojo: categorías, enlaces legales, logo, redes sociales,
// copyright y accesos discretos a /publicar y /admin para el equipo.
// ============================================================================

import Image from "next/image";
import Link from "next/link";
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
        {/* Categorías */}
        <nav aria-label="Categorías del pie de página">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 sm:justify-between sm:gap-x-10">
            {footerNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="inline-block font-helvetica text-[17px] font-bold transition-all duration-300 hover:-translate-y-0.5 hover:underline hover:opacity-90 sm:text-[21.77px]"
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
          <Image
            src="/design/social-icons.svg"
            alt="Síguenos en X, YouTube, Instagram, TikTok, LinkedIn y Facebook"
            width={332}
            height={43}
            className="h-[34px] w-auto transition-opacity duration-300 hover:opacity-80 sm:h-[43px]"
          />
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

        {/* Accesos internos (redacción/administración) + crédito de la agencia */}
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="flex gap-4">
            <Link
              href="/publicar"
              className="opacity-70 transition-opacity duration-300 hover:underline hover:opacity-100"
            >
              Redacción
            </Link>
            <Link
              href="/admin"
              className="opacity-70 transition-opacity duration-300 hover:underline hover:opacity-100"
            >
              Administración
            </Link>
          </span>
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
