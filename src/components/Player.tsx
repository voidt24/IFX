"use client";
import React, { useState, Dispatch, SetStateAction } from "react";

export default function Player({ openPlayer, setOpenPlayer, mediaURL }: { openPlayer: boolean; setOpenPlayer: Dispatch<SetStateAction<boolean>>; mediaURL: string }) {
  const [minBtn, setMinBtn] = useState(false);
  const [minBtnClass, setMinBtnClass] = useState("bi bi-fullscreen-exit");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  function handleMin() {
    setMinBtn(!minBtn);

    if (minBtn) {
      setMinBtnClass("bi bi-fullscreen-exit");
    } else {
      setMinBtnClass("bi bi-fullscreen");
    }
  }

  return openPlayer ? (
    <div className={`${minBtn ? "min" : "trailer"} bg-black`}>
      {!iframeLoaded && (
        <span className="flex items-center justify-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24">
            <path fill="grey" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25" />
            <path fill="white" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
              <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
            </path>
          </svg>
        </span>
      )}
      <button
        className="trailer-btn close-btn"
        onClick={() => {
          setOpenPlayer(false);
        }}
      >
        <i className="bi bi-x-lg"></i>
      </button>

      <button className="trailer-btn min-btn" onClick={handleMin}>
        <i className={minBtnClass}></i>
      </button>

      <>
        <iframe
          src={mediaURL}
          width={"100%"}
          height={"100%"}
          allowFullScreen
          referrerPolicy="origin"
          onLoad={() => {
            setIframeLoaded(true);
          }}
        ></iframe>
      </>
    </div>
  ) : null;
}
