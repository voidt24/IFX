import { useState, useContext } from "react";
import { Context } from "@/context/Context";
import { createUser } from "../firebase/createUser";
import { authHandler } from "../firebase/authHandler";
import { loginUser } from "../firebase/loginUser";
import { authErrors, database } from "../firebase/firebase.config";
import Error from "./common/Error";
import { CircularProgress } from "@mui/material";
import Input from "./common/Input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { banners } from "@/helpers/banners/banners-sources";

export default function AuthForm() {
  const { setLoadingScreen, setAuthModalActive, setUserLogged, noAccount, setNoAccount, setFirebaseActiveUser } = useContext(Context);
  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });
  const [loadingAuth, setLoadingAuth] = useState(false);

  const authInputFields = [
    {
      label: "Email",
      type: "email",
      placeholder: "email@example.com",
      value: userData.email || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, email: e.target.value }),
    },
    {
      label: "Password",
      type: "password",
      placeholder: "Password",
      value: userData.password || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, password: e.target.value }),
    },
  ];

  const handleSubmit = async () => {
    const methodToUseForAuth = noAccount ? createUser : loginUser;
    let resultFromAuth;
    setLoadingAuth(true);

    try {
      resultFromAuth = await authHandler(methodToUseForAuth, userData);
      setFirebaseActiveUser({ email: resultFromAuth.user.email, uid: resultFromAuth.user.uid });
      setUserLogged(true);
      setAuthModalActive(false);
      setErrorMessage({ active: false, text: "" });
      setUserData({ username: "", email: "", password: "" });
      setLoadingScreen(true);

      if (methodToUseForAuth == createUser) {
        try {
          const document = doc(database, `users/${resultFromAuth.user.uid}`);
          const documentResult = await getDoc(document);

          if (documentResult.exists()) {
          } else {
            await setDoc(document, {
              createdAt: resultFromAuth.user.metadata.creationTime,
              name: resultFromAuth.user.displayName,
              email: resultFromAuth.user.email,
              uid: resultFromAuth.user.uid,
              banner: banners[0].src,
            });
          }
        } catch (error) {}
      }

      setTimeout(() => {
        setLoadingScreen(false);
      }, 1000);
    } catch (error) {
      setErrorMessage({ active: true, text: authErrors(error) });
    } finally {
      setLoadingAuth(false);
    }
  };

  return (
    <>
      <h2 className="font-semibold text-2xl">{noAccount ? "Sign up" : "Login"} </h2>
      <form
        className="auth-form flex-col-center gap-6 w-full sm:w-[80%] xl:w-[85%] 2xl:w-[65%] 4:w-[55%] "
        onSubmit={(evt) => {
          evt.preventDefault();
          handleSubmit();
        }}
      >
        {authInputFields.map((input, index) => {
          return (
            <label htmlFor={index.toString()} key={index} className="w-full text-left">
              <p className="mb-2">{input.label}</p>
              <Input
                id={index.toString()}
                type={input.type}
                placeholder={input.placeholder}
                value={input.value || ""}
                onChange={input.onChange}
                hasPassword={input.type == "password" ? true : false}
              />
            </label>
          );
        })}

        {errorMessage.active && <Error errorMessage={errorMessage} />}

        <button
          className={`btn-primary  hover:bg-brand-hover  w-full py-3 ${loadingAuth && "btn-secondary cursor-wait "}`}
          type="submit"
          onClick={() => {}}
        >
          {loadingAuth ? (
            <span className="flex gap-1 items-center justify-center">
              <CircularProgress size={15} color="primary" />
              <p>Loading...</p>
            </span>
          ) : noAccount ? (
            "Create account"
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p data-testid="accountText">
        {noAccount ? "Already have an account? " : "Dont have an account? "}
        <button
          data-testid="changeText"
          className=" border-none mt-2 text-brand-primary hover:text-brand-hover hover:underline "
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
