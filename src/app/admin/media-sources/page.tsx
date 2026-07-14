"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { API_KEY, apiUrl } from "@/helpers/api.config";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
}

interface TVSeasonInfo {
  season_number: number;
  name: string;
  episode_count: number;
}

interface TVEpisodeInfo {
  episode_number: number;
  name: string;
}

interface SavedEntry {
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  season?: number;
  episode?: number;
  m3u8Url: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayTitle(r: TMDBResult) {
  return r.title || r.name || "Unknown";
}

function displayYear(r: TMDBResult) {
  const date = r.release_date || r.first_air_date;
  return date ? `(${date.slice(0, 4)})` : "";
}

function buildKey(e: Pick<SavedEntry, "mediaType" | "tmdbId" | "season" | "episode">) {
  return e.mediaType === "tv" && e.season && e.episode ? `media-source:tv:${e.tmdbId}:${e.season}:${e.episode}` : `media-source:${e.mediaType}:${e.tmdbId}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminMediaSources() {
  const { userLogged, authListenerInitialized } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Selected title state
  const [selected, setSelected] = useState<TMDBResult | null>(null);
  const [season, setSeason] = useState("");
  const [episode, setEpisode] = useState("");
  const [m3u8Url, setM3u8Url] = useState("");

  // TV season/episode lookup (from TMDB)
  const [tvSeasons, setTvSeasons] = useState<TVSeasonInfo[]>([]);
  const [tvEpisodes, setTvEpisodes] = useState<TVEpisodeInfo[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(false);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Saved entries list
  const [entries, setEntries] = useState<SavedEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);

  // Inline edit state (for updating a saved entry's m3u8Url without delete + re-add)
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Wait for Firebase to finish resolving the session before redirecting.
  useEffect(() => {
    if (!authListenerInitialized) return;
    if (!userLogged) router.push("/");
  }, [authListenerInitialized, userLogged]);

  // Load existing entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setIsLoadingEntries(true);
    try {
      const res = await fetch("/api/admin/media-source");
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } finally {
      setIsLoadingEntries(false);
    }
  }

  // TMDB search (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${apiUrl}search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`);
        const data = await res.json();
        const filtered = (data.results as TMDBResult[]).filter((r) => r.media_type === "movie" || r.media_type === "tv").slice(0, 6);
        setSearchResults(filtered);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // Fetch season list for a TV show
  async function fetchTVSeasons(tvId: number) {
    setIsLoadingSeasons(true);
    try {
      const res = await fetch(`${apiUrl}tv/${tvId}?api_key=${API_KEY}`);
      const data = await res.json();
      const seasons: TVSeasonInfo[] = (data.seasons || [])
        .filter((s: { season_number: number }) => s.season_number > 0)
        .map((s: { season_number: number; name: string; episode_count: number }) => ({
          season_number: s.season_number,
          name: s.name,
          episode_count: s.episode_count,
        }));
      setTvSeasons(seasons);
    } catch {
      setTvSeasons([]);
    } finally {
      setIsLoadingSeasons(false);
    }
  }

