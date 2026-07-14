import { IhistoryMedia } from "@/Types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface historyState {
  // Identifies which single card's options dropdown is open, by a stable
  // "date-itemId" key (e.g. "2026-07-11-98765") rather than array position.
  // Positions shift on every delete (Firestore's realtime listener rebuilds
  // the array), so index-based tracking was matching the wrong card after
  // any deletion — this is what caused menus/selection to jump between items.
  activeOptionsKey: string | null;
  activeHistoryEntry: string | null;
  elementsToDelete: (number | string)[];
  historyMedia: [string, IhistoryMedia[]][] | null;
}

const initialState: historyState = {
  activeOptionsKey: null,
  activeHistoryEntry: null,
  elementsToDelete: [],
  historyMedia: null,
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setActiveOptionsKey: (state, action: PayloadAction<string | null>) => {
      state.activeOptionsKey = action.payload;
    },
    setActiveHistoryEntry: (state, action: PayloadAction<string | null>) => {
      state.activeHistoryEntry = action.payload;
    },
    setElementsToDelete: (state, action: PayloadAction<(number | string)[]>) => {
      state.elementsToDelete = action.payload;
    },
    setHistoryMedia: (state, action: PayloadAction<[string, IhistoryMedia[]][] | null>) => {
      state.historyMedia = action.payload;
    },
  },
});

export const { setActiveOptionsKey, setActiveHistoryEntry, setElementsToDelete, setHistoryMedia } = historySlice.actions;
export default historySlice.reducer;
