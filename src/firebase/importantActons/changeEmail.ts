import { updateEmail, verifyBeforeUpdateEmail } from "firebase/auth";
import { auth } from "../firebase.config";
import reauthenticateUser from "./reautheticateUser";

export default async function changeEmail( userData: { email: string; password: string }, email: string) {
  if (auth.currentUser) {
    try {
      await reauthenticateUser(userData);

      await verifyBeforeUpdateEmail(auth.currentUser, email);
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("No user signed In");
  }
}
