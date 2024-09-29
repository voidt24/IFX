"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { Context } from "@/context/Context";
import Error from "../components/Error";

const AuthModal = () => {
  const { userClicked, setUserClicked, setUserLogged, noAccount, setNoAccount, setFirebaseActiveUser } = useContext(Context);

  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });

  const handleSubmit = async (evt) => {
    evt.preventDefault();
  };

  return userClicked ? (
    <>
      <div className={`flex fixed z-30 h-screen w-full top-0 left-0 p-10 flex-col justify-center items-center `}>
        <div
          className="overlay bg-black opacity-85 absolute left-0 top-0 w-full h-full"
          onClick={() => {
            setUserClicked(false);
          }}
        ></div>

        <div className="user-options bg-black text-white z-30 border border-gray-600">
          <button
            onClick={() => {
              setUserClicked(false);
            }}
            type="button"
            className="border-none  rounded-lg  w-6 h-6 hover:text-[var(--primary)]"
          >
            <i className="bi bi-x-circle"></i>
          </button>
          {false ? (
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
              {noAccount ? "Sign up" : "Login"}
              <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="">Email</label>
                <input
                  className="text-black"
                  type="Email"
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                  }}
                  required
                />

                <label htmlFor="">Password</label>
                <input
                  className="text-black"
                  type="password"
                  onChange={(e) => {
                    setUserData({ ...userData, password: e.target.value });
                  }}
                  required
                />

                {errorMessage.active && <Error errorMessage={errorMessage} />}

                <button className="rounded-3xl w-full" type="submit">
                  {noAccount ? "Create account" : "Login"}
                </button>
              </form>
              {noAccount ? (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setNoAccount(false);
                      setErrorMessage({ active: false, text: "" });
                    }}
                    className="opt border-none hover:bg-black"
                  >
                    Login
                  </button>
                </p>
              ) : (
                <p>
                  {" "}
                  Dont have an account?{" "}
                  <button
                    onClick={() => {
                      setNoAccount(true);
                      setErrorMessage({ active: false, text: "" });
                    }}
                    className="opt border-none hover:bg-black"
                  >
                    Create account
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  ) : null;
};

export default AuthModal;
