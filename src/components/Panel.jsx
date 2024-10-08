import SliderCard from "./SliderCard";

import { TabPanel } from "@mui/base";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { database, usersCollectionName } from "../firebase/firebase.config";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const Panel = ({ value, panelName, savedElementResults, setLoading, setMessage }) => {
  const { firebaseActiveUser, edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const deleteFromFireStore = (fieldName, customMessage = "List updated!") => {
    const document = doc(database, usersCollectionName, firebaseActiveUser.uid);

    getDoc(document)
      .then((documentResult) => {
        const dataSaved = documentResult.data();
        const newData = dataSaved[fieldName].filter((el) => !checkedMedia.includes(el.id.toString()));
        setLoading(true);
        setEdit(false);
        setCheckedMedia([]);

        const updateData = {};
        updateData[fieldName] = newData;

        updateDoc(document, updateData).then(() => {
          setLoading(false);
        });
        setMessage({ message: customMessage, severity: "success", open: true });
      })
      .catch((err) => {
        setMessage({ message: "Error deleting data, try again later", severity: "error", open: true });

        setLoading(false);
        return; //todo: set error message un screen
      });
  };

  useEffect(() => {
    return () => {
      setCheckedMedia([]);
    };
  }, []);

  return (
    <TabPanel className="tabpanel" value={value}>
      {savedElementResults && savedElementResults.length > 0 && (
        <div className="tabpanel-options">
          <button
            onClick={() => {
              setEdit(!edit);
              if (edit) {
                // TODO: use react
                document.querySelectorAll(".card").forEach((card) => {
                  card.style.border = "3px solid transparent";
                  card.querySelector("img").style.filter = "none";
                  card.querySelector("img").style.transform = "scale(1)";
                  card.querySelector("a").style.pointerEvents = "all";
                });
              }
              setCheckedMedia([]);
            }}
          >
            <i className="bi bi-pencil-square"></i> {edit ? "Done" : "Edit"}
          </button>

          {checkedMedia.length > 0 && (
            <button
              onClick={() => {
                setConfirmDialog(true);
              }}
            >
              <i className="bi bi-trash3"></i> Delete
            </button>
          )}

          {confirmDialog && (
            <div className="overlay z-50 flex p-4 items-center justify-center text-white">
              <div className="  bg-black relative flex flex-col gap-6 rounded-lg items-center justify-center  z-30 border border-gray-600 py-4 px-6 w-full  sm:w-3/4 lg:w-3/6 xl:w-[700px]">
                <button
                  onClick={() => {
                    setConfirmDialog(false);
                  }}
                  type="button"
                  className="border-none  rounded-lg  hover:text-[var(--primary)] self-end"
                >
                  <i className="bi bi-x-circle "></i>
                </button>
                <p className="dialog-content-text xl:text-lg">Do you really you want to delete this data from {panelName}?</p>

                <div className="delete-options flex gap-4">
                  <button
                    onClick={() => {
                      setConfirmDialog(false);
                    }}
                    autoFocus
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      deleteFromFireStore(panelName);
                      setConfirmDialog(false);
                    }}
                    autoFocus
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="results">
        {savedElementResults &&
          savedElementResults.length > 0 &&
          savedElementResults
            .slice()
            .reverse()
            .map((result) => {
              return <SliderCard result={result} changeMediaType={result.mediatype} key={result.id} canBeEdited={true} />;
            })}
      </div>
    </TabPanel>
  );
};
