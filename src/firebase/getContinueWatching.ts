import { collection, getDocs } from "firebase/firestore";
import { database, usersCollectionName } from "./firebase.config";
import { IhistoryMedia } from "@/Types";

export interface ShowProgress {
  mediaId: number;
  title: string;
  season: number;
  episode: number;
  watchedAt: number;
}

/**
 * Scans this user's watch history and returns, per TV show, the furthest point
 * reached — the max (season, episode) pair ever watched, not simply the most
 * recently watched episode (rewatching an old episode shouldn't look like new
 * progress).
 *
 * Same access pattern/cost tradeoff as getWatchedEpisodeIds: reads every date
 * bucket in the user's history. Fine at personal-project scale.
 */
export async function getShowsProgress(uid: string): Promise<ShowProgress[]> {
  const progressByShow = new Map<number, ShowProgress>();

  try {
    const dateCollections = await getDocs(collection(database, usersCollectionName, uid, "history"));

    await Promise.all(
      dateCollections.docs.map(async (dateDoc) => {
        const contentSnapshot = await getDocs(collection(database, usersCollectionName, uid, "history", dateDoc.id, "content"));

        contentSnapshot.docs.forEach((contentDoc) => {
          const item = contentDoc.data() as IhistoryMedia;
          if (item.media_type !== "tv" || item.season == null || item.episode_number == null) return;

          const existing = progressByShow.get(item.id);
          const isFurther = !existing || item.season > existing.season || (item.season === existing.season && item.episode_number > existing.episode);

          if (isFurther) {
            progressByShow.set(item.id, {
              mediaId: item.id,
              title: item.title || "",
              season: item.season,
              episode: item.episode_number,
              watchedAt: item.watchedAt || 0,
            });
          }
        });
      }),
    );
  } catch (err) {
    console.error("Error fetching watch progress:", err);
  }

  return Array.from(progressByShow.values());
}
