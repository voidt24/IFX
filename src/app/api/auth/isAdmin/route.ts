import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth-admin";
import { ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";

// This route only answers "should the UI show admin-only links?". It is NOT what
// protects /admin/upcoming-movies or /api/tmdb/upcoming — those re-verify the
// Firebase ID token + email allowlist independently (see verifyAdminToken usage there).
export async function GET(req: NextRequest) {
  const admin = await verifyAdminToken(req.cookies.get(ID_TOKEN_COOKIE_NAME)?.value);
  return NextResponse.json({ isAdmin: !!admin });
}
