import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import { auth, ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";

interface AuthState {
  userLogged: boolean;
  firebaseActiveUser: { email: string | null; uid: string | null } | null;
  profileData: { displayName: string | null; email: string | null };
  authListenerInitialized: boolean;
}
const initialState: AuthState = {
  userLogged: false,
  firebaseActiveUser: null,
  profileData: { displayName: null, email: null },
  authListenerInitialized: false,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLogged: (state, action: PayloadAction<boolean>) => {
      state.userLogged = action.payload;
    },
    setFirebaseActiveUser: (state, action: PayloadAction<{ email: string | null; uid: string } | null>) => {
      state.firebaseActiveUser = action.payload;
    },
    setProfileData: (state, action: PayloadAction<{ displayName: string | null; email: string | null }>) => {
      state.profileData = action.payload;
    },
    setAuthListenerInitialized: (state, action: PayloadAction<boolean>) => {
      state.authListenerInitialized = action.payload;
    },
  },
});

export const initializeAuthListener = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const { auth: authState } = getState();

  if (authState.authListenerInitialized) return;

  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch(setUserLogged(true));
      dispatch(setFirebaseActiveUser({ email: user.email, uid: user.uid }));
      dispatch(setProfileData({ displayName: user.displayName, email: user.email }));
    } else {
      dispatch(setUserLogged(false));
      dispatch(setFirebaseActiveUser(null));
      dispatch(setProfileData({ displayName: null, email: null }));
    }
    dispatch(setAuthListenerInitialized(true));
  });

  auth.onIdTokenChanged(async (user) => {
    if (user) {
      const token = await user.getIdToken();
      document.cookie = `${ID_TOKEN_COOKIE_NAME}=${token};path=/`;
    }
  });
};

export const { setUserLogged, setFirebaseActiveUser, setProfileData, setAuthListenerInitialized } = authSlice.actions;
export default authSlice.reducer;
