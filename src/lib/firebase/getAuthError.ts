import { FirebaseError } from "firebase/app";
import { authErrorMessages } from "../constants/authErrorMessages.ts";

export const getAuthError = (error: FirebaseError) => {
  return authErrorMessages[error.code] ||  "An unexpected error occurred. Please try again later."
};