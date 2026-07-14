import { verifyToken } from "@/firebase/firebase.admin.config";

/**
 * Verifies a Firebase ID token and checks that the resulting email is in
 * the ADMIN_EMAILS allowlist (comma-separated env var). Used to gate
 * admin-only API routes (e.g. managing our own m3u8 sources).
 *
 * Returns the decoded token if valid + authorized, or null otherwise.
 * Never throws — callers should treat null as "unauthorized".
 */
export async function verifyAdminToken(token: string | undefined | null) {
  if (!token) return null;

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) return null;

  try {
    const decoded = await verifyToken({ token });
    const email = decoded?.email?.toLowerCase();

    if (!email || !adminEmails.includes(email)) return null;

    return decoded;
  } catch {
    return null;
  }
}
