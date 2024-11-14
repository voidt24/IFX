import { useState, useContext, useRef } from "react";
import { Context } from "@/context/Context";
import { createUser } from "../firebase/createUser";
import { authHandler } from "../firebase/authHandler";
import { loginUser } from "../firebase/loginUser";
import { authErrors } from "../firebase/firebase.config";
import Error from "./common/Error";

export default function AuthForm() {
  const { setAuthModalActive, setUserLogged, noAccount, setNoAccount, setFirebaseActiveUser } = useContext(Context);
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });
  const pwdInputRef = useRef(null);
  const [pwdInputType, setPwdInputType] = useState("password");

  function setAppForActiveUser(user) {
    setFirebaseActiveUser({ email: user.user.email, uid: user.user.uid });
    setUserLogged(true);
    setAuthModalActive(false);
    setErrorMessage({ active: false, text: "" });
    setUserData({ username: "", email: "", password: "" });
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    let methodToUseForAuth = noAccount ? createUser : loginUser;
    let resultFromAuth;

    try {
      resultFromAuth = await authHandler(methodToUseForAuth, userData);
      setAppForActiveUser(resultFromAuth);
    } catch (error) {
      setErrorMessage({ active: true, text: authErrors(error) });
    }
  };

  return (
    <>
      {noAccount ? <h2 className="bold text-xl">Sign up</h2> : <h2 className="bold text-xl">Login</h2>}
      <form onSubmit={(e) => handleSubmit(e)} className="auth-form gap-6 w-full sm:w-[80%] xl:w-[85%] 2xl:w-[65%] 4:w-[55%]">
        <label htmlFor="">
          Email
          <span className="mt-2 flex items-center justify-center bg-zinc-900 relative rounded-full ">
            <input
              onFocus={(e) => {
                e.target.parentElement.style.border = "2px solid gray";
              }}
              onBlur={(e) => {
                e.target.parentElement.style.border = "none";
              }}
              className="text-white bg-zinc-900 border-none w-[88.5%]  pr-2 py-2.5 text-[80%] !pl-0"
              type="Email"
              onChange={(e) => {
                setUserData({ ...userData, email: e.target.value });
              }}
              required
              placeholder="email@example.com"
            />
          </span>
        </label>

        <label htmlFor="">
          Password
          <span className="mt-2 flex items-center justify-center bg-zinc-900 relative rounded-full">
            <input
              onFocus={(e) => {
                e.target.parentElement.style.border = "2px solid gray";
              }}
              onBlur={(e) => {
                e.target.parentElement.style.border = "none";
              }}
              className="text-white bg-zinc-900 border-none w-[88.5%]  pr-2 py-2.5 text-[80%]"
              type={pwdInputType}
              onChange={(e) => {
                setUserData({ ...userData, password: e.target.value });
              }}
              ref={pwdInputRef}
              required
              placeholder="Password"
            />
            <button
              type="button"
              className={"bg-none  hover:bg-transparent bg-transparent border-0"}
              onClick={() => {
                if (pwdInputRef.current.type == "text") {
                  pwdInputRef.current.type = "password";
                  setPwdInputType("password");
                } else {
                  setPwdInputType("text");
                }
              }}
            >
              <i className={`bi bi-eye-fill  cursor-pointer ${pwdInputType == "password" ? "text-zinc-300" : "text-[var(--primary)]"} `}></i>
            </button>
          </span>
        </label>

        {errorMessage.active && <Error errorMessage={errorMessage} />}

        <button className="rounded-3xl w-full bg-white/90 text-black hover:bg-white" type="submit">
          {noAccount ? "Create account" : "Login"}
        </button>
      </form>

      <p>
        {noAccount ? "Already have an account? " : "Dont have an account? "}
        <button
          className=" border-none  mt-2 p-0 text-[var(--primary)] hover:bg-transparent hover:underline"
          onClick={() => {
            noAccount ? setNoAccount(false) : setNoAccount(true);

            setErrorMessage({ active: false, text: "" });
          }}
        >
          {noAccount ? "Login" : "Create account"}
        </button>
      </p>
    </>
  );
}
