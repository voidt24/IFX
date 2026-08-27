"use client";
import { useMemo, useState } from "react";
import { IMediaData } from "@/Types";
import { IPersonCredit } from "@/Types/person";
import MediaGrid from "@/components/MediaGrid/MediaGrid";
import Tabs from "@/components/common/Tabs/Tabs";
import { Tab } from "@/components/common/Tabs/Tab";

const PAGE_SIZE = 9;

// One credit can appear more than once in combined_credits (e.g. multiple voice
// roles in the same title) — keep the most "complete" entry per id+media_type.
function dedupeCredits(credits: IPersonCredit[]): IPersonCredit[] {
  const map = new Map<string, IPersonCredit>();
  for (const credit of credits) {
    const key = `${credit.media_type}-${credit.id}`;
    if (!map.has(key)) map.set(key, credit);
  }
  return Array.from(map.values());
}

function sortByDateDesc(a: IPersonCredit, b: IPersonCredit) {
  const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
  const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
  if (isNaN(dateA)) return 1;
  if (isNaN(dateB)) return -1;
  return dateB - dateA;
}

function toMediaData(credit: IPersonCredit): IMediaData {
  return {
    id: credit.id,
    media_type: credit.media_type,
    title: credit.title,
    original_title: credit.original_title,
    name: credit.name,
    original_name: credit.original_name,
    overview: credit.overview,
    poster_path: credit.poster_path ?? undefined,
    noTextPoster_path: undefined,
    release_date: credit.release_date,
    first_air_date: credit.first_air_date,
    vote_average: credit.vote_average,
  };
}

function FilmographyGrid({ credits }: { credits: IPersonCredit[] }) {
  const [elementsToShow, setElementsToShow] = useState(PAGE_SIZE);

  if (credits.length === 0) {
    return <p className="text-content-third text-center py-8">Nothing to show here yet</p>;
  }

  const mediaData = credits.slice(0, elementsToShow).map(toMediaData);

  return (
    <>
      <MediaGrid mediaData={mediaData} />
      {elementsToShow < credits.length && (
        <p className="show-more-btn" onClick={() => setElementsToShow((prev) => prev + PAGE_SIZE)}>
          Show more
        </p>
      )}
    </>
  );
}

const ActorFilmography = ({ cast }: { cast: IPersonCredit[] }) => {
  const sortedCast = useMemo(() => dedupeCredits(cast || []).sort(sortByDateDesc), [cast]);
  // const sortedCrew = useMemo(() => dedupeCredits(crew || []).sort(sortByDateDesc), [crew]);

  if (sortedCast.length === 0) {
    return <p className="text-content-third text-center py-8">No known filmography</p>;
  }

  // if (sortedCrew.length === 0) {
  //   return <FilmographyGrid credits={sortedCast} />;
  // }

  return (
    <Tabs>
      <Tab title={`Acting (${sortedCast.length})`}>
        <FilmographyGrid credits={sortedCast} />
      </Tab>
      {/* <Tab title={`Crew (${sortedCrew.length})`}>
        <FilmographyGrid credits={sortedCrew} />
      </Tab> */}
    </Tabs>
  );
};

export default ActorFilmography;
