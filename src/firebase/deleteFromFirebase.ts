import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { database, usersCollectionName } from "../firebase/firebase.config";

export default async function deleteFromFireStore(firebaseActiveUser: { email: string | null; uid: string | null }, fieldName: string, checkedMedia: (string | number)[]) {
  if (firebaseActiveUser && firebaseActiveUser.uid) {
    const activelistDocuments = collection(database, usersCollectionName, firebaseActiveUser?.uid, fieldName);
    const querySnapshot = await getDocs(activelistDocuments);
    querySnapshot.forEach(async (doc) => {
      if (checkedMedia.includes(doc.id.toString())) {
        await deleteDoc(doc.ref);
      }
    });
  } else {
    throw Promise.reject("");
  }
}
