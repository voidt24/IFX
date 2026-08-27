import { NextRequest, NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/cache";
import { apiUrl, API_KEY } from "@/helpers/api.config";
import { resolveFetchURL } from "@/helpers/resolveFetchURL";
import { resolveOriginalProvider } from "@/helpers/getOriginalProvider";
import { IMediaData, MediaTypeApi } from "@/Types";

// Same window the old browser cache used (2 days), now shared by every visitor.
const TTL_SECONDS = 172_800; // 2 days

function buildGeneralSearchURL(mediaType: MediaTypeApi, TRENDING_CATEGORY: string, categoryForMovie?: string, pageNumber?: number) {
  return mediaType == "tv"
    ? `${apiUrl}${TRENDING_CATEGORY}/${mediaType}/day?api_key=${API_KEY}&page=${pageNumber || 1}`
    : `${apiUrl}${categoryForMovie === "trending" ? `trending/${mediaType}/day` : `${mediaType}/${categoryForMovie}`}?api_key=${API_KEY}&page=${pageNumber || 1}`;
}

async function fetchCleanAssets(mediaType: MediaTypeApi, id: number): Promise<{ logo: string | null; noTextPoster: string | null }> {
  try {
    const res = await fetch(resolveFetchURL("images", mediaType, id));
    const data = await res.json();
    const logos = data?.logos as
      | { aspect_ratio: number; height: number; iso_3166_1: string | null; iso_639_1: string | null; file_path: string; vote_average: number; vote_count: number; width: number }[]
      | undefined;
    const posters = data?.posters as { aspect_ratio: number; height: number; iso_639_1: string | null; file_path: string; vote_average: number; vote_count: number; width: number }[] | undefined;

    const isUsableFormat = (logo: { file_path: string }) => [".svg", ".png", ".jpg"].some((ext) => logo.file_path.includes(ext));

    const logo = logos?.find((logo) => logo.iso_3166_1 == "US" && isUsableFormat(logo))?.file_path || logos?.find(isUsableFormat)?.file_path || null;

    const noTextPoster = posters?.find((poster) => poster.iso_639_1 === null)?.file_path || null;

    return { logo, noTextPoster };
  } catch {
    return { logo: null, noTextPoster: null };
  }
}

// One extra per-item call (same pattern/cost as fetchCleanAssets above) to get the
// `networks` (tv) / `production_companies` (movie) fields needed for the Original badge —
// list/discover/search endpoints don't include them, only the byId detail endpoint does.
async function fetchOriginalProvider(mediaType: MediaTypeApi, id: number): Promise<string | null> {
  try {
    const res = await fetch(resolveFetchURL("byId", mediaType, id));
    const data = await res.json();
    return resolveOriginalProvider(mediaType, data);
  } catch {
    return null;
  }
}

async function fetchFromTMDB(url: string, mediaType: MediaTypeApi): Promise<[IMediaData[], number]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB request failed with status ${res.status}`);

  const json = await res.json();
  const results = json.results as IMediaData[];

  const enriched = await Promise.all(
    results.map(async (element) => {
      const [{ logo, noTextPoster }, originalProvider] = await Promise.all([fetchCleanAssets(mediaType, element.id), fetchOriginalProvider(mediaType, element.id)]);
      const logoBackdrop = logo;
      const result: IMediaData = {
        backdrop_path: element.backdrop_path || undefined,
        id: element.id,
        title: element.title || undefined,
        original_title: element.original_title || undefined,
        name: element.name || undefined,
        original_name: element.original_name || undefined,
        overview: element.overview || undefined,
        poster_path: element.poster_path || undefined,
        noTextPoster_path: noTextPoster || undefined,
        media_type: element.media_type || mediaType,
        release_date: element.release_date || undefined,
        first_air_date: element.first_air_date || undefined,
        vote_average: element.vote_average || undefined,
        logoBackdrop,
        originalProvider,
      };
      return result;
    }),
  );

  return [enriched, json.total_pages];
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mediaType = searchParams.get("mediaType") as MediaTypeApi | null;
  const trendingCategory = searchParams.get("trendingCategory") || "trending";
  const categoryForMovie = searchParams.get("categoryForMovie") || undefined;
  const pageNumber = searchParams.get("page") ? Number(searchParams.get("page")) : undefined;

  if (!mediaType) {
    return NextResponse.json({ error: "mediaType is required" }, { status: 400 });
  }

  const url = buildGeneralSearchURL(mediaType, trendingCategory, categoryForMovie, pageNumber);
  // v4: cascade fallback added (keywords -> production_companies -> watch/providers)
  const cacheKey = `tmdb:general:v4:${mediaType}-${mediaType == "tv" ? trendingCategory : categoryForMovie}-page-${pageNumber || 1}`;

  try {
    const [results, total_pages] = await getOrSetCache(cacheKey, TTL_SECONDS, () => fetchFromTMDB(url, mediaType));
    return NextResponse.json({ results, total_pages });
  } catch (e) {
    console.error("[/api/tmdb/general] failed", e);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 502 });
  }
}
