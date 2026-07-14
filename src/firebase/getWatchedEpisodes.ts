import { collection, getDocs } from "firebase/firestore";
import { database, usersCollectionName } from "./firebase.config";
import { IhistoryMedia } from "@/Types";

/**
 * Scans this user's watch history and returns the set of TMDB episode ids
 * that belong to the given show (mediaId) and have already been watched.
 *
 * Note: history is stored bucketed by date (users/{uid}/history/{dateId}/content/{episodeId}),
 * with no direct index from "show + episode" to "date watched". So this reads every
 * date bucket for the user, same access pattern as the History page itself. Fine at
 * personal-project scale; if history grows very large, a denormalized per-show
 * "watchedEpisodeIds" summary would be the next step.
 */
export async function getWatchedEpisodeIds(uid: string, mediaId: number): Promise<Set<number>> {
  const watched = new Set<number>();

  try {
    const dateCollections = await getDocs(collection(database, usersCollectionName, uid, "history"));

    await Promise.all(
      dateCollections.docs.map(async (dateDoc) => {
        const contentSnapshot = await getDocs(collection(database, usersCollectionName, uid, "history", dateDoc.id, "content"));

        contentSnapshot.docs.forEach((contentDoc) => {
          const item = contentDoc.data() as IhistoryMedia;
          if (item.media_type === "tv" && item.id === mediaId && item.episodeId) {
            watched.add(item.episodeId);
          }
        });
      }),
    );
  } catch (err) {
    console.error("Error fetching watched episodes:", err);
  }

  return watched;
}
