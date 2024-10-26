"use client";
import { useContext, useEffect, useState } from "react";
import Hero from "./Hero";
import Slider from "./Slider";
import SliderCard from "./SliderCard";
import { Context } from "../context/Context";
import { CircularProgress } from "@mui/material";

export default function MainContent() {
  const { apiData, setCurrentId, initialDataError, initialDataIsLoading, currentMediaType } = useContext(Context);
  const [sliderData, setSliderData] = useState([]);

  useEffect(() => {
    setCurrentId(undefined);
  }, []);

  useEffect(() => {
    if (apiData && apiData.length > 0) {
      const [trendingResults, popularResults] = apiData[0];

      setSliderData(currentMediaType == "movies" ? popularResults : trendingResults.slice(5, 20)); // check fetchData.js (helper) for context on why we save diff. results based on currentMediaType

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
        {sliderData.map((sliderData) => {
          return <SliderCard result={sliderData} key={sliderData.id} />;
        })}
      </Slider>
    </>
  );
}
