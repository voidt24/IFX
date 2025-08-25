import { RefObject } from "react";

function HeroControls({ sliderRef, side }: { sliderRef: RefObject<HTMLDivElement>; side: "right" | "left" }) {
  return (
    <i
      className={`bi bi-chevron-${side} slider-arrow ${side}-5`}
      onClick={() => {
        if (sliderRef && sliderRef.current) {
          if (side === "left") {
            if ((sliderRef.current.children[0] as HTMLElement).offsetWidth) sliderRef.current.scrollLeft -= (sliderRef.current.children[0] as HTMLElement).offsetWidth + 10;
          } else {
            if ((sliderRef.current.children[0] as HTMLElement).offsetWidth) sliderRef.current.scrollLeft += (sliderRef.current.children[0] as HTMLElement).offsetWidth + 10;
          }
        }
      }}
    ></i>
  );
}

export default HeroControls;
