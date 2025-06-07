"use client";
import { useContext, useRef, useLayoutEffect } from "react";
import { image, ISliderData } from "../../helpers/api.config";

import Link from "next/link";
import { Context } from "@/context/Context";
import formatReleaseDate from "@/helpers/formatReleaseDate";

export default function Hero({ results, type, hasTitle }: { results: ISliderData[]; type: string; hasTitle?: boolean }) {
  const { setCurrentId } = useContext(Context);

  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderContentRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    setTimeout(() => {
      if (sliderRef && sliderRef.current)
        if (sliderContentRef && sliderContentRef.current) {
          sliderRef.current.scrollLeft = sliderContentRef.current.offsetLeft;
        }
    }, 2000);
  }, []);

  return (
    <div className="slider-test max-w-full relative px-2 mx-auto w-full h-full overflow-hidden">
      {hasTitle && (
        <span className="flex-row-between w-full px-3 sm:px-6 pb-2">
          <h1 className="text-lg lg:text-2xl font-medium">What's trending in {type}</h1>
        </span>
      )}
      <i
        className="bi bi-chevron-left slider-arrow left-5"
        onClick={() => {
          if (sliderRef && sliderRef.current) {
            if ((sliderRef.current.children[0] as HTMLElement).offsetWidth) sliderRef.current.scrollLeft -= (sliderRef.current.children[0] as HTMLElement).offsetWidth + 10;
          }
        }}
      ></i>
      <i
        className="bi bi-chevron-right slider-arrow right-5"
        onClick={() => {
          if (sliderRef && sliderRef.current) {
            if ((sliderRef.current.children[0] as HTMLElement).offsetWidth) sliderRef.current.scrollLeft += (sliderRef.current.children[0] as HTMLElement).offsetWidth + 10;
          }
        }}
      ></i>
      <div
        className="slider-test__content grid grid-flow-col auto-cols-[92%] md:auto-cols-[85%] lg:auto-cols-[100%] overflow-x-scroll scroll-smooth snap-x snap-mandatory gap-3 xl:gap-6 no-scrollbar"
        ref={sliderRef}
      >
        {results &&
          results.slice(0, 5).map((sliderData, index) => {
            return (
              <div
                className="relative aspect-[16/9] lg:max-h-[80vh] snap-center h-full w-full object-cover object-center bg-cover bg-center"
                style={{ backgroundImage: `url(${image}${sliderData.backdrop_path})` }}
                key={index}
                ref={index === 1 ? sliderContentRef : null}
              >
                <div className="max-lg:hidden side-hero-overlay"></div>
                <div className="px-4 max-w-[80%] max-lg:hidden absolute flex flex-col items-start justify-center gap-2 top-1/2 -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20 text-4xl">
                  <h1 className="title max-w-[80%] font-semibold text-[125%]">{sliderData.title || sliderData.name}</h1>
                  {(sliderData.release_date && new Date(sliderData.release_date).getTime() > Date.now()) ||
                  (sliderData.first_air_date && new Date(sliderData.first_air_date).getTime() > Date.now()) ? (
                    <span className=" text-content-secondary text-[55%]">Available on {formatReleaseDate(sliderData.release_date || sliderData.first_air_date || "")}</span>
                  ) : null}
                  <p className="text-content-secondary text-[40%] text-left leading-6 max-w-[55%] line-clamp-4 ">{sliderData.overview}</p>

                  <Link
                    className="btn-primary text-[40%] !py-0 !px-6"
                    href={`${type.toLowerCase().split(" ").join("")}/${sliderData.id}`}
                    onClick={() => {
                      setCurrentId(sliderData.id);
                      sessionStorage.setItem("navigatingFromApp", "1");
                    }}
                  >
                    Details
                  </Link>
                </div>

                {/* MOBILE */}
                <div className="lg:hidden blur absolute bottom-0 w-full h-[30%] sm:h-[15%] z-10 "> </div>
                <div className="lg:hidden buttons z-30 absolute bottom-0 w-full h-[30%] sm:h-[15%] flex items-center justify-end gap-4 md:gap-8 px-2 sm:text-lg">
                  <div className="flex-col-center h-full">
                    <h1 className="title font-medium text-sm line-clamp-2">{sliderData.title || sliderData.name}</h1>
                    {(sliderData.release_date && new Date(sliderData.release_date).getTime() > Date.now()) ||
                    (sliderData.first_air_date && new Date(sliderData.first_air_date).getTime() > Date.now()) ? (
                      <span className=" text-content-secondary text-[75%]">Available on {formatReleaseDate(sliderData.release_date || sliderData.first_air_date || "")}</span>
                    ) : null}
                  </div>
                  <Link
                    className="bg-surface-modal hover:bg-white/20 rounded-full  border border-[#ffffff4b] py-[0.5px] px-6"
                    href={`${type.toLowerCase().split(" ").join("")}/${sliderData.id}`}
                    onClick={() => {
                      setCurrentId(sliderData.id);
                      sessionStorage.setItem("navigatingFromApp", "1");
                    }}
                  >
                    <i className="bi bi-caret-right-fill leading-none text-[90%]"></i>
                  </Link>
                </div>
                {/* </div> */}
              </div>
            );
          })}
      </div>
    </div>
  );
}
