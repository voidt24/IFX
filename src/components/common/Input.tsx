import { Context } from "@/context/Context";
import React, { useContext, useEffect, useRef, useState } from "react";

interface inputProps {
  id?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  hasPassword?: boolean;
  customClassesForWrapper?: string;
  customClassesForInput?: string;
}

export default function Input({ id, type, placeholder, value, onChange, hasPassword, customClassesForWrapper, customClassesForInput }: inputProps) {
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");
  const inputRef = useRef<HTMLInputElement>(null);
  const { showSearchBar, openSearchDrawer } = useContext(Context);
  
  useEffect(() => {
    if (showSearchBar || openSearchDrawer) {
      inputRef.current?.focus();
    }
  }, [inputRef, showSearchBar, openSearchDrawer]);

  return (
    <span className={`w-full flex-row-center bg-white/5 relative rounded-full focus-within:border focus-within:border-blue-500 lg:text-[80%] ${hasPassword ? "pr-2" : ""} ${customClassesForWrapper}`}>
      <input
        id={id}
        ref={inputRef}
        className={`outline-none text-white bg-transparent w-[88.5%] py-2.5  ${hasPassword ? "px-2" : ""} placeholder:text-gray-500 max-sm:placeholder:text-[85%] ${customClassesForInput}`}
        type={type === "password" ? passwordType : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      {type === "password" && (
        <button
          title="pwd"
          type="button"
          className={"bg-none hover:bg-transparent bg-transparent border-0"}
          onClick={() => {
            setPasswordType(passwordType === "password" ? "text" : "password");
          }}
        >
          <i className={`bi bi-eye-fill cursor-pointer ${passwordType == "password" ? "text-zinc-300" : "text-[var(--primary)]"} `}></i>
        </button>
      )}
    </span>
  );
}
