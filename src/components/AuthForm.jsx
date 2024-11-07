import { useState, useContext, useRef } from "react";
import { Context } from "@/context/Context";
import { createUser } from "../firebase/createUser";
import { authHandler } from "../firebase/authHandler";
import { loginUser } from "../firebase/loginUser";
import { authErrors } from "../firebase/firebase.config";
import Error from "@/components/Error";

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
      <form onSubmit={(e) => handleSubmit(e)} className="auth-form">
        <label htmlFor="">Email</label>
        <input
          className=" text-black  px-2"
          type="Email"
          onChange={(e) => {
            setUserData({ ...userData, email: e.target.value });
          }}
          required
        />

        <label htmlFor="">Password</label>
        <span className="flex items-center justify-center bg-white rounded-xl relative">
          <input
            className="text-black  border-none w-[88.5%] px-2"
            type={pwdInputType}
            onChange={(e) => {
              setUserData({ ...userData, password: e.target.value });
            }}
            ref={pwdInputRef}
            required
          />
          <button
            type="button"
            className={"bg-none absolute top-0 right-2 p-0 hover:bg-transparent bg-transparent border-0"}
            onClick={() => {
              if (pwdInputRef.current.type == "text") {
                pwdInputRef.current.type = "password";
                setPwdInputType("password");
              } else {
                setPwdInputType("text");
              }
            }}
          >
            <i className={`bi bi-eye-fill  cursor-pointer ${pwdInputType == "password" ? "text-black" : "text-[var(--primary)]"} `}></i>
          </button>
        </span>

        {errorMessage.active && <Error errorMessage={errorMessage} />}

        <button className="rounded-3xl w-full bg-gray-800 hover:bg-gray-700" type="submit">
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
