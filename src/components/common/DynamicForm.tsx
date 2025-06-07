import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Error from "./Error";
import Input from "./Input";
import { CircularProgress } from "@mui/material";

interface IDynamicForm {
  fieldsToAdd: {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
  }[];
  onSubmitHandler: () => Promise<void>;
  errorMessage: { active: boolean; text: string };
  setErrorMessage: Dispatch<SetStateAction<{ active: boolean; text: string }>>;
}

export default function DynamicForm({ fieldsToAdd, onSubmitHandler, errorMessage, setErrorMessage }: IDynamicForm) {
  const [loadingAuth, setLoadingAuth] = useState(false);

  useEffect(() => {
    return () => {
      setErrorMessage({ active: false, text: "" });
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try {
          setLoadingAuth(true);
          onSubmitHandler();
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingAuth(false);
        }
      }}
      className="auth-form gap-6 w-full sm:w-[80%] xl:w-[85%] 2xl:w-[65%] 4:w-[55%] flex-col-center p-1"
    >
      {fieldsToAdd.map((input, index) => {
        return (
          <label htmlFor="" key={index} className="w-full flex flex-col items-start gap-1 ">
            {input.label}
            <Input type={input.type} placeholder={input.placeholder} value={input.value || ""} onChange={input.onChange} hasPassword={input.type == "password" ? true : false} />
          </label>
        );
      })}
      {errorMessage.active && <Error errorMessage={errorMessage} />}

      <button className={`btn-primary w-full ${loadingAuth ? "btn-secondary cursor-wait " : ""}`} type="submit" onClick={() => {}}>
        {loadingAuth ? (
          <span className="flex gap-1 items-center justify-center">
            <CircularProgress size={15} color="primary" />
            <p>Loading...</p>
          </span>
        ) : (
          "Confirm"
        )}
      </button>
    </form>
  );
}
