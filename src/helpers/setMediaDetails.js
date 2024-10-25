import { image, imageWithSize } from "./api.config";
import { mediaD_Actions } from "./reducerSelectedMedia";
import { getFromDB } from "../firebase/getFromDB";

const getRunTime = (runtimeParam) => {
  let time;

  if (runtimeParam < 60) {
    time = runtimeParam + "m";
  } else {
    const hrs = Math.floor(runtimeParam / 60);
    let remainingMins = runtimeParam % 60;
    let strHrs = "h";
    let strMin = "m";

    if (remainingMins == 0) {
      strMin = "";
      remainingMins = "";
    }

    time = hrs + strHrs + " " + remainingMins + strMin;
  }

  return time;
};

export const setMediaDetails = (data, dispatch) => {
  const { title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path, runtime, number_of_seasons } = data[0];
  dispatch({
    type: mediaD_Actions.set_Media_Values,
    payload: {
      results: [data[0]],
      heroBackground: window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`,
      title: title || original_name,
      poster: `${imageWithSize("500")}${poster_path}` || "",
      overview,
      releaseDate: release_date?.slice(0, 4) || first_air_date?.slice(0, 4),
      vote: String(vote_average).slice(0, 3),
      genres: (genres && genres.map((genre) => genre.name)) || "",
      loadingAllData: false,
      runtime: runtime ? getRunTime(runtime) : "",
      seasons: number_of_seasons ?  number_of_seasons == 1 ? number_of_seasons + " Season" : number_of_seasons + " Seasons" : "",
    },
  });
};

export const setListsState = (userLogged, firebaseActiveUser, setAddedToFavs, setLoadingFavs, setAddedtoWatchList, setLoadingWatchlist, currentId) => {
  if (userLogged) {
    getFromDB(firebaseActiveUser.uid, "favorites", setAddedToFavs, setLoadingFavs, currentId);
    getFromDB(firebaseActiveUser.uid, "watchlist", setAddedtoWatchList, setLoadingWatchlist, currentId);
  } else {
    setLoadingFavs(false);
    setLoadingWatchlist(false);
    setAddedToFavs(false);
    setAddedtoWatchList(false);
  }
};
