import { NextRequest, NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/cache";
import { apiUrl, API_KEY } from "@/helpers/api.config";
import { resolveFetchURL } from "@/helpers/resolveFetchURL";
import { resolveOriginalProvider } from "@/helpers/getOriginalProvider";
import { extractTheatricalInfo } from "@/helpers/isInTheaters";
import { movieGenresCode, tvGenresCode, providersNetworkCode, providersWatchCode } from "@/helpers/constants";
import { IMediaData, MediaTypeApi } from "@/Types";

// Same window the old browser cache used (2 days), now shared by every visitor.
const TTL_SECONDS = 172_800; // 2 days

function getProviderNetworkId(providerName: string | null) {
  return providerName && providersNetworkCode[providerName];
}
function getProviderWatchId(providerName: string | null) {
  return providerName && providersWatchCode[providerName];
}
function getGenreCode(genreName: string | null, media_type: string | null) {
  return media_type == "tv" ? genreName && tvGenresCode[genreName] : genreName && movieGenresCode[genreName];
}

function buildFilteredSearchURL(mediaType: MediaTypeApi, validProvider: boolean, validGenre: boolean, genreCode: string | null, provider: string | null, pageNumber?: number) {
  function createDiscoverURL(params: string) {
    return `${apiUrl}discover/${mediaType}?api_key=${API_KEY}&page=${pageNumber || 1}${validProvider ? params : ``}${validGenre ? `&with_genres=${getGenreCode(genreCode, mediaType)}` : ``}`;
  }

  if ((mediaType == "tv" && provider == "Crunchyroll") || mediaType == "movie") {
    return createDiscoverURL(`&watch_region=US&with_watch_providers=${getProviderWatchId(provider)}`);
  }
  return createDiscoverURL(`&with_networks=${getProviderNetworkId(provider)}`);
}

function buildFilteredCacheKey(mediaType: MediaTypeApi, validProvider: boolean, validGenre: boolean, genreCode: string | null, provider: string | null, pageNumber?: number) {
  if ((mediaType == "tv" && provider == "Crunchyroll") || mediaType == "movie") {
    return `tmdb:discover:${mediaType}-${validProvider ? `wp:${getProviderWatchId(provider)}` : ""}-${validGenre ? `g:${getGenreCode(genreCode, mediaType)}` : ""}-page:${pageNumber}`;
  }
  return `tmdb:discover:${mediaType}-${validProvider ? `wn:${getProviderNetworkId(provider)}` : ""}-${validGenre ? `g:${getGenreCode(genreCode, mediaType)}` : ""}-page:${pageNumber}`;
}

async function fetchLogo(mediaType: MediaTypeApi, id: number): Promise<string | null> {
  try {
    const res = await fetch(resolveFetchURL("images", mediaType, id));
    const data = await res.json();
    const logos = data?.logos as
      | { aspect_ratio: number; height: number; iso_3166_1: string | null; iso_639_1: string | null; file_path: string; vote_average: number; vote_count: number; width: number }[]
      | undefined;

    const isUsableFormat = (logo: { file_path: string }) => [".svg", ".png", ".jpg"].some((ext) => logo.file_path.includes(ext));

    return logos?.find((logo) => logo.iso_3166_1 == "US" && isUsableFormat(logo))?.file_path || logos?.find(isUsableFormat)?.file_path || null;
  } catch {
    return null;
  }
}

// Same one-extra-call pattern as fetchLogo. Skipped entirely when the row is already
// network-filtered for TV (see isNetworkFilteredRow in GET) — in that case every item
// is guaranteed to be that provider's Original by construction, no need to ask TMDB again.
// That same byId call also carries release_dates (see resolveFetchURL), so it's reused
// here to derive the "still in theaters" flag for movies at zero extra cost.
// Same one-extra-call pattern as fetchLogo. Skipped entirely when the row is already
// network-filtered for TV (see isNetworkFilteredRow in GET) — in that case every item
// is guaranteed to be that provider's Original by construction, no need to ask TMDB again.
// That same byId call also carries release_dates (see resolveFetchURL). We only extract
// and return the permanent facts (hadTheatricalRelease / digitalReleaseDate) here — never
// a computed "is it in theaters right now" boolean, since that depends on the current time
// and would go stale the moment this response gets cached or persisted client-side.
async function fetchOriginalProviderAndTheatricalInfo(
  mediaType: MediaTypeApi,
  id: number,
): Promise<{ originalProvider: string | null; hadTheatricalRelease: boolean; digitalReleaseDate: string | null }> {
  try {
    const res = await fetch(resolveFetchURL("byId", mediaType, id));
    const data = await res.json();
    const { hadTheatricalRelease, digitalReleaseDate } = extractTheatricalInfo(mediaType, data.release_dates);
    return { originalProvider: resolveOriginalProvider(mediaType, data), hadTheatricalRelease, digitalReleaseDate };
  } catch {
    return { originalProvider: null, hadTheatricalRelease: false, digitalReleaseDate: null };
  }
}

async function fetchFromTMDB(url: string, mediaType: MediaTypeApi, knownOriginalProvider: string | null): Promise<[IMediaData[], number]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB request failed with status ${res.status}`);

  const json = await res.json();
  const results = json.results as IMediaData[];

  const enriched = await Promise.all(
    results.map(async (element) => {
      const [logoBackdrop, { originalProvider, hadTheatricalRelease, digitalReleaseDate }] = await Promise.all([
        fetchLogo(mediaType, element.id),
        knownOriginalProvider
          ? Promise.resolve({ originalProvider: knownOriginalProvider, hadTheatricalRelease: false, digitalReleaseDate: null })
          : fetchOriginalProviderAndTheatricalInfo(mediaType, element.id),
      ]);
      const result: IMediaData = {
        backdrop_path: element.backdrop_path || undefined,
        id: element.id,
        title: element.title || undefined,
        original_title: element.original_title || undefined,
        name: element.name || undefined,
        original_name: element.original_name || undefined,
        overview: element.overview || undefined,
        poster_path: element.poster_path || undefined,
        noTextPoster_path: undefined,
        media_type: element.media_type || mediaType,
        release_date: element.release_date || undefined,
        first_air_date: element.first_air_date || undefined,
        vote_average: element.vote_average || undefined,
        logoBackdrop,
        originalProvider,
        hadTheatricalRelease,
        digitalReleaseDate,
      };
      return result;
    }),
  );

  return [enriched, json.total_pages];
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mediaType = searchParams.get("mediaType") as MediaTypeApi | null;
  const provider = searchParams.get("provider");
  const genreCode = searchParams.get("genre");
  const pageNumber = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;

  if (!mediaType) {
    return NextResponse.json({ error: "mediaType is required" }, { status: 400 });
  }

  const validProvider = provider !== null && provider !== "Platform" && provider !== "All";
  const validGenre = genreCode !== null && genreCode !== "All";

  // Mirrors the branch in buildFilteredSearchURL: when this row was built with
  // &with_networks=<id> for TV, every result in it is that provider's Original by
  // construction — no need to look it up again per item.
  const isNetworkFilteredRow = validProvider && mediaType === "tv" && provider !== "Crunchyroll";
  const knownOriginalProvider = isNetworkFilteredRow ? provider : null;

  const url = buildFilteredSearchURL(mediaType, validProvider, validGenre, genreCode, provider, pageNumber);
  // v6: replaced the stale inTheaters boolean with permanent facts (hadTheatricalRelease,
  // digitalReleaseDate) — the actual verdict is now derived at render time, never cached
  const cacheKey = `v6:${buildFilteredCacheKey(mediaType, validProvider, validGenre, genreCode, provider, pageNumber)}`;

  try {
    const [results, total_pages] = await getOrSetCache(cacheKey, TTL_SECONDS, () => fetchFromTMDB(url, mediaType, knownOriginalProvider));
    return NextResponse.json({ results, total_pages });
  } catch (e) {
    console.error("[/api/tmdb/filtered] failed", e);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 502 });
  }
}
