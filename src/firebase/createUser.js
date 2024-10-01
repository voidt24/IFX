import { auth } from "./firebase.config";
import {createUserWithEmailAndPassword } from "firebase/auth";

export const createUser = async (user) => {
    const result = await createUserWithEmailAndPassword(auth, user.email, user.password);
    return result //returns object with user data
};