import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    userLogged: boolean,
    firebaseActiveUser:{email: string | null, uid:string | null}
    profileData:{displayName: string | null, email:string | null}
}
const initialState: AuthState = {
    userLogged: false,
    firebaseActiveUser:{email: null, uid:null},
    profileData:{displayName: null, email:null}
}
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setUserLogged: (state,action: PayloadAction<boolean>)=>{
            state.userLogged  = action.payload
        },
        setFirebaseActiveUser: (state, action: PayloadAction<{email: string | null, uid:string | null}>)=>{
            state.firebaseActiveUser = action.payload
        },
        setProfileData: (state, action: PayloadAction<{displayName:string | null, email:string |null}>)=>{
            state.profileData = action.payload
        }
    }
})

export const {setUserLogged,setFirebaseActiveUser,setProfileData} = authSlice.actions
export default authSlice.reducer