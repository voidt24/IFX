"use client";
import { useState, useContext } from "react";
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
    <div
      className={`transition-all duration-300 ${
        minBtn
          ? " fixed top-[65%] right-0 z-[999] w-full h-auto pt-[1.55rem] px-2 xs:w-[90%] xs:h-[35%] xs:top-[55%] md:h-[40%] md:top-[58%] lg:w-[55%] lg:h-[45%] lg:top-[55%] "
          : "fixed bg-black top-0 w-full h-full z-[9999] right-0"
      }`}
      style={{ backgroundColor: trailerKey === null ? "black" : undefined }}
    >
      <button
        className={`trailer-btn right-[5%] ${minBtn ? "top-0" : "top-[12%]"}  close-btn`}
        onClick={() => {
          setOpenTrailer(false);
        }}
        title="close-trailer-btn"
      >
        <i className="bi bi-x-lg"></i>
      </button>

      {trailerKey && (
        <button
          className={`trailer-btn left-[5%] ${minBtn ? " top-0" : "top-[12%]"}  min-btn`}
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
