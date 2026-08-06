// ============================================================================
// Página institucional (/sobre-nosotros). Contenido estático, enlazado desde
// el pie de página.
// ============================================================================

import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Noticias 33: medio de comunicación binacional que informa lo que pasa en Baja California y California.",
};

const HIGHLIGHTS = [
  { icon: "🇲🇽", label: "Baja California" },
  { icon: "🇺🇸", label: "California" },
  { icon: "🤝", label: "Comunidad binacional" },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Quiénes somos"
        title="Sobre nosotros"
        description="Un medio binacional para la comunidad que comparte la frontera entre Baja California y California."
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-2xl bg-n33-surface p-6 shadow-[0_16px_35px_-24px_rgba(0,0,0,0.25)] sm:p-10">
            <div className="prose-n33">
              <p>
                Somos un medio de comunicación binacional enfocado a informar
                los acontecimientos que se registran tanto en Baja
                California como en California, uniendo a una comunidad que
                históricamente ha compartido actividades sociales,
                económicas, gubernamentales, educativas, comerciales, entre
                otras, por ello y ante la ausencia de una verdadera cobertura
                de ambas entidades fronterizas, surge N33.
              </p>
              <p>
                Aquí encontrará información oficial, acontecimientos del
                momento e información con sentido social, dando voz a las y
                los ciudadanos y a cada historia detrás de ellos, pues la
                información es de, y para las personas.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-n33-border pt-8 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-n33-background p-4 text-center"
                >
                  <p className="text-2xl" aria-hidden="true">
                    {item.icon}
                  </p>
                  <p className="mt-1 font-helvetica text-sm font-bold text-n33-blue">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
