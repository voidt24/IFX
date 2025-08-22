"use client";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "@/context/Context";
import DeleteAccount from "@/firebase/importantActons/DeleteAccount";
import { auth, ID_TOKEN_COOKIE_NAME, VERIFY_EMAIL_ROUTE } from "@/firebase/firebase.config";
import changePassword from "@/firebase/importantActons/changePassword";
import changeEmail from "@/firebase/importantActons/changeEmail";
import changeDisplayName from "@/firebase/importantActons/changeDisplayName";
import UserActionModal from "@/components/common/UserActionModal";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import SettingsSkeleton from "@/components/common/Skeletons/SettingsSkeleton";
import Notification from "@/components/common/Notification";
import useVerifyToken from "@/Hooks/useVerifyToken";
import { APP_NAME } from "@/helpers/api.config";
import { FirebaseError } from "firebase/app";
import { getAuthError } from "@/lib/firebase/getAuthError";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setFirebaseActiveUser, setProfileData } from "@/store/slices/authSlice";

export default function Settings() {
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [pwdModalActive, setPwdModalActive] = useState(false);
  const [emailModalActive, setEmailModalActive] = useState(false);
  const [nameModalActive, setNameModalActive] = useState(false);
  const [loader, setLoader] = useState(true);
  const [password, setPassword] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [name, setName] = useState<string | null>("");
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });
  const router = useRouter();
  const [message, setMessage] = useState<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>({
    message: "",
    severity: "info",
    open: false,
  });
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [showAccountDeletedModal, setShowAccountDeletedModal] = useState(false);

  const authState = useSelector((state: RootState) => state.auth);
  const { profileData } = authState;
  const dispatch = useDispatch();

  useVerifyToken(setLoader);

  useEffect(() => {
    dispatch(setProfileData({ displayName: auth.currentUser?.displayName || null, email: auth.currentUser?.email || null }));
  }, [auth.currentUser?.displayName]);

  const handleChangeDisplayName = async () => {
    if (!name) {
      setErrorMessage({ active: true, text: "Type your name" });
      return;
    }
    if (name.length > 20) {
      setErrorMessage({ active: true, text: "Please type 20 or less characters." });
      return;
    }
    try {
      await changeDisplayName(name);
      setNameModalActive(false);
      setMessage({ message: `Name changed!`, severity: "success", open: true });
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage({ active: true, text: getAuthError(error) });
      }
    }
  };

  const handleChangeEmail = async () => {
    if (!email) {
      setErrorMessage({ active: true, text: "Please enter a valid email address." });
      return;
    }

    if (userData.email == email) {
      setErrorMessage({ active: true, text: "New email should be different as the previous one..." });
      return;
    }
    if (auth.currentUser?.email !== userData.email) {
      setErrorMessage({ active: true, text: "Current email should be the same you used for this login session" });
      return;
    }
    try {
      const emailExists = await fetch(VERIFY_EMAIL_ROUTE, {
        method: "POST",
        body: JSON.stringify(email),
      });
      if (emailExists.ok) {
        setErrorMessage({ active: true, text: "The new email is already associated with another account. " });
      } else {
        await changeEmail(userData, email);
        setEmailModalActive(false);
        setShowVerifyEmailModal(true);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage({ active: true, text: getAuthError(error) });
      }
    }
  };

  const handleChangePassword = async () => {
    if (!userData.email) {
      setErrorMessage({ active: true, text: "Please enter a valid email address." });
      return;
    }
    if (!userData.password) {
      setErrorMessage({ active: true, text: "Type your current password" });
      return;
    }
    if (!password) {
      setErrorMessage({ active: true, text: "Type a new password" });
      return;
    }

    if (userData.password == password) {
      setErrorMessage({ active: true, text: "Passwords should be different..." });
      return;
    }
    try {
      await changePassword(userData, password);
      setPwdModalActive(false);
      setMessage({ message: `Password changed!`, severity: "success", open: true });
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage({ active: true, text: getAuthError(error) });
      }
    }
  };
  const handleDeleteAccount = async () => {
    if (!userData.email) {
      setErrorMessage({ active: true, text: "Please enter a valid email address." });
      return;
    }
    if (auth.currentUser?.email !== userData.email) {
      setErrorMessage({ active: true, text: "Email should be the same you used for this login session" });
      return;
    }
    if (!userData.password) {
      setErrorMessage({ active: true, text: "Type your password" });
      return;
    }
    try {
      await DeleteAccount(userData);
      dispatch(setFirebaseActiveUser({ email: "", uid: "" }));
      setDeleteModalActive(false);
      document.cookie = `${ID_TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      setShowAccountDeletedModal(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage({ active: true, text: getAuthError(error) });
      }
    }
  };

  const changeDisplayNameFields = [
    {
      label: "Name",
      type: "text",
      placeholder: "max. 20 charact.",
      value: name || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    },
  ];
  const changeEmailFields = [
    {
      label: "Current email",
      type: "email",
      placeholder: "current@example.com",
      value: userData.email || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, email: e.target.value }),
    },
    {
      label: "New email",
      type: "email",
      placeholder: "new@example.com",
      value: email || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    },
    {
      label: "Password",
      type: "password",
      placeholder: "Password",
      value: userData.password || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, password: e.target.value }),
    },
  ];

  const changePasswordFields = [
    {
      label: "Email",
      type: "email",
      placeholder: "email@example.com",
      value: userData.email || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, email: e.target.value }),
    },
    {
      label: "Current password",
      type: "password",
      placeholder: "new@example.com",
      value: userData.password || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, password: e.target.value }),
    },
    {
      label: "New Password",
      type: "password",
      placeholder: "Your new password...",
      value: password || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    },
  ];

  const deleteAccountFields = [
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

  if (loader) {
    return <SettingsSkeleton />;
  }

  return (
    <>
      <div>
        {/* General Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Account settings</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between sm:justify-start">
              <button
                className="max-sm:w-full flex justify-between sm:justify-start gap-8"
                onClick={() => {
                  setNameModalActive(!nameModalActive);
                  setName("");
                }}
              >
                <p className="settings-btn text-left">Name &gt;</p>
                <p className="text-content-muted px-4 py-1">{profileData?.displayName}</p>
              </button>
            </div>
            <div className="w-full">
              <button
                className="max-sm:w-full flex justify-between sm:justify-start gap-8"
                onClick={() => {
                  setEmailModalActive(!emailModalActive);
                  setUserData({ email: "", password: "" });
                  setEmail("");
                }}
              >
                <p className="settings-btn text-left">Email address &gt;</p>
                <p className="text-content-muted px-4 py-1">{profileData?.email}</p>
              </button>
            </div>
            <div className="flex justify-start">
              <button
                className="settings-btn text-left"
                onClick={() => {
                  setPwdModalActive(!pwdModalActive);
                  setUserData({ email: "", password: "" });
                  setPassword("");
                }}
              >
                Password &gt;
              </button>
            </div>
          </div>
        </div>
        {/* namemodal */}
        {nameModalActive && (
          <UserActionModal
            title="Change name"
            fieldsToAdd={changeDisplayNameFields}
            modalActive={nameModalActive}
            setModalActive={setNameModalActive}
            onSubmitHandler={handleChangeDisplayName}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
        {/* emailmodal */}
        {emailModalActive && (
          <UserActionModal
            title="Change email"
            fieldsToAdd={changeEmailFields}
            modalActive={emailModalActive}
            setModalActive={setEmailModalActive}
            onSubmitHandler={handleChangeEmail}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {showVerifyEmailModal && (
          <Modal
            modalActive={showVerifyEmailModal}
            setModalActive={(value) => {
              setShowVerifyEmailModal(value);
            }}
          >
            <div className="flex items-center justify-center flex-col gap-4 max-w-full">
              <svg className="w-20 h-20 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
              </svg>

              <h2 className="text-2xl">Verify your email</h2>
              <p className="text-zinc-300">
                We have just sent an email to <span className="text-[var(--primary)]">{email}</span>. <br /> Please follow the link to verify your new email.
              </p>
              <button
                className="btn-primary px-8 mt-4"
                onClick={() => {
                  setShowVerifyEmailModal(false);
                }}
              >
                Got it
              </button>
            </div>
          </Modal>
        )}
        {/* pwd modal */}
        {pwdModalActive && (
          <UserActionModal
            title="Change password"
            fieldsToAdd={changePasswordFields}
            modalActive={pwdModalActive}
            setModalActive={setPwdModalActive}
            onSubmitHandler={handleChangePassword}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {/* Advanced Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Advanced</h2>
          <button
            className="text-red-500 px-4 hover:bg-red-950 rounded-full py-1"
            onClick={() => {
              setDeleteModalActive(true);
              setUserData({ email: "", password: "" });
            }}
          >
            Delete account &gt;
          </button>
        </div>

        {/* delete account  modal */}
        {deleteModalActive && (
          <UserActionModal
            title="Delete account"
            fieldsToAdd={deleteAccountFields}
            modalActive={deleteModalActive}
            setModalActive={setDeleteModalActive}
            onSubmitHandler={handleDeleteAccount}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          >
            <p className="text-left leading-7">
              Once you delete your account, all your data is permanently removed from {APP_NAME}. <br />
              *Deleted accounts are not recoverable.
            </p>
          </UserActionModal>
        )}
        {showAccountDeletedModal && (
          <div className={`flex fixed z-[99999] h-screen w-full top-0 left-0 max-sm:p-6 flex-col justify-center items-center `}>
            <div className="overlay bg-black opacity-95 absolute left-0 top-0 w-full h-full"></div>

            <div className="user-options bg-black relative flex flex-col gap-3 items-center justify-center text-white z-30 border border-white/30 px-6 py-8 w-full  sm:w-3/4 lg:w-3/6 xl:w-1/4">
              <div className="flex items-center justify-center flex-col gap-4 max-w-full">
                <img src="/logo.png" alt="" className="w-[40%] md:w-[25%] xl:w-[35%] 2xl:w-[40%] 4k:w-[175px]" />
                <p className="text-zinc-300">
                  Your account has been successfully deleted. <br /> Thank you for using our app.
                </p>
                <button
                  className="btn-primary px-8 mt-4"
                  onClick={() => {
                    setShowVerifyEmailModal(false);
                    router.push("/");
                  }}
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Notification message={message} setMessage={setMessage} />
    </>
  );
}
