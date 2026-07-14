"use client";
import { useEffect, useState } from "react";
import Notification from "@/components/common/Notification";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import EditButton from "@/components/byRoute/Lists/EditButton";
import ToTop from "@/components/common/ToTop/ToTop";
import { IMediaData } from "@/Types/index";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import MediaTypeSelect from "@/features/contentFilter/MediaTypeSelect";
// 1. Importas tu nuevo componente YearSelect
import YearSelect from "@/features/contentFilter/YearSelect";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { defaultListButtons } from "@/features/contentFilter/savedListsSelection";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";
import { ListsResults } from "@/components/byRoute/Lists/ListsResults";
import useVerifyToken from "@/Hooks/useVerifyToken";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import SavedListOptions from "@/features/contentFilter/savedListsSelection";
import { Suspense } from "react";
import useHideDrawers from "@/Hooks/useHideDrawers";
import DeletionToolbar from "@/components/byRoute/Lists/DeletionToolbar";
import { setUserLogged } from "@/store/slices/authSlice";

export default function Lists() {
  useVerifyToken();
  useHideDrawers();

  const [currentListData, setCurrentListData] = useState<IMediaData[] | null>(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [originalListData, setOriginalListData] = useState<IMediaData[]>([]);
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const dispatch = useDispatch();
  const { checkedMedia, edit, listChanged } = useSelector((state: RootState) => state.listsManagement);
  const { firebaseActiveUser, userLogged } = useSelector((state: RootState) => state.auth);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const list = searchParams.get("selected");
  const media = searchParams.get("media");
  // 2. Extraes el parámetro de la URL para el año
  const year = searchParams.get("year");

  useEffect(() => {
    return () => {
      dispatch(setCheckedMedia([]));
      dispatch(setEdit(false));
    };
  }, []);

  // Subscription a Firebase (Trae la data cruda y la guarda intacta en originalListData)
  useEffect(() => {
    async function getData() {
      if (userLogged && database && usersCollectionName && firebaseActiveUser?.uid && list) {
        const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser.uid, list);

        const unsub = onSnapshot(activelistDocuments, (document) => {
          const data: IMediaData[] = [];
          document.forEach((doc) => {
            data.push(doc.data() as IMediaData);
          });
          setOriginalListData(data);
        });

        return () => unsub();
      } else {
        setCurrentListData([]);
        setOriginalListData([]);
      }
    }

    try {
      getData();
    } catch (error) {}
  }, [firebaseActiveUser?.uid, list, listChanged, userLogged]);

  // 3. Inicializar el parámetro de año por defecto en la URL si no existe
  useEffect(() => {
    if (!media || !["Filter by", "TV Shows", "Movies", "All"].includes(media)) {
      params.set("media", "Filter by");
    }
    if (!year) {
      params.set("year", "All");
    }
    router.replace(`?${params.toString()}`);
  }, []);

  // 4. NUEVO EFECTO: Centraliza el filtrado combinado (Media + Año) en el cliente
  useEffect(() => {
    if (originalListData.length === 0) {
      setCurrentListData([]);
      return;
    }

    let filteredData = [...originalListData];

    // A. Filtrado por tipo de Media
    if (media === "Movies") {
      filteredData = filteredData.filter((item) => item.media_type === "movie");
    } else if (media === "TV Shows") {
      filteredData = filteredData.filter((item) => item.media_type === "tv");
    }

    // B. Filtrado por Año (Extrae el año de release_date o first_air_date)
    if (year && year !== "All") {
      filteredData = filteredData.filter((item) => {
        const dateStr = item.release_date || item.first_air_date;
        if (!dateStr) return false;
        // TMDb retorna YYYY-MM-DD, cortamos los primeros 4 caracteres
        const itemYear = dateStr.substring(0, 4);
        return itemYear === year;
      });
    }

    setCurrentListData(filteredData);
  }, [originalListData, media, year]);

  useEffect(() => {
    if (!list || !defaultListButtons.includes(list)) {
      params.set("selected", "favorites");
      router.replace(`?${params.toString()}`);
    }

    if (firstRender) {
      setFirstRender(false);
      return;
    }
    params.set("media", "Filter by");
    params.set("year", "All"); // Reseteamos año al cambiar de lista (ej: de favoritos a watchlist)
    router.replace(`?${params.toString()}`);
  }, [list, listChanged]);

  if (currentListData == null) {
    return (
      <div className="wrapper">
        <div className="lists flex flex-col items-center gap-4 text-center animate-pulse w-full mt-16">
          <div className="flex-row-center gap-2">
            <div className="rounded-full py-3.5 px-12 bg-surface-modal "></div>
            <div className="rounded-full py-3.5 px-12 bg-surface-modal "></div>
            <div className="rounded-full py-3.5 px-12 bg-surface-modal "></div>
          </div>
          <div className="media-lists flex flex-col gap-4 xl:max-w-[1400px] w-full ">
            {Array.from({ length: 20 }).map((_, index) => (
              <SliderCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Wrapper>
      <div className="flex-col-center gap-4">
        <Suspense fallback={<div>Loading list options...</div>}>
          <SavedListOptions />
        </Suspense>

        <div className="options flex justify-between items-center w-full bg-none">
          {/* 5. Renderizamos ambos Selects juntos en un contenedor flex */}
          <div className="flex items-center gap-4">
            {/* Select de Media + Botón Reset */}
            <div className="flex items-center gap-1.5 pr-2">
              <MediaTypeSelect originalListData={originalListData} setCurrentListData={setCurrentListData} />
              {media && media !== "Filter by" && (
                <button
                  onClick={() => {
                    params.set("media", "Filter by");
                    router.replace(`?${params.toString()}`);
                  }}
                  className="pr-2 text-content-third hover:text-content-primary text-sm  transition-colors"
                  title="Reset Media"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Select de Año + Botón Reset */}
            <div className="flex items-center gap-1.5 pr-2">
              <YearSelect selected={year} />
              {year && year !== "All" && (
                <button
                  onClick={() => {
                    params.set("year", "All");
                    router.replace(`?${params.toString()}`);
                  }}
                  className="pr-2 text-content-third hover:text-content-primary text-sm  transition-colors"
                  title="Reset Year"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {originalListData && originalListData.length > 0 && (
            <div className="my-4">
              <EditButton />
              {confirmDialog && (
                <ConfirmDeleteModal
                  confirmDialog={confirmDialog}
                  setConfirmDialog={setConfirmDialog}
                  listName={list || ""}
                  extraActions={() => {
                    dispatch(setEdit(false));
                    dispatch(setCheckedMedia([]));
                    params.set("media", "Filter by");
                    params.set("year", "All");
                    router.replace(`?${params.toString()}`);
                  }}
                  elementsToDelete={checkedMedia}
                  setMessage={setMessage}
                  isHistory={false}
                />
              )}
            </div>
          )}
        </div>

        {currentListData && currentListData.length > 0 ? (
          <Suspense fallback={<div>Loading content...</div>}>
            <ListsResults currentListData={currentListData} />
            {currentListData.length > 35 && <ToTop />}
          </Suspense>
        ) : (
          <div className="w-full h-full mt-2 text-center text-content-third">No content found matching your filters...</div>
        )}
      </div>
      {edit && <DeletionToolbar setConfirmDialog={() => setConfirmDialog(true)} />}
      <Notification message={message} setMessage={setMessage} />
    </Wrapper>
  );
}
