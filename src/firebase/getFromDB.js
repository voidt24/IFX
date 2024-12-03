import { collection, getDocs } from "firebase/firestore";
import { database, usersCollectionName } from "./firebase.config";

export const getFromDB = async (documentName, fieldName, currentId) => {
  if (database && documentName) {
    try {
      const activelistDocuments = collection(database, usersCollectionName, documentName, fieldName);
      const querySnapshot = await getDocs(activelistDocuments);
      let isSaved = false;
      querySnapshot.forEach(async (doc) => {
        if (currentId == doc.id) {
          isSaved = true;
        }
      });

      return Promise.resolve(isSaved);
    } catch (err) {
      throw err;
    }
  }
};
