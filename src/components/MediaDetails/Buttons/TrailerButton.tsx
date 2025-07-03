import { Context } from "@/context/Context";
import { handleTrailerClick } from "@/helpers/getTrailer";
import { MediaTypeApi } from "@/Types/mediaType";
import React, { useContext } from "react";

function TrailerButton({ id, mediaType }: { id: number | undefined; mediaType: MediaTypeApi }) {
  const { setOpenTrailer, setTrailerKey } = useContext(Context);

  return (
    <button
      className="btn-primary w-full relative pointer-events-auto z-[4]"
      data-id={id}
      onClick={() => {
        handleTrailerClick(setOpenTrailer, id, mediaType, setTrailerKey);
      }}
    >
      <i className="bi bi-play "></i> Watch trailer
    </button>
  );
}

export default TrailerButton;
