"use client";
import { useState, useEffect, ReactNode, useRef } from "react";

interface props {
  children: ReactNode;
  customClassesForParent?: string;
  customClassesForChildren?: string;
  regularChildrenClasses?: string;
  truncatedTextStyle?: React.CSSProperties;
  parentStyle?: React.CSSProperties;
}

const CollapsibleElement = ({ children, customClassesForParent, regularChildrenClasses, truncatedTextStyle, parentStyle }: props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(true);
  const [isContentFullyVisible, setIsContentFullyVisible] = useState(true);

  const ref = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLInputElement>(null);
  const parentRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsContentFullyVisible(ref?.current?.scrollHeight !== ref?.current?.clientHeight);
  }, [ref?.current?.scrollHeight, ref?.current?.clientHeight]);

  return (
    <>
      <div style={isMaximized ? parentStyle : { height: "100%" }} className={`w-full ${customClassesForParent}`} ref={parentRef}>
        {truncatedTextStyle ? (
          <>
            <div style={!isOpen ? truncatedTextStyle : undefined} className={`w-full ${regularChildrenClasses}`} ref={ref}>
              {children}
            </div>
            {isContentFullyVisible && (
              <p
                className="show-more-btn"
                ref={btnRef}
                onClick={() => {
                  if (isOpen) {
                  }
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? "Show less" : "Show more"}
              </p>
            )}
          </>
        ) : (
          <>
            {children}
            <span
              style={{
                display: !isMaximized ? "none" : "block",
                zIndex: "2",
                height: "190px",
                width: "100%",
                position: "absolute",
                bottom: "0",
                left: "0",
                background: "linear-gradient(transparent, #000000de, black)",
              }}
            ></span>
          </>
        )}
      </div>

      {!truncatedTextStyle && (
        <p
          className={`show-more-btn text-center  z-10 `}
          onClick={() => {
            if (!isMaximized) {
              btnRef?.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
            }
            setIsMaximized(!isMaximized);
          }}
        >
          {!isMaximized ? "Show less" : "Show more"}
        </p>
      )}
    </>
  );
};

export default CollapsibleElement;
