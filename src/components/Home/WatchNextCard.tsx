import Link from "next/link";
import { WatchNextItem } from "@/Hooks/useWatchNext";

function WatchNextCard({ item }: { item: WatchNextItem }) {
  return (
    <Link
      href={`/tvshows/${item.mediaId}/watch?season=${item.season}&episode=${item.episode}&option=1`}
      className="block group"
      onClick={() => {
        sessionStorage.setItem("navigatingFromApp", "1");
      }}
    >
      <div className="relative aspect-video rounded-md overflow-hidden bg-zinc-900 border-2 border-white/10 group-hover:border-brand-primary transition-colors">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.episodeName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No image</div>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
          <i className="bi bi-play-fill text-3xl text-white drop-shadow" />
        </div>

        <span className="absolute top-1.5 left-1.5 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          S{item.season}-E{item.episode}
        </span>
      </div>

      <p className="mt-1.5 text-sm font-bold line-clamp-1">{item.title}</p>
      <p className="text-xs text-content-secondary line-clamp-1">{item.episodeName}</p>
    </Link>
  );
}

export default WatchNextCard;
