"use client";
import { ReactNode, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "./index";
import { initializeAuthListener } from "./slices/authSlice";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { usePathname } from "next/navigation";
import { setCurrentMediaType } from "./slices/mediaDetailsSlice";
import Modal from "@/components/common/Modal";
import AuthForm from "@/components/AuthForm";
import { setAuthModalActive } from "@/store/slices/UISlice";
import LoadingScreen from "@/components/common/Loaders/LoadingScreen";

export function AuthListener() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthListener());
  }, []);
  return null;
}
export function ParamsListener() {
  const path = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    const mediaTypeFromUrl = setMedia(path);
    if (isValidMediatype(mediaTypeFromUrl)) {
      dispatch(setCurrentMediaType(mediaTypeFromUrl));
    } else {
      dispatch(setCurrentMediaType("movies"));
    }
  }, [path]);
  return null;
}
export function GlobalOverlays() {
  const { loadingScreen, authModalActive } = useSelector((state: RootState) => state.ui);
  const dispatch = useDispatch();
  return (
    <>
      {loadingScreen && <LoadingScreen />}

      <Modal
        modalActive={authModalActive}
        setModalActive={(value) => {
          dispatch(setAuthModalActive(value));
        }}
      >
        <AuthForm />
      </Modal>
    </>
  );
}
export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthListener />
      <ParamsListener />
      {children}
      <GlobalOverlays />
    </Provider>
  );
}
