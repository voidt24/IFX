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
                  setIsOpen(!isOpen);
                }}
              >
                {isOpen ? "Show less" : "Show more"}
              </p>
            )}
          </>
        ) : (
          children
        )}
      </div>

      {!truncatedTextStyle && (
        <p
          className="show-more-btn"
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
