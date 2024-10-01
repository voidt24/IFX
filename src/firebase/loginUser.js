import { auth } from "./firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

export const loginUser = async (user) => {
    const result = await signInWithEmailAndPassword(auth, user.email, user.password);
    return result
};