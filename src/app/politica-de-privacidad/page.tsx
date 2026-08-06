// ============================================================================
// Aviso/política de privacidad (/politica-de-privacidad). Contenido legal
// estático, enlazado desde el pie de página.
// ============================================================================

import type { Metadata } from "next";
import { LegalToc } from "@/components/layout/legal-toc";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Aviso de privacidad de Noticias 33: datos personales que recabamos, finalidades del tratamiento y derechos ARCO.",
};

const SECTIONS = [
  {
    id: "responsable",
    title: "Responsable del tratamiento de los datos personales",
    body: (
      <p>
        Noticias 33, con domicilio en Tijuana, Baja California, es
        responsable del tratamiento de los datos personales recabados a
        través de este sitio web y de sus plataformas digitales, de
        conformidad con la Ley Federal de Protección de Datos Personales en
        Posesión de los Particulares, su Reglamento y demás disposiciones
        aplicables.
      </p>
    ),
  },
  {
    id: "datos-que-recabamos",
    title: "Datos personales que recabamos",
    body: (
      <>
        <p>
          Dependiendo de la interacción con nuestros servicios, podremos
          recabar los siguientes datos personales:
        </p>
        <ul>
          <li>Nombre completo.</li>
          <li>Correo electrónico.</li>
          <li>Número telefónico.</li>
          <li>
            Información contenida en mensajes enviados mediante formularios
            de contacto.
          </li>
          <li>
            Material multimedia enviado por los usuarios, incluyendo
            fotografías, videos y documentos.
          </li>
          <li>
            Dirección IP, navegador, sistema operativo y datos de navegación.
          </li>
          <li>Información obtenida mediante cookies y tecnologías similares.</li>
        </ul>
        <p>
          Noticias 33 no solicita ni trata deliberadamente datos personales
          sensibles. En caso de que el usuario proporcione este tipo de
          información de manera voluntaria, será tratada únicamente cuando
          resulte estrictamente necesaria para atender la solicitud
          correspondiente y conforme a la legislación aplicable.
        </p>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Finalidades del tratamiento",
    body: (
      <>
        <p>
          Los datos personales serán utilizados para las siguientes
          finalidades primarias:
        </p>
        <ul>
          <li>Dar respuesta a solicitudes de información.</li>
          <li>Atender reportes ciudadanos y denuncias.</li>
          <li>Dar seguimiento a comunicaciones enviadas por los usuarios.</li>
          <li>Verificar información proporcionada para fines periodísticos.</li>
          <li>Mejorar el funcionamiento y la seguridad del sitio web.</li>
          <li>
            Cumplir obligaciones legales y requerimientos de autoridades
            competentes.
          </li>
        </ul>
        <p>
          Como finalidades secundarias, y únicamente cuando resulte
          aplicable, los datos podrán utilizarse para enviar comunicados,
          boletines, invitaciones o información relacionada con Noticias 33.
          El usuario podrá manifestar su negativa para estas finalidades en
          cualquier momento.
        </p>
      </>
    ),
  },
  {
    id: "transferencia",
    title: "Transferencia de datos personales",
    body: (
      <>
        <p>
          Noticias 33 no venderá, rentará ni comercializará los datos
          personales de sus usuarios.
        </p>
        <p>Los datos únicamente podrán compartirse cuando:</p>
        <ul>
          <li>Exista autorización expresa del titular.</li>
          <li>Sea necesario para cumplir obligaciones legales.</li>
          <li>
            Sea requerido por una autoridad competente conforme a la
            legislación mexicana.
          </li>
          <li>
            Sea indispensable para la prestación de servicios tecnológicos
            relacionados con el funcionamiento del sitio web, bajo acuerdos
            de confidencialidad.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "derechos-arco",
    title: "Derechos ARCO",
    body: (
      <>
        <p>
          El titular de los datos personales podrá ejercer en cualquier
          momento sus derechos de Acceso, Rectificación, Cancelación y
          Oposición (ARCO), así como revocar el consentimiento otorgado para
          el tratamiento de sus datos, mediante solicitud enviada a través de
          los medios oficiales de contacto de Noticias 33.
        </p>
        <p>La solicitud deberá contener, al menos:</p>
        <ul>
          <li>Nombre del titular.</li>
          <li>Medio para recibir respuesta.</li>
          <li>Descripción clara del derecho que desea ejercer.</li>
          <li>
            Documentos que acrediten su identidad o representación legal,
            cuando corresponda.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "medidas-de-seguridad",
    title: "Medidas de seguridad",
    body: (
      <p>
        Noticias 33 adopta medidas administrativas, técnicas y físicas
        razonables para proteger los datos personales contra daño, pérdida,
        alteración, destrucción, acceso o tratamiento no autorizado.
      </p>
    ),
  },
  {
    id: "conservacion",
    title: "Conservación de los datos",
    body: (
      <p>
        Los datos personales serán conservados únicamente durante el tiempo
        necesario para cumplir las finalidades descritas en este aviso,
        atender obligaciones legales o resolver controversias derivadas del
        uso de nuestros servicios.
      </p>
    ),
  },
  {
    id: "autoridad-competente",
    title: "Autoridad competente",
    body: (
      <p>
        Si el titular considera que su derecho a la protección de datos
        personales ha sido vulnerado, podrá acudir al Instituto Nacional de
        Transparencia, Acceso a la Información y Protección de Datos
        Personales (INAI), o a la autoridad que legalmente asuma sus
        funciones, conforme a la legislación vigente.
      </p>
    ),
  },
  {
    id: "cambios-al-aviso",
    title: "Cambios al Aviso de Privacidad",
    body: (
      <p>
        Noticias 33 podrá modificar o actualizar el presente Aviso de
        Privacidad para atender reformas legales, cambios en sus procesos
        internos o nuevos servicios. Las modificaciones serán publicadas en
        este sitio web y surtirán efectos desde la fecha de su publicación.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    body: (
      <>
        <p>
          Para cualquier duda relacionada con este Aviso de Privacidad, el
          tratamiento de datos personales o el ejercicio de los derechos
          ARCO, los titulares podrán comunicarse con Noticias 33 a través de
          los siguientes medios:
        </p>
        <p>
          Correo electrónico:
          <br />
          <a href="mailto:contacto@noticias33.com">contacto@noticias33.com</a>
        </p>
        <p>
          Teléfono:
          <br />
          <a href="tel:+16643011616">(664) 301 1616</a>
        </p>
        <p>
          Redes sociales oficiales:
          <br />
          Facebook, Instagram, TikTok, YouTube y demás plataformas oficiales
          de Noticias 33, disponibles mediante los enlaces e iconos
          publicados en este sitio web.
        </p>
        <p>
          Horario de atención:
          <br />
          Lunes a viernes, de 9:00 a 18:00 horas (hora del Pacífico), salvo
          días inhábiles.
        </p>
        <p>
          Domicilio para efectos legales:
          <br />
          Tijuana, Baja California, México.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Aviso legal"
        title="Política de privacidad"
        description="Cómo recabamos, usamos y protegemos tus datos personales en Noticias 33."
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
