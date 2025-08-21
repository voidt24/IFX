import Link from "next/link";
import { ReadonlyURLSearchParams } from "next/navigation";
import { setActiveSeason } from "@/store/slices/mediaDetailsSlice";
import { ISeasonArray, MediaTypeUrl } from "@/Types";
import { setSeasonModal } from "@/store/slices/UISlice";
import { useDispatch } from "react-redux";

function EpisodeNavigation({
  season,
  episode,
  searchParams,
  currentMediaType,
  currentId,
  seasonArray,
}: {
  season: string | null;
  episode: string | null;
  searchParams: ReadonlyURLSearchParams;
  currentMediaType: MediaTypeUrl;
  currentId: number;
  seasonArray: ISeasonArray[];
}) {
  const dispatch = useDispatch();
  return (
    <div className=" w-full z-20 py-4">
      <div className="flex gap-6  ">
        <nav className="flex items-center justify-center w-full px-4 ">
          <ul className="flex text-[75%] self-center bg-surface-modal rounded-full">
            <li>
              <button
                className={`flex items-center justify-center max-md:px-6 px-8 h-8 ms-0  leading-tight border  border-content-muted rounded-s-full ${
                  episode == "1" ? " pointer-events-none text-content-muted" : "pointer-events-auto text-content-primary hover:bg-surface-hover"
                }`}
                onClick={() => {
                  if (episode && Number(episode) > 1) {
                    const newEpisode = (Number(episode) - 1).toString();

                    const params = new URLSearchParams(searchParams.toString());
                    params.set("episode", newEpisode);

                    window.location.search = params.toString();
                  }
                }}
              >
                <i className={`bi bi-chevron-left font-bold`}></i>
                Previous
              </button>
            </li>

            <li>
              <Link
                href={`/${currentMediaType}/${currentId}`}
                onClick={() => {
                  dispatch(setActiveSeason(Number(season)));
                  dispatch(setSeasonModal(true));
                }}
                className={`flex items-center justify-center max-md:px-3 px-6 h-8 leading-tight  border border-content-muted  hover:bg-surface-hover`}
              >
                <i className="bi bi-list"></i>
              </Link>
            </li>

            <li>
              <button
                className={`flex items-center justify-center max-md:px-6 px-8 h-8 ms-0  leading-tight border  border-content-muted rounded-e-full ${
                  seasonArray && seasonArray[Number(season) - 1] && Number(episode) == seasonArray[Number(season) - 1].episode_count
                    ? " pointer-events-none text-zinc-600"
                    : "pointer-events-auto text-gray-200   hover:bg-surface-hover hover:text-white"
                }`}
                onClick={() => {
                  if (episode && seasonArray && Number(episode) < seasonArray[Number(season) - 1].episode_count) {
                    const newEpisode = (Number(episode) + 1).toString();

                    const params = new URLSearchParams(searchParams.toString());
                    params.set("episode", newEpisode);

                    window.location.search = params.toString();
                  }
                }}
              >
                Next <i className={`bi bi-chevron-right font-bold`}></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default EpisodeNavigation;
