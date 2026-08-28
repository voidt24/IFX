import { NextRequest, NextResponse } from "next/server";
import { getOrSetCache } from "@/lib/cache";
import { redis } from "@/lib/redis";
import { resolveFetchURL } from "@/helpers/resolveFetchURL";
import { MediaTypeApi } from "@/Types/mediaType";

type DetailsType = "byId" | "images" | "cast" | "reviews";

const TTL_SECONDS: Record<DetailsType, number> = {
  byId: 2_592_000, // 30 days
  images: 2_592_000, // 30 days
  cast: 2_592_000, // 30 days
  reviews: 259_200, // 3 days
};

const VALID_TYPES: DetailsType[] = ["byId", "images", "cast", "reviews"];

// v2: byId now carries append_to_response=keywords,watch/providers — bump this prefix
// whenever resolveFetchURL's query params for a given type change, so previously
// cached shapes get bypassed instead of served stale.
function buildCacheKey(mediaType: MediaTypeApi, type: DetailsType, id: string) {
  return `tmdb:details:v2:${mediaType}:${type}:${id}`;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mediaType = searchParams.get("mediaType") as MediaTypeApi | null;
  const id = searchParams.get("id");
  const type = searchParams.get("type") as DetailsType | null;
  const cacheOnly = searchParams.get("cacheOnly") === "true";

  if (!mediaType || !id || !type || !VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "mediaType, id and a valid type are required" }, { status: 400 });
  }

  const cacheKey = buildCacheKey(mediaType, type, id);

  // Offline path: the client already knows it has no connection and only wants
  // whatever is shared in Redis — never attempt a live TMDB call here, since it
  // would just fail (or hang) the same way the client's own request did.
  if (cacheOnly) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached !== null && cached !== undefined) {
        return NextResponse.json({ data: cached, cached: true });
      }
      return NextResponse.json({ data: null, cached: false });
    } catch (e) {
      console.error(`[/api/tmdb/details] redis-only read failed for "${cacheKey}"`, e);
      return NextResponse.json({ data: null, cached: false });
    }
  }

  try {
    const url = resolveFetchURL(type, mediaType, Number(id));
    const data = await getOrSetCache(cacheKey, TTL_SECONDS[type], async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`TMDB ${type} request failed with status ${res.status}`);
      return res.json();
    });

    return NextResponse.json({ data, cached: true });
  } catch (e) {
    console.error(`[/api/tmdb/details] failed for ${mediaType}/${type}/${id}`, e);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 502 });
  }
}
