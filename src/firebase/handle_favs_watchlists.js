import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { database, usersCollectionName } from './firebase.config';

export const handle_favs_watchlists = (documentName, referenceOfClickedElement, state, fieldName,
   callbackToUpdateUIComponent,currentId,setMessage) => {
    //reference of document 'documentName'(uid from activeUser) within 'users' colection
    const document = doc(database, usersCollectionName, documentName);

    getDoc(document)
      .then((documentResult) => {
        if (documentResult.exists()) {//if we found the uid within users collection
          
          const dataSaved = documentResult.data();
          const idAlreadyExists = [...Object.values(dataSaved[fieldName] || {})].find((el) => el.id == currentId);

          if (!idAlreadyExists) {
            const newData = [...Object.values(dataSaved[fieldName] || {}), { id: currentId, mediatype: referenceOfClickedElement.current.dataset.mediatype, title: state.title, vote_average: state.vote, poster_path: state.poster }];

            const updatedData = {};
            updatedData[fieldName] = newData;
            updateDoc(document, updatedData);
            callbackToUpdateUIComponent(true);
          } else {
            const newData = [...Object.values(dataSaved[fieldName]).filter((el) => el.id != idAlreadyExists.id)];
            const updatedData = {};
            updatedData[fieldName] = newData;
            updateDoc(document, updatedData);

            callbackToUpdateUIComponent(false); //to-do: set data saved correctly message un screen
          }
        } else {
          const newDataToSave = {};
          newDataToSave[fieldName] = [{ id: currentId, mediatype: referenceOfClickedElement.current.dataset.mediatype, title: state.title, vote_average: state.vote, poster_path: state.poster }];
          setDoc(doc(database, usersCollectionName, documentName), newDataToSave, { merge: true }); //'merge' was necessary to save in the document without replacing previous stored data
          callbackToUpdateUIComponent(true);
        }
      })
      .catch((err) => {
        setMessage({ message: `Error saving to ${fieldName}, try again later!`, severity: 'error', open: true });
        return; //todo: set error message un screen
      });
  };