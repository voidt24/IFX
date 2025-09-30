import { IhistoryMedia, MediaTypeApi } from "@/Types";
import { image } from "./api.config";
import { ImediaDetailsData } from "@/Types/mediaDetails";
import { IepisodesArray } from "@/Types/episodeArray";

export default function prepareHistoryData(
  mediaId: number,
  mediaType: MediaTypeApi,
  mediaDetailsData: ImediaDetailsData | null,
  episodesArray?: IepisodesArray[] | null,
  season?: string | null,
  episode?: string | null,
) {
  const episodeExists = episodesArray && episodesArray[0] && episodesArray[0].episodes?.[Number(episode) - 1];

  const ExactEpisode = episodeExists && episodesArray[0].episodes?.[Number(episode) - 1];

  const episodeId = ExactEpisode?.id;
  const episodeName = ExactEpisode?.name;
  const episodeImage = ExactEpisode?.still_path;
  const episodeVote = ExactEpisode?.vote_average;

  const dataToSave: IhistoryMedia = {
    id: mediaId,
    media_type: mediaType,
    ...(mediaType === "tv" &&
      episodeExists && {
        episodeId: episodeId,
        season: Number(season),
        episode: episodeName,
        episode_number: Number(episode),
        episode_image: `${image}${episodeImage}`,
      }),
    title: mediaDetailsData?.title,
    vote_average: mediaType === "tv" && episodeExists ? episodeVote : mediaDetailsData?.vote,
    poster_path: mediaDetailsData?.poster,
    backdrop_path: mediaDetailsData?.bigHeroBackground,
    release_date: mediaDetailsData?.releaseDate,
    watchedAt: Date.now(),
  };

  return dataToSave;
}
