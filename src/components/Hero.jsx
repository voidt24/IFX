"use client";
import { useState, useEffect, useContext } from "react";
import { image, imageWithSize } from "../helpers/api.config";
import { handleTrailerClick } from "../helpers/getTrailer";

import Link from "next/link";
import { Context } from "@/context/Context";

const Hero = () => {
  const [heroBackground, setHeroBackground] = useState("");
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState("");
  const { currentId, setCurrentId, setOpenTrailer, setTrailerKey, apiData, currentMediaType } = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
    renderInitialContent();
  }, [apiData, currentMediaType]);

  function renderInitialContent() {
    try {
      let mediaData;
      if (apiData.length > 0) {
        mediaData = currentMediaType === "movies" ? apiData[0] : apiData[1];
        const [trendingResults] = mediaData;

        setResults(trendingResults);

        let initialBackground = window.innerWidth >= 640 ? `${image}${trendingResults[0].backdrop_path}` : `${image}${trendingResults[0].poster_path}`;
        setHeroBackground(initialBackground);
        setTitle(trendingResults[0].name || trendingResults[0].title);
        setCurrentId(trendingResults[0].id);
      }
    } catch (e) {
      console.log("enter error here", e);
    }
  }

  function handleImageClick(event, result) {
    setCurrentId(result.id);

    const clickedElement = event.target.dataset.id;

    results.forEach((element) => {
      const elementExistInApi = clickedElement == element.id;

      if (elementExistInApi) {
        setHeroBackground(window.innerWidth >= 640 ? `${image}${element.backdrop_path}` : `${image}${element.poster_path}`);
        setTitle(element.name || element.title);
      }
    });
  }

  return (
    <div className={"hero"} style={{ backgroundImage: `url(${heroBackground})` }}>
      <div className="overlay"></div>
      <div className="hero-media-selection">
        <h1 className="title">{title}</h1>

        <button
          data-id={currentId}
          onClick={() => {
            handleTrailerClick(setOpenTrailer, currentId, currentMediaType, setTrailerKey);
          }}
        >
          {" "}
          <span>
            <i className="bi bi-play-circle-fill "></i>
          </span>{" "}
          Play Trailer
        </button>

        <Link className="details" href={`${currentMediaType}/${currentId}`}>
          <button> Details </button>
        </Link>
      </div>

      <div className="hero-media-thumbnails">
        {results.slice(0, 4).map((result) => {
          const vote = result.vote_average.toString().slice(0, 3)*10 
          return (
            <div
              className={"movie " + (currentId === result.id ? "isActive" : "")}
              onClick={(event) => {
                handleImageClick(event, result);
              }}
              key={result.id}
            >
              <div
                className={`${
                  vote == 0
                    ? " border-2 border-gray-700 text-white"
                    : vote < 50
                    ? " border-2 border-red-800"
                    : vote < 65
                    ? " border-2 border-yellow-500"
                    : vote < 75
                    ? " border-2 border-lime-300"
                    : " border-2 border-green-500"
                } vote text-black`}
              >
                <p>{vote + "%"}</p>
              </div>

              <img src={`${imageWithSize("500")}${result.poster_path}`} key={result.id} data-id={result.id} data-media-type={result.media_type} alt="media-image" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
