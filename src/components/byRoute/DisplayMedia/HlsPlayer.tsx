"use client";

import { useEffect, useRef, useState, useCallback, memo, type ChangeEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";

interface HlsPlayerProps {
  src: string;
  className?: string;
  onFatalError?: () => void;
  mediaType?: "movie" | "tv";
  season?: string | null;
  episode?: string | null;
}

function HlsPlayer({ src, className, onFatalError, mediaType, season, episode }: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Playback state ──────────────────────────────────────────────────────────
  const [hasStarted, setHasStarted] = useState(false); // first play clicked
  const [isPaused, setIsPaused] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showLogo, setShowLogo] = useState(false); // logo intro animation
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0); // 0-100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState(0);
  const seekBarRef = useRef<HTMLDivElement>(null);

  // ── Media metadata from Redux ───────────────────────────────────────────────
  const { mediaDetailsData, episodesArray } = useSelector((s: RootState) => s.mediaDetails);

  const title = mediaDetailsData?.title ?? "";

  // bigHeroBackground is already a full TMDB URL built at "original" size
  // (see useMediaDetails.tsx) — landscape backdrop, best fit for a 16:9 player.
  const movieBackdrop = mediaDetailsData?.bigHeroBackground || null;

  // For TV: get episode still + name. still_path here is a raw TMDB path
  // (unprocessed API response), so we build the full URL ourselves at
  // "original" size for a sharp, non-stretched image.
  const seasonIdx = season ? Number(season) - 1 : 0;
  const episodeIdx = episode ? Number(episode) - 1 : 0;
  const episodeData = episodesArray?.[seasonIdx]?.episodes?.[episodeIdx];
  const episodeStill = episodeData?.still_path ? `https://image.tmdb.org/t/p/original${episodeData.still_path}` : null;
  const episodeName = episodeData?.name ?? "";

  const posterSrc = mediaType === "tv" ? episodeStill || movieBackdrop : movieBackdrop;
  const displayTitle = mediaType === "tv" && episodeName ? `${title} — ${episodeName}` : title;
  const displaySubtitle = mediaType === "tv" && season && episode ? `Season ${season} · Episode ${episode}` : null;

  // ── HLS setup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);
    setHasStarted(false);
    setIsPaused(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    let cancelled = false;
    let hlsInstance: import("hls.js").default | undefined;

    async function setup() {
      const { default: Hls } = await import("hls.js");
      if (cancelled || !video) return;

      if (!Hls.isSupported()) {
        onFatalError?.();
        return;
      }

      hlsInstance = new Hls();
      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(video);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!cancelled) setIsReady(true);
      });

      hlsInstance.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal && !cancelled) onFatalError?.();
      });
    }

    setup();
    return () => {
      cancelled = true;
      hlsInstance?.destroy();
    };
  }, [src, onFatalError]);

  // ── Video event listeners ────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    const onDurationChange = () => setDuration(video.duration);
    const onPlay = () => setIsPaused(false);
    const onPause = () => setIsPaused(true);
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

  // ── Fullscreen change sync ───────────────────────────────────────────────────
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // ── Auto-hide controls ───────────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (!isPaused) setShowControls(false);
    }, 3000);
  }, [isPaused]);

  useEffect(() => {
    if (isPaused) {
      setShowControls(true);
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    } else resetHideTimer();
  }, [isPaused, resetHideTimer]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleFirstPlay = useCallback(() => {
    if (!isReady) return;
    setShowLogo(true);
    setTimeout(() => {
      setShowLogo(false);
      setHasStarted(true);
      videoRef.current?.play().catch(() => {});
    }, 800);
  }, [isReady]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  const handleSeek = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const val = Number(e.target.value);
    video.currentTime = (val / 100) * video.duration;
    setProgress(val);
  }, []);

  const handleVolume = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const val = Number(e.target.value);
    video.volume = val;
    video.muted = val === 0;
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  }, []);

  const skip = useCallback((secs: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + secs));
  }, []);

  // ── Keyboard shortcuts (space = play/pause, ←/→ = seek ±10s) ─────────────────
  useEffect(() => {
    if (!hasStarted) return;

    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      // Don't hijack typing in inputs/textareas elsewhere on the page.
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        skip(-10);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        skip(10);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hasStarted, togglePlay, skip]);

  const handleSeekHover = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      const bar = seekBarRef.current;
      if (!bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      setHoverX(x);
      setHoverTime((x / rect.width) * duration);
    },
    [duration],
  );

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function formatTime(s: number) {
    if (!s || isNaN(s)) return "0:00";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black rounded-xl select-none ${className ?? ""}`}
      onMouseMove={hasStarted ? resetHideTimer : undefined}
      onMouseLeave={() => {
        if (!isPaused) setShowControls(false);
      }}
    >
      <video ref={videoRef} className="h-full w-full object-contain cursor-pointer" playsInline onClick={hasStarted ? togglePlay : undefined} />

      {/* ══ POSTER / PRE-PLAY SCREEN ══════════════════════════════════════════ */}
      {!hasStarted && (
        <div className="absolute inset-0 z-10">
          {/* Poster image */}
          {posterSrc ? (
            <img src={posterSrc} alt={displayTitle} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
          )}

          {/* Flat dark tint so the still stays sharp (no blur) but text is legible everywhere */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Extra gradient toward the bottom, where the title/button sit */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Logo intro animation overlay */}
          {showLogo && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 animate-fade-in">
              <div className="animate-logo-pop">
                <Image src="/logo.png" alt="Logo" width={180} height={90} className="object-contain drop-shadow-2xl" priority />
              </div>
            </div>
          )}

          {/* Title + play button (hidden while logo shows) */}
          {!showLogo && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6">
              {/* Big play button */}
              <button
                onClick={handleFirstPlay}
                disabled={!isReady}
                className="group flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/60 hover:bg-white/30 hover:scale-110 transition-all duration-300 disabled:opacity-40"
              >
                {isReady ? (
                  <svg className="w-9 h-9 md:w-11 md:h-11 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  /* Loading spinner */
                  <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
              </button>

              <div className="text-center">
                <p className="text-white font-bold text-xl md:text-3xl drop-shadow-lg">{displayTitle}</p>
                {displaySubtitle && <p className="text-white/70 text-sm md:text-base mt-1.5">{displaySubtitle}</p>}
                {!isReady && <p className="text-white/50 text-xs mt-3">Loading video...</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ PAUSE OVERLAY ═════════════════════════════════════════════════════ */}
      {hasStarted && isPaused && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          {/* Title info */}
          <div className="absolute top-10 text-center w-full">
            <p className="text-white font-semibold text-lg drop-shadow">{displayTitle}</p>
            {displaySubtitle && <p className="text-white/60 text-sm">{displaySubtitle}</p>}
            <p className="text-white/50 text-xs mt-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          {/* Center controls */}
          <div className="flex items-center gap-8">
            {/* Rewind 10s */}
            <button onClick={() => skip(-10)} className="flex flex-col items-center gap-1 group">
              <svg className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                <text x="8.5" y="15" fontSize="5" fill="currentColor" fontFamily="sans-serif">
                  10
                </text>
              </svg>
            </button>

            {/* Big play button */}
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/60 hover:bg-white/30 hover:scale-110 transition-all duration-300"
            >
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            {/* Forward 10s */}
            <button onClick={() => skip(10)} className="flex flex-col items-center gap-1 group">
              <svg className="w-8 h-8 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                <text x="8.5" y="15" fontSize="5" fill="currentColor" fontFamily="sans-serif">
                  10
                </text>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ══ CUSTOM CONTROLS BAR ═══════════════════════════════════════════════ */}
      {hasStarted && (
        <div className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-500 ${showControls || isPaused ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {/* Gradient so controls are readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none rounded-b-xl" />

          <div className="relative px-4 pb-3 pt-8">
            {/* Progress bar */}
            <div ref={seekBarRef} className="relative mb-3" onMouseMove={handleSeekHover} onMouseLeave={() => setHoverTime(null)}>
              {hoverTime !== null && (
                <div className="absolute -top-8 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap" style={{ left: hoverX }}>
                  {formatTime(hoverTime)}
                </div>
              )}
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 cursor-pointer accent-blue-500"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
                }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-3">
              {/* Left: play, skip, volume, time */}
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
                  {isPaused ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  )}
                </button>

                {/* Skip -10 */}
                <button onClick={() => skip(-10)} className="flex flex-col items-center gap-1 group">
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    <text x="8.5" y="15" fontSize="5" fill="currentColor" fontFamily="sans-serif">
                      10
                    </text>
                  </svg>
                </button>
                {/* Skip +10 */}

                <button onClick={() => skip(10)} className="flex flex-col items-center gap-1 group">
                  <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
                    <text x="8.5" y="15" fontSize="5" fill="currentColor" fontFamily="sans-serif">
                      10
                    </text>
                  </svg>
                </button>

                {/* Volume */}
                <div className="flex items-center gap-1.5">
                  <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                    {isMuted || volume === 0 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : volume < 0.5 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.5 12A4.5 4.5 0 0016 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>
                  <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume} onChange={handleVolume} className="w-16 h-1 cursor-pointer accent-blue-500" />
                </div>

                {/* Time */}
                <span className="text-white/70 text-xs tabular-nums">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right: logo + fullscreen */}
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={48} height={24} className="object-contain opacity-70" />
                <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
                  {isFullscreen ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(HlsPlayer);
