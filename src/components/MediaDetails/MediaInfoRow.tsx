import { isReleased } from "@/helpers/isReleased";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { MediaTypeApi } from "@/Types/mediaType";

function MediaInfoRow({ data, mediaType }: { data: ImediaDetailsData | null; mediaType: MediaTypeApi }) {
  if (!data) return null;

  return (
    <div className="info flex-row-center flex-wrap max-md:text-[85%] lg:text-[90%] lg:justify-start gap-2 text-content-secondary">
      <h1 className="title font-semibold text-4xl line-clamp-3 w-full lg:max-w-[80%] lg:text-left text-content-primary">{data.title}</h1>

      <div className="flex-row-center gap-1 md:gap-2">
        <span className="">{!isReleased(data.releaseDate) ? `Available on ${data.releaseDate}` : data.releaseDate}</span>

        {mediaType === "movie" && data.runtime && (
          <>
            <span>•</span>
            <span>{data.runtime}</span>
          </>
        )}

        {mediaType === "tv" && data.seasons && (
          <>
            <span>•</span>
            <span>{data.seasons}</span>
          </>
        )}

        {data.genres?.[0] && (
          <>
            <span>•</span>
            <span>{data.genres[0].name}</span>
          </>
        )}

        {data.vote && (
          <>
            <span>•</span>
            <span>
              <i className="bi bi-star-fill text-[goldenrod] cursor-default"></i>
              {data.vote}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default MediaInfoRow;
