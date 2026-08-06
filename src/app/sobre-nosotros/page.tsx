// ============================================================================
// Página institucional (/sobre-nosotros). Contenido estático, enlazado desde
// el pie de página.
// ============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "Noticias 33: medio de comunicación binacional que informa lo que pasa en Baja California y California.",
};

export default function AboutPage() {
  return (
    <div className="animate-fade-up mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        Sobre nosotros
      </h1>

      <div className="prose-n33 mt-8">
        <p>
          Somos un medio de comunicación binacional enfocado a informar los
          acontecimientos que se registran tanto en Baja California como en
          California, uniendo a una comunidad que históricamente ha
          compartido actividades sociales, económicas, gubernamentales,
          educativas, comerciales, entre otras, por ello y ante la ausencia de
          una verdadera cobertura de ambas entidades fronterizas, surge N33.
        </p>
        <p>
          Aquí encontrará información oficial, acontecimientos del momento e
          información con sentido social, dando voz a las y los ciudadanos y
          a cada historia detrás de ellos, pues la información es de, y para
          las personas.
        </p>
      </div>
    </div>
  );
}
