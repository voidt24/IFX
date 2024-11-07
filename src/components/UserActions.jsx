"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";
import AuthForm from "@/components/AuthForm";
import { auth } from "../firebase/firebase.config";
import { useRouter } from "next/navigation";
import { on } from "events";

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

  const userLoggedActions = [
    {
      name: "Lists",
      href: "/lists",
      icon: <i className="bi bi-person-lines-fill"></i>,
      actionFunction: setAuthModalActive,
    },
    {
      name: "Log out",
      href: null,
      icon: <i className="bi bi-box-arrow-left"></i>,
      actionFunction: handleLogout,
    },
  ];

  return userLogged ? (
    <div className="flex flex-col items-start gap-2">
      {userLoggedActions.map((action, index) => {
        const { name, href, icon, actionFunction } = action;
        return (
          <Link
            key={index}
            href={href || ""}
            onClick={() => {
              actionFunction(name == "Lists" ? false : undefined);
            }}
          >
            {icon} {name}
          </Link>
        );
      })}
    </div>
  ) : (
    <AuthForm />
  );
}
