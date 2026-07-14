import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const tmdbId = searchParams.get("tmdbId");
  const mediaType = searchParams.get("mediaType");
  const season = searchParams.get("season");
  const episode = searchParams.get("episode");

  if (!tmdbId || !mediaType) {
    return NextResponse.json({ error: "tmdbId and mediaType are required" }, { status: 400 });
  }

  const key = mediaType === "tv" && season && episode ? `media-source:tv:${tmdbId}:${season}:${episode}` : `media-source:${mediaType}:${tmdbId}`;

  try {
    const entry = await redis.get<{ m3u8Url: string }>(key);
    return NextResponse.json({ m3u8Url: entry?.m3u8Url ?? null });
  } catch (e) {
    console.error("[/api/media-source] failed", e);
    return NextResponse.json({ m3u8Url: null });
  }
}
