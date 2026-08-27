export const TWO_DAYS = Date.now() + 172_800_000;
export const THREE_DAYS = Date.now() + 259_200_000;
export const ONE_MONTH = Date.now() + 2_629_800_000;

export const INITIAL_DATA_EXPIRATION_TIME = TWO_DAYS;
export const selectFilterCategories = ["Movies", "TV Shows"];

export const selectFilterProviders = ["Netflix", "Disney+", "Apple TV+", "Amazon Prime Video", "HBO Max", "Hulu", "Paramount+", "Crunchyroll", "AMC", "History"];
export const providersNetworkCode: Record<string, number> = {
  Netflix: 213,
  "Disney+": 2739,
  "Apple TV+": 2552,
  "Amazon Prime Video": 1024,
  "HBO Max": 3186,
  Hulu: 453,
  "Paramount+": 4330,
  Crunchyroll: 1112,
  AMC: 174,
  History: 65,
};

// Movies under-match by design (TMDB has no "original" field for movies, only
// production_companies — see themoviedb.org/talk/5c45b71ac3a368478c830950). Expanded
// below per your call: association-level matches are fine, priority is that real
// originals actually show up.
export const providersProductionCompanyCode: Record<string, number[]> = {
  Netflix: [
    19382, // Netflix Content Services
    19491, // Netflix Studios
    178464, // Netflix US
    171251, // Netflix Animation
    13240, // Netflix International Pictures
    201128, // Netflix Productions
    142278,
  ],
  "Amazon Prime Video": [
    20580, // Amazon Studios
    125110, // Amazon Prime Video
    107386, // Amazon MGM Studios
  ],
  "Apple TV+": [
    194232, // Apple Studios
    124317, // Apple Original Films
  ],
  "HBO Max": [
    3268, // HBO Films
    11073, // HBO Max / Max Originals
  ],
  "Paramount+": [
    4, // Paramount Pictures
    10038, // Paramount Players
  ],
};

export const providersWatchCode: Record<string, number> = {
  Netflix: 8,
  "Disney+": 337,
  "Apple TV+": 2,
  "Amazon Prime Video": 9,
  "HBO Max": 1899,
  Hulu: 15,
  "Paramount+": 531,
  Crunchyroll: 283,
  AMC: 80,
  History: 155,
};
export const selectFilterMovieCategories = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];
export const selectFilterTVCategories = [
  "Action & Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Kids",
  "Mystery",
  "News",
  "Reality",
  "Science Fiction & Fantasy",
  "Talk",
  "War & Politics",
  "Western",
];

export const movieGenresCode: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

export const tvGenresCode: Record<string, number> = {
  "Action & Adventure": 10759,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Kids: 10762,
  Mystery: 9648,
  News: 10763,
  Reality: 10764,
  "Science Fiction & Fantasy": 10765,
  Talk: 10767,
  "War & Politics": 10768,
  Western: 37,
};
