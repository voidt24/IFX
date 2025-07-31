"use client";
import { useState, useContext, useEffect, ChangeEvent } from "react";
import { imageWithSize } from "../../helpers/api.config";
import { Context } from "@/context/Context";
import Link from "next/link";
import Checkbox from "@mui/material/Checkbox";
import formatReleaseDate from "@/helpers/formatReleaseDate";
import { MediaTypeApi, IMediaData } from "@/Types/index";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
interface ISliderCardProps {
  result: IMediaData;
  canBeEdited?: boolean;
  mediaType: MediaTypeApi;
  isChecked?: boolean;
}

const SliderCard = ({ result, canBeEdited = false, mediaType, isChecked }: ISliderCardProps) => {
  const [poster, setPoster] = useState("");
  const [vote, setVote] = useState<string | undefined>();

  const { setOpenMediaDetailsSheet, setCurrentId, setCurrentMediaType, showSearchBar, setShowSearchBar, setSheetMediaType, isMobilePWA } = useContext(Context);
  const dispatch = useDispatch();
  const { checkedMedia, edit } = useSelector((state: RootState) => state.listsManagement);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      if (!checkedMedia?.includes(event.target.id)) {
        dispatch(setCheckedMedia([...checkedMedia, event.target.id]));
      }
    } else {
      if (checkedMedia?.includes(event.target?.id)) {
        dispatch(setCheckedMedia(checkedMedia.filter((element) => element !== event.target.id)));
      }
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setEdit(false));
    };
  }, []);

  useEffect(() => {
    if (result.poster_path != null) {
      setPoster(`${imageWithSize("780")}${result.poster_path}`);
    }
    if (result.vote_average != null) {
      const voteResult = result.vote_average;
      setVote(voteResult.toString().slice(0, 3));
    }
  }, [result]);

  return (
    poster && (
      <div
        className={`card relative rounded-md border-[3px] border-transparent z-[1] lg:hover:border lg:hover:border-brand-primary transition-all duration-200 ${
          isChecked ? " !border-[3px] !border-brand-primary hover:!border-[3px] hover:!border-brand-primary " : " border-[3px] border-transparent"
        }`}
        data-id={result.id}
      >
        {isMobilePWA ? (
          <button
            onClick={() => {
              setSheetMediaType(mediaType == "movie" ? "movies" : "tvshows");
              setCurrentId(result.id);
              setOpenMediaDetailsSheet(true);

              if (canBeEdited) {
                setCurrentMediaType(result.media_type == "movie" ? "movies" : "tvshows");
              } else {
                setSheetMediaType(mediaType == "movie" ? "movies" : "tvshows");
              }
            }}
          >
            <div className="content " key={result.id}>
              <div
                className={`absolute top-[13px] left-[5px] flex-row-center gap-1 z-[2] font-semibold rounded-full bg-surface-modal pl-[0.3rem] pr-[0.4rem]
          vote`}
              >
                {poster != "" && (
                  <>
                    <i className="bi bi-star-fill text-[goldenrod] text-[80%] cursor-default"></i>
                    <p>{vote || 0}</p>
                  </>
                )}
              </div>
              <span className="year absolute top-[13px] right-[5px] z-[2] rounded-full px-[0.3rem] bg-surface-modal">
                {result.release_date
                  ? result.release_date && new Date(result.release_date).getTime() > Date.now()
                    ? new Date(result.release_date).getFullYear()
                    : result?.release_date?.slice(0, 4)
                  : result.first_air_date && new Date(result.first_air_date).getTime() > Date.now()
                  ? new Date(result.first_air_date).getFullYear()
                  : result?.first_air_date?.slice(0, 4)}
              </span>
              {canBeEdited ? <span className="mediatype absolute left-[5px] bottom-[12px] z-[2] rounded-full px-[0.3rem] bg-surface-modal">{result.media_type}</span> : null}

              <img src={poster} alt="" className={`rounded-md`} width={780} height={1170} />
              {(result.release_date && new Date(result.release_date).getTime() > Date.now()) || (result.first_air_date && new Date(result.first_air_date).getTime() > Date.now()) ? (
                <span className="cooming-soon block uppercase absolute bottom-10 text-center w-full left-0 right-0 z-[2] backdrop-blur-xl bg-brand-primary/20 [text-shadow:1px_1px_3px_black] py-1 text-content-primary font-bold text-[70%] lg:text-[80%]">
                  coming soon
                  <span className="block text-[85%]">{formatReleaseDate(result.release_date || result.first_air_date || "")}</span>
                </span>
              ) : null}
            </div>
          </button>
        ) : (
          <Link
            href={canBeEdited ? `/${result.media_type === "movie" ? "movies" : "tvshows"}/${result.id}` : `/${mediaType === "movie" ? "movies" : "tvshows"}/${result.id}`}
            onClick={() => {
              sessionStorage.setItem("navigatingFromApp", "1");

              setCurrentId(result.id ?? undefined);
              if (canBeEdited) {
                setCurrentMediaType(result.media_type == "movie" ? "movies" : "tvshows");
              }
              if (showSearchBar) {
                setShowSearchBar(false);
              }
            }}
          >
            <div className="content " key={result.id}>
              <div
                className={`absolute top-[13px] left-[5px] flex-row-center gap-1 z-[2] font-semibold rounded-full bg-surface-modal pl-[0.3rem] pr-[0.4rem]
          vote`}
              >
                {poster != "" && (
                  <>
                    <i className="bi bi-star-fill text-[goldenrod] text-[80%] cursor-default"></i>
                    <p>{vote || 0}</p>
                  </>
                )}
              </div>
              <span className="year absolute top-[13px] right-[5px] z-[2] rounded-full px-[0.3rem] bg-surface-modal">
                {result.release_date
                  ? result.release_date && new Date(result.release_date).getTime() > Date.now()
                    ? new Date(result.release_date).getFullYear()
                    : result?.release_date?.slice(0, 4)
                  : result.first_air_date && new Date(result.first_air_date).getTime() > Date.now()
                  ? new Date(result.first_air_date).getFullYear()
                  : result?.first_air_date?.slice(0, 4)}
              </span>
              {canBeEdited ? <span className="mediatype absolute left-[5px] bottom-[12px] z-[2] rounded-full px-[0.3rem] bg-surface-modal">{result.media_type}</span> : null}

              <img src={poster} alt="" className={`rounded-md`} width={780} height={1170} />
              {(result.release_date && new Date(result.release_date).getTime() > Date.now()) || (result.first_air_date && new Date(result.first_air_date).getTime() > Date.now()) ? (
                <span className="cooming-soon block uppercase absolute bottom-10 text-center w-full left-0 right-0 z-[2] backdrop-blur-xl bg-brand-primary/20 [text-shadow:1px_1px_3px_black] py-1 text-content-primary font-bold text-[70%] lg:text-[80%]">
                  coming soon
                  <span className="block text-[85%]">{formatReleaseDate(result.release_date || result.first_air_date || "")}</span>
                </span>
              ) : null}
            </div>
          </Link>
        )}
        {canBeEdited && edit && (
          <span id="checkbox" className="absolute w-full h-full z-[3] top-0 right-0">
            <Checkbox
              onChange={(evt) => {
                handleChange(evt);
              }}
              inputProps={{ "aria-label": "controlled" }}
              id={result?.id?.toString()}
              sx={{
                height: "100%",
                width: "100%",
                bgcolor: "#00000040",
                borderRadius: "8px",
                color: "black",
                "&:hover": {
                  bgcolor: "#00000040",
                },
                "&.Mui-checked": {
                  color: "white",
                  bgcolor: "#000000ad",
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
