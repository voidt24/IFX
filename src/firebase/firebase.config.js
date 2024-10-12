// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
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
    case "auth/invalid-credential":
      return "Invalid credentials";

    case "auth/email-already-in-use":
      return "That email is already registered";
      
    case "auth/weak-password":
      return "password should have at least 6 characters";

    case "auth/too-many-requests":
      return "account temporarily disabled due to many failed login attempts, try again later";

    default:
      return "There was an unexpected error, please trying again.";
  }
};
