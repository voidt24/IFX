import React from "react";
import CollapsibleElement from "@/components/common/CollapsibleElement";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

function DisplayInfoOverview({ variant, isTV, episode }: { variant: "mobile" | "desktop"; isTV: boolean; episode: string | null }) {
  const { mediaDetailsData, episodesArray } = useSelector((state: RootState) => state.mediaDetails);
  const truncatedTextStyle: React.CSSProperties & { WebkitLineClamp: string; WebkitBoxOrient: "horizontal" | "vertical" | "inline-axis" | "block-axis" } = {
    WebkitLineClamp: "3 ",
    WebkitBoxOrient: "vertical",
    overflow: "hidden ",
    display: "-webkit-box ",
  };
  return (
    <div
      className={`info z-[2] ${variant == "mobile" ? "md:hidden" : "max-md:hidden"}  flex flex-col items-center md:items-start justify-center flex-wrap gap-2 text-content-primary text-[85%] md:text-[95%] xl:text-[100%]`}
    >
      <CollapsibleElement customClassesForParent={" md:text-left md:w-[85%] xl:w-[90%]"} truncatedTextStyle={truncatedTextStyle}>
        {isTV ? (
          episodesArray == null ? (
            ""
          ) : episodesArray?.[0]?.episodes && episodesArray[0].episodes[Number(episode) - 1] ? (
            <p>{episodesArray[0].episodes[Number(episode) - 1].overview}</p>
          ) : (
            "No overview"
          )
        ) : (
          mediaDetailsData?.overview
        )}
      </CollapsibleElement>
    </div>
  );
}

export default DisplayInfoOverview;
