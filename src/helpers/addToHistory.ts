import { saveToHistory } from "@/firebase/saveToHistory";
import prepareHistoryData from "./prepareHistoryData";
import { MediaTypeApi } from "@/Types";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { IepisodesArray } from "@/Types/episodeArray";

export default function addToHistory(mediaType:MediaTypeApi,mediaDetailsData:ImediaDetailsData | null,firebaseActiveUser:{email:string | null, uid:string | null},mediaId:number,episodesArray?:IepisodesArray[] | null,season?:string | null,episode?:string | null){
    
    const dataToSave = prepareHistoryData(mediaId,mediaType,mediaDetailsData,episodesArray,season,episode,)

    if (firebaseActiveUser && firebaseActiveUser.uid && dataToSave) {
        if (dataToSave.media_type === "movie" && mediaId) {
            saveToHistory(dataToSave, mediaId, firebaseActiveUser.uid);
        } else {
            if (dataToSave.episodeId) {
                saveToHistory(dataToSave, dataToSave.episodeId, firebaseActiveUser.uid);
            }
        }
    }
}