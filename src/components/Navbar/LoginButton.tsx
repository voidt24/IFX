import { Context } from "@/context/Context";
import { useContext } from "react";

function LoginButton() {
  const { authModalActive, setAuthModalActive, setNoAccount } = useContext(Context);

  return (
    <button
      className=" btn-primary px-2.5 py-1 shadow-none "
      onClick={() => {
        setNoAccount(false);
        setAuthModalActive(!authModalActive);
      }}
    >
      <p className="font-semibold">Log in</p>
    </button>
  );
}

export default LoginButton;
