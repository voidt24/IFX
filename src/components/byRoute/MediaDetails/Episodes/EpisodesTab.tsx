"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { usePathname, useRouter } from "next/navigation";
import { API_KEY, apiUrl, image } from "@/helpers/api.config";
import { MediaTypeApi } from "@/Types";
import { Season } from "@/Types/season";
import { getRunTime } from "@/helpers/getRunTime";
import { setActiveEpisode, setActiveSeason } from "@/store/slices/mediaDetailsSlice";
import { auth } from "@/firebase/firebase.config";
import { getWatchedEpisodeIds } from "@/firebase/getWatchedEpisodes";

interface EpisodeItem {
  id: number;
  episode_number: number;
  name: string;
  still_path: string | null;
  air_date: string | null;
  runtime: number;
}

function EpisodesTab({ mediaId, mediaType }: { mediaId: number; mediaType: MediaTypeApi }) {
  const { mediaDetailsData } = useSelector((state: RootState) => state.mediaDetails);
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const path = usePathname();

  const seasons = ((mediaDetailsData?.seasonsArray as Season[] | null) || []).filter((s) => s.name !== "Specials" && (!s.air_date || new Date(s.air_date).getTime() <= Date.now()));

  const [selectedSeason, setSelectedSeason] = useState<number | null>(seasons[0]?.season_number ?? null);
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [watchedIds, setWatchedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!selectedSeason) return;
    let cancelled = false;
    setIsLoading(true);

    fetch(`${apiUrl}${mediaType}/${mediaId}/season/${selectedSeason}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list: EpisodeItem[] = (data.episodes || []).filter((e: EpisodeItem) => !e.air_date || new Date(e.air_date).getTime() <= Date.now());
        setEpisodes(list);
      })
      .catch(() => {
        if (!cancelled) setEpisodes([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSeason, mediaId, mediaType]);

  // Load which episodes of this show have already been watched, to show the "watched" indicator.
  useEffect(() => {
    const uid = firebaseActiveUser?.uid || auth.currentUser?.uid;
    if (!uid) {
      setWatchedIds(new Set());
      return;
    }
    let cancelled = false;
    getWatchedEpisodeIds(uid, mediaId).then((ids) => {
      if (!cancelled) setWatchedIds(ids);
    });
    return () => {
      cancelled = true;
    };
  }, [mediaId, firebaseActiveUser?.uid]);

  function handleEpisodeClick(ep: EpisodeItem) {
    if (!selectedSeason) return;
    dispatch(setActiveSeason(selectedSeason));
    dispatch(setActiveEpisode(ep.episode_number));
    router.push(`${path}/watch?season=${selectedSeason}&episode=${ep.episode_number}&option=1`);
  }

  if (seasons.length === 0) {
    return <p className="text-content-secondary text-sm text-center">No seasons available yet.</p>;
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <select
        value={selectedSeason ?? ""}
        onChange={(e) => setSelectedSeason(Number(e.target.value))}
        className="w-full sm:w-64 rounded-lg border border-zinc-700 bg-zinc-900 text-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-primary"
      >
        {seasons.map((s) => (
          <option key={s.season_number} value={s.season_number}>
            {s.name || `Season ${s.season_number}`}
          </option>
        ))}
      </select>

      {isLoading ? (
        <p className="text-content-secondary text-sm">Loading episodes...</p>
      ) : episodes.length === 0 ? (
        <p className="text-content-secondary text-sm text-center">No episodes available for this season yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {episodes.map((ep) => {
            const isWatched = watchedIds.has(ep.id);
            return (
              <button key={ep.episode_number} onClick={() => handleEpisodeClick(ep)} className="flex flex-col gap-2 group  transition-colors rounded-lg cursor-pointer text-left">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border-2 border-transparent group-hover:border-brand-primary">
                  {ep.still_path ? (
                    <img
                      src={`${image}${ep.still_path}`}
                      alt={ep.name}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isWatched ? "opacity-40" : ""}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No image</div>
                  )}

                  {/* Play icon on hover, like a real "click to play" affordance */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30">
                    <i className="bi bi-play-fill text-3xl text-white drop-shadow" />
                  </div>

                  {/* Watched badge */}
                  {isWatched && (
                    <span className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-black/75 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      <i className="bi bi-check-circle-fill text-brand-primary" />
                      Watched
                    </span>
                  )}

                  {/* Netflix-style bottom progress bar (full, since we only track watched/unwatched) */}
                  {isWatched && <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-primary" />}
                </div>
                <div className="flex px-1.5 py-1.5 justify-between items-center text-sm">
                  <p className={`line-clamp-2 ${isWatched ? "text-content-secondary" : ""}`}>
                    E{ep.episode_number}: {ep.name}
                  </p>
                  <span className="text-white/70 flex-shrink-0 ml-2">{getRunTime(ep.runtime)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EpisodesTab;
