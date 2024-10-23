"use client";
import { useContext, useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Slider from "@/components/Slider";
import SliderCard from "@/components/SliderCard";
import { Context } from "@/context/Context";
import { CircularProgress } from "@mui/material";

export default function Movies() {
  const { apiData, setApiData, setCurrentId, initialDataError, initialDataIsLoading, currentMediaType } = useContext(Context);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setCurrentId(undefined);
  }, []);

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const [trendingResults, popularResults] = apiData[0];

      setResults(currentMediaType == "movies" ? popularResults : trendingResults.slice(5, 20));
    }
  }, [apiData, currentMediaType]);

  if (initialDataIsLoading) {
    return (
      <span className="flex items-center justify-center h-screen">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="inherit" size={100} />
        </div>
      </span>
    );
  }

  if (initialDataError) {
    return (
      <div className="error not-found">
        <h1>ERROR</h1>
        <p>Please try again</p>
      </div>
    );
  }

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
