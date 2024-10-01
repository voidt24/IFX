import { doc, getDoc } from "firebase/firestore";
import { database } from "./firebase.config";

export const getFromDB = (documentName, fieldName, callbackToUpdateUIComponent, callbackToStopLoader, currentId) => {
  if (database && documentName) {
    const document = doc(database, "users", documentName);

    getDoc(document)
      .then((documentResult) => {
        if (!documentResult.exists()) {
          callbackToStopLoader(false);
          return;
        }

        const allFieldsFromDocument = documentResult.data();
        const savedIds = [...Object.values(allFieldsFromDocument[fieldName] || {})];

        const idAlreadySaved = savedIds.find((el) => el.id == currentId);

        idAlreadySaved ? callbackToUpdateUIComponent(true) : callbackToUpdateUIComponent(false);
        callbackToStopLoader(false);
      })
      .catch((err) => {
        callbackToStopLoader(false);
        return err;
      });
  }
};
