import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListsState {
  addedToFavs: boolean;
  addedToWatchList: boolean;
  addedToWatched: boolean;
  listActive: string;
  checkedMedia: (number | string)[];
  edit: boolean;
  listChanged: boolean;
}

export const initialState: ListsState = {
  addedToFavs: false,
  addedToWatchList: false,
  addedToWatched: false,
  listActive: "favorites",
  checkedMedia: [],
  edit: false,
  listChanged: false,
};
export const listsManagementSlice = createSlice({
  name: "listsManagement",
  initialState,
  reducers: {
    setAddedToFavs: (state, action: PayloadAction<boolean>) => {
      state.addedToFavs = action.payload;
    },
    setAddedToWatchList: (state, action: PayloadAction<boolean>) => {
      state.addedToWatchList = action.payload;
    },
    setAddedToWatched: (state, action: PayloadAction<boolean>) => {
      state.addedToWatched = action.payload;
    },
    setListActive: (state, action: PayloadAction<string>) => {
      state.listActive = action.payload;
    },
    setCheckedMedia: (state, action: PayloadAction<(number | string)[]>) => {
      state.checkedMedia = action.payload;
    },
    setEdit: (state, action: PayloadAction<boolean>) => {
      state.edit = action.payload;
    },
    setListChanged: (state, action: PayloadAction<boolean>) => {
      state.listChanged = action.payload;
    },
  },
});

export const { setAddedToFavs, setAddedToWatchList, setAddedToWatched, setListActive, setCheckedMedia, setEdit, setListChanged } = listsManagementSlice.actions;
export default listsManagementSlice.reducer;
