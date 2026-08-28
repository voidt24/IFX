import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const TTL_SECONDS = 86_400; // 1 day
const DEFAULT_COUNTRY = "US";

function getClientIp(req: NextRequest): string | null {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

async function lookupCountryByIp(ip: string): Promise<string> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/country/`);
    if (!res.ok) return DEFAULT_COUNTRY;

    const country = (await res.text()).trim();
    return /^[A-Z]{2}$/.test(country) ? country : DEFAULT_COUNTRY;
  } catch {
    return DEFAULT_COUNTRY;
  }
}

export async function GET(req: NextRequest) {
  // Vercel sets this automatically from the request's IP at the edge — no extra
  // lookup (or Redis round-trip) needed when it's already there.
  const vercelCountry = req.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return NextResponse.json({ country: vercelCountry });
  }

  const ip = getClientIp(req);
  if (!ip || ip === "127.0.0.1" || ip === "::1") {
    return NextResponse.json({ country: DEFAULT_COUNTRY });
  }

  const cacheKey = `geo:ip-country:${ip}`;

  try {
    const cached = await redis.get<string>(cacheKey);
    if (cached) return NextResponse.json({ country: cached });
  } catch (e) {
    console.error("[/api/geo] redis read failed", e);
  }

  const country = await lookupCountryByIp(ip);

  try {
    await redis.set(cacheKey, country, { ex: TTL_SECONDS });
  } catch (e) {
    console.error("[/api/geo] redis write failed", e);
  }

  return NextResponse.json({ country });
}
