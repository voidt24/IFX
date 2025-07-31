import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import listsManagementReducer from "./slices/listsManagementSlice"
export const store = configureStore({
    reducer: {
        auth: authReducer,
        listsManagement: listsManagementReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;