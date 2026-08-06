// ============================================================================
// Términos de uso (/terminos-de-uso). Contenido legal estático, enlazado
// desde el pie de página.
// ============================================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de uso",
  description:
    "Términos de uso de Noticias 33: cookies, uso de inteligencia artificial, correcciones, contenido enviado por usuarios y publicidad.",
};

export default function TermsOfUsePage() {
  return (
    <div className="animate-fade-up mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        Términos de uso
      </h1>

      <div className="prose-n33 mt-8">
        <h2>Uso de cookies</h2>
        <p>
          Noticias 33 utiliza cookies y tecnologías similares para mejorar la
          experiencia de navegación, analizar el uso del sitio web y
          optimizar su funcionamiento. Al continuar utilizando este sitio, el
          usuario acepta el uso de dichas tecnologías de conformidad con
          nuestro Aviso de Privacidad. El usuario podrá configurar o
          deshabilitar las cookies desde su navegador; sin embargo, algunas
          funciones del sitio podrían verse afectadas.
        </p>

        <h2>Uso de inteligencia artificial</h2>
        <p>
          Noticias 33 podrá utilizar herramientas de inteligencia artificial
          como apoyo en procesos de redacción, traducción, transcripción,
          edición de audio, video e imágenes, así como para optimizar
          procesos internos de producción de contenido. Todo el material
          publicado es revisado por el equipo editorial antes de su difusión
          con el fin de procurar su precisión, calidad y apego a los
          principios periodísticos.
        </p>

        <h2>Correcciones y actualizaciones</h2>
        <p>
          Noticias 33 mantiene el compromiso de ofrecer información
          verificada y actualizada. Si una publicación contiene un error,
          dato inexacto o requiere información adicional derivada de nuevos
          acontecimientos, el contenido podrá ser corregido, actualizado o
          complementado en cualquier momento, dejando constancia cuando
          resulte procedente.
        </p>

        <h2>Solicitud de rectificación</h2>
        <p>
          Las personas que consideren que una publicación contiene
          información incorrecta o que afecte sus derechos podrán solicitar
          una revisión a través de los canales oficiales de contacto de
          Noticias 33. Cada solicitud será analizada conforme a los criterios
          editoriales y, en caso de ser procedente, se realizarán las
          correcciones o aclaraciones correspondientes.
        </p>

        <h2>Contenido enviado por usuarios</h2>
        <p>
          Al enviar fotografías, videos, documentos, testimonios o cualquier
          otro material a Noticias 33, el usuario declara contar con los
          derechos o autorizaciones necesarias para compartir dicho contenido
          y otorga una autorización no exclusiva para su uso, reproducción,
          edición y publicación con fines informativos en cualquiera de las
          plataformas de Noticias 33, salvo que se acuerde expresamente lo
          contrario.
        </p>

        <h2>Contenido patrocinado y publicidad</h2>
        <p>
          Algunas publicaciones podrán corresponder a contenido patrocinado o
          espacios publicitarios, los cuales serán identificados cuando
          corresponda. La responsabilidad sobre los productos, servicios o
          promociones anunciados recae exclusivamente en los anunciantes, por
          lo que Noticias 33 no garantiza su disponibilidad, calidad o
          resultados.
        </p>

        <h2>Jurisdicción aplicable</h2>
        <p>
          Los presentes Términos de Uso se interpretarán y regirán de
          conformidad con las leyes de los Estados Unidos Mexicanos.
          Cualquier controversia derivada del uso del sitio web será
          sometida a la jurisdicción de los tribunales competentes de
          Tijuana, Baja California, salvo disposición legal en contrario.
        </p>
      </div>
    </div>
  );
}
