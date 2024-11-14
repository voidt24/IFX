const searchCategory = ["trending", "popular"];
const limit = [4, 12, 20];

export const mediaProperties = {
  movie: {
    mediaType: "movie",
    searchCategory,
    limit,
    route: "movies",
  },
  tv: {
    mediaType: "tv",
    searchCategory,
    limit,
    route: "tvshows",
  },
};
