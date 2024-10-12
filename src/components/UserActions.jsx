"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";
import AuthForm from "@/components/AuthForm";
import { auth } from "../firebase/firebase.config";

export default function UserActions() {
  const { setUserClicked, userLogged, setUserLogged, setFirebaseActiveUser } = useContext(Context);
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });

  const handleLogout = async () => {
    auth.signOut().then(() => {
      setUserLogged(false);
      setUserData({ username: "", email: "", password: "" });
      setFirebaseActiveUser({ email: null, uid: null });
      setErrorMessage({ active: false, text: "" });
      setUserClicked(false);
    });
  };
  return userLogged ? (
    <>
      <Link
        href={"/profile"}
        onClick={() => {
          setUserClicked(false);
        }}
      >
        <i className="bi bi-person"></i> Profile{" "}
      </Link>
      <Link href={""} onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i> Log out
      </Link>
    </>
  ) : (
    <AuthForm />
  );
}
