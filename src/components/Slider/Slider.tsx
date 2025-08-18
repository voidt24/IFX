"use client";
import { useRef } from "react";
import SliderControl from "./SliderControl";

interface ISliderProps {
  sideControls?: boolean;
  expectingCards?: boolean;
  XPosition?: string;
  padding?: string;
  children: React.ReactNode;
}

export const Slider = ({ sideControls = false, expectingCards = false, XPosition, padding, children }: ISliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative ${expectingCards ? "slider-with-cards" : "slider"} ${padding}`}>
      {sideControls && (
        <>
          <SliderControl side="left" sliderRef={sliderRef} expectingCards={expectingCards} XPosition={XPosition} />

          <SliderControl side="right" sliderRef={sliderRef} expectingCards={expectingCards} XPosition={XPosition} />
        </>
      )}

      <div className={`${expectingCards ? "slider-with-cards__content gap-[0.3rem] xl:gap-[0.5rem]" : "slider__content"} `} ref={sliderRef}>
        {children}
      </div>
    </div>
  );
};

export default Slider;
