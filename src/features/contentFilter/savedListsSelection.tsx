"use client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCheckedMedia, setEdit, setListActive } from "@/store/slices/listsManagementSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react"; // 1. Importamos hooks básicos

export const defaultListButtons = ["favorites", "watchlist", "watched"];

function SavedListOptions() {
  const { edit, listActive } = useSelector((state: RootState) => state.listsManagement);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // 2. Estado local para control visual inmediato de la pestaña activa
  const [activeTab, setActiveTab] = useState(searchParams.get("selected") || "favorites");

  // 3. Sincronizar el estado si la URL cambia externamente (ej: botón atrás del navegador)
  useEffect(() => {
    const currentParam = searchParams.get("selected");
    if (currentParam && currentParam !== activeTab) {
      dispatch(setListActive(currentParam));
      setActiveTab(currentParam);
    }
  }, [searchParams]);

  return (
    <div className="w-auto bg-black/80 border px-2 border-white/15 flex items-center justify-center rounded-full gap-4 sm:gap-7 xl:gap-10 sticky top-20 z-50 py-2">
      {defaultListButtons.map((name, index) => {
        // 4. Evaluamos contra el estado local 'activeTab', no contra 'list' de los params
        const isActive = activeTab === name;

        return (
          <button
            key={index}
            type="button"
            // Reducimos la transición de Tailwind a duration-150 o duration-200 para que se sienta más responsivo
            className={`transition-all duration-150 rounded-full py-1 px-4 hover:text-white ${isActive ? "bg-brand-primary/60 text-white" : "text-white/70"}`}
            onClick={() => {
              // 5. Cambio visual instantáneo
              setActiveTab(name);
              dispatch(setListActive(name));
              // 6. Actualización de URL en segundo plano
              const params = new URLSearchParams(searchParams.toString());
              params.set("selected", name);
              router.replace(`?${params.toString()}`);

              // Lógica de limpieza de edición (se mantiene intacta)
              if (edit && searchParams.get("selected") !== name) {
                dispatch(setEdit(false));
                const cards = document.querySelectorAll(".card");
                cards.forEach((card) => {
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