  // Fetch episode list for a specific season
  async function fetchTVEpisodes(tvId: number, seasonNumber: number) {
    setIsLoadingEpisodes(true);
    try {
      const res = await fetch(`${apiUrl}tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
      const data = await res.json();
      const episodes: TVEpisodeInfo[] = (data.episodes || []).map((e: { episode_number: number; name: string }) => ({
        episode_number: e.episode_number,
        name: e.name,
      }));
      setTvEpisodes(episodes);
    } catch {
      setTvEpisodes([]);
    } finally {
      setIsLoadingEpisodes(false);
    }
  }

  function selectResult(result: TMDBResult) {
    setSelected(result);
    setQuery(displayTitle(result));
    setSearchResults([]);
    setSeason("");
    setEpisode("");
    setSaveMsg(null);
    setTvSeasons([]);
    setTvEpisodes([]);

    if (result.media_type === "tv") {
      setM3u8Url("");
      fetchTVSeasons(result.id);
    } else {
      // Movies: prefill with the existing URL if one is already saved, to make substitution easy.
      const existing = entries.find((e) => e.mediaType === "movie" && e.tmdbId === result.id);
      setM3u8Url(existing?.m3u8Url ?? "");
    }
  }

  function handleSeasonChange(value: string) {
    setSeason(value);
    setEpisode("");
    setTvEpisodes([]);
    if (selected && value) fetchTVEpisodes(selected.id, Number(value));
  }

  async function handleSave() {
    if (!selected || !m3u8Url.trim()) return;
    if (selected.media_type === "tv" && (!season || !episode)) return;

    setIsSaving(true);
    setSaveMsg(null);

    try {
      const res = await fetch("/api/admin/media-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: selected.id,
          mediaType: selected.media_type,
          title: displayTitle(selected),
          season: season ? Number(season) : undefined,
          episode: episode ? Number(episode) : undefined,
          m3u8Url: m3u8Url.trim(),
        }),
      });

      if (res.ok) {
        setSaveMsg({ ok: true, text: "Guardado correctamente." });

        if (selected.media_type === "tv") {
          // Keep the show + season selected so adding the next episode is a single step.
          setEpisode("");
          setM3u8Url("");
        } else {
          setSelected(null);
          setQuery("");
          setM3u8Url("");
          setSeason("");
          setEpisode("");
        }
        fetchEntries();
      } else {
        const err = await res.json();
        setSaveMsg({ ok: false, text: err.error || "Error al guardar." });
      }
    } catch {
      setSaveMsg({ ok: false, text: "Error de red." });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(key: string) {
    if (!confirm("¿Eliminar esta fuente?")) return;
    try {
      await fetch("/api/admin/media-source", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      fetchEntries();
    } catch {
      alert("Error al eliminar.");
    }
  }

  function startEdit(entry: SavedEntry) {
    setEditingKey(buildKey(entry));
    setEditValue(entry.m3u8Url);
  }

  function cancelEdit() {
    setEditingKey(null);
    setEditValue("");
  }

  // Reuses the same POST endpoint used by the "add" form — since the key (tmdbId/mediaType/season/episode)
  // stays identical, this overwrites the existing entry's URL in place instead of delete + re-add.
  async function handleUpdateUrl(entry: SavedEntry) {
    if (!editValue.trim()) return;

    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/media-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: entry.tmdbId,
          mediaType: entry.mediaType,
          title: entry.title,
          season: entry.season,
          episode: entry.episode,
          m3u8Url: editValue.trim(),
        }),
      });

      if (res.ok) {
        setEditingKey(null);
        setEditValue("");
        // Re-fetch so every dependent view (search "already added" badges, season/episode
        // dropdowns, duplicate detection, this same grouped list) reflects the new URL.
        fetchEntries();
      } else {
        alert("Error al actualizar la fuente.");
      }
    } catch {
      alert("Error de red al actualizar.");
    } finally {
      setIsUpdating(false);
    }
  }

  // ── Duplicate detection ───────────────────────────────────────────────────
  const existingMovieEntry = selected?.media_type === "movie" ? entries.find((e) => e.mediaType === "movie" && e.tmdbId === selected.id) : null;

  const currentSeasonEpisodes = useMemo(() => {
    if (!selected || selected.media_type !== "tv" || !season) return new Set<number>();
    return new Set(entries.filter((e) => e.mediaType === "tv" && e.tmdbId === selected.id && e.season === Number(season)).map((e) => e.episode as number));
  }, [entries, selected, season]);

  const allEpisodesInSeasonAdded = tvEpisodes.length > 0 && tvEpisodes.every((ep) => currentSeasonEpisodes.has(ep.episode_number));

  // ── Group saved entries by title for a tidy list ──────────────────────────
  const { movies, shows } = useMemo(() => {
    const movieEntries = entries.filter((e) => e.mediaType === "movie").sort((a, b) => a.title.localeCompare(b.title));

    type ShowGroup = { tmdbId: number; title: string; seasons: Map<number, SavedEntry[]> };
    const showMap = new Map<number, ShowGroup>();

    entries
      .filter((e) => e.mediaType === "tv")
      .forEach((e) => {
        if (!showMap.has(e.tmdbId)) showMap.set(e.tmdbId, { tmdbId: e.tmdbId, title: e.title, seasons: new Map() });
        const show = showMap.get(e.tmdbId)!;
        const s = e.season ?? 0;
        if (!show.seasons.has(s)) show.seasons.set(s, []);
        show.seasons.get(s)!.push(e);
      });

    const showList = Array.from(showMap.values()).sort((a, b) => a.title.localeCompare(b.title));
    showList.forEach((show) => {
      show.seasons.forEach((list) => list.sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0)));
    });

    return { movies: movieEntries, shows: showList };
  }, [entries]);

  const canSave = selected && m3u8Url.trim() && (selected.media_type === "movie" || (season && episode));

  // Don't render anything while Firebase is still resolving the session
  if (!authListenerInitialized) {
    return <div className="min-h-screen flex items-center justify-center text-content-secondary text-sm">Verificando sesión...</div>;
  }

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin — Fuentes M3U8</h1>

      {/* ── Search ── */}
      <section className="mb-10">
        <h2 className="text-lg font-medium mb-3">Agregar nueva fuente</h2>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar película o serie..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary text-black"
          />
          {isSearching && <p className="absolute right-3 top-2 text-xs text-content-secondary">Buscando...</p>}

          {searchResults.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-background shadow-lg text-black">
              {searchResults.map((r) => {
                const already = r.media_type === "movie" ? entries.some((e) => e.mediaType === "movie" && e.tmdbId === r.id) : entries.some((e) => e.mediaType === "tv" && e.tmdbId === r.id);
                return (
                  <li key={r.id} onClick={() => selectResult(r)} className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-primary/10 text-sm">
                    {r.poster_path && <img src={`https://image.tmdb.org/t/p/w45${r.poster_path}`} alt="" className="h-10 w-7 rounded object-cover flex-shrink-0" />}
                    <span className="flex-1">
                      <span className="font-medium">{displayTitle(r)}</span> <span className="text-content-secondary">{displayYear(r)}</span>{" "}
                      <span className="text-xs text-primary ml-1">{r.media_type === "tv" ? "Serie" : "Película"}</span>
                    </span>
                    {already && <span className="text-xs text-green-600 font-medium flex-shrink-0">✓ Agregada</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Movie: duplicate banner ── */}
        {selected?.media_type === "movie" && existingMovieEntry && (
          <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-800">
            Esta película ya tiene una fuente guardada. Puedes <span className="font-medium">sustituir</span> la URL de abajo o eliminarla.
          </div>
        )}

        {/* ── Season / episode (only for TV), fetched from TMDB ── */}
        {selected?.media_type === "tv" && (
          <div className="flex gap-3 mb-4">
            <select
              value={season}
              onChange={(e) => handleSeasonChange(e.target.value)}
              disabled={isLoadingSeasons || tvSeasons.length === 0}
              className="w-1/2 text-black rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="">{isLoadingSeasons ? "Cargando temporadas..." : "Selecciona temporada"}</option>
              {tvSeasons.map((s) => {
                const addedCount = entries.filter((e) => e.mediaType === "tv" && e.tmdbId === selected.id && e.season === s.season_number).length;
                const complete = s.episode_count > 0 && addedCount >= s.episode_count;
                return (
                  <option key={s.season_number} value={s.season_number}>
                    {s.name || `Temporada ${s.season_number}`} ({addedCount}/{s.episode_count}){complete ? " ✓" : ""}
                  </option>
                );
              })}
            </select>

            <select
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              disabled={!season || isLoadingEpisodes || tvEpisodes.length === 0}
              className="w-1/2 text-black rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            >
              <option value="">{isLoadingEpisodes ? "Cargando episodios..." : "Selecciona episodio"}</option>
              {tvEpisodes.map((ep) => {
                const already = currentSeasonEpisodes.has(ep.episode_number);
                return (
                  <option key={ep.episode_number} value={ep.episode_number} disabled={already}>
                    E{ep.episode_number} — {ep.name} {already ? "✓ Agregado" : ""}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {selected?.media_type === "tv" && season && allEpisodesInSeasonAdded && <p className="text-xs text-green-600 mb-4">Todos los episodios de esta temporada ya están agregados.</p>}

        {/* ── M3U8 URL ── */}
        {selected && (
          <input
            type="url"
            placeholder="https://tu-cdn.com/.../master.m3u8"
            value={m3u8Url}
            onChange={(e) => setM3u8Url(e.target.value)}
            className="w-full text-black rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary mb-4"
          />
        )}

        {selected && (
          <div className="text-xs text-content-secondary mb-4 text-black">
            <span className="font-medium">Seleccionado:</span> {displayTitle(selected)} {displayYear(selected)} · tmdbId: {selected.id}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            {isSaving ? "Guardando..." : existingMovieEntry ? "Sustituir fuente" : "Guardar fuente"}
          </button>

          {selected?.media_type === "movie" && existingMovieEntry && (
            <button
              onClick={() => {
                handleDelete(buildKey(existingMovieEntry));
                setSelected(null);
                setQuery("");
                setM3u8Url("");
              }}
              className="rounded-lg border border-red-500/50 px-5 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              Eliminar fuente
            </button>
          )}
        </div>

        {saveMsg && <p className={`mt-3 text-sm ${saveMsg.ok ? "text-green-500" : "text-red-500"}`}>{saveMsg.text}</p>}
      </section>

      {/* ── Saved entries, grouped ── */}
      <section className="text-black">
        <h2 className="text-lg font-medium mb-4">Fuentes guardadas</h2>

        {isLoadingEntries && <p className="text-sm text-content-secondary">Cargando...</p>}

        {!isLoadingEntries && entries.length === 0 && <p className="text-sm text-content-secondary">No hay fuentes guardadas todavía.</p>}

        {!isLoadingEntries && entries.length > 0 && (
          <div className="space-y-8">
            {/* ── Movies ── */}
            {movies.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-content-secondary mb-2">Películas ({movies.length})</h3>
                <ul className="space-y-2">
                  {movies.map((e) => {
                    const key = buildKey(e);
                    const isEditing = editingKey === key;
                    return (
                      <li key={key} className="rounded-lg border border-border bg-background p-3 text-sm flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{e.title}</p>
                          {isEditing ? (
                            <input
                              type="url"
                              value={editValue}
                              onChange={(ev) => setEditValue(ev.target.value)}
                              autoFocus
                              className="w-full mt-1.5 text-black text-xs rounded border border-border bg-background px-2 py-1 outline-none focus:ring-2 focus:ring-primary"
                            />
                          ) : (
                            <p className="text-xs mt-0.5 break-all text-content-secondary">{e.m3u8Url}</p>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {isEditing ? (
                            <>
                              <button onClick={() => handleUpdateUrl(e)} disabled={isUpdating || !editValue.trim()} className="text-green-600 hover:text-green-500 text-xs disabled:opacity-40">
                                Save
                              </button>
                              <button onClick={cancelEdit} className="text-content-secondary hover:text-black text-xs">
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(e)} className="text-blue-500 hover:text-blue-400 text-xs">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(key)} className="text-red-500 hover:text-red-400 text-xs">
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* ── TV Shows ── */}
            {shows.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-content-secondary mb-2">Series ({shows.length})</h3>
                <div className="space-y-2">
                  {shows.map((show) => {
                    const totalEpisodes = Array.from(show.seasons.values()).reduce((acc, list) => acc + list.length, 0);
                    const seasonNumbers = Array.from(show.seasons.keys()).sort((a, b) => a - b);
                    return (
                      <details key={show.tmdbId} className="rounded-lg border border-border bg-background overflow-hidden">
                        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium flex items-center justify-between hover:bg-primary/5">
                          <span>{show.title}</span>
                          <span className="text-xs text-content-secondary font-normal">
                            {totalEpisodes} episodio{totalEpisodes === 1 ? "" : "s"} · {seasonNumbers.length} temporada{seasonNumbers.length === 1 ? "" : "s"}
                          </span>
                        </summary>
                        <div className="border-t border-border px-4 py-3 space-y-3">
                          {seasonNumbers.map((seasonNum) => (
                            <div key={seasonNum}>
                              <p className="text-xs font-semibold text-content-secondary mb-1.5">Temporada {seasonNum}</p>
                              <ul className="space-y-1.5">
                                {show.seasons.get(seasonNum)!.map((e) => {
                                  const key = buildKey(e);
                                  const isEditing = editingKey === key;
                                  return (
                                    <li key={key} className="flex items-center justify-between gap-3 text-sm bg-black/[0.03] rounded-md px-3 py-1.5">
                                      <div className="min-w-0 flex-1 flex items-center gap-2">
                                        <span className="flex-shrink-0">E{e.episode}</span>
                                        {isEditing ? (
                                          <input
                                            type="url"
                                            value={editValue}
                                            onChange={(ev) => setEditValue(ev.target.value)}
                                            autoFocus
                                            className="flex-1 min-w-0 text-black text-xs rounded border border-border bg-background px-2 py-1 outline-none focus:ring-2 focus:ring-primary"
                                          />
                                        ) : (
                                          <span className="text-content-secondary text-xs break-all truncate">{e.m3u8Url}</span>
                                        )}
                                      </div>
                                      <div className="flex gap-2 flex-shrink-0">
                                        {isEditing ? (
                                          <>
                                            <button
                                              onClick={() => handleUpdateUrl(e)}
                                              disabled={isUpdating || !editValue.trim()}
                                              className="text-green-600 hover:text-green-500 text-xs disabled:opacity-40"
                                            >
                                              Save
                                            </button>
                                            <button onClick={cancelEdit} className="text-content-secondary hover:text-black text-xs">
                                              Cancel
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button onClick={() => startEdit(e)} className="text-blue-500 hover:text-blue-400 text-xs">
                                              Edit
                                            </button>
                                            <button onClick={() => handleDelete(key)} className="text-red-500 hover:text-red-400 text-xs">
                                              Eliminar
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
