import React, { useRef, useState } from "react";

interface inputProps {
  id?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  hasPassword?: boolean;
  customClasses?: string;
}

export default function Input({ id, type, placeholder, value, onChange, hasPassword, customClasses }: inputProps) {
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <span className={`flex items-center justify-center bg-zinc-900 relative rounded-full focus-within:border focus-within:border-blue-500 lg:text-[80%] ${hasPassword ? "pr-2" : ""} ${customClasses}`}>
      <input
        id={id}
        ref={inputRef}
        className={`outline-none text-white bg-zinc-900 w-[88.5%] py-2.5  ${hasPassword ? "px-2" : ""} placeholder:text-gray-500 max-sm:placeholder:text-[85%]`}
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
