import { IepisodesArray } from "@/Types/episodeArray";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

 interface MediaDetailsState{
    currentId: number,    
    currentMediaType: "movies" | "tvshows"; 
    mediaDetailsData: ImediaDetailsData | null;
    episodesArray: IepisodesArray[] | null;
    activeSeason: number | null;
    activeEpisode: number | null; 
}

export const initialState: MediaDetailsState = {
    currentId: 0,
    currentMediaType: "movies",
    mediaDetailsData: null,
    episodesArray: null,
    activeSeason:  null,
    activeEpisode:  null,
}
export const MediaDetailsSlice = createSlice({
    name:"mediaDetails",
    initialState,
    reducers:{
        setCurrentId: (state, action:PayloadAction<number> ) => {
            state.currentId = action.payload;
        },
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
    }
})

export const {setCurrentId, setCurrentMediaType, setMediaDetailsData, setEpisodesArray, setActiveSeason, setActiveEpisode} = MediaDetailsSlice.actions
 export default MediaDetailsSlice.reducer