import { Context } from "@/context/Context";
import { handleTrailerClick } from "@/helpers/getTrailer";
import { MediaTypeApi } from "@/Types/mediaType";
import { useContext } from "react";

function TrailerButton({ id, mediaType }: { id: number | null; mediaType: MediaTypeApi }) {
  const { setOpenTrailer, setTrailerKey } = useContext(Context);

  return (
    <button
      className="btn-primary w-full relative pointer-events-auto z-[4] !px-12"
      data-id={id}
      onClick={async () => {
        const trailer = await handleTrailerClick(id, mediaType);
        setTrailerKey(trailer);
        setOpenTrailer(true);
      }}
    >
      <i className="bi bi-play "></i> Watch trailer
    </button>
  );
}

export default TrailerButton;
