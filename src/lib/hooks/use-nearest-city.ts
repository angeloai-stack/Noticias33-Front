"use client";

// ============================================================================
// Ciudad cubierta más cercana según la IP de quien visita (vía /api/geo,
// que lee la geolocalización que agrega Vercel). Devuelve null hasta que
// resuelve o si no hay datos de geolocalización disponibles.
// ============================================================================

import { useEffect, useState } from "react";

export function useNearestCitySlug(): string | null {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/geo")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { slug: string | null } | null) => {
        if (active && data?.slug) {
          setSlug(data.slug);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return slug;
}
