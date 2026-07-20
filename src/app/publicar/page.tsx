// ============================================================================
// Herramienta interna de redactores (/publicar): protegida por clave y
// excluida de los buscadores (robots noindex). El formulario publica
// directamente en WordPress a través de las API internas.
// ============================================================================

import type { Metadata } from "next";
import { AccessGate } from "@/components/publish/access-gate";
import { PublishForm } from "@/components/publish/publish-form";

export const metadata: Metadata = {
  title: "Publicar nota",
  robots: { index: false, follow: false },
};

export default function PublicarPage() {
  return (
    <AccessGate
      expectedCode={process.env.NEXT_PUBLIC_ACCESS_CODE ?? ""}
      storageKey="n33-publicar"
      title="Redacción N33"
      subtitle="Ingresa la clave de redactores para publicar una nota."
    >
      <PublishForm />
    </AccessGate>
  );
}
