"use client";
import { useContext, useRef, useState } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";
import Error from "../components/Error";

import { createUser } from "../firebase/createUser";
import { loginUser } from "../firebase/loginUser";
import { auth } from "../firebase/firebase.config";
import { useRouter } from "next/navigation";
const AuthModal = () => {
  const router = useRouter();
  const { userClicked, setUserClicked, userLogged, setUserLogged, noAccount, setNoAccount, setFirebaseActiveUser } = useContext(Context);

  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });
  const pwdInputRef = useRef(null);
  const [pwdInputType, setPwdInputType] = useState("password");

  function setAppForActiveUser(user) {
    setFirebaseActiveUser({ email: user.user.email, uid: user.user.uid });
    setUserLogged(true);
    setUserClicked(false);
    setErrorMessage({ active: false, text: "" });
    setUserData({ username: "", email: "", password: "" });
    // navigate("/profile");
    router.push("/profile");
  }
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (noAccount) {
      createUser(userData)
        .then((user) => {
          setAppForActiveUser(user);
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              setErrorMessage({ active: true, text: "That email is already registered" });
              break;
            case "auth/weak-password":
              setErrorMessage({ active: true, text: "password should have at least 6 characters" });
              break;
            default:
              setErrorMessage({ active: true, text: "There was an unexpected error, please trying again." });
          }
        });
    } else {
    }
    loginUser(userData)
      .then((user) => {
        setAppForActiveUser(user);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-credential":
            setErrorMessage({ active: true, text: "incorrect email o password, try again." });
            break;
          case "auth/too-many-requests":
            setErrorMessage({ active: true, text: "Too many invalid requests, wait a couple of minutes before trying again." });
            break;
          default:
            setErrorMessage({ active: true, text: "There was an unexpected error, please trying again." });
        }
        setUserLogged(false);
        setUserClicked(true);
      });
  };

  const handleLogout = async () => {
    auth.signOut().then(() => {
      setUserLogged(false);
      setUserData({ username: "", email: "", password: "" });
      setFirebaseActiveUser({ email: null, uid: null });
      setErrorMessage({ active: false, text: "" });
      setUserClicked(false);
    });
  };
  return userClicked ? (
    <>
      <div className={`flex fixed z-50 h-screen w-full top-0 left-0 p-2 flex-col justify-center items-center `}>
        <div
          className="overlay bg-black opacity-85 absolute left-0 top-0 w-full h-full"
          onClick={() => {
            setUserClicked(false);
          }}
        ></div>

        <div className="user-options bg-black relative flex flex-col gap-3 items-center justify-center text-white z-30 border border-gray-600 p-6 w-full h-2/5  sm:w-3/4 lg:w-3/6 xl:w-1/4">
          <button
            onClick={() => {
              setUserClicked(false);
            }}
            type="button"
            className="border-none  rounded-lg  hover:text-[var(--primary)] absolute top-4 right-4 p-0"
          >
            <i className="bi bi-x-circle text-xl"></i>
          </button>
          {userLogged ? (
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
            <>
              {noAccount ? <h2 className="bold text-xl">Sign up</h2> : <h2 className="bold text-xl">Login</h2>}
              <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="">Email</label>
                <input
                  className="text-black py-0 px-2"
                  type="Email"
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                  }}
                  required
                />

                <label htmlFor="">Password</label>
                <span className="flex bg-white rounded-xl relative">
                  <input
                    className="text-black py-0 px-2 border-none w-[88.5%]"
                    type={pwdInputType}
                    onChange={(e) => {
                      setUserData({ ...userData, password: e.target.value });
                    }}
                    ref={pwdInputRef}
                    required
                  />
                  <i
                    className={`bi bi-eye-fill text-lg ${pwdInputType == "password" ? "text-black" : "text-[var(--primary)]"}  absolute top-0 right-2`}
                    onClick={() => {
                      if (pwdInputRef.current.type == "text") {
                        pwdInputRef.current.type = "password";
                        setPwdInputType("password");
                      } else {
                        setPwdInputType("text");
                      }
                    }}
                  ></i>
                </span>

                {errorMessage.active && <Error errorMessage={errorMessage} />}

                <button className="rounded-3xl w-full" type="submit">
                  {noAccount ? "Create account" : "Login"}
                </button>
              </form>

              <p>
                {noAccount ? "Already have an account? " : "Dont have an account? "}
                <button
                  className=" border-none underline mt-2 p-0 text-[var(--primary)]"
                  onClick={() => {
                    noAccount ? setNoAccount(false) : setNoAccount(true);

                    setErrorMessage({ active: false, text: "" });
                  }}
                >
                  {noAccount ? "Login" : "Create account"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  ) : null;
};

export default AuthModal;
