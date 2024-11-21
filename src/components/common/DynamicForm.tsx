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
        setLoadingAuth(true);
        onSubmitHandler();
        setLoadingAuth(false);
      }}
      className="auth-form gap-6 w-full sm:w-[80%] xl:w-[85%] 2xl:w-[65%] 4:w-[55%]"
    >
      {fieldsToAdd.map((input, index) => {
        return (
          <label htmlFor="" key={index}>
            {input.label}
            <Input type={input.type} placeholder={input.placeholder} value={input.value || ""} onChange={input.onChange} hasPassword={input.type == "password" ? true : false} />
          </label>
        );
      })}
      {errorMessage.active && <Error errorMessage={errorMessage} />}

      <button className={`rounded-3xl w-full ${loadingAuth ? "bg-white/20 cursor-wait text-zinc-500" : "bg-white/90 hover:bg-white text-black cursor-pointer"}`} type="submit" onClick={() => {}}>
        {loadingAuth ? (
          <span className="flex gap-1 items-center justify-center">
            <CircularProgress size={15} color="inherit" />
            <p>Loading</p>
          </span>
        ) : (
          "Confirm"
        )}
      </button>
    </form>
  );
}
