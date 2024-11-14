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
            className="bi bi-chevron-left left text-gray-400 hover:text-gray-200 absolute left-0  max-lg:hidden text-2xl -mx-2"
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>

          <i
            className="bi bi-chevron-right right text-gray-400 hover:text-gray-200 absolute right-0 max-lg:hidden text-2xl -mx-2"
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>
        </>
      )}

      <div className={`grid ${expectingCards ? "slider-with-cards__content gap-[0.3rem] xl:gap-[0.6rem]" : "slider__content"} `} ref={sliderRef}>
        {children}
      </div>
    </div>
  );
};

export default Slider;
