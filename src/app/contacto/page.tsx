// ============================================================================
// Página de contacto (/contacto). Contenido estático, enlazado desde el pie
// de página; sin formulario por ahora, solo medios directos de contacto.
// ============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Medios de contacto de Noticias 33: correo, WhatsApp y redes sociales.",
};

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61572235200687&locale=es_LA",
  },
  { name: "Instagram", href: "https://www.instagram.com/noticias33oficial/" },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@noticias33oficial?is_from_webapp=1&sender_device=pc",
  },
  { name: "YouTube", href: "https://www.youtube.com/@Noticias33oficial" },
];

export default function ContactPage() {
  return (
    <div className="animate-fade-up mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        Contacto
      </h1>

      <div className="prose-n33 mt-8">
        <p>
          Correo electrónico:
          <br />
          <a href="mailto:contacto@noticias33.com">contacto@noticias33.com</a>
        </p>

        <p>
          WhatsApp:
          <br />
          <a
            href="https://wa.me/16643011616"
            target="_blank"
            rel="noopener noreferrer"
          >
            664 301 1616
          </a>
        </p>

        <p>Redes sociales:</p>
        <ul>
          {SOCIAL_LINKS.map((social) => (
            <li key={social.name}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                {social.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
