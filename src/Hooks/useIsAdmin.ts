"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { API_ROUTES } from "@/config/routes";
import { getBaseUrl } from "@/lib/env";

// UI hint only — decides whether to render the "Upcoming (Admin)" button. The real
// gate lives server-side: /admin/upcoming-movies and /api/tmdb/upcoming both re-verify
// the Firebase ID token against the ADMIN_EMAILS allowlist themselves (verifyAdminToken),
// so this hook returning true/false never grants or blocks anything by itself.
export default function useIsAdmin() {
  const { firebaseActiveUser, authListenerInitialized } = useSelector((state: RootState) => state.auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authListenerInitialized || !firebaseActiveUser?.uid) {
      setIsAdmin(false);
      return;
    }

    fetch(`${getBaseUrl()}${API_ROUTES.IS_ADMIN_ROUTE}`)
      .then((res) => res.json())
      .then((data) => setIsAdmin(!!data.isAdmin))
      .catch(() => setIsAdmin(false));
  }, [firebaseActiveUser?.uid, authListenerInitialized]);

  return isAdmin;
}
