import { deleteDoc, doc } from "firebase/firestore";
import { auth, database, usersCollectionName } from "../firebase.config";
import reauthenticateUser from "./reautheticateUser";

export default async function DeleteAccount(userData: { email: string; password: string }) {
  if (auth.currentUser) {
    try {
      await reauthenticateUser(userData);
      const userDoc = doc(database, usersCollectionName, auth.currentUser.uid);

      await deleteDoc(userDoc);

      auth.currentUser.delete();
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("There's no user signed In");
  }
}
