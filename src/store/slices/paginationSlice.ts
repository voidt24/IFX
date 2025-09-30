import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface paginationState {
  numberOfPages: number;
  pageActive: number;
}

const initialState: paginationState = {
  numberOfPages: 0,
  pageActive: 0,
};

export const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setNumberOfPages: (state, action: PayloadAction<number>) => {
      state.numberOfPages = action.payload;
    },
    setPageActive: (state, action: PayloadAction<number>) => {
      state.pageActive = action.payload;
    },
  },
});

export const { setNumberOfPages, setPageActive } = paginationSlice.actions;
export default paginationSlice.reducer;
