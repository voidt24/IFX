import { RootState } from "@/store";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

function DisplayInfoTitle({ mediaId, title, isTV, season, episode }: { mediaId: number; title: string | null; isTV: boolean; season: string | null; episode: string | null }) {
  const { currentMediaType, episodesArray } = useSelector((state: RootState) => state.mediaDetails);

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <Link className="font-bold text-xl md:text-2xl xl:text-3xl text-left hover:underline" href={`/${currentMediaType}/${mediaId}`}>
        {title}
      </Link>

      {isTV && (
        <p className="text-content-secondary text-left max-lg:text-[88%]">
          {season && season != "0" && `Season ${season} - `}
          {episode && episode != "0" && `Episode ${episode} `}
          {episodesArray?.[0]?.episodes &&
            episodesArray[0].episodes[Number(episode) - 1]?.name.toLowerCase() != `episode ${Number(episode)}` &&
            `- ${episodesArray[0].episodes[Number(episode) - 1]?.name}`}
        </p>
      )}
    </div>
  );
}

export default DisplayInfoTitle;
