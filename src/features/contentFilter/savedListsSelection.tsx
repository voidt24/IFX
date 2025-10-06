"use client";
import Slider from "@/components/Slider/Slider";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useRouter, useSearchParams } from "next/navigation";
export const defaultListButtons = ["favorites", "watchlist", "watched"];

function SavedListOptions() {
  const { edit } = useSelector((state: RootState) => state.listsManagement);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonRef2 = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const list = searchParams.get("selected");
  const dispatch = useDispatch();

  return (
    <Slider>
      {defaultListButtons &&
        defaultListButtons.map((name, index) => {
          return (
            <button
              key={index}
              type="button"
              className={`rounded-full ${list == name ? "bg-brand-primary py-1 px-4" : ""}`}
              onClick={(evt) => {
                params.set("selected", name);
                router.replace(`?${params.toString()}`);

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
