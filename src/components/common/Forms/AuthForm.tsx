import { useState } from "react";
import { createUser } from "../../../firebase/createUser";
import { authHandler } from "../../../firebase/authHandler";
import { loginUser } from "../../../firebase/loginUser";
import { database } from "../../../firebase/firebase.config";
import Error from "../Error";
import { CircularProgress } from "@mui/material";
import Input from "./Input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { banners } from "@/helpers/banners/banners-sources";
import { getAuthError } from "@/lib/firebase/getAuthError";
import { FirebaseError } from "firebase/app";
import { useDispatch, useSelector } from "react-redux";
import { setFirebaseActiveUser, setUserLogged } from "@/store/slices/authSlice";
import { setLoadingScreen, setAuthModalActive, setNoAccount } from "@/store/slices/UISlice";
import { RootState } from "@/store";
import TestAppButton from "../TestAppButton";

export default function AuthForm() {
  const { noAccount } = useSelector((state: RootState) => state.ui);
  const { testingInitialized } = useSelector((state: RootState) => state.auth);

  const [userData, setUserData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const dispatch = useDispatch();

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
      dispatch(setFirebaseActiveUser({ email: resultFromAuth.user.email, uid: resultFromAuth.user.uid }));
      dispatch(setUserLogged(true));
      dispatch(setAuthModalActive(false));
      setErrorMessage({ active: false, text: "" });
      setUserData({ username: "", email: "", password: "" });
      dispatch(setLoadingScreen(true));

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
        dispatch(setLoadingScreen(false));
      }, 1000);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage({ active: true, text: getAuthError(error) });
      }
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

        <button className={`btn-primary  hover:bg-brand-hover  w-full py-3 ${loadingAuth && "btn-secondary cursor-wait "}`} type="submit" onClick={() => {}}>
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
            noAccount ? dispatch(setNoAccount(false)) : dispatch(setNoAccount(true));

            setErrorMessage({ active: false, text: "" });
          }}
        >
          {noAccount ? "Login" : "Create account"}
        </button>
      </p>

      {/* soon */}
      {/* {!testingInitialized && (
        <>
          <div className="relative flex flex-col items-center justify-center">
            <span className="bg-white absolute  h-px px-24"></span>
            <p className="bg-[#0c0e13] py-2 px-5 rounded-lg z-[2]">or</p>
          </div>

          <TestAppButton />
        </>
      )} */}
    </>
  );
}
