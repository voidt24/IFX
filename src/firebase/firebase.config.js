// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
export const ID_TOKEN_COOKIE_NAME = "prods_firebase_idtoken";
export const VERIFY_TOKEN_ROUTE = `https://ifxtv.vercel.app/api/auth/verifyToken/`;
export const VERIFY_EMAIL_ROUTE = `https://ifxtv.vercel.app/api/account/verifyEmailExistence/`;
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "new-productions.firebaseapp.com",
  projectId: "new-productions",
  storageBucket: "new-productions.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const usersCollectionName = "users";

export const authErrors = (error) => {
  switch (error.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/missing-password":
      return "Please enter a valid password.";

    case "auth/invalid-credential":
      return "The email or password you entered is incorrect. Please try again.";

    case "auth/email-already-in-use":
      return "The email is already associated with another account.";

    case "auth/weak-password":
      return "Your password must be at least 6 characters long";

    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again in a couple of minutes.";

    case "auth/user-mismatch":
      return "Current email should be the same you used for this login session";

    default:
      return "An unexpected error occurred. Please try again later.";
      
  }
};

export const DBLists = {
  favs: "favorites",
  watchs: "watchlist",
};
