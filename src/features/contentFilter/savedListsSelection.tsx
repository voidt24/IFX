"use client";
import Slider from "@/components/Slider/Slider";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useRouter, useSearchParams } from "next/navigation";
const defaultListButtons = ["favorites", "watchlist"];

function SavedListOptions() {
  const { edit } = useSelector((state: RootState) => state.listsManagement);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonRef2 = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const list = searchParams.get("selected");
  const dispatch = useDispatch();

  useEffect(() => {
    if (buttonRef.current && buttonRef.current.classList.contains("active")) {
      buttonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
    if (buttonRef2.current && buttonRef2.current.classList.contains("active")) {
      buttonRef2.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [buttonRef.current, buttonRef2.current]);

  return (
    <Slider>
      {defaultListButtons &&
        defaultListButtons.map((name, index) => {
          return (
            <button
              key={index}
              type="button"
              ref={buttonRef2}
              className={`hover:scale-100 ${list === name ? " btn-primary " : "btn-secondary !bg-white/15 !text-content-primary"} `}
              onClick={(evt) => {
                if (edit && list != name) {
                  dispatch(setEdit(false));
                  const card = document.querySelectorAll(".card");
                  card.forEach((card) => {
                    if (card instanceof HTMLElement) {
                      card.style.border = "3px solid transparent";
                      const cardImg = card.querySelector("img");
                      if (cardImg instanceof HTMLImageElement) {
                        cardImg.style.filter = "none";
                        cardImg.style.transform = "scale(1)";
                      }
                    }
                  });
                  dispatch(setCheckedMedia([]));
                }
                params.set("selected", name);
                router.replace(`?${params.toString()}`);
              }}
            >
              {name}
            </button>
          );
        })}
    </Slider>
  );
}

export default SavedListOptions;
