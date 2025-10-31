import { MediaTypeApi } from "@/Types/mediaType";
import { Tooltip } from "@mui/material";
import React, { LegacyRef } from "react";

function AddToListButton({
  type,
  wasAdded,
  currentId,
  mediaType,
  mediaTypeRef,
  onClick,
}: {
  type: string;
  wasAdded: boolean;
  currentId: number | undefined;
  mediaType: MediaTypeApi;
  mediaTypeRef: LegacyRef<HTMLDivElement> | null;
  onClick: () => void;
}) {
  const iconClass =
    type === "Watchlist"
      ? wasAdded
        ? "bi bi-eye-slash"
        : "bi bi-eye"
      : type === "Watched"
        ? wasAdded
          ? "bi bi-check2-all"
          : "bi bi-check-lg"
        : type === "Favorites"
          ? wasAdded
            ? "bi bi-heart-fill "
            : "bi bi-heart"
          : "";

  return (
    <Tooltip title={wasAdded ? `Delete from ${type}` : `Add to ${type}`} placement="bottom" onClick={onClick}>
      <div className="flex flex-col gap-3">
        <span className={`${wasAdded ? " bg-brand-primary" : " bg-zinc-600/40 lg:hover:bg-brand-primary/80"} watchlist text-white flex-col-center cursor-pointer py-2 px-3.5 rounded-full`}>
          <i className={`text-[130%] lg:text-[115%] transition-all duration-200 leading-none${iconClass}`} data-id={currentId} ref={mediaTypeRef} data-mediatype={mediaType} id={`${type}-icon`}></i>
        </span>
        <p className="text-[65%] text-center lg:hidden leading-none cursor-pointer">{type}</p>
      </div>
    </Tooltip>
  );
}

export default AddToListButton;
