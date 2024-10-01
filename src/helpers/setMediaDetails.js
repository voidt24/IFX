import { image, imageWithSize } from "./api.config";
import { getById } from "./getById";
import { getCast } from "./getCast";
import { getReviews } from "./getReviews";
import { getSimilar } from "./getSimilar";
import { mediaD_Actions } from "./reducerSelectedMedia";
import { getFromDB } from "../firebase/getFromDB";

export const setMediaDetails = (currentId, dispatch, setCastMaximized, currentMediaType, setCast, setLoadingCast, setSimilar, setReviews, setRouteKey, setSimilarMaximized) => {
  dispatch({ type: mediaD_Actions.set_All_DataLoader, payload: { loadingAllData: true } });

  window.scrollTo(0, 0);
  setCastMaximized(false);
  const mediaType = currentMediaType == "movies" ? "movie" : "tv";

  getById(mediaType, currentId)
    .then((data) => {
      if (data.status_code === 6) {
        throw new Error("id not found");
      }
      const { title, original_name, overview, release_date, first_air_date, genres, vote_average, backdrop_path, poster_path } = data[0];
      dispatch({
        type: mediaD_Actions.set_Media_Values,
        payload: {
          results: [data[0]],
          heroBackground: window.innerWidth >= 640 ? `${image}${backdrop_path}` : `${image}${poster_path}`,
          title: title || original_name,
          poster: `${imageWithSize("500")}${poster_path}`,
          overview,
          releaseDate: release_date?.slice(0, 4) || first_air_date?.slice(0, 4),
          vote: String(vote_average).slice(0, 3),
          genres: genres.map((genre) => genre.name),
          loadingAllData: false,
        },
      });

      getCast(mediaType, currentId, data[1] == "byCache" && "byCache")
        .then((data) => {
          setCast(data);
          setLoadingCast(false);
        })
        .catch(() => {
          throw new Error();
        });

      getSimilar(mediaType, currentId, data[1] == "byCache" && "byCache")
        .then((data) => {
          setSimilar(data.results);
        })
        .catch(() => {
          throw new Error();
        });

      getReviews(mediaType, currentId, data[1] == "byCache" && "byCache")
        .then((data) => {
          setReviews(data.results);
        })
        .catch(() => {
          throw new Error();
        });
      setRouteKey((prevKey) => prevKey + 1);

      setSimilarMaximized(false);
    })
    .catch((er) => {
      setLoadingCast(false);
      dispatch({ type: mediaD_Actions.set_All_DataLoader, payload: { loadingAllData: false } });
    }); //todo: display error in screen
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
