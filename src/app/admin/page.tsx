// ============================================================================
// Herramienta interna de administración (/admin): protegida por clave y
// excluida de los buscadores. Muestra el historial de publicaciones y los
// errores registrados en Supabase.
// ============================================================================

import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AccessGate } from "@/components/publish/access-gate";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AccessGate
      expectedCode={process.env.NEXT_PUBLIC_ADMIN_CODE ?? ""}
      storageKey="n33-admin"
      title="Administración N33"
      subtitle="Ingresa la clave de administrador para ver el historial."
    >
      <AdminDashboard />
    </AccessGate>
  );
}
