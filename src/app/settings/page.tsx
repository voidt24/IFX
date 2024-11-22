"use client";

import React, { useContext, useState } from "react";
import { Context } from "@/context/Context";
import DeleteAccount from "@/firebase/importantActons/DeleteAccount";
import { auth } from "@/firebase/firebase.config";
import { Alert, Snackbar } from "@mui/material";
import changePassword from "@/firebase/importantActons/changePassword";
import changeEmail from "@/firebase/importantActons/changeEmail";
import changeDisplayName from "@/firebase/importantActons/changeDisplayName";
import UserActionModal from "@/components/common/UserActionModal";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";

export default function Settings() {
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [pwdModalActive, setPwdModalActive] = useState(false);
  const [emailModalActive, setEmailModalActive] = useState(false);
  const [nameModalActive, setNameModalActive] = useState(false);
  const { firebaseActiveUser, setFirebaseActiveUser } = useContext(Context);
  const [password, setPassword] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [name, setName] = useState<string | null>("");
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({ active: false, text: "" });
  const router = useRouter();
  const [message, setMessage] = useState<{ message: string | undefined; severity: "error" | "info" | "success" | "warning"; open: boolean }>({ message: "null", severity: "info", open: false });
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);

  const handleChangeDisplayName = async () => {
    if (!name) {
      setErrorMessage({ active: true, text: "Type your name" });
      return;
    }

    if (name.length > 20) {
      setErrorMessage({ active: true, text: "Please type less than 21 characters." });
      return;
    }
    try {
      await changeDisplayName(name);
      setNameModalActive(false);
      setMessage({ message: `Name changed!`, severity: "success", open: true });
    } catch (error) {
      setErrorMessage({ active: true, text: `Error executing action: ${error}` });
    }
  };

  const handleChangeEmail = async () => {
    if (!email) return;

    if (userData.email == email) {
      setErrorMessage({ active: true, text: "New email should be different as the previous one..." });

      return;
    }
    try {
      await changeEmail(userData, email);
      setEmailModalActive(false);
      setShowVerifyEmailModal(true);
    } catch (error) {
      setErrorMessage({ active: true, text: `Error executing action: ${error}` });
    }
  };

  const handleChangePassword = async () => {
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
      setErrorMessage({ active: true, text: `Error executing action: ${error}` });
    }
  };
  const handleDeleteAccount = async () => {
    try {
      await DeleteAccount(userData);
      setFirebaseActiveUser({ email: "", uid: "" });
      setDeleteModalActive(false);
      router.push("/");
      setMessage({ message: `Account deleted!`, severity: "success", open: true });
    } catch (error) {
      setErrorMessage({ active: true, text: `Error executing action: ${error}` });
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

  return (
    <div className=" sm:mt-20 text-white  pb-10 py-10  mx-auto md:w-[90%] xl:w-[80%] 4k:w-[60%] max-w-full max-md:px-4">
      <h1 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-4">Settings</h1>

      {/* Settings Content */}
      <div>
        {/* General Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <button
                className="text-gray-300 px-4 hover:bg-zinc-700 rounded-full py-1"
                onClick={() => {
                  setNameModalActive(!nameModalActive);
                  setName("");
                }}
              >
                Name &gt;
              </button>
            </div>
            <div className="flex justify-between">
              <button
                className="text-gray-300 px-4 hover:bg-zinc-700 rounded-full py-1"
                onClick={() => {
                  setEmailModalActive(!emailModalActive);
                  setUserData({ email: "", password: "" });
                  setEmail("");
                }}
              >
                Email address &gt;
              </button>
            </div>
            <div className="flex justify-between">
              <button
                className="text-gray-300 px-4 hover:bg-zinc-700 rounded-full py-1"
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
          <Modal modalActive={showVerifyEmailModal} setModalActive={setShowVerifyEmailModal}>
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
              Once you delete your account, all your data is permanently removed from Prods. <br />
              *Deleted accounts are not recoverable.
            </p>
          </UserActionModal>
        )}
      </div>

      <Snackbar
        open={message?.open}
        autoHideDuration={3500}
        onClose={() => {
          setMessage({ ...message, open: false });
        }}
      >
        <Alert
          onClose={() => {
            setMessage({ ...message, open: false });
          }}
          severity={message.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
