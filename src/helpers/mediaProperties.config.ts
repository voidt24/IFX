import { MediaTypeApi, MediaTypeUrl } from "@/Types";

const searchCategory = ["trending", "popular"];
const limit = [4, 12, 20];

interface mediaPropertiesObjType {
  movie: {
    mediaType: MediaTypeApi;
    searchCategory: string[];
    limit: number[];
    route: MediaTypeUrl;
  };
  tv: {
    mediaType: MediaTypeApi;
    searchCategory: string[];
    limit: number[];
    route: MediaTypeUrl;
  };
}

export const mediaProperties: mediaPropertiesObjType = {
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
