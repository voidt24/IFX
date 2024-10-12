const category = ["trending", "popular"];
const limit = [4, 15, 20];

export const mediaProperties = {
  movie: {
    mediaType: "movie",
    category,
    limit,
    route: "movies",
  },
  tv: {
    mediaType: "tv",
    category,
    limit,
    route: "tvshows",
  },
};
