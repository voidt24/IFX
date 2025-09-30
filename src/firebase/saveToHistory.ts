import { IhistoryMedia } from "@/Types/index";
import { database, usersCollectionName } from "./firebase.config";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

export async function saveToHistory(dataToSave: IhistoryMedia, id: number, userUid: string) {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const dateId = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    const userDocRef = doc(database, usersCollectionName, userUid);
    const userDocResults = await getDoc(userDocRef);

    if (userDocResults.exists()) {
      const historyDocRef = doc(database, usersCollectionName, userUid, "history", dateId);
      const mediaDocRef = doc(database, usersCollectionName, userUid, "history", dateId, "content", id.toString());

      const historySnapshot = await getDoc(historyDocRef);

      if (!historySnapshot.exists()) {
        await setDoc(historyDocRef, { createdAt: serverTimestamp() }, { merge: true });
        await setDoc(mediaDocRef, dataToSave, { merge: true });
      } else {
        const mediaDocResults = await getDoc(mediaDocRef);

        if (!mediaDocResults.exists()) {
          await setDoc(mediaDocRef, dataToSave, { merge: true });
        }
      }
    }
  } catch (err) {
    throw err;
  }
}
