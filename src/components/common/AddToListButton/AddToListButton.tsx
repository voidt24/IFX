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
        ? "bi bi-eye-slash text-brand-primary"
        : "bi bi-eye"
      : type === "Watched"
        ? wasAdded
          ? "bi bi-check2-all text-brand-primary"
          : "bi bi-check-lg"
        : type === "Favorites"
          ? wasAdded
            ? "bi bi-heart-fill text-brand-primary"
            : "bi bi-heart"
          : "";

  return (
    <Tooltip title={wasAdded ? `Delete from ${type}` : `Add to ${type}`} placement="bottom">
      <span className="watchlist flex-col-center cursor-pointer" onClick={onClick}>
        <i className={`text-[145%] transition-all duration-200 ${iconClass}`} data-id={currentId} ref={mediaTypeRef} data-mediatype={mediaType} id={`${type}-icon`}></i>
        <p className="text-[75%]">{type}</p>
      </span>
    </Tooltip>
  );
}

export default AddToListButton;
