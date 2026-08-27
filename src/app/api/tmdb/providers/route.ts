import { NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/cache";
import { apiUrl, API_KEY } from "@/helpers/api.config";
import { selectFilterProviders, providersWatchCode } from "@/helpers/constants";

const TTL_SECONDS = 2_592_000; // 30 days

type TMDBWatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export type ProviderLogos = {
  shortLogo: string | null;
  fullLogo: string | null;
};

const WORDMARK_LOGOS: Record<string, string> = {
  Netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "Disney+": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
  "Apple TV+": "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg",
  "Amazon Prime Video":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/1280px-Amazon_Prime_Video_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail",
  "HBO Max": "https://upload.wikimedia.org/wikipedia/commons/b/b3/HBO_Max_%282025%29.svg",
  Hulu: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Hulu_logo_%282018%29.svg",
  "Paramount+": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg",
  Crunchyroll: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Crunchyroll.svg",
  AMC: "https://upload.wikimedia.org/wikipedia/commons/3/34/AMC_logo_2019.svg",
  History: "https://upload.wikimedia.org/wikipedia/commons/f/f5/History_Logo.svg",
};

async function fetchProviderList(mediaType: "movie" | "tv"): Promise<TMDBWatchProvider[]> {
  const res = await fetch(`${apiUrl}watch/providers/${mediaType}?api_key=${API_KEY}&watch_region=US`);
  if (!res.ok) throw new Error(`TMDB watch/providers/${mediaType} request failed with status ${res.status}`);

  const json = await res.json();
  return (json.results as TMDBWatchProvider[]) || [];
}

async function buildProviderLogosMap(): Promise<Record<string, ProviderLogos>> {
  const [movieProviders, tvProviders] = await Promise.all([fetchProviderList("movie"), fetchProviderList("tv")]);

  const idToLogo: Record<number, string> = {};
  [...movieProviders, ...tvProviders].forEach((provider) => {
    if (!idToLogo[provider.provider_id]) {
      idToLogo[provider.provider_id] = provider.logo_path;
    }
  });

  const logos: Record<string, ProviderLogos> = {};

  selectFilterProviders.forEach((name) => {
    const providerId = providersWatchCode[name];
    const tmdbPath = idToLogo[providerId];

    // Logo corto (TMDB)
    const shortLogo = tmdbPath ? `https://image.tmdb.org/t/p/original${tmdbPath}` : null;

    // Logo largo (Wordmark de Wikimedia o fallback a TMDB)
    const fullLogo = WORDMARK_LOGOS[name] || shortLogo;

    logos[name] = { shortLogo, fullLogo };
  });

  return logos;
}

export async function GET() {
  try {
    // Usamos v4 para refrescar la estructura de caché
    const logos = await getOrSetCache("tmdb:providers:logos:v4", TTL_SECONDS, buildProviderLogosMap);
    return NextResponse.json({ logos });
  } catch (e) {
    console.error("[/api/tmdb/providers] failed", e);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 502 });
  }
}
