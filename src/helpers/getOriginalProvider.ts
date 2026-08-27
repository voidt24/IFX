import { providersNetworkCode, providersProductionCompanyCode, providersWatchCode } from "./constants";
import { MediaTypeApi } from "@/Types/mediaType";

type TMDBCompanyOrNetwork = { id: number };
type TMDBKeyword = { id: number; name: string };
type TMDBWatchProviderEntry = { provider_id: number; provider_name: string };
type TMDBWatchProviderRegion = { link?: string; flatrate?: TMDBWatchProviderEntry[]; rent?: TMDBWatchProviderEntry[]; buy?: TMDBWatchProviderEntry[] };
type TMDBWatchProviders = { results?: Record<string, TMDBWatchProviderRegion> };

const WATCH_PROVIDERS_REGION = "US";

/**
 * IDs universales de Grandes Estudios de Cine (Major Studios) en TMDB.
 * Ninguna película de estos estudios debe marcarse como "Original" vía watch/providers.
 */
const MAJOR_STUDIOS_IDS = [
  174, // Warner Bros. Pictures
  4, // Paramount
  33, // Universal Pictures
  34, // Sony Pictures / Columbia Pictures
  25, // 20th Century Studios
  2, // Walt Disney Pictures
  10221, // MGM,
  429, // DC Films / DC Studios
  420, // Marvel Studios
];

// IDs oficiales e inmutables de Keywords para Originales en TMDB
const PROVIDER_KEYWORD_IDS: Record<string, number[]> = {
  Netflix: [208821], // netflix original
  "Amazon Prime Video": [263548], // amazon original
  "Apple TV+": [282838], // apple original
  "Disney+": [286214], // disney+ original
  Max: [284340, 290074], // hbo original / max original
};

export function getOriginalProviderFromNetworks(networks: TMDBCompanyOrNetwork[] | undefined | null): string | null {
  if (!networks || networks.length === 0) return null;
  const networkIds = networks.map((network) => network.id);

  for (const [providerName, networkId] of Object.entries(providersNetworkCode)) {
    if (networkIds.includes(networkId)) return providerName;
  }
  return null;
}

/**
 * Paso 1: Keywords usando IDs inmutables de TMDB
 */
export function getOriginalProviderFromKeywords(keywords: TMDBKeyword[] | undefined | null): string | null {
  if (!keywords || keywords.length === 0) return null;

  const keywordIds = new Set(keywords.map((k) => k.id));

  for (const [providerName, targetIds] of Object.entries(PROVIDER_KEYWORD_IDS)) {
    if (targetIds.some((id) => keywordIds.has(id))) return providerName;
  }

  return null;
}

/**
 * Paso 2: Casa productora oficial
 */
export function getOriginalProviderFromCompanies(companies: TMDBCompanyOrNetwork[] | undefined | null): string | null {
  if (!companies || companies.length === 0) return null;
  const companyIds = companies.map((company) => company.id);

  for (const [providerName, mappedIds] of Object.entries(providersProductionCompanyCode)) {
    if (mappedIds.some((id) => companyIds.includes(id))) return providerName;
  }

  return null;
}

/**
 * Paso 3: Watch Providers (Red de seguridad para exclusivas)
 * Ahora descarta explícitamente películas creadas por Major Studios para evitar falsos positivos como Joker.
 */
export function getOriginalProviderFromWatchProviders(watchProviders: TMDBWatchProviders | undefined | null, companies?: TMDBCompanyOrNetwork[] | null): string | null {
  // 1. Si la película fue hecha por un Estudio Mayor (Warner, Sony, Universal, etc.), NUNCA es un Original por distribución
  if (companies && companies.length > 0) {
    const isMajor = companies.some((c) => MAJOR_STUDIOS_IDS.includes(c.id));
    if (isMajor) return null;
  }

  const region = watchProviders?.results?.[WATCH_PROVIDERS_REGION];
  if (!region) return null;

  const flatrate = region.flatrate;
  if (!flatrate || flatrate.length === 0) return null;

  const hasTransactionalOption = (region.rent?.length ?? 0) > 0 || (region.buy?.length ?? 0) > 0;
  if (hasTransactionalOption) return null;

  const flatrateIds = flatrate.map((entry) => entry.provider_id);
  const matchedProviders = Object.entries(providersWatchCode).filter(([, id]) => flatrateIds.includes(id));

  return matchedProviders.length === 1 ? matchedProviders[0][0] : null;
}

export function resolveOriginalProvider(
  mediaType: MediaTypeApi | string | undefined,
  raw: {
    networks?: TMDBCompanyOrNetwork[] | null;
    production_companies?: TMDBCompanyOrNetwork[] | null;
    keywords?: { keywords?: TMDBKeyword[] } | null;
    "watch/providers"?: TMDBWatchProviders | null;
  },
): string | null {
  // 1. Las series se resuelven directamente por sus cadenas (networks)
  if (mediaType === "tv") return getOriginalProviderFromNetworks(raw.networks);

  // 2. CORTAFUEGOS INMEDIATO PARA PELÍCULAS:
  // Si la película tiene en su lista a Warner Bros, Universal, Sony, DC, Marvel, etc.
  // NO puede catalogarse como un Original de streaming.
  const companies = raw.production_companies || [];
  const isMajorStudioMovie = companies.some((company) => MAJOR_STUDIOS_IDS.includes(company.id));

  if (isMajorStudioMovie) {
    return null; // Detiene la evaluación y devuelve null para Joker, Batman, Spider-Man, etc.
  }

  // 3. Si no es de un estudio mayor, ejecuta la cascada
  return getOriginalProviderFromKeywords(raw.keywords?.keywords) || getOriginalProviderFromCompanies(raw.production_companies) || getOriginalProviderFromWatchProviders(raw["watch/providers"]);
}
