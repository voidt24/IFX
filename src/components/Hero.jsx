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
  const [activeImage, setActiveImage] = useState("");
  const [idToNavigate, setIdToNavigate] = useState("");
  const { currentId, setCurrentId, setOpenTrailer, setTrailerKey, apiData, currentMediaType } = useContext(Context);

  useEffect(() => {
    window.scrollTo(0, 0);
    renderInitialContent();
  }, [apiData, currentMediaType]);

  function renderInitialContent() {
    if (apiData && apiData.length > 0) {
      const [trendingResults] = apiData;
      const [firstTrendingElement] = trendingResults;

      setResults(trendingResults);

      let initialBackground = window.innerWidth >= 640 ? `${image}${firstTrendingElement.backdrop_path}` : `${image}${firstTrendingElement.poster_path}`;
      setHeroBackground(initialBackground);
      setTitle(firstTrendingElement.name || firstTrendingElement.title);
      setActiveImage(firstTrendingElement.id);
      setIdToNavigate(firstTrendingElement.id);
    }
  }

  function handleImageClick(event, result) {
    setIdToNavigate(result.id);
    setActiveImage(result.id);

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
          className="bg-gray-800"
          data-id={currentId}
          onClick={() => {
            handleTrailerClick(setOpenTrailer, idToNavigate, currentMediaType, setTrailerKey);
          }}
        >
          {" "}
          <span>
            <i className="bi bi-play-fill "></i>
          </span>{" "}
          Play Trailer
        </button>

        <Link
          className="details bg-gray-800 hover:bg-gray-700 rounded-full  border border-[#ffffff4b] text-[85%] py-[8px] px-[28.8px] w-full"
          href={`${currentMediaType}/${idToNavigate}`}
          onClick={() => setCurrentId(idToNavigate)}
        >
          Details
        </Link>
      </div>

      <div className="hero-media-thumbnails">
        {results.slice(0, 4).map((result, index) => {
          const vote = result.vote_average.toString().slice(0, 3) * 10;
          return (
            <div
              className={"movie " + (activeImage === result.id ? "isActive fallback-isActive" : "")}
              onClick={(event) => {
                handleImageClick(event, result);
              }}
              key={result.id}
            >
              <div
                className={`${
                  vote == 0
                    ? " border-[1.5px] xl:border-2 border-gray-700 text-white"
                    : vote < 50
                    ? " border-[1.5px] xl:border-2 border-red-800"
                    : vote < 65
                    ? " border-[1.5px] xl:border-2 border-yellow-500"
                    : vote < 75
                    ? " border-[1.5px] xl:border-2 border-lime-300"
                    : " border-[1.5px] xl:border-2 border-green-500"
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
