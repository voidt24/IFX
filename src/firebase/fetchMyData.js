import { doc, getDoc } from "firebase/firestore";
import { database, usersCollectionName } from "./firebase.config";

export const fetchMyData = async (firebaseActiveUser, fieldName, setStateFunction, setLoading, setMessage) => {
  if (database && usersCollectionName && firebaseActiveUser.uid) {
    try {
      const document = doc(database, usersCollectionName, firebaseActiveUser.uid);
      const documentResults = await getDoc(document);

      const dataSaved = documentResults.data();

      if (Object.entries(dataSaved) && Object.entries(dataSaved).length > 0) {
        if (dataSaved[fieldName] && Object.entries(dataSaved).length > 0) {
          const temp = await Promise.all(
            dataSaved[fieldName].map((el) => {
              return el;
            })
          );
          setStateFunction(temp);
        }
      }
    } catch (err) {

      setLoading(false);
      setMessage({ message: "Couldn't load data, please try later", severity: "error", open: true });
    }
  }
};
