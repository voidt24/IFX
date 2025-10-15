"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useRouter, useSearchParams } from "next/navigation";
export const defaultListButtons = ["favorites", "watchlist", "watched"];

function SavedListOptions() {
  const { edit } = useSelector((state: RootState) => state.listsManagement);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const list = searchParams.get("selected");
  const dispatch = useDispatch();

  return (
    <div className="w-full flex items-center justify-center gap-4 sm:gap-7 xl:gap-10 ">
      {defaultListButtons.map((name, index) => {
        return (
          <button
            key={index}
            type="button"
            className={`transition-all rounded-full py-1 px-4 ${list == name ? "bg-brand-primary " : ""}`}
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
    </div>
  );
}

export default SavedListOptions;
