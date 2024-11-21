import { updateProfile } from "firebase/auth";
import { auth } from "../firebase.config";
export default async function changeDisplayName(name: string) {
  if (auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, { displayName: name });
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("No user signed In");
  }
}
