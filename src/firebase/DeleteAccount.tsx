import { deleteDoc, doc } from "firebase/firestore";
import { auth, database, usersCollectionName } from "./firebase.config";

export default async function DeleteAccount(firebaseActiveUser: { email: string | null; uid: string | null } | null) {
  try {
    if (firebaseActiveUser?.uid) {
      const userDoc = doc(database, usersCollectionName, firebaseActiveUser.uid);

      await deleteDoc(userDoc);

      auth?.currentUser?.delete();
    } else {
      throw new Error("There's no user signed In");
    }
  } catch (error) {
    throw error;
  }
}
