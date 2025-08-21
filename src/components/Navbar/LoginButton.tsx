import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { setAuthModalActive, setNoAccount } from "@/store/slices/UISlice";

function LoginButton() {
  const { authModalActive } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();

  return (
    <button
      className=" btn-primary px-2.5 py-1 shadow-none "
      onClick={() => {
        dispatch(setNoAccount(false));
        dispatch(setAuthModalActive(!authModalActive));
      }}
    >
      <p className="font-semibold">Log in</p>
    </button>
  );
}

export default LoginButton;
