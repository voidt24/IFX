import { ImediaDetailsData } from "@/context/Context";
import React, { useLayoutEffect, useRef, useState } from "react";

function Overview({ data }: { data: ImediaDetailsData | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);

  useLayoutEffect(() => {
    if (textRef.current) {
      const needsReadMore = textRef.current.scrollHeight !== textRef.current.clientHeight;
      setShowReadMoreButton(needsReadMore);
    }
  }, [textRef.current]);
  return (
    <div className="overview ">
      <p className={`${!isOpen ? "line-clamp-3" : ""} review-text text-content-primary  lg:max-w-[90%] 2xl:max-w-[60%]`} ref={textRef}>
        {data?.overview}
      </p>

      {showReadMoreButton && (
        <p
          className="show-more-btn lg:text-left"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? "Less" : "More..."}
        </p>
      )}
    </div>
  );
}

export default Overview;
