"use client";
import { useEffect, useState } from "react";
import Notification from "@/components/common/Notification";
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal";
import ListOptionsBar from "@/components/common/ListOptionsBar";
import ToTop from "@/components/common/ToTop/ToTop";
import { IMediaData } from "@/Types/index";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import MediaTypeSelect from "@/features/contentFilter/MediaTypeSelect";
import { database, usersCollectionName } from "@/firebase/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { defaultListButtons } from "@/features/contentFilter/savedListsSelection";
import SliderCardSkeleton from "@/components/common/Skeletons/SliderCardSkeleton";
import { ListsResults } from "@/components/ListsResults";
import useVerifyToken from "@/Hooks/useVerifyToken";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import SavedListOptions from "../../features/contentFilter/savedListsSelection";
import { Suspense } from "react";
import useHideDrawers from "@/Hooks/useHideDrawers";

export default function Lists() {
  useVerifyToken();
  useHideDrawers();

  const [currentListData, setCurrentListData] = useState<IMediaData[] | null>(null);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [originalListData, setOriginalListData] = useState<IMediaData[]>([]);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const dispatch = useDispatch();
  const { checkedMedia } = useSelector((state: RootState) => state.listsManagement);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const list = searchParams.get("selected");
  const media = searchParams.get("media");

  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const { listChanged } = useSelector((state: RootState) => state.listsManagement);

  useEffect(() => {
    return () => {
      dispatch(setCheckedMedia([]));
      dispatch(setEdit(false));
    };
  }, []);

  useEffect(() => {
    async function getData() {
      //subscription to db to get real time changes
      if (database && usersCollectionName && firebaseActiveUser?.uid && list) {
        const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser.uid, list);

        const unsub = onSnapshot(activelistDocuments, (document) => {
          const data: IMediaData[] = [];
          document.forEach((doc) => {
            data.push(doc.data() as IMediaData);
          });
          setCurrentListData(data);
          setOriginalListData(data);
        });

        // return 'unsub' on component unmount to avoid being "subscribe" while not on this page
        return () => {
          unsub();
        };
      }
    }

    try {
      getData();
    } catch (error) {}
  }, [firebaseActiveUser?.uid, list, listChanged]);

  useEffect(() => {
    if (!media || !["Filter by", "TV Shows", "Movies", "All"].includes(media)) {
      params.set("media", "Filter by");
      router.replace(`?${params.toString()}`);
    }
  }, []);

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
    router.replace(`?${params.toString()}`);
  }, [list]);

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
          <MediaTypeSelect originalListData={originalListData} setCurrentListData={setCurrentListData} />
          {currentListData && currentListData.length > 0 && (
            <div className="my-4">
              <ListOptionsBar setConfirmDialog={setConfirmDialog} />
              {confirmDialog && (
                <ConfirmDeleteModal
                  confirmDialog={confirmDialog}
                  setConfirmDialog={setConfirmDialog}
                  listName={list || ""}
                  extraActions={() => {
                    dispatch(setEdit(false));
                    dispatch(setCheckedMedia([]));
                    params.set("media", "Filter by");
                    router.replace(`?${params.toString()}`);
                  }}
                  elementsToDelete={checkedMedia}
                  setMessage={setMessage}
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
          <div className="w-full h-full mt-2 text-center text-content-third">This list is empty...</div>
        )}
      </div>
      <Notification message={message} setMessage={setMessage} />
    </Wrapper>
  );
}
