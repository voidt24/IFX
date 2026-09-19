"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IMediaData } from "@/Types/index";
import MediaGrid from "@/components/MediaGrid/MediaGrid";
import Pagination from "@/components/common/Pagination";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";
import YearSelect from "@/features/contentFilter/YearSelect";
import GenreSelect from "@/features/contentFilter/GenreSelect";

// Año actual + 5 (debe coincidir con YEARS_AHEAD en api/tmdb/upcoming/route.ts)
const YEARS_AHEAD = 5;
const CURRENT_YEAR = new Date().getFullYear();
const UPCOMING_YEARS = Array.from({ length: YEARS_AHEAD + 1 }, (_, i) => String(CURRENT_YEAR + i));

export default function UpcomingMovies() {
  const [apiData, setApiData] = useState<IMediaData[]>([]);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const page = searchParams.get("page");
  const year = searchParams.get("year");
  const genre = searchParams.get("genre");

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!Number(page)) {
      params.set("page", "1");
      router.replace(`?${params.toString()}`);
    }
  }, [page]);

  // Al cambiar year/genre volvemos a la página 1
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (Number(page) > 1) {
      params.set("page", "1");
      router.replace(`?${params.toString()}`);
    }
  }, [year, genre]);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    const query = new URLSearchParams({ page: String(Number(page) || 1) });
    if (year && year !== "All") query.set("year", year);
    if (genre && genre !== "All") query.set("genre", genre);

    fetch(`/api/tmdb/upcoming?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setApiData(data.results || []);
        setNumberOfPages(Number(data.total_pages) || 1);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [page, year, genre]);

  if (error) {
    return (
      <div className="error not-found">
        <h1>ERROR</h1>
        <p>Please try again</p>
      </div>
    );
  }

  return (
    <Wrapper customClasses="relative">
      <div className="flex-col-center lists w-full gap-8">
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full z-20 bg-none">
            <h1 className="title-style">Upcoming Movies</h1>
            <div className="flex gap-4">
              <YearSelect selected={year} years={UPCOMING_YEARS} />
              <GenreSelect selected={genre} mediaType="movies" />
            </div>
          </div>

          {isLoading ? (
            <div className="lists flex flex-col items-center gap-4 text-center animate-pulse w-full">
              <div className="media-lists flex flex-col gap-4 xl:max-w-[1400px] w-full">
                {Array.from({ length: 20 }).map((_, index) => (
                  <SliderCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : apiData.length === 0 ? (
            <p className="text-content-primary">No upcoming movies found for this filter.</p>
          ) : (
            <MediaGrid mediaData={apiData} />
          )}
        </div>

        {numberOfPages > 1 && <Pagination queryName="page" pageActive={Number(page) || 1} numberOfPages={numberOfPages} />}
      </div>
    </Wrapper>
  );
}
