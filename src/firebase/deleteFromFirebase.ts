import { collection, deleteDoc, doc, getDocs, limit, query } from "firebase/firestore";
import { database, usersCollectionName } from "../firebase/firebase.config";

export default async function deleteFromFireStore(
  firebaseActiveUser: { email: string | null; uid: string | null } | null,
  fieldName: string | string[],
  checkedMedia: (string | number)[],
  isHistory: boolean = false,
) {
  if (firebaseActiveUser && firebaseActiveUser.uid) {
    const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser?.uid, ...(Array.isArray(fieldName) ? fieldName : [fieldName]));
    const querySnapshot = await getDocs(activelistDocuments);
    querySnapshot.forEach(async (doc) => {
      if (checkedMedia.includes(doc.id.toString())) {
        await deleteDoc(doc.ref);
      }
    });

    if (isHistory) {
      //to avoid having empty documents
      const verifyQuery = query(activelistDocuments, limit(1));
      const verifySnapshot = await getDocs(verifyQuery);

      if (verifySnapshot.empty) {
        const parentDocRef = doc(database, usersCollectionName, firebaseActiveUser.uid, ...(Array.isArray(fieldName) ? fieldName.slice(0, -1) : [fieldName].slice(0, -1)));
        await deleteDoc(parentDocRef);
      }
    }
  } else {
    throw Promise.reject("");
  }
}
