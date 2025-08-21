import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UISliceState {
  noAccount: boolean;
  authModalActive: boolean;
  seasonModal: boolean;
  showSearchBar: boolean;
  userMenuActive: boolean;
  containerMargin: number;
  openMediaDetailsSheet: boolean;
  openDisplayMediaSheet: boolean;
  openSearchDrawer: boolean;
  openUserDrawer: boolean;
  loadingScreen: boolean;
}

const initialState: UISliceState = {
  noAccount: false,
  authModalActive: false,
  seasonModal: false,
  showSearchBar: false,
  userMenuActive: false,
  containerMargin: 0,
  openMediaDetailsSheet: false,
  openDisplayMediaSheet: false,
  openSearchDrawer: false,
  openUserDrawer: false,
  loadingScreen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setNoAccount: (state, action: PayloadAction<boolean>) => {
      state.noAccount = action.payload;
    },
    setAuthModalActive: (state, action: PayloadAction<boolean>) => {
      state.authModalActive = action.payload;
    },
    setSeasonModal: (state, action: PayloadAction<boolean>) => {
      state.seasonModal = action.payload;
    },
    setShowSearchBar: (state, action: PayloadAction<boolean>) => {
      state.showSearchBar = action.payload;
    },
    setUserMenuActive: (state, action: PayloadAction<boolean>) => {
      state.userMenuActive = action.payload;
    },
    setContainerMargin: (state, action: PayloadAction<number>) => {
      state.containerMargin = action.payload;
    },
    setOpenMediaDetailsSheet: (state, action: PayloadAction<boolean>) => {
      state.openMediaDetailsSheet = action.payload;
    },
    setOpenDisplayMediaSheet: (state, action: PayloadAction<boolean>) => {
      state.openDisplayMediaSheet = action.payload;
    },
    setOpenSearchDrawer: (state, action: PayloadAction<boolean>) => {
      state.openSearchDrawer = action.payload;
    },
    setOpenUserDrawer: (state, action: PayloadAction<boolean>) => {
      state.openUserDrawer = action.payload;
    },
    setLoadingScreen: (state, action: PayloadAction<boolean>) => {
      state.loadingScreen = action.payload;
    },
  },
});

export const {
  setNoAccount,
  setAuthModalActive,
  setSeasonModal,
  setShowSearchBar,
  setUserMenuActive,
  setContainerMargin,
  setOpenMediaDetailsSheet,
  setOpenDisplayMediaSheet,
  setOpenSearchDrawer,
  setOpenUserDrawer,
  setLoadingScreen,
} = uiSlice.actions;

export default uiSlice.reducer;
