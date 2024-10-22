"use client";
import { useRef, useState, useEffect, useContext } from "react";
import SliderCard from "./SliderCard";
import { moveSlider } from "../helpers/moveSlider";
import { Context } from "../context/Context";

export const Slider = () => {
  const [results, setResults] = useState([]);
  const { openTrailer, apiData, setApiData, currentMediaType } = useContext(Context);
  const sliderRef = useRef();

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const [trendingResults, popularResults] = apiData[0];

      setResults(currentMediaType == "movies" ? popularResults : trendingResults.slice(5, 20));
    }
  }, [apiData, currentMediaType]);

  return (
    <div className="slider">
      <div className="slider__header">
        <h2>
          | {"POPULAR"} <span> {currentMediaType.toUpperCase()}</span>
        </h2>

        <div className="controls text-gray-500">
          <i
            className="bi bi-chevron-left left hover:text-gray-200"
            onClick={(event) => {
              moveSlider(event, sliderRef);
            }}
          ></i>
          <i
            className="bi bi-chevron-right right hover:text-gray-200"
            onClick={(event) => {
              moveSlider(event, sliderRef);
            }}
          ></i>
        </div>
      </div>

      <div className={`slider__content ${openTrailer && "on-trailer"}`} ref={sliderRef}>
        {results.map((result) => {
          return <SliderCard result={result} key={result.id} />;
        })}
      </div>
    </div>
  );
};

export default Slider;
