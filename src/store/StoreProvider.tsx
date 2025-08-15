"use client";
import { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./index";
import { initializeAuthListener } from "./slices/authSlice";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { usePathname } from "next/navigation";
import { setCurrentMediaType } from "./slices/mediaDetailsSlice";

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
export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthListener />
      <ParamsListener />
      {children}
    </Provider>
  );
}
