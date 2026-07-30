// ============================================================================
// Clima en tiempo real (Open-Meteo, sin API key) para las ciudades de Baja
// California que cubre el sitio. Una sola petición por lote (listas de
// lat/lon separadas por comas) para no multiplicar las llamadas.
// ============================================================================

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Ciudades de Baja California mostradas en el widget de clima. San Felipe va
 * primero: es la ciudad por defecto (WeatherCard y el badge del nav usan la
 * primera del arreglo hasta que la geolocalización por IP resuelve).
 */
const CITIES = [
  { slug: "san-felipe", name: "San Felipe", lat: 31.0286, lon: -114.8347 },
  { slug: "tijuana", name: "Tijuana", lat: 32.5149, lon: -117.0382 },
  { slug: "mexicali", name: "Mexicali", lat: 32.6245, lon: -115.4523 },
  { slug: "ensenada", name: "Ensenada", lat: 31.8667, lon: -116.6 },
  { slug: "rosarito", name: "Rosarito", lat: 32.3667, lon: -117.05 },
  { slug: "tecate", name: "Tecate", lat: 32.5667, lon: -116.6333 },
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

const KM_PER_DEGREE_LAT = 111;

/** Distancia aproximada en km entre dos coordenadas (suficiente a esta escala). */
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const dLat = (lat1 - lat2) * KM_PER_DEGREE_LAT;
  const dLon =
    (lon1 - lon2) * KM_PER_DEGREE_LAT * Math.cos((lat1 * Math.PI) / 180);

  return Math.sqrt(dLat * dLat + dLon * dLon);
}

/** Ciudad por defecto: la geolocalización por IP solo la desplaza si otra
 * ciudad queda claramente más cerca (ver DEFAULT_CITY_BIAS_KM). */
const DEFAULT_CITY_SLUG = "san-felipe";

/**
 * Margen a favor de la ciudad por defecto. La geolocalización por IP suele
 * tener 10-50 km de error, así que sin este margen un visitante de la ciudad
 * por defecto con un poco de ruido en su IP podría terminar viendo el clima
 * de la ciudad cubierta más cercana.
 */
const DEFAULT_CITY_BIAS_KM = 12;

/**
 * Ciudad cubierta más cercana a unas coordenadas (p. ej. la geolocalización
 * por IP de Vercel), con la ciudad por defecto ligeramente favorecida para
 * absorber el ruido típico de la geolocalización por IP.
 */
export function getNearestCitySlug(lat: number, lon: number): string {
  let nearest: (typeof CITIES)[number] = CITIES[0];
  let nearestScore = Infinity;

  for (const city of CITIES) {
    const distance = distanceKm(lat, lon, city.lat, city.lon);
    const score =
      city.slug === DEFAULT_CITY_SLUG
        ? distance - DEFAULT_CITY_BIAS_KM
        : distance;

    if (score < nearestScore) {
      nearestScore = score;
      nearest = city;
    }
  }

  return nearest.slug;
}
