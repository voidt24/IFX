import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Notification from "@/components/common/Notification";
import ConfirmDeleteModal from "./common/ConfirmDeleteModal";
import ListOptionsBar from "./common/ListOptionsBar";
import ToTop from "./common/ToTop/ToTop";
import { IMediaData } from "@/Types/index";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import MediaTypeSelect from "@/features/contentFilter/MediaTypeSelect";
import { database, usersCollectionName } from "@/firebase/firebase.config";

import { collection, onSnapshot } from "firebase/firestore";
import MediaGrid from "./MediaGrid/MediaGrid";

export const ListsResults = () => {
  const [currentListData, setCurrentListData] = useState<IMediaData[]>([]);

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalListData, setOriginalListData] = useState<IMediaData[]>([]);
  const [listSelectedChange, setListSelectedChange] = useState(false);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const dispatch = useDispatch();
  const { checkedMedia } = useSelector((state: RootState) => state.listsManagement);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const list = searchParams.get("selected");
  const auth = useSelector((state: RootState) => state.auth);
  const { firebaseActiveUser } = auth;
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
          setListSelectedChange(!listSelectedChange); //when selecting a new list: "favorites to watchlist" or vice versa this will trigger the dropdown to its default state
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
    if (!list || !["favorites", "watchlist"].includes(list)) {
      params.set("selected", "favorites");
      router.replace(`?${params.toString()}`);
    }
    params.set("media", "Filter by");
    router.replace(`?${params.toString()}`);
  }, [list]);

  return (
    <div className="flex flex-col gap-2 h-full relative w-full">
      <div className="options flex justify-between items-center w-full bg-none">
        <MediaTypeSelect
          originalListData={originalListData}
          setOriginalListData={setOriginalListData}
          currentListData={currentListData}
          setCurrentListData={setCurrentListData}
          listSelectedChange={listSelectedChange}
          setLoading={setLoading}
        />
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

      {loading ? (
        <div className="flex items-start justify-center h-full w-full min-h-screen pt-12">
          <CircularProgress color="inherit" size={100} />
        </div>
      ) : currentListData && currentListData.length > 0 ? (
        <>
          <MediaGrid mediaData={currentListData} />
          {currentListData.length > 35 && <ToTop />}
        </>
      ) : (
        <div className="w-full h-full mt-2 text-center">You will see your saved data here...</div>
      )}

      <Notification message={message} setMessage={setMessage} />
    </div>
  );
};
