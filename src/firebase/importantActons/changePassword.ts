import { updatePassword } from "firebase/auth";
import { auth } from "../firebase.config";
import reauthenticateUser from "./reautheticateUser";

export default async function changePassword(userData: { email: string; password: string }, password: string) {
  if (auth.currentUser) {
    try {
      await reauthenticateUser(userData);

      await updatePassword(auth.currentUser, password);
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("No user signed In");
  }
}
