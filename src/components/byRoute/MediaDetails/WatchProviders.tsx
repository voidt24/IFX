"use client";
import { imageWithSize } from "@/helpers/api.config";
import useUserRegion from "@/Hooks/useUserRegion";
import { IWatchProviderRegion } from "@/Types/mediaDetails";
import { MediaTypeApi } from "@/Types/mediaType";

const FALLBACK_REGION = "US";

function WatchProviders({ watchProvidersByRegion, mediaType }: { watchProvidersByRegion?: Record<string, IWatchProviderRegion> | null; mediaType: MediaTypeApi }) {
  const { region } = useUserRegion();

  // TV only, per product requirement — movies aren't shown here.
  if (mediaType !== "tv" || !watchProvidersByRegion) return null;

  const regionData = watchProvidersByRegion[region] || watchProvidersByRegion[FALLBACK_REGION];
  const providers = regionData?.flatrate || [];

  if (providers.length === 0) return null;

  return (
    <div className="flex-row-center flex-wrap gap-2 text-content-secondary ">
      <span>Available on:</span>
      <div className="flex-row-center gap-2 flex-wrap">
        {providers.slice(0, 3).map((provider) => (
          <img key={provider.provider_id} src={`${imageWithSize("92")}${provider.logo_path}`} alt={provider.provider_name} title={provider.provider_name} className="h-6 w-6 rounded-md object-cover" />
        ))}
      </div>
    </div>
  );
}

export default WatchProviders;
