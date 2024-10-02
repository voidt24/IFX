"use client";

import { useState, useContext, useEffect } from "react";
import { imageWithSize } from "../helpers/api.config";
import { Context } from "@/context/Context";
import Link from "next/link";

import Checkbox from "@mui/material/Checkbox";

const SliderCard = ({ result, changeMediaType = null, canBeEdited = false }) => {
  const [poster, setPoster] = useState(null);
  const [vote, setVote] = useState();
  const { setCurrentId, setCurrentMediaType, currentMediaType, edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);

  const l = `/${changeMediaType === "movie" ? "movies" : "tvshows"}`;
  const handleChange = (event) => {
    setCheckedMedia(event.target.checked);

    const card = event.target.parentElement.parentElement.parentElement;

    if (event.target.checked) {
      card.style.border = "4px solid rgb(255 166 0)";

      card.classList.add("selected");

      card.querySelector("img").style.filter = "contrast(0.6)";
      card.querySelector("img").style.transform = "scale(0.93)";
      card.querySelector("a").style.pointerEvents = "none";
    } else {
      card.style.border = "3px solid transparent";
      card.querySelector("img").style.filter = "none";
      card.querySelector("img").style.transform = "scale(1)";
      card.querySelector("a").style.pointerEvents = "all";
    }

    if (event.target.checked) {
      if (!checkedMedia.includes(event.target.id)) {
        setCheckedMedia([...checkedMedia, event.target.id]);
      }
    } else {
      if (checkedMedia.includes(event.target.id)) {
        setCheckedMedia(checkedMedia.filter((element) => element !== event.target.id));
      }
    }
  };

  useEffect(() => {
    return () => {
      setEdit(false);
    };
  }, []);
  useEffect(() => {
    if (result.poster_path != null) {
      setPoster(`${imageWithSize("780")}${result.poster_path}`);
    }

    setVote(result.vote_average.toString().slice(0, 3) * 10);
  }, [result]);
  return (
    poster && (
      <div className="card" data-id={result.id}>
        <div
          className={`${
            vote == 0
              ? " border-2 border-gray-700 text-white"
              :  vote < 50
              ? " border-2 border-red-800"
              : vote < 65
              ? " border-2 border-yellow-500"
              : vote < 75
              ? " border-2 border-lime-300"
              : " border-2 border-green-500"
          } vote text-black`}
        >
          <p>
          {vote + "%"}
          </p>
        </div>
        <span className="year">
          {(result.release_date && result.release_date.slice(0, 4)) || (result.first_air_date && result.first_air_date.slice(0, 4)) || (result.releaseDate && result.releaseDate)}
        </span>
        {changeMediaType ? <span className="mediatype">{result.mediatype || result.media_type}</span> : null}
        <Link
          href={changeMediaType != null ? `${l}/${result.id}` : `${currentMediaType}/${result.id}`}
          onClick={() => {
            setCurrentId(result.id);
            if (changeMediaType) {
              setCurrentMediaType(changeMediaType == "movie" ? "movies" : "tvshows");
            }
          }}
        >
          <div className="content" key={result.id}>
            <img src={poster} alt="" />
          </div>
        </Link>
        {canBeEdited && edit && (
          <span id="checkbox">
            <Checkbox
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
              id={result.id.toString()}
              sx={{
                "&:hover": { bgcolor: "black" },
                bgcolor: "#0008",
                color: "white",
                "&.Mui-checked": {
                  bgcolor: "#000",
                },
              }}
            />
          </span>
        )}
      </div>
    )
  );
};

export default SliderCard;
