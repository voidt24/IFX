import SliderCard from "./SliderCard";

import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { CircularProgress } from "@mui/material";
import Notification from "@/components/common/Notification";
import SelectDropdown from "@/components/common/SelectDropdown";
import ConfirmDeleteModal from "./common/ConfirmDeleteModal";

export const ListsResults = ({ listName, savedElementResults, setCurrentListData, listSelectedChange }) => {
  const { firebaseActiveUser, edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ message: "", severity: "info", open: false });
  useEffect(() => {
    if (savedElementResults != null) {
      setLoading(false);
    }
  }, [savedElementResults]);

  useEffect(() => {
    return () => {
      setCheckedMedia([]);
      setEdit(false);
    };
  }, []);

  return (
    <div className="results-container flex flex-col gap-4 xl:max-w-[1400px] overflow-auto h-full !pt-1 !pb-20 relative">
      <div className="options flex justify-between items-center w-full sticky top-[-4px] left-0 bg-black z-50 py-4">
        <span className="flex flex-col  text-left">
          <p>List</p>
          <p className=" text-[120%] lg:text-[160%] text-[var(--primary)] mb-2">{listName.toUpperCase()}</p>
          <SelectDropdown currentListData={savedElementResults} setCurrentListData={setCurrentListData} listSelectedChange={listSelectedChange} />
        </span>
        {savedElementResults && savedElementResults.length > 0 && (
          <>
            <div className="options-btns flex gap-4 max-md:text-[75%]">
              <button
                className="border-0 bg-none hover:bg-transparent"
                onClick={() => {
                  setEdit(!edit);
                  if (edit) {
                    // TODO: use react
                    document.querySelectorAll(".card").forEach((card) => {
                      card.style.border = "3px solid transparent";
                      card.querySelector("img").style.filter = "none";
                      card.querySelector("img").style.transform = "scale(1)";
                    });
                  }
                  setCheckedMedia([]);
                }}
              >
                <i className="bi bi-pencil-square"></i> {edit ? "Done" : "Edit"}
              </button>

              {checkedMedia.length > 0 && (
                <button
                  className="border-0 bg-none hover:bg-transparent"
                  onClick={() => {
                    setConfirmDialog(true);
                  }}
                >
                  <i className="bi bi-trash3"></i> Delete
                </button>
              )}
            </div>

            {confirmDialog && (
              <ConfirmDeleteModal
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
                listName={listName}
                firebaseActiveUser={firebaseActiveUser}
                setEdit={setEdit}
                checkedMedia={checkedMedia}
                setCheckedMedia={setCheckedMedia}
                setMessage={setMessage}
              />
            )}
          </>
        )}
      </div>

      {loading ? (
        <div className="flex items-start justify-center h-full w-full min-h-screen pt-12">
          <CircularProgress color="inherit" size={100} />
        </div>
      ) : savedElementResults && savedElementResults.length > 0 ? (
        <div className="results">
          {savedElementResults
            .slice()
            .reverse()
            .map((result) => (
              <SliderCard result={result} changeMediaType={result.media_type} key={result.id} canBeEdited={true} />
            ))}
        </div>
      ) : (
        <div className="w-full h-full mt-2">You will see your saved data here...</div>
      )}

      <Notification message={message} setMessage={setMessage} />
    </div>
  );
};
