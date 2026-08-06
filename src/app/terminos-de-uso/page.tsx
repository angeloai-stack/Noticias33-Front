// ============================================================================
// Términos de uso (/terminos-de-uso). Contenido legal estático, enlazado
// desde el pie de página.
// ============================================================================

import type { Metadata } from "next";
import { LegalToc } from "@/components/layout/legal-toc";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Términos de uso de Noticias 33: cookies, uso de inteligencia artificial, correcciones, contenido enviado por usuarios y publicidad.",
};

const SECTIONS = [
  {
    id: "cookies",
    title: "Uso de cookies",
    body: (
      <p>
        Noticias 33 utiliza cookies y tecnologías similares para mejorar la
        experiencia de navegación, analizar el uso del sitio web y optimizar
        su funcionamiento. Al continuar utilizando este sitio, el usuario
        acepta el uso de dichas tecnologías de conformidad con nuestro Aviso
        de Privacidad. El usuario podrá configurar o deshabilitar las
        cookies desde su navegador; sin embargo, algunas funciones del sitio
        podrían verse afectadas.
      </p>
    ),
  },
  {
    id: "inteligencia-artificial",
    title: "Uso de inteligencia artificial",
    body: (
      <p>
        Noticias 33 podrá utilizar herramientas de inteligencia artificial
        como apoyo en procesos de redacción, traducción, transcripción,
        edición de audio, video e imágenes, así como para optimizar procesos
        internos de producción de contenido. Todo el material publicado es
        revisado por el equipo editorial antes de su difusión con el fin de
        procurar su precisión, calidad y apego a los principios
        periodísticos.
      </p>
    ),
  },
  {
    id: "correcciones",
    title: "Correcciones y actualizaciones",
    body: (
      <p>
        Noticias 33 mantiene el compromiso de ofrecer información verificada
        y actualizada. Si una publicación contiene un error, dato inexacto o
        requiere información adicional derivada de nuevos acontecimientos,
        el contenido podrá ser corregido, actualizado o complementado en
        cualquier momento, dejando constancia cuando resulte procedente.
      </p>
    ),
  },
  {
    id: "rectificacion",
    title: "Solicitud de rectificación",
    body: (
      <p>
        Las personas que consideren que una publicación contiene información
        incorrecta o que afecte sus derechos podrán solicitar una revisión a
        través de los canales oficiales de contacto de Noticias 33. Cada
        solicitud será analizada conforme a los criterios editoriales y, en
        caso de ser procedente, se realizarán las correcciones o
        aclaraciones correspondientes.
      </p>
    ),
  },
  {
    id: "contenido-de-usuarios",
    title: "Contenido enviado por usuarios",
    body: (
      <p>
        Al enviar fotografías, videos, documentos, testimonios o cualquier
        otro material a Noticias 33, el usuario declara contar con los
        derechos o autorizaciones necesarias para compartir dicho contenido
        y otorga una autorización no exclusiva para su uso, reproducción,
        edición y publicación con fines informativos en cualquiera de las
        plataformas de Noticias 33, salvo que se acuerde expresamente lo
        contrario.
      </p>
    ),
  },
  {
    id: "publicidad",
    title: "Contenido patrocinado y publicidad",
    body: (
      <p>
        Algunas publicaciones podrán corresponder a contenido patrocinado o
        espacios publicitarios, los cuales serán identificados cuando
        corresponda. La responsabilidad sobre los productos, servicios o
        promociones anunciados recae exclusivamente en los anunciantes, por
        lo que Noticias 33 no garantiza su disponibilidad, calidad o
        resultados.
      </p>
    ),
  },
  {
    id: "jurisdiccion",
    title: "Jurisdicción aplicable",
    body: (
      <p>
        Los presentes Términos de Uso se interpretarán y regirán de
        conformidad con las leyes de los Estados Unidos Mexicanos. Cualquier
        controversia derivada del uso del sitio web será sometida a la
        jurisdicción de los tribunales competentes de Tijuana, Baja
        California, salvo disposición legal en contrario.
      </p>
    ),
  },
];

export default function TermsOfUsePage() {
  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Aviso legal"
        title="Términos de uso"
        description="Las condiciones que rigen el uso del sitio web y del contenido de Noticias 33."
      />

      <div className="mx-auto max-w-5xl gap-12 px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[220px_1fr] lg:px-8 lg:py-14">
        <LegalToc
          items={SECTIONS.map((section) => ({
            id: section.id,
            label: section.title,
          }))}
        />

        <div className="rounded-2xl bg-n33-surface p-6 shadow-[0_16px_35px_-24px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="prose-n33">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
