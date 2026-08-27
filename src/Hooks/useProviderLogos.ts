import { useEffect, useState } from "react";
import { fetchProviderLogos } from "@/helpers/fetchInitialData";
import { ProviderLogos } from "@/app/api/tmdb/providers/route";

function useProviderLogos(enabled: boolean = true) {
  const [logos, setLogos] = useState<Record<string, ProviderLogos | null>>({});
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    fetchProviderLogos()
      .then((data) => {
        if (isMounted) setLogos(data);
      })
      .catch(() => {
        // swallow: consumers just won't get a logo, badge/selector falls back gracefully
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return { logos, isLoading };
}

export default useProviderLogos;
