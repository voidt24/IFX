/**
 * Verifies the user's token during history-based navigation, as this type of navigation
 * does not trigger a new server request and therefore bypasses the middleware.
 */

import { ID_TOKEN_COOKIE_NAME, VERIFY_TOKEN_ROUTE } from "@/firebase/firebase.config";
import getCookie from "@/helpers/getCookie";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useRouter } from "next/navigation";

function useVerifyToken(setLoader?: Dispatch<SetStateAction<boolean>>) {
  const router = useRouter();

  useEffect(() => {
    async function verifyToken() {
      const authCookie = getCookie(ID_TOKEN_COOKIE_NAME);

      if (!authCookie) {
        router.push("/");
        return;
      }

      const verify = await fetch(VERIFY_TOKEN_ROUTE, {
        method: "POST",
        body: JSON.stringify({ token: authCookie }),
      });

      if (!verify.ok) {
        router.push("/");
      }
    }
    try {
      verifyToken();
    } catch (e) {
      router.push("/");
    } finally {
      setLoader && setLoader(false);
    }
  }, []);
}

export default useVerifyToken;
