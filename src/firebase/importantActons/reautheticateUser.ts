import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "../firebase.config";

export default async function reauthenticateUser(userData: { email: string; password: string }) {
  if (auth.currentUser) {
    try {
      const credential = EmailAuthProvider.credential(userData.email, userData.password);
      return await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("No user signed In");
  }
}
