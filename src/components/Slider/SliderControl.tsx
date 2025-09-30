import { moveSlider } from "@/helpers/moveSlider";
import { RefObject } from "react";

function SliderControl({ side, sliderRef, expectingCards, XPosition }: { side: "right" | "left"; sliderRef: RefObject<HTMLDivElement>; expectingCards: boolean; XPosition?: string }) {
  return (
    <i
      className={`bi bi-chevron-${side} ${side} slider-arrow  ${side}-${XPosition || 0}`}
      onClick={(event) => {
        moveSlider(event, sliderRef, expectingCards);
      }}
    ></i>
  );
}

export default SliderControl;
