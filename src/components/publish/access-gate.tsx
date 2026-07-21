"use client";

// ============================================================================
// Puerta de acceso por clave numérica, compartida por /publicar y /admin.
// No es seguridad robusta (la clave viaja en el bundle como NEXT_PUBLIC_*);
// su función es la misma que en el sistema original: mantener las
// herramientas internas fuera del alcance del visitante casual.
// ============================================================================

import { useEffect, useState } from "react";

type AccessGateProps = {
  /** Clave correcta (viene de NEXT_PUBLIC_ACCESS_CODE / ADMIN_CODE). */
  expectedCode: string;
  /** Clave de sessionStorage para recordar el acceso durante la sesión. */
  storageKey: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

/** Muestra el formulario de clave y, una vez validada, su contenido. */
export function AccessGate({
  expectedCode,
  storageKey,
  title,
  subtitle,
  children,
}: AccessGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  // sessionStorage solo existe en el navegador, por eso se lee en useEffect.
  // `checked` evita un parpadeo del formulario y el desajuste de hidratación
  // (el servidor no puede conocer el valor). Es una lectura puntual de un
  // sistema externo al montar, no un patrón de renders en cascada.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUnlocked(sessionStorage.getItem(storageKey) === "1");
    setChecked(true);
  }, [storageKey]);

  if (!checked) {
    return null;
  }

  if (unlocked) {
    return <>{children}</>;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Se exige que la clave esté configurada: sin variable de entorno no se entra
    if (code === expectedCode && expectedCode !== "") {
      sessionStorage.setItem(storageKey, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setCode("");
    }
  };

  return (
    <div className="animate-fade-up mx-auto flex max-w-md flex-col items-center px-4 py-24">
      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        {title}
      </h1>
      <p className="mt-2 text-center text-sm text-n33-muted">{subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
        <label htmlFor="access-code" className="sr-only">
          Clave de acceso
        </label>
        <input
          id="access-code"
          type="password"
          inputMode="numeric"
          autoFocus
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError(false);
          }}
          placeholder="Clave de acceso"
          className={`h-[48px] rounded-xl border bg-white px-4 text-center text-lg tracking-[0.5em] shadow-sm outline-none ring-n33-primary transition-all duration-300 focus:shadow-lg focus:ring-2 ${
            error ? "border-n33-primary" : "border-n33-border"
          }`}
        />
        {error && (
          <p className="text-center text-sm font-medium text-n33-primary">
            Clave incorrecta. Intenta de nuevo.
          </p>
        )}
        <button
          type="submit"
          className="h-[46px] cursor-pointer rounded-[9px] bg-n33-primary text-[13px] font-bold uppercase text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-primary-dark hover:shadow-lg active:translate-y-0 active:scale-95"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
