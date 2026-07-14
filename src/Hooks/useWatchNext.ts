"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { auth } from "@/firebase/firebase.config";
import { getShowsProgress } from "@/firebase/getContinueWatching";
import { API_KEY, apiUrl, image } from "@/helpers/api.config";

export interface WatchNextItem {
  mediaId: number;
  title: string;
  season: number;
  episode: number;
  episodeName: string;
  imageUrl: string | null;
  watchedAt: number;
}

interface TMDBSeasonSummary {
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

interface TMDBEpisode {
  episode_number: number;
  name: string;
  still_path: string | null;
  air_date: string | null;
}

// Bounds how many shows we make extra TMDB calls for on every Home load.
const MAX_SHOWS_TO_CHECK = 10;

export function useWatchNext() {
  const { firebaseActiveUser, userLogged } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<WatchNextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const uid = firebaseActiveUser?.uid || auth.currentUser?.uid;

    if (!userLogged || !uid) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function resolveNextEpisode(show: Awaited<ReturnType<typeof getShowsProgress>>[number]): Promise<WatchNextItem | null> {
      try {
        const detailsRes = await fetch(`${apiUrl}tv/${show.mediaId}?api_key=${API_KEY}`);
        const details = await detailsRes.json();

        const seasons: TMDBSeasonSummary[] = (details.seasons || []).filter(
          (s: TMDBSeasonSummary & { name?: string }) => s.season_number > 0 && (!s.air_date || new Date(s.air_date).getTime() <= Date.now()),
        );

        const currentSeason = seasons.find((s) => s.season_number === show.season);
        if (!currentSeason) return null;

        let targetSeason = show.season;
        let targetEpisode = show.episode + 1;

        if (targetEpisode > currentSeason.episode_count) {
          const nextSeason = seasons.find((s) => s.season_number > show.season);
          if (!nextSeason) return null; // finished the whole series so far
          targetSeason = nextSeason.season_number;
          targetEpisode = 1;
        }

        const seasonRes = await fetch(`${apiUrl}tv/${show.mediaId}/season/${targetSeason}?api_key=${API_KEY}`);
        const seasonData = await seasonRes.json();
        const nextEp: TMDBEpisode | undefined = (seasonData.episodes || []).find((e: TMDBEpisode) => e.episode_number === targetEpisode);

        if (!nextEp) return null;
        if (nextEp.air_date && new Date(nextEp.air_date).getTime() > Date.now()) return null; // not aired yet

        return {
          mediaId: show.mediaId,
          title: details.name || show.title,
          season: targetSeason,
          episode: targetEpisode,
          episodeName: nextEp.name,
          imageUrl: nextEp.still_path ? `${image}${nextEp.still_path}` : details.backdrop_path ? `${image}${details.backdrop_path}` : null,
          watchedAt: show.watchedAt,
        };
      } catch {
        return null;
      }
    }

    async function run() {
      const progress = await getShowsProgress(uid as string);

      // NUEVO: Calcular límite de 2 semanas en milisegundos
      const TWO_WEEKS_IN_MS = 14 * 24 * 60 * 60 * 1000;
      const now = Date.now();

      // NUEVO: Filtramos primero los que tienen menos de 2 semanas, luego ordenamos y cortamos.
      const candidates = progress
        .filter((show) => now - show.watchedAt < TWO_WEEKS_IN_MS)
        .sort((a, b) => b.watchedAt - a.watchedAt)
        .slice(0, MAX_SHOWS_TO_CHECK);

      const results = await Promise.all(candidates.map(resolveNextEpisode));

      if (!cancelled) {
        setItems(results.filter((r): r is WatchNextItem => r !== null));
        setIsLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [firebaseActiveUser?.uid, userLogged]);

  return { items, isLoading };
}
