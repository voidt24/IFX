import { IepisodesArray } from "@/Types/episodeArray";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

 interface MediaDetailsState{
    currentMediaType: "movies" | "tvshows"; 
    mediaDetailsData: ImediaDetailsData | null;
    episodesArray: IepisodesArray[] | null;
    activeSeason: number | null;
    activeEpisode: number | null; 
     
    // PWA
    mediaIdPWA: number,    
    sheetMediaType: "movies" | "tvshows",
    sheetSeason: number | null,
    sheetEpisode: number | null,
}

export const initialState: MediaDetailsState = {
    currentMediaType: "movies",
    mediaDetailsData: null,
    episodesArray: null,
    activeSeason:  null,
    activeEpisode:  null,
    
    // PWA
    mediaIdPWA: 0,
    sheetMediaType:  "movies",
    sheetSeason:  null,
    sheetEpisode:  null
}
export const MediaDetailsSlice = createSlice({
    name:"mediaDetails",
    initialState,
    reducers:{
        setCurrentMediaType: (state, action:PayloadAction<"movies" | "tvshows"> ) => {
            state.currentMediaType = action.payload;
        },
        setMediaDetailsData: (state, action:PayloadAction<ImediaDetailsData | null> ) => {
            state.mediaDetailsData = action.payload;
        },
        setEpisodesArray: (state, action:PayloadAction<IepisodesArray[] | null> ) => {
            state.episodesArray = action.payload;
        },
        setActiveSeason: (state, action:PayloadAction<number | null> ) => {
            state.activeSeason = action.payload;
        },
        setActiveEpisode: (state, action:PayloadAction<number | null> ) => {
            state.activeEpisode = action.payload;
        },
        
        // PWA
        setMediaIdPWA: (state, action:PayloadAction<number> ) => {
            state.mediaIdPWA = action.payload;
        },
        setSheetMediaType: (state, action:PayloadAction<"movies" | "tvshows"> ) => {
            state.sheetMediaType = action.payload;
        },
        setSheetSeason: (state, action:PayloadAction<number | null> ) => {
            state.sheetSeason = action.payload;
        },
        setSheetEpisode: (state, action:PayloadAction<number | null> ) => {
            state.sheetEpisode = action.payload;
        },
    }
})

export const { setCurrentMediaType, setMediaDetailsData, setEpisodesArray, setActiveSeason, setActiveEpisode, setMediaIdPWA, setSheetMediaType, setSheetSeason, setSheetEpisode} = MediaDetailsSlice.actions
 export default MediaDetailsSlice.reducer