import { Tab } from "@/components/common/Tabs/Tab";
import React, { useContext } from "react";
import { Reviews } from "../Reviews/Reviews";
import Tabs from "@/components/common/Tabs/Tabs";
import Cast from "../Cast";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Context } from "@/context/Context";
import { handleTrailerClick } from "@/helpers/getTrailer";
import { getApiMediaType } from "@/helpers/getApiMediaType";
import { MediaTypeApi } from "@/Types";

//to-do: add cast and reviews types to delete type never[]
function TabsSection({ mediaType, mediaId, cast, reviews }: { mediaType: MediaTypeApi; mediaId: number; cast: never[]; reviews: never[] }) {
  const { mediaDetailsData, currentMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const { setOpenTrailer, setTrailerKey, isMobilePWA } = useContext(Context);

  return (
    <div className="w-full px-[0.8rem] lg:max-w-[85%] xxl:max-w-[70%] 4k:max-w-[60%] relative  mx-auto  mt-10">
      <Tabs>
        <Tab title="Cast">
          <Cast cast={cast} />
        </Tab>
        <Tab title="Trailer">
          <div
            className="trailer-preview border border-content-third rounded-lg overflow-hidden bg-cover bg-center aspect-video bg-no-repeat w-full md:w-[40%] mx-auto relative"
            style={{ backgroundImage: `url(${mediaDetailsData?.bigHeroBackground})` }}
          >
            <div className="overlay-base bg-black/70 flex-col-center ">
              <button
                className="px-3 py-2 bg-brand-primary/35 backdrop-blur-lg rounded-full hover:scale-125 transition-all duration-200"
                onClick={async () => {
                  const trailer = await handleTrailerClick(mediaId, isMobilePWA ? mediaType : getApiMediaType(currentMediaType));
                  setTrailerKey(trailer);
                  setOpenTrailer(true);
                }}
                title="trailer-button"
              >
                <i className="bi bi-play text-2xl"></i>
              </button>
            </div>
          </div>
        </Tab>
        <Tab title={`Reviews (${reviews && reviews.length})`}>
          <Reviews reviews={reviews} />
        </Tab>
      </Tabs>
    </div>
  );
}

export default TabsSection;
