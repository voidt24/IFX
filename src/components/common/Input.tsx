import React, { useRef, useState } from "react";

interface inputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  hasPassword?: boolean;
}

export default function Input({ type, placeholder, value, onChange, hasPassword }: inputProps) {
  const [passwordType, setPasswordType] = useState<"password" | "text">("password");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <span className={`mt-2 flex items-center justify-center bg-zinc-900 relative rounded-full focus-within:border focus-within:border-blue-500 ${hasPassword ? "pr-2" : ""} `}>
      <input
        ref={inputRef}
        className={`text-white bg-zinc-900 w-[88.5%] py-2.5 lg:text-[80%] ${hasPassword ? "px-2" : ""}`}
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
