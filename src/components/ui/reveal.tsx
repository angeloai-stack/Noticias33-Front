"use client";

// ============================================================================
// <Reveal>: envoltorio de animación al hacer scroll. Su contenido aparece
// con un desvanecimiento ascendente la primera vez que entra en pantalla
// (IntersectionObserver). Respeta "prefers-reduced-motion".
// ============================================================================

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Retraso en ms para escalonar apariciones. */
  delay?: number;
  className?: string;
};

/** Hace aparecer su contenido con un desvanecimiento ascendente al entrar en pantalla. */
export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    // Usuarios que prefieren menos movimiento ven el contenido de inmediato
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // La animación solo ocurre una vez; se deja de observar
          observer.disconnect();
        }
      },
      // Se dispara cuando ~8% del elemento es visible, con un margen que
      // adelanta un poco la animación antes de llegar al borde inferior
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
