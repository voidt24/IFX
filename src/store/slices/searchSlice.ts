import { IMediaData } from "@/Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  loadingSearch: boolean;
  searchQuery: string;
  searchStarted: boolean;
  searchResults: IMediaData[] | null;
  recentlySearched: string[] | null;
}

const initialState: SearchState = {
  loadingSearch: false,
  searchQuery: "",
  searchStarted: false,
  searchResults: null,
  recentlySearched: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setLoadingSearch: (state, action: PayloadAction<boolean>) => {
      state.loadingSearch = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchStarted: (state, action: PayloadAction<boolean>) => {
      state.searchStarted = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<IMediaData[] | null>) => {
      state.searchResults = action.payload;
    },
    setRecentlySearched: (state, action: PayloadAction<string[] | null>) => {
      state.recentlySearched = action.payload;
    },
  },
});

export const { setLoadingSearch, setSearchQuery, setSearchStarted, setSearchResults, setRecentlySearched } = searchSlice.actions;
export default searchSlice.reducer;
