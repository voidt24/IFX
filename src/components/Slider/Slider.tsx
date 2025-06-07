"use client";
import { useRef } from "react";
import { moveSlider } from "../../helpers/moveSlider";

interface ISliderProps {
  controls?: boolean;
  sideControls?: boolean;
  expectingCards?: boolean;
  XPosition?: string;
  padding?: string;
  children: React.ReactNode;
}

export const Slider = ({ controls = false, sideControls = false, expectingCards = false, XPosition, padding, children }: ISliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`relative ${expectingCards ? "slider-with-cards" : "slider"} ${padding}`}>
      {sideControls && (
        <>
          <i
            className={`bi bi-chevron-left left slider-arrow  left-${XPosition || 0}`}
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>

          <i
            className={`bi bi-chevron-right right slider-arrow right-${XPosition || 0}`}
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>
        </>
      )}

      <div className={`${expectingCards ? "slider-with-cards__content gap-[0.3rem] xl:gap-[0.5rem]" : "slider__content"} `} ref={sliderRef}>
        {children}
      </div>
    </div>
  );
};

export default Slider;
