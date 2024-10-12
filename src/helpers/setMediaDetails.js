import { image, imageWithSize } from "./api.config";
import { mediaD_Actions } from "./reducerSelectedMedia";
import { getFromDB } from "../firebase/getFromDB";

export const setMediaDetails = (data, dispatch) => {
  const { title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path } = data[0];
  dispatch({
    type: mediaD_Actions.set_Media_Values,
    payload: {
      results: [data[0]],
      heroBackground: window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`,
      title: title || original_name,
      poster: `${imageWithSize("500")}${poster_path} || ""`,
      overview,
      releaseDate: release_date?.slice(0, 4) || first_air_date?.slice(0, 4),
      vote: String(vote_average).slice(0, 3),
      genres: (genres && genres.map((genre) => genre.name)) || "",
      loadingAllData: false,
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
