"use client";
import { useRef } from "react";
import { moveSlider } from "../helpers/moveSlider";

interface ISliderProps {
  controls?: boolean;
  sideControls?: boolean;
  expectingCards?: boolean;
  children: React.ReactNode;
}

export const Slider = ({ controls = false, sideControls = false, expectingCards = false, children }: ISliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${expectingCards ? "slider-with-cards" : "slider"}  relative ${sideControls && "lg:px-4"}`}>
      {sideControls && (
        <>
          <i
            className="bi bi-chevron-left left absolute top-[45%] left-5 max-md:bg-black/40  max-md:hover:bg-white/10 bg-black/80 px-1 hover:bg-white/30 text-xl rounded-md z-30 max-md:text-white/20 text-white/90"
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>

          <i
            className="bi bi-chevron-right right absolute top-[45%] right-5 max-md:bg-black/40  max-md:hover:bg-white/10 bg-black/80 px-1 hover:bg-white/30 text-xl rounded-md z-30 max-md:text-white/20 text-white/90"
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>
        </>
      )}

      <div className={`grid ${expectingCards ? "slider-with-cards__content gap-[0.3rem] xl:gap-[0.5rem]" : "slider__content"} `} ref={sliderRef}>
        {children}
      </div>
    </div>
  );
};

export default Slider;
