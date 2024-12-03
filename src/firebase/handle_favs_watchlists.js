import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { database, usersCollectionName } from "./firebase.config";

export const handle_favs_watchlists = async (documentName, referenceOfClickedElement, state, fieldName, currentId) => {
  let dataToSave = {
    id: currentId,
    media_type: referenceOfClickedElement.current.dataset.mediatype,
    title: state.title,
    vote_average: state.vote,
    poster_path: state.poster,
    release_date: state.releaseDate,
  };

  try {
    const userDocRef = doc(database, usersCollectionName, documentName);
    //reference of document uid (from activeUser) within 'users'collection
    const userDocResults = await getDoc(userDocRef);

    if (userDocResults.exists()) {
      //if we found the uid within users collection
      const mediaElementRef = doc(database, usersCollectionName, documentName, fieldName, currentId.toString());
      const mediaElementDocResults = await getDoc(mediaElementRef);
      if (mediaElementDocResults.exists()) {
        await deleteDoc(mediaElementRef); // si una coleccion como favorites llega a estar vacia, firebase la elimina automaticamente
      } else {
        await setDoc(doc(database, usersCollectionName, documentName, fieldName, currentId.toString()), dataToSave, { merge: true });
      }

      return;
    }
    //aun no existe el doc de users, creemoslo y agreguemos el elemento (movie o tv)
    createDocumentWithNewElement(fieldName, currentId, documentName, dataToSave);
  } catch (err) {
    throw err;
  }
};

const createDocumentWithNewElement = async (fieldName, idToCreate, documentName, newDataToSave) => {
  await setDoc(doc(database, usersCollectionName, documentName), {});
  await setDoc(doc(database, usersCollectionName, documentName, fieldName, idToCreate.toString()), newDataToSave, { merge: true }); //'merge' was necessary to save in the document without replacing previous stored data
};
