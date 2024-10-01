import SliderCard from './SliderCard';

import { TabPanel } from '@mui/base';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../context/Context';
import { database, usersCollectionName } from '../firebase/firebase.config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const Panel = ({ value, panelName, savedElementResults, setLoading, setMessage }) => {
  const { firebaseActiveUser, edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const deleteFromFireStore = (fieldName, customMessage = 'List updated!') => {
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
        setMessage({ message: customMessage, severity: 'success', open: true });
      })
      .catch((err) => {
        setMessage({ message: 'Error deleting data, try again later', severity: 'error', open: true });

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
    <TabPanel
      
      className="tabpanel"
      value={value}
    >
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

          <Dialog
            className="confirm-dialog"
            open={confirmDialog}
            onClose={() => {
              setConfirmDialog(false);
            }}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">{"Confirm the action"}</DialogTitle>
            <DialogContent className="dialogcontent">
              <DialogContentText>Do you really you want to delete this data from {panelName}?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setConfirmDialog(false);
                }}
                autoFocus
              >
                Cancel
              </Button>
              <Button
                autoFocus
                onClick={() => {
                  deleteFromFireStore(panelName);
                  setConfirmDialog(false);
                }}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
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
