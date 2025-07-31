import SliderCard from "./Slider/SliderCard";

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { CircularProgress } from "@mui/material";
import Notification from "@/components/common/Notification";
import SelectDropdown from "@/components/common/SelectDropdown";
import ConfirmDeleteModal from "./common/ConfirmDeleteModal";
import ListOptionsBar from "./common/ListOptionsBar";
import { selectFilterCategories } from "@/helpers/constants";
import ToTop from "./common/ToTop/ToTop";
import { IMediaData } from "@/Types/index";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

export const ListsResults = ({
  listName,
  currentListData,
  setCurrentListData,
  listSelectedChange,
}: {
  listName: string;
  currentListData: IMediaData[];
  setCurrentListData: Dispatch<SetStateAction<IMediaData[]>>;
  listSelectedChange: boolean;
}) => {
  // const { setEdit, checkedMedia, setCheckedMedia } = useContext(Context);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalListData, setOriginalListData] = useState<IMediaData[] | null>([]);

  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "", severity: "info", open: false });

  const dispatch = useDispatch();
  const { checkedMedia } = useSelector((state: RootState) => state.listsManagement);

  useEffect(() => {
    if (currentListData) {
      setOriginalListData(currentListData);
      setCurrentListData(currentListData);
      setLoading(false);
    }
  }, [listSelectedChange]);

  useEffect(() => {
    return () => {
      dispatch(setCheckedMedia([]));
      dispatch(setEdit(false));
    };
  }, []);

  return (
    <div className="flex flex-col gap-2 h-full relative">
      <div className="options flex justify-between items-center w-full bg-none">
        <SelectDropdown
          listSelectedChange={listSelectedChange}
          selectDefaultName="Filter by"
          selectOptions={selectFilterCategories}
          actionWhenSelectChange={(selected) => {
            if (!originalListData?.length) return;
            switch (selected) {
              case "All":
                setCurrentListData(originalListData);
                break;
              case selectFilterCategories[0]:
                setCurrentListData(originalListData.filter((obj) => obj.media_type === "movie"));
                break;
              case selectFilterCategories[1]:
                setCurrentListData(originalListData.filter((obj) => obj.media_type === "tv"));
                break;
              default:
                setCurrentListData(originalListData);
            }
          }}
        />
        {currentListData && currentListData.length > 0 && (
          <div className="my-4">
            <ListOptionsBar setConfirmDialog={setConfirmDialog} />
            {confirmDialog && (
              <ConfirmDeleteModal
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
                listName={listName}
                extraActions={() => {
                  dispatch(setEdit(false));
                  dispatch(setCheckedMedia([]));
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
        <div className="media-lists">
          {currentListData.map((result) => (
            <SliderCard key={result.id} result={result} mediaType={result.media_type} canBeEdited={true} isChecked={checkedMedia.includes(result.id?.toString() ?? "")} />
          ))}

          {currentListData.length > 35 && <ToTop />}
        </div>
      ) : (
        <div className="w-full h-full mt-2">You will see your saved data here...</div>
      )}

      <Notification message={message} setMessage={setMessage} />
    </div>
  );
};
