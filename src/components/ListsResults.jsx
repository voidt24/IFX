import SliderCard from "./SliderCard";

import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { database, usersCollectionName } from "../firebase/firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Snackbar, Alert } from "@mui/material";
import Modal from "@/components/Modal";

export const ListsResults = ({ listName, savedElementResults }) => {
  const { firebaseActiveUser, edit, setEdit, checkedMedia, setCheckedMedia, message, setMessage } = useContext(Context);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const deleteFromFireStore = async (fieldName, customMessage = "List updated!") => {
    try {
      const document = doc(database, usersCollectionName, firebaseActiveUser.uid);

      const documentResult = await getDoc(document);

      let dataSaved = documentResult.data();

      const newData = dataSaved[fieldName].filter((el) => !checkedMedia.includes(el.id.toString()));
      setEdit(false);
      setCheckedMedia([]);

      const updateData = {};
      updateData[fieldName] = newData;

      updateDoc(document, updateData);
      setMessage({ message: customMessage, severity: "success", open: true });
    } catch (err) {
      setMessage({ message: "Error deleting data, try again later", severity: "error", open: true });
    }
  };

  useEffect(() => {
    return () => {
      setCheckedMedia([]);
      setEdit(false);
    };
  }, []);

  return (
    <div className="results-container flex flex-col gap-4 xl:max-w-[1400px] ">
      {savedElementResults && savedElementResults.length > 0 && (
        <div className="options flex justify-between items-center w-full">
          <span className="flex flex-col  text-left">
            <p>List</p>
            <p className=" text-[120%] lg:text-[160%] text-[var(--primary)]">{listName.toUpperCase()}</p>
          </span>

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
            <Modal modalActive={confirmDialog} setModalActive={setConfirmDialog}>
              <div className="flex flex-col gap-4 max-md:text-sm py-4">
                <p className="">Do you really you want to delete this data from {listName}?</p>

                <div className="delete-options flex gap-4">
                  <button
                    type="submit"
                    className="w-full rounded-full  hover:bg-gray-700 px-4 py-1"
                    onClick={() => {
                      setConfirmDialog(false);
                    }}
                    autoFocus
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full rounded-full  bg-white/40 hover:bg-gray-600 px-4 py-1"
                    onClick={() => {
                      deleteFromFireStore(listName);
                      setConfirmDialog(false);
                    }}
                    autoFocus
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {savedElementResults && savedElementResults.length > 0 ? (
        <div className="results">
          {savedElementResults
            .slice()
            .reverse()
            .map((result) => {
              return <SliderCard result={result} changeMediaType={result.mediatype} key={result.id} canBeEdited={true} />;
            })}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">You will see your saved data here...</div>
      )}

      <Snackbar
        open={message.open}
        autoHideDuration={3500}
        onClose={() => {
          setMessage({ ...message, open: false });
        }}
      >
        <Alert
          onClose={() => {
            setMessage({ ...message, open: false });
          }}
          severity={message.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
