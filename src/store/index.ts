import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import listsManagementReducer from "./slices/listsManagementSlice"
import searchReducer from "./slices/searchSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        listsManagement: listsManagementReducer,
        search: searchReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;