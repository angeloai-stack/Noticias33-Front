// ============================================================================
// Clima en tiempo real (Open-Meteo, sin API key) para las ciudades de Baja
// California que cubre el sitio. Una sola petición por lote (listas de
// lat/lon separadas por comas) para no multiplicar las llamadas.
// ============================================================================

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

/** Ciudades de Baja California mostradas en el widget de clima. */
const CITIES = [
  { slug: "tijuana", name: "Tijuana", lat: 32.5149, lon: -117.0382 },
  { slug: "mexicali", name: "Mexicali", lat: 32.6245, lon: -115.4523 },
  { slug: "ensenada", name: "Ensenada", lat: 31.8667, lon: -116.6 },
  { slug: "rosarito", name: "Rosarito", lat: 32.3667, lon: -117.05 },
  { slug: "tecate", name: "Tecate", lat: 32.5667, lon: -116.6333 },
  { slug: "san-felipe", name: "San Felipe", lat: 31.0286, lon: -114.8347 },
  { slug: "san-quintin", name: "San Quintín", lat: 30.5586, lon: -115.9522 },
] as const;

/** Categoría amplia usada para elegir la paleta del widget en el front. */
export type WeatherCondition =
  | "clear"
  | "clouds"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

export type CityWeather = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  condition: WeatherCondition;
};

type OpenMeteoResponse = {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
};

/** Traduce el código WMO de Open-Meteo a una descripción e ícono en español. */
function describeWeatherCode(code: number): {
  description: string;
  icon: string;
  condition: WeatherCondition;
} {
  if (code === 0) return { description: "Despejado", icon: "☀️", condition: "clear" };
  if (code === 1 || code === 2)
    return {
      description: "Mayormente despejado",
      icon: "🌤️",
      condition: "clear",
    };
  if (code === 3)
    return { description: "Nublado", icon: "☁️", condition: "clouds" };
  if (code === 45 || code === 48)
    return { description: "Niebla", icon: "🌫️", condition: "fog" };
  if ([51, 53, 55, 56, 57].includes(code))
    return { description: "Llovizna", icon: "🌦️", condition: "rain" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { description: "Lluvia", icon: "🌧️", condition: "rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { description: "Nieve", icon: "❄️", condition: "snow" };
  if ([95, 96, 99].includes(code))
    return { description: "Tormenta", icon: "⛈️", condition: "storm" };
  return { description: "Sin datos", icon: "🌡️", condition: "clear" };
}

/**
 * Clima actual de todas las ciudades cubiertas, en una sola petición a
 * Open-Meteo. Se revalida cada 10 minutos; si la API falla devuelve un
 * arreglo vacío para que el widget pueda mostrar un estado de respaldo.
 */
export async function getWeatherForCities(): Promise<CityWeather[]> {
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", CITIES.map((city) => city.lat).join(","));
  url.searchParams.set("longitude", CITIES.map((city) => city.lon).join(","));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
  );
  url.searchParams.set("timezone", "America/Tijuana");

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as
      | OpenMeteoResponse[]
      | OpenMeteoResponse;
    const results = Array.isArray(data) ? data : [data];

    return CITIES.map((city, index) => {
      const current = results[index]?.current;
      const { description, icon, condition } = describeWeatherCode(
        current?.weather_code ?? -1,
      );

      return {
        slug: city.slug,
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        temperature: current?.temperature_2m ?? 0,
        humidity: current?.relative_humidity_2m ?? 0,
        windSpeed: current?.wind_speed_10m ?? 0,
        description,
        icon,
        condition,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Ciudad cubierta más cercana a unas coordenadas (p. ej. la geolocalización
 * por IP de Vercel). Compara en grados, no en distancia real: alcanza para
 * ordenar por cercanía entre 7 puntos dentro de un mismo estado.
 */
export function getNearestCitySlug(lat: number, lon: number): string {
  let nearest: (typeof CITIES)[number] = CITIES[0];
  let nearestDistance = Infinity;

  for (const city of CITIES) {
    const dLat = lat - city.lat;
    const dLon = lon - city.lon;
    const distance = dLat * dLat + dLon * dLon;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = city;
    }
  }

  return nearest.slug;
}
