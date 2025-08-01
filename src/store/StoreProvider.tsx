"use client";
import { ReactNode, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "./index";
import { initializeAuthListener } from "./slices/authSlice";
import isValidMediatype, { setMedia } from "@/helpers/isvalidMediatype";
import { useParams, usePathname } from "next/navigation";
import { setCurrentId, setCurrentMediaType } from "./slices/mediaDetailsSlice";

export function AuthListener() {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuthListener());
  }, []);
  return null;
}
export function ParamsListener() {
  const path = usePathname();
  const { id: idFromUrl } = useParams();

  const { currentId } = useSelector((state: RootState) => state.mediaDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Number(idFromUrl) != currentId && currentId == undefined) {
      dispatch(setCurrentId(Number(idFromUrl)));
    }
  }, [idFromUrl]);

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
