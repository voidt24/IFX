/**
 * One-off script to load your own licensed m3u8 links into Redis.
 *
 * Usage:
 *   npx tsx scripts/seed-media-sources.ts
 *
 * Edit the `sources` array below with your real tmdbId + m3u8Url pairs,
 * then run. Safe to re-run (it just overwrites the same keys).
 */
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

type Source = { mediaType: "movie"; tmdbId: number; m3u8Url: string } | { mediaType: "tv"; tmdbId: number; season: number; episode: number; m3u8Url: string };

const sources: Source[] = [
  // { mediaType: "movie", tmdbId: 27205, m3u8Url: "https://your-cdn.com/inception/master.m3u8" },
  // { mediaType: "tv", tmdbId: 1396, season: 1, episode: 1, m3u8Url: "https://your-cdn.com/breaking-bad/s01e01/master.m3u8" },
];

async function main() {
  for (const source of sources) {
    const key = source.mediaType === "tv" ? `media-source:tv:${source.tmdbId}:${source.season}:${source.episode}` : `media-source:movie:${source.tmdbId}`;

    await redis.set(key, source.m3u8Url);
    console.log(`Set ${key} -> ${source.m3u8Url}`);
  }
  console.log(`Done. Seeded ${sources.length} source(s).`);
}

main();
