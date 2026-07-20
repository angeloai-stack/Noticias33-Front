// ============================================================================
// Armazón del sitio: estructura común a todas las páginas
// (header con ticker → contenido → newsletter → footer).
// Es un componente de servidor: obtiene aquí el titular del ticker para
// pasárselo al Header, que es de cliente y no puede hacer fetch en el server.
// ============================================================================

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Newsletter } from "@/components/layout/newsletter";
import { getLatestArticles } from "@/lib/api/news";

type SiteShellProps = {
  children: React.ReactNode;
};

/**
 * Titular más reciente para la marquesina "Información al momento".
 * Si la API falla, se devuelve null y el ticker simplemente no se muestra.
 */
async function getTickerHeadline(): Promise<string | null> {
  try {
    const { data } = await getLatestArticles(1, 1);
    return data[0]?.title ?? null;
  } catch {
    return null;
  }
}

export async function SiteShell({ children }: SiteShellProps) {
  const headline = await getTickerHeadline();

  return (
    <>
      <Header headline={headline} />
      <main className="flex-1">{children}</main>
      <Newsletter />
      <Footer />
    </>
  );
}
