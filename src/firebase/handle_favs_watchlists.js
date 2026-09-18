import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { database, usersCollectionName } from "./firebase.config";

export const handle_favs_watchlists = async (documentName, referenceOfClickedElement, state, fieldName, currentId) => {
  let dataToSave = {
    id: currentId,
    media_type: referenceOfClickedElement.current.dataset.mediatype,
    title: state.title,
    vote_average: state.vote,
    poster_path: state.poster_path,
    release_date: state.releaseDate,
    originalProvider: state.originalProvider || null,
    // Permanent facts only — never a precomputed "in theaters now" boolean, since this
    // document can sit in a user's list indefinitely and that verdict would go stale.
    hadTheatricalRelease: state.hadTheatricalRelease || false,
    digitalReleaseDate: state.digitalReleaseDate || null,
  };

  try {
    const userDocRef = doc(database, usersCollectionName, documentName);
    const userDocResults = await getDoc(userDocRef);

    if (userDocResults.exists()) {
      const mediaElementRef = doc(database, usersCollectionName, documentName, fieldName, currentId.toString());
      const mediaElementDocResults = await getDoc(mediaElementRef);
      if (mediaElementDocResults.exists()) {
        await deleteDoc(mediaElementRef);
      } else {
        await setDoc(doc(database, usersCollectionName, documentName, fieldName, currentId.toString()), dataToSave, { merge: true });
      }

      return;
    }
    createDocumentWithNewElement(fieldName, currentId, documentName, dataToSave);
  } catch (err) {
    throw err;
  }
};

const createDocumentWithNewElement = async (fieldName, idToCreate, documentName, newDataToSave) => {
  await setDoc(doc(database, usersCollectionName, documentName), {});
  await setDoc(doc(database, usersCollectionName, documentName, fieldName, idToCreate.toString()), newDataToSave, { merge: true });
};
