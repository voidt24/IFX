"use client";
import { useContext, useRef, useLayoutEffect } from "react";
import { image, ISliderMovieData, ISliderTVData } from "../helpers/api.config";

import Link from "next/link";
import { Context } from "@/context/Context";

export default function Hero({ results, type }: { results: ISliderMovieData[] | ISliderTVData[]; type: string }) {
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
    <div className="slider-test max-w-full lg:max-w-[95%] 2xl:max-w-[80%] 4K:max-w-[75%] relative px-2 mx-auto w-full overflow-hidden">
      <span className="flex justify-between items-center w-full px-2 pb-2">
        <h1 className="lg:text-xl text-white/85">What's trending on {type}</h1>
      </span>
      <i
        className="bi bi-chevron-left absolute top-[45%] left-5 max-md:bg-black/40  max-md:hover:bg-white/10 bg-black/80 px-1 hover:bg-white/30 text-xl rounded-md z-30 max-md:text-white/20 text-white/90"
        onClick={() => {
          if (sliderRef && sliderRef.current) {
            if ((sliderRef.current.children[0] as HTMLElement).offsetWidth) sliderRef.current.scrollLeft -= (sliderRef.current.children[0] as HTMLElement).offsetWidth + 10;
          }
        }}
      ></i>
      <i
        className="bi bi-chevron-right absolute top-[45%] right-5 max-md:bg-black/40  max-md:hover:bg-white/10 bg-black/80 px-1 hover:bg-white/30 text-xl rounded-md z-30 max-md:text-white/20 text-white/90"
        onClick={() => {
          if (sliderRef && sliderRef.current) {
            if ((sliderRef.current.children[0] as HTMLElement).offsetWidth) sliderRef.current.scrollLeft += (sliderRef.current.children[0] as HTMLElement).offsetWidth + 10;
          }
        }}
      ></i>
      <div className="slider-test__content grid grid-flow-col auto-cols-[80%] xl:auto-cols-[65%] overflow-x-scroll scroll-smooth snap-x snap-mandatory gap-8 xl:gap-20 " ref={sliderRef}>
        <span></span>
        {results &&
          results.slice(0, 5).map((sliderData, index) => {
            return (
              <div className="relative " key={index} ref={index === 1 ? sliderContentRef : null}>
                <div className="max-lg:hidden hero-overlay"></div>
                <div className="max-lg:hidden absolute flex flex-col gap-2 items-center justify-center top-1/2 text-center -translate-x-1/2 -translate-y-1/2 left-1/2 w-full z-20 text-[125%]">
                  <h1 className="title ">{(sliderData as ISliderMovieData).title || (sliderData as ISliderTVData).name}</h1>

                  <Link
                    className="  btn-primary  border border-[#ffffff4b] text-[70%] py-[2px] px-4"
                    href={`${type.toLowerCase().split(" ").join("")}/${sliderData.id}`}
                    onClick={() => setCurrentId(sliderData.id)}
                  >
                    Details
                  </Link>
                </div>

                <img className="rounded-lg md:rounded-xl" src={`${image}${sliderData.backdrop_path}`} alt="" width={3840} height={2160} />
                <div className="lg:hidden blur absolute w-full bottom-0 h-[25%] md:h-16 z-10"> </div>

                <div className="lg:hidden z-30 absolute bottom-0 w-full p-2 md:p-4">
                  <div className="buttons flex items-center gap-8 justify-end  text-[75%] md:text-sm">
                    <h1 className="title ">{(sliderData as ISliderMovieData).title || (sliderData as ISliderTVData).name}</h1>
                    <Link
                      className="  bg-black/40 rounded-full  border border-[#ffffff4b] text-[85%] py-[1px] px-4 "
                      href={`${type.toLowerCase().split(" ").join("")}/${sliderData.id}`}
                      onClick={() => setCurrentId(sliderData.id)}
                    >
                      <i className="bi bi-arrow-right "></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        <span></span>
      </div>
    </div>
  );
}
