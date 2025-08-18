"use client";
import { useContext, useEffect } from "react";
import { imageWithSize } from "../../helpers/api.config";
import { Context } from "@/context/Context";
import Link from "next/link";
import { MediaTypeApi, IMediaData } from "@/Types/index";
import { useDispatch } from "react-redux";
import { setEdit } from "@/store/slices/listsManagementSlice";
import { setMediaIdPWA, setCurrentMediaType } from "@/store/slices/mediaDetailsSlice";
import MediaCard from "./MediaCard";
import EditCheckbox from "./EditCheckbox";

interface MediaCardContainerProps {
  result: IMediaData;
  canBeEdited?: boolean;
  mediaType: MediaTypeApi;
  isChecked?: boolean;
}

const MediaCardContainer = ({ result, canBeEdited = false, mediaType, isChecked }: MediaCardContainerProps) => {
  const { setOpenMediaDetailsSheet, setSheetMediaType, isMobilePWA } = useContext(Context);
  const dispatch = useDispatch();

  const { media_type, id, poster_path, vote_average } = result;

  const poster = poster_path ? `${imageWithSize("780")}${poster_path}` : "";
  const vote = vote_average ? vote_average.toString().slice(0, 3) : "";

  const mediaCardProps = { result, vote, poster, canBeEdited };

  const isMovieOrTV = media_type == "movie" ? "movies" : "tvshows";

  useEffect(() => {
    return () => {
      dispatch(setEdit(false));
    };
  }, []);

  function handleCardClickPWA() {
    setSheetMediaType(isMovieOrTV);
    dispatch(setMediaIdPWA(id));
    setOpenMediaDetailsSheet(true);

    if (canBeEdited) {
      dispatch(setCurrentMediaType(isMovieOrTV));
    } else {
      setSheetMediaType(isMovieOrTV);
    }
  }

  return (
    <div
      className={`relative ${isChecked ? "!border-[3px] !border-brand-primary hover:!border-[3px] rounded-md hover:!border-brand-primary" : "border-[3px] border-transparent"}`}
      key={id}
      data-id={id}
    >
      {isMobilePWA ? (
        <button title="media-card-button" onClick={handleCardClickPWA}>
          <MediaCard {...mediaCardProps} />
        </button>
      ) : (
        <Link href={`/${isMovieOrTV}/${id}`}>
          <MediaCard {...mediaCardProps} />
        </Link>
      )}

      {canBeEdited && <EditCheckbox id={id} />}
    </div>
  );
};

export default MediaCardContainer;
