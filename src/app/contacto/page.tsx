// ============================================================================
// Página de contacto (/contacto). Contenido estático, enlazado desde el pie
// de página; sin formulario por ahora, solo medios directos de contacto.
// ============================================================================

import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { SocialIcon } from "@/components/ui/social-icon";
import { socialLinks } from "@/lib/config/social-links";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Medios de contacto de Noticias 33: correo, WhatsApp y redes sociales.",
};

const DIRECT_CONTACTS = [
  {
    name: "Correo electrónico",
    value: "contacto@noticias33.com",
    href: "mailto:contacto@noticias33.com",
    icon: "✉️",
  },
  {
    name: "WhatsApp",
    value: "664 301 1616",
    href: "https://wa.me/16643011616",
    icon: "💬",
  },
];

export default function ContactPage() {
  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Estamos aquí"
        title="Contacto"
        description="Escríbenos por correo o WhatsApp, o síguenos en nuestras redes sociales."
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {DIRECT_CONTACTS.map((contact) => (
              <a
                key={contact.name}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 rounded-2xl bg-n33-surface p-8 text-center shadow-[0_16px_35px_-24px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-18px_rgba(31,95,170,0.35)]"
              >
                <span className="text-4xl" aria-hidden="true">
                  {contact.icon}
                </span>
                <p className="mt-2 font-helvetica text-base font-bold text-n33-blue">
                  {contact.name}
                </p>
                <p className="text-sm text-n33-muted transition-colors duration-300 group-hover:text-n33-primary">
                  {contact.value}
                </p>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <p className="text-center font-helvetica text-sm font-bold uppercase tracking-wide text-n33-muted">
            Síguenos en redes
          </p>
          <div className="mt-5 flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex size-14 items-center justify-center rounded-full bg-n33-blue text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-blue-dark hover:shadow-lg"
              >
                <SocialIcon icon={social} className="h-6 w-6" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
