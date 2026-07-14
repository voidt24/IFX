"use client";

import { useEffect, useState, memo } from "react";
import { Dispatch, SetStateAction } from "react";
import { MediaTypeApi } from "@/Types";
import HlsPlayer from "./HlsPlayer";
import PlayMedia from "./PlayMedia";

interface MediaPlayerProps {
  currentId: number;
  mediaType: MediaTypeApi;
  season: string | null;
  episode: string | null;
  option: string | null;
  setOption?: Dispatch<SetStateAction<string | null>>;
  mediaURL: string | undefined;
  setMediaURL: Dispatch<SetStateAction<string | undefined>>;
}

/**
 * Looks up whether we have our own licensed .m3u8 for this title.
 * If we do, plays it directly with no ads/warning.
 * If we don't (or it fails to load), falls back to the existing
 * third-party embed carousel (PlayMedia), with a small notice that
 * the fallback source may include ads.
 */
function MediaPlayer(props: MediaPlayerProps) {
  const { currentId, mediaType, season, episode } = props;
  const [ownSourceUrl, setOwnSourceUrl] = useState<string | null | undefined>(undefined); // undefined = checking, null = none found
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setUseFallback(false);
    setOwnSourceUrl(undefined);

    const params = new URLSearchParams({ tmdbId: String(currentId), mediaType });
    if (mediaType === "tv") {
      if (season) params.set("season", season);
      if (episode) params.set("episode", episode);
    }

    fetch(`/api/media-source?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { m3u8Url: null }))
      .then((data) => {
        const url = data.m3u8Url;
        setOwnSourceUrl(typeof url === "string" && url.startsWith("http") ? url : null);
      })
      .catch(() => setOwnSourceUrl(null));
  }, [currentId, mediaType, season, episode]);

  if (ownSourceUrl === undefined) {
    return <div className="h-[20rem] lg:h-[40rem] xl:h-[40rem] w-full flex items-center justify-center text-content-secondary">Cargando...</div>;
  }

  if (ownSourceUrl && !useFallback) {
    return <HlsPlayer src={ownSourceUrl} className="h-[20rem] lg:h-[40rem] xl:h-[40rem] w-full" onFatalError={() => setUseFallback(true)} mediaType={mediaType} season={season} episode={episode} />;
  }

  return (
    <>
      <p className="text-sm text-content-secondary mb-2">Esta fuente es externa y puede incluir anuncios.</p>
      <PlayMedia {...props} />
    </>
  );
}

export default memo(MediaPlayer);
