"use client";
import dynamic from "next/dynamic";
import { useWatchlistPreview } from "@/Hooks/useWatchlistPreview";
import HomeCarouselSection from "@/components/common/HomeCarouselSection";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";

const MediaCardContainer = dynamic(() => import("@/components/MediaCard/MediaCardContainer"), {
  loading: () => <SliderCardSkeleton />,
});

function WatchlistPreviewSection() {
  const { items, isLoading } = useWatchlistPreview();

  if (isLoading || items.length === 0) return null;

  return (
    <HomeCarouselSection title="From Your Watchlist" link="/lists?selected=watchlist">
      {items.map((item) => (
        <MediaCardContainer
          key={item.id}
          result={item}
          mediaType={item.media_type}
          showBadge={true} // <-- Pasamos la orden de forzar el badge
        />
      ))}
    </HomeCarouselSection>
  );
}

export default WatchlistPreviewSection;
