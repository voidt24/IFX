"use client";
import { ReactNode, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./index";
import { initializeAuthListener } from "./slices/authSlice";

export function AuthListener() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthListener());
  }, []);
  return null;
}
export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthListener />
      {children}
    </Provider>
  );
}
