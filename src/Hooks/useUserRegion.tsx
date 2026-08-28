import { useEffect, useState } from "react";
import { getBaseUrl } from "@/lib/env";

const DEFAULT_REGION = "US";

// Module-level cache: every component asking for the user's region during this
// session should share one request instead of each firing its own /api/geo call.
let regionPromise: Promise<string> | null = null;

const fetchUserRegion = async (): Promise<string> => {
  if (!regionPromise) {
    regionPromise = fetch(`${getBaseUrl()}/api/geo`)
      .then(async (res) => {
        if (!res.ok) return DEFAULT_REGION;
        const { country } = await res.json();
        return country || DEFAULT_REGION;
      })
      .catch(() => {
        regionPromise = null; // let the next call retry instead of caching a failure
        return DEFAULT_REGION;
      });
  }

  return regionPromise;
};

export function useUserRegion() {
  const [region, setRegion] = useState<string>(DEFAULT_REGION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchUserRegion().then((country) => {
      if (isMounted) {
        setRegion(country);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { region, isLoading };
}

export default useUserRegion;
