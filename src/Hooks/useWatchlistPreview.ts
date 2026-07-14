"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { collection, getDocs } from "firebase/firestore";
import { database, usersCollectionName, auth } from "@/firebase/firebase.config";
import { IMediaData } from "@/Types";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
/**

 * Picks up to 6 random movies + 6 random shows from the user's watchlist and

 * interleaves them (movie, show, movie, show...) so both types get airtime

 * instead of one dominating the carousel.

 */
export function useWatchlistPreview() {
  const { firebaseActiveUser, userLogged } = useSelector((state: RootState) => state.auth);
  const [items, setItems] = useState<IMediaData[]>([]);
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

    // 1. Configuración de la Caché (4 horas)
    const CACHE_KEY = `watchlist_preview_${uid}`;
    const CACHE_TIME_MS = 4 * 60 * 60 * 1000;
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (cachedData) {
      try {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_TIME_MS) {
          setItems(data);
          setIsLoading(false);
          return; // Si el caché es válido, salimos temprano
        }
      } catch (e) {
        console.error("Error leyendo la caché", e);
      }
    }

    // 2. Si no hay caché válido, hacemos el fetch
    getDocs(collection(database, usersCollectionName, uid, "watchlist"))
      .then((snapshot) => {
        if (cancelled) return;

        const all = snapshot.docs.map((doc) => doc.data() as IMediaData);

        if (all.length === 0) {
          setItems([]);
          return;
        }

        // Tomamos 5 y 5 para dejarle espacio al último elemento (total ~11 elementos)
        const movies = shuffle(all.filter((m) => m.media_type === "movie")).slice(0, 7);
        const shows = shuffle(all.filter((m) => m.media_type === "tv")).slice(0, 7);

        const interleaved: IMediaData[] = [];

        const max = Math.max(movies.length, shows.length);
        for (let i = 0; i < max; i++) {
          if (movies[i]) interleaved.push(movies[i]);
          if (shows[i]) interleaved.push(shows[i]);
        }

        setItems(interleaved);

        // 4. Guardamos los nuevos resultados en localStorage
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: interleaved }));
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [firebaseActiveUser?.uid, userLogged]);

  return { items, isLoading };
}
