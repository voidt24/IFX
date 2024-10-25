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

  const mediaTypeOfSpecificCard = `/${changeMediaType === "movie" ? "movies" : "tvshows"}`;
  const handleChange = (event) => {
    setCheckedMedia(event.target.checked);

    const card = event.target.parentElement.parentElement.parentElement;

    if (event.target.checked) {
      card.style.border = "3px solid rgb(255 166 0)";

      card.querySelector("img").style.filter = "grayscale(1)";
    } else {
      card.style.border = "3px solid transparent";
      card.querySelector("img").style.filter = "none";
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
        <span className="year">
          {(result.release_date && result.release_date.slice(0, 4)) || (result.first_air_date && result.first_air_date.slice(0, 4)) || (result.releaseDate && result.releaseDate)}
        </span>
        {changeMediaType ? <span className="mediatype">{result.mediatype || result.media_type}</span> : null}
        <Link
          href={changeMediaType != null ? `${mediaTypeOfSpecificCard}/${result.id}` : `${currentMediaType}/${result.id}`}
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
          <span id="checkbox" className="relative w-full h-full z-20">
            <Checkbox
              onChange={(evt) => {
                handleChange(evt);
              }}
              inputProps={{ "aria-label": "controlled" }}
              id={result.id.toString()}
              sx={{
                height: "100%",
                width: "100%",
                bgcolor: "#00000060",
                borderRadius: "8px",
                color: "white",
                "&.Mui-checked": {
                  color: "goldenrod",
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
