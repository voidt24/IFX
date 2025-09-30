import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import listsManagementReducer from "./slices/listsManagementSlice";
import searchReducer from "./slices/searchSlice";
import mediaDetailsReducer from "./slices/mediaDetailsSlice";
import paginationReducer from "./slices/paginationSlice";
import UIReducer from "./slices/UISlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listsManagement: listsManagementReducer,
    search: searchReducer,
    mediaDetails: mediaDetailsReducer,
    pagination: paginationReducer,
    ui: UIReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
