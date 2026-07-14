import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { verifyAdminToken } from "@/lib/auth-admin";
import { ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";

interface MediaSourceEntry {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string; // stored for display purposes in the admin list, not used by the player
  season?: number;
  episode?: number;
  m3u8Url: string;
}

function buildKey(entry: Pick<MediaSourceEntry, "mediaType" | "tmdbId" | "season" | "episode">) {
  return entry.mediaType === "tv" && entry.season && entry.episode ? `media-source:tv:${entry.tmdbId}:${entry.season}:${entry.episode}` : `media-source:${entry.mediaType}:${entry.tmdbId}`;
}

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(ID_TOKEN_COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const keys = await redis.keys("media-source:*");
    const entries = keys.length ? await redis.mget<MediaSourceEntry[]>(...keys) : [];
    return NextResponse.json({ entries: entries.filter(Boolean) });
  } catch (e) {
    console.error("[/api/admin/media-source GET] failed", e);
    return NextResponse.json({ error: "Failed to list sources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Partial<MediaSourceEntry>;
  const { tmdbId, mediaType, title, season, episode, m3u8Url } = body;

  if (!tmdbId || !mediaType || !m3u8Url || !title) {
    return NextResponse.json({ error: "tmdbId, mediaType, title and m3u8Url are required" }, { status: 400 });
  }
  if (mediaType === "tv" && (!season || !episode)) {
    return NextResponse.json({ error: "season and episode are required for tv" }, { status: 400 });
  }

  const entry: MediaSourceEntry = { tmdbId, mediaType, title, m3u8Url, ...(mediaType === "tv" ? { season, episode } : {}) };
  const key = buildKey(entry);

  try {
    await redis.set(key, entry);
    return NextResponse.json({ ok: true, key });
  } catch (e) {
    console.error("[/api/admin/media-source POST] failed", e);
    return NextResponse.json({ error: "Failed to save source" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key } = (await req.json()) as { key?: string };
  if (!key || !key.startsWith("media-source:")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    await redis.del(key);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[/api/admin/media-source DELETE] failed", e);
    return NextResponse.json({ error: "Failed to delete source" }, { status: 500 });
  }
}
