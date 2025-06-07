import React, { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import DynamicForm from "./DynamicForm";

interface props {
  children?: React.ReactNode;
  title: string;
  fieldsToAdd: {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }[];
  modalActive: boolean;
  setModalActive: Dispatch<SetStateAction<boolean>>;
  onSubmitHandler: () => Promise<void>;
  errorMessage: { active: boolean; text: string };
  setErrorMessage: Dispatch<SetStateAction<{ active: boolean; text: string }>>;
}

export default function UserActionModal({ children, title, fieldsToAdd, modalActive, setModalActive, onSubmitHandler, errorMessage, setErrorMessage }: props) {

  return (
    <Modal modalActive={modalActive} setModalActive={setModalActive}>
      <>
        <h2 className=" mb-4 font-semibold text-2xl">{title}</h2>
        {children}
        <DynamicForm fieldsToAdd={fieldsToAdd} onSubmitHandler={onSubmitHandler} errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
      </>
    </Modal>
  );
}
