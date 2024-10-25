"use client";
import { useContext, useEffect, useState } from "react";
import Hero from "./Hero";
import Slider from "./Slider";
import SliderCard from "./SliderCard";
import { Context } from "../context/Context";

export default function MainContent() {
  const { apiData, currentMediaType } = useContext(Context);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const [trendingResults, popularResults] = apiData[0];

      setResults(currentMediaType == "movies" ? popularResults : trendingResults.slice(5, 20));
    }
  }, [apiData, currentMediaType]);
  return (
    <>
      <Hero />
      <Slider
        header={
          <>
            | POPULAR <span>{currentMediaType.toUpperCase()}</span>
          </>
        }
        controls
        expectingCards
      >
        {results.map((result) => {
          return <SliderCard result={result} key={result.id} />;
        })}
      </Slider>
    </>
  );
}
