"use client";
import React, { useState, useContext } from "react";
import ReactPlayer from "react-player";
import { Context } from "../context/Context";

const Trailer = () => {
  const { openTrailer, setOpenTrailer, trailerKey } = useContext(Context);
  const [minBtn, setMinBtn] = useState(false);
  const [minBtnClass, setMinBtnClass] = useState("bi bi-fullscreen-exit");

  function handleMin() {
    setMinBtn(!minBtn);

    if (minBtn) {
      setMinBtnClass("bi bi-fullscreen-exit");
    } else {
      setMinBtnClass("bi bi-fullscreen");
    }
  }

  return openTrailer ? (
    <div className={`transition-all duration-300 ${minBtn ? "min " : "trailer right-0"}`} style={{ backgroundColor: trailerKey === null && "black" }}>
      <button
        className="trailer-btn close-btn"
        onClick={() => {
          setOpenTrailer(false);
        }}
      >
        <i className="bi bi-x-lg"></i>
      </button>

      {trailerKey && (
        <button
          className="trailer-btn min-btn"
          onClick={() => {
            handleMin();
          }}
        >
          {" "}
          <i className={minBtnClass}></i>
        </button>
      )}

      {trailerKey === null ? (
        <h2 style={{ position: "absolute", top: "50%", left: "50%", transform: "translateX(-50%)" }}>No trailer :/</h2>
      ) : (
        <ReactPlayer url={`https://www.youtube.com/watch?v=${trailerKey}`} width="100%" height="100%" controls playing />
      )}
    </div>
  ) : null;
};

export default Trailer;
