"use client";
import { useWatchNext } from "@/Hooks/useWatchNext";
import HomeCarouselSection from "@/components/common/HomeCarouselSection";
import WatchNextCard from "./WatchNextCard";

function WatchNextSection() {
  const { items, isLoading } = useWatchNext();

  if (isLoading || items.length === 0) return null;

  return (
    <HomeCarouselSection title="Watch Next" link="/history">
      {items.map((item) => (
        <WatchNextCard key={item.mediaId} item={item} />
      ))}
    </HomeCarouselSection>
  );
}

export default WatchNextSection;
