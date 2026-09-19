import { NextRequest, NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/cache";
import { apiUrl, API_KEY } from "@/helpers/api.config";
import { resolveFetchURL } from "@/helpers/resolveFetchURL";
import { resolveOriginalProvider } from "@/helpers/getOriginalProvider";
import { extractTheatricalInfo } from "@/helpers/isInTheaters";
import { movieGenresCode } from "@/helpers/constants";
import { verifyAdminToken } from "@/lib/auth-admin";
import { ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";
import { IMediaData } from "@/Types";

const ONE_DAY_SECONDS = 86_400; // la popularidad cambia rápido, mejor no cachear una semana
const YEARS_AHEAD = 5; // debe coincidir con UPCOMING_YEARS en views/UpcomingMovies.tsx

async function fetchOriginalProviderAndTheatricalInfo(id: number): Promise<{ originalProvider: string | null; hadTheatricalRelease: boolean; digitalReleaseDate: string | null }> {
  try {
    const res = await fetch(resolveFetchURL("byId", "movie", id));
    const data = await res.json();
    const { hadTheatricalRelease, digitalReleaseDate } = extractTheatricalInfo("movie", data.release_dates);
    return { originalProvider: resolveOriginalProvider("movie", data), hadTheatricalRelease, digitalReleaseDate };
  } catch {
    return { originalProvider: null, hadTheatricalRelease: false, digitalReleaseDate: null };
  }
}

function parseYear(value: string | null): number | null {
  const year = Number(value);
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(year) || year < currentYear || year > currentYear + YEARS_AHEAD) return null;
  return year;
}

function parseGenreCode(value: string | null): number | null {
  if (!value || value === "All") return null;
  return movieGenresCode[value] ?? null;
}

// Siempre estrenos futuros (desde mañana), ordenados por popularidad.
// Si hay año: desde max(mañana, 1 de enero de ese año) hasta el 31 de diciembre.
function buildUpcomingURL(page: number, year: number | null, genreCode: number | null) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  let minDate = tomorrowStr;
  let maxDate: string | null = null;

  if (year) {
    const yearStart = `${year}-01-01`;
    minDate = yearStart > tomorrowStr ? yearStart : tomorrowStr;
    maxDate = `${year}-12-31`;
  }

  let url = `${apiUrl}discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&include_adult=false&primary_release_date.gte=${minDate}&page=${page}`;
  if (maxDate) url += `&primary_release_date.lte=${maxDate}`;
  if (genreCode) url += `&with_genres=${genreCode}`;

  return url;
}

async function fetchUpcoming(page: number, year: number | null, genreCode: number | null): Promise<[IMediaData[], number]> {
  const res = await fetch(buildUpcomingURL(page, year, genreCode));
  if (!res.ok) throw new Error(`TMDB discover request failed with status ${res.status}`);

  const json = await res.json();
  const results = json.results as IMediaData[];

  const enriched = await Promise.all(
    results.map(async (element) => {
      const { originalProvider, hadTheatricalRelease, digitalReleaseDate } = await fetchOriginalProviderAndTheatricalInfo(element.id);

      const result: IMediaData = {
        backdrop_path: element.backdrop_path || undefined,
        id: element.id,
        title: element.title || undefined,
        original_title: element.original_title || undefined,
        overview: element.overview || undefined,
        poster_path: element.poster_path || undefined,
        noTextPoster_path: undefined,
        media_type: "movie",
        release_date: element.release_date || undefined,
        vote_average: element.vote_average || undefined,
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
  const admin = await verifyAdminToken(req.cookies.get(ID_TOKEN_COOKIE_NAME)?.value);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searchParams = req.nextUrl.searchParams;
  const pageNumber = Number(searchParams.get("page")) || 1;
  const year = parseYear(searchParams.get("year"));
  const genreCode = parseGenreCode(searchParams.get("genre"));

  const cacheKey = `tmdb:upcoming:v2:y-${year ?? "all"}:g-${genreCode ?? "all"}:page-${pageNumber}`;

  try {
    const [results, total_pages] = await getOrSetCache(cacheKey, ONE_DAY_SECONDS, () => fetchUpcoming(pageNumber, year, genreCode));
    return NextResponse.json({ results, total_pages });
  } catch (e) {
    console.error("[/api/tmdb/upcoming] failed", e);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 502 });
  }
}
