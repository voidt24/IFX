import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface historyState {
  activeIndex: number | undefined;
  parentActiveIndex: number | undefined;
  activeHistoryEntry: string | null;
  elementsToDelete: (number | string)[];
}

const initialState: historyState = {
  activeIndex: undefined,
  parentActiveIndex: undefined,
  activeHistoryEntry: null,
  elementsToDelete: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number | undefined>) => {
      state.activeIndex = action.payload;
    },
    setParentActiveIndex: (state, action: PayloadAction<number | undefined>) => {
      state.parentActiveIndex = action.payload;
    },
    setActiveHistoryEntry: (state, action: PayloadAction<string | null>) => {
      state.activeHistoryEntry = action.payload;
    },
    setElementsToDelete: (state, action: PayloadAction<(number | string)[]>) => {
      state.elementsToDelete = action.payload;
    },
  },
});

export const { setActiveIndex, setParentActiveIndex, setActiveHistoryEntry, setElementsToDelete } = historySlice.actions;
export default historySlice.reducer;
