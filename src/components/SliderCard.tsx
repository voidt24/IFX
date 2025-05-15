"use client";

import { useState, useContext, useEffect, ChangeEvent } from "react";
import { imageWithSize, ISliderData } from "../helpers/api.config";
import { Context } from "@/context/Context";
import Link from "next/link";

import Checkbox from "@mui/material/Checkbox";
import formatReleaseDate from "@/helpers/formatReleaseDate";
interface ISliderCardProps {
  result: ISliderData;
  changeMediaType?: string | null;
  canBeEdited?: boolean;
  mediaType?: string;
  isChecked?: boolean;
}

const SliderCard = ({ result, changeMediaType = null, canBeEdited = false, mediaType, isChecked }: ISliderCardProps) => {
  const [poster, setPoster] = useState("");
  const [vote, setVote] = useState<string | undefined>();

  const { setCurrentId, setCurrentMediaType, edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);

  const mediaTypeOfSpecificCard = `${changeMediaType === "movie" ? "movies" : "tvshows"}`;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (!checkedMedia?.includes(event.target.id)) {
        setCheckedMedia([...checkedMedia, event.target.id]);
      }
    } else {
      if (checkedMedia?.includes(event.target?.id)) {
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
    if (result.vote_average != null) {
      const voteResult = result.vote_average * 10;
      setVote(voteResult.toString().slice(0, 2));
    }
  }, [result]);
  return (
    poster && (
      <div className={`card ${isChecked ? " border-[3px] border-[#ffa600]  hover:!border-[3px] hover:!border-[#ffa600] " : " border-[3px] border-transparent"}`} data-id={result.id}>
        <div
          className={`${
            Number(vote) == 0
              ? " border-[1.5px] xl:border-2 border-gray-700 text-white"
              : vote && Number(vote) < 50
              ? " border-[1.5px] xl:border-2 border-red-800"
              : vote && Number(vote) < 65
              ? " border-[1.5px] xl:border-2 border-yellow-500"
              : vote && Number(vote) < 75
              ? " border-[1.5px] xl:border-2 border-lime-300"
              : " border-[1.5px] xl:border-2 border-green-500"
          } vote text-white`}
        >
          {poster != "" && <p>{!vote ? 0 : vote + "%"}</p>}
        </div>
        <span className="year">
          {result.release_date
            ? result.release_date && new Date(result.release_date).getTime() > Date.now()
              ? new Date(result.release_date).getFullYear()
              : result?.release_date?.slice(0, 4)
            : result.first_air_date && new Date(result.first_air_date).getTime() > Date.now()
            ? new Date(result.first_air_date).getFullYear()
            : result?.first_air_date?.slice(0, 4)}
        </span>
        {(result.release_date && new Date(result.release_date).getTime() > Date.now()) || (result.first_air_date && new Date(result.first_air_date).getTime() > Date.now()) ? (
          <span className="cooming-soon block uppercase absolute bottom-10 text-center w-full left-0 right-0 z-[2] bg-[var(--primary)] py-1 text-black font-bold text-[70%] lg:text-[80%] [text-shadow:none]">
            coming soon
            <span className="block text-zinc-900 text-[85%]">{formatReleaseDate(result.release_date || result.first_air_date || "")}</span>
          </span>
        ) : null}

        {changeMediaType ? <span className="mediatype">{result.media_type}</span> : null}
        <Link
          href={changeMediaType != null ? `/${mediaTypeOfSpecificCard}/${result.id}` : `/${mediaType}/${result.id}`}
          onClick={() => {
            setCurrentId(result.id ?? undefined);
            if (changeMediaType) {
              setCurrentMediaType(changeMediaType == "movie" ? "movies" : "tvshows");
            }
          }}
        >
          <div className="content " key={result.id}>
            <img src={poster} alt="" className={`rounded-md`} width={780} height={1170} />
          </div>
        </Link>
        {canBeEdited && edit && (
          <span id="checkbox" className="relative w-full h-full z-20">
            <Checkbox
              onChange={(evt) => {
                handleChange(evt);
              }}
              inputProps={{ "aria-label": "controlled" }}
              id={result?.id?.toString()}
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
