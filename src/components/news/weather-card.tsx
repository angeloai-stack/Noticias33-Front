"use client";

// ============================================================================
// Tarjeta de clima de la barra lateral. Muestra el clima actual (Open-Meteo)
// de la ciudad elegida, sobre un mapa de temperatura en vivo de Windy.com
// centrado en esa ciudad.
//
// El embed de Windy es gratuito para medios (windy.com/-Widgets-on-your-website),
// que es justo nuestro caso; su logo/atribución viene incluido en el propio
// iframe y no debe ocultarse ni recortarse.
// ============================================================================

import { useEffect, useMemo, useRef, useState } from "react";
import type { CityWeather } from "@/lib/api/weather";
import { useNearestCitySlug } from "@/lib/hooks/use-nearest-city";

type WeatherCardProps = {
  /** Clima actual de cada ciudad cubierta, o [] si falló la API. */
  cities: CityWeather[];
};

/** Zoom fijo del embed: suficiente para ver la ciudad y su entorno. */
const WINDY_ZOOM = 8;

/** Construye la URL del embed oficial de Windy centrado en unas coordenadas. */
function buildWindyEmbedUrl(lat: number, lon: number): string {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    detailLat: String(lat),
    detailLon: String(lon),
    width: "650",
    height: "450",
    zoom: String(WINDY_ZOOM),
    level: "surface",
    overlay: "temp",
    menu: "",
    message: "",
    marker: "true",
    calendar: "now",
    pressure: "",
    type: "map",
    location: "coordinates",
    detail: "",
    metricWind: "default",
    metricTemp: "default",
    radarRange: "-1",
  });

  return `https://embed.windy.com/embed2.html?${params.toString()}`;
}

export function WeatherCard({ cities }: WeatherCardProps) {
  const [selectedSlug, setSelectedSlug] = useState(
    cities.find((city) => city.slug === "tijuana")?.slug ?? cities[0]?.slug ?? "",
  );
  const hasUserSelected = useRef(false);
  const nearestSlug = useNearestCitySlug();

  // Si quien visita no eligió ciudad todavía, se cambia a la más cercana
  // según su IP en cuanto /api/geo resuelve.
  useEffect(() => {
    if (
      !hasUserSelected.current &&
      nearestSlug &&
      cities.some((city) => city.slug === nearestSlug)
    ) {
      setSelectedSlug(nearestSlug);
    }
  }, [nearestSlug, cities]);

  function selectCity(slug: string) {
    hasUserSelected.current = true;
    setSelectedSlug(slug);
  }

  const selected = useMemo(
    () =>
      cities.find((city) => city.slug === selectedSlug) ??
      cities.find((city) => city.slug === "tijuana") ??
      cities[0],
    [cities, selectedSlug],
  );

  if (!selected) {
    return (
      <section aria-label="Clima" className="w-[286px]">
        <h3 className="text-[19px] font-bold uppercase leading-normal text-black">
          Clima
        </h3>
        <p className="mt-3 text-[13px] text-n33-muted">
          El clima no está disponible en este momento.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Clima" className="w-[286px]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[19px] font-bold uppercase leading-normal text-black">
          Clima
        </h3>
        <select
          value={selected.slug}
          onChange={(event) => selectCity(event.target.value)}
          aria-label="Elegir ciudad"
          className="rounded-[8px] border border-black/10 bg-white px-2 py-1 text-[12px] font-semibold text-n33-muted transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-n33-blue"
        >
          {cities.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mapa de temperatura en vivo (Windy.com), centrado en la ciudad elegida */}
      <div className="relative mt-3 h-85 w-full overflow-hidden rounded-[14px] shadow-[0_16px_35px_-18px_rgba(0,0,0,0.35)]">
        <iframe
          key={selected.slug}
          src={buildWindyEmbedUrl(selected.lat, selected.lon)}
          title={`Mapa de temperatura en Windy.com centrado en ${selected.name}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>

      <div
        key={selected.slug}
        className="animate-fade-up mt-3 flex items-center gap-4 rounded-[14px] bg-n33-blue/5 p-4 shadow-[0_16px_35px_-18px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-18px_rgba(23,156,255,0.35)]"
      >
        <span
          className="animate-icon-float text-[48px] leading-none"
          aria-hidden="true"
        >
          {selected.icon}
        </span>
        <div>
          <p className="text-[32px] font-bold leading-none text-black">
            {Math.round(selected.temperature)}°C
          </p>
          <p className="mt-1 text-[13px] font-medium text-n33-muted">
            {selected.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex justify-between text-[12px] text-n33-muted">
        <span>Humedad: {selected.humidity}%</span>
        <span>Viento: {Math.round(selected.windSpeed)} km/h</span>
      </div>
    </section>
  );
}
