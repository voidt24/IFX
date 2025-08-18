import React from "react";

function YearBadge({ release_date, first_air_date }: { release_date: string | undefined; first_air_date: string | undefined }) {
  const isMovie = release_date && !first_air_date;
  const isMovieNotReleasedYet = release_date && new Date(release_date).getTime() > Date.now();
  const MovieYear = release_date && new Date(release_date).getFullYear();
  const isTVNotReleasedYet = first_air_date && new Date(first_air_date).getTime() > Date.now();
  const TVYear = first_air_date && new Date(first_air_date).getFullYear();

  return (
    <div className="year absolute top-[13px] right-[5px] z-[2] rounded-full px-[0.3rem] bg-surface-modal">
      {isMovie ? (isMovieNotReleasedYet ? MovieYear : release_date.slice(0, 4)) : isTVNotReleasedYet ? TVYear : first_air_date?.slice(0, 4)}
    </div>
  );
}

export default YearBadge;
