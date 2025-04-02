import { IhistoryMedia } from "@/Types/index";
import { database, usersCollectionName } from "./firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function saveToHistory(dataToSave: IhistoryMedia, id: number, userUid: string) {
  try {
    const userDocRef = doc(database, usersCollectionName, userUid);
    const userDocResults = await getDoc(userDocRef);

    if (userDocResults.exists()) {
      await setDoc(doc(database, usersCollectionName, userUid, "history", id.toString()), dataToSave, { merge: true });
    }
  } catch (err) {
    throw err;
  }
}