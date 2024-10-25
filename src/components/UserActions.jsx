"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";
import AuthForm from "@/components/AuthForm";
import { auth } from "../firebase/firebase.config";
import { useRouter } from "next/navigation";

export default function UserActions() {
  const { setAuthModalActive, userLogged, setUserLogged, setFirebaseActiveUser } = useContext(Context);
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });

  const router = useRouter();

  const handleLogout = async () => {
    auth.signOut().then(() => {
      setUserLogged(false);
      setUserData({ username: "", email: "", password: "" });
      setFirebaseActiveUser({ email: null, uid: null });
      setErrorMessage({ active: false, text: "" });
      setAuthModalActive(false);
      router.push("/movies");
    });
  };
  return userLogged ? (
    <div className="flex flex-col items-start gap-2">
      <Link
        href={"/lists"}
        onClick={() => {
          setAuthModalActive(false);
        }}
      >
        <i className="bi bi-person"></i> Lists{" "}
      </Link>
      <Link href={""} onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i> Log out
      </Link>
    </div>
  ) : (
    <AuthForm />
  );
}
