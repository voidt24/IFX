import { resolveFetchURL } from "@/helpers/resolveFetchURL";

interface testCase {
  typeOfSearch: "byId" | "similar" | "cast" | "reviews";
  mediaType: "movie" | "tv";
  mediaId: number;
  expectedURL: string;
}

jest.mock("@/helpers/api.config", () => ({
  API_KEY: "test_api_key",
  apiUrl: "https://api.test.com/",
}));
const tests: testCase[] = [
  { typeOfSearch: "byId", mediaType: "movie", mediaId: 123, expectedURL: `https://api.test.com/movie/123?api_key=test_api_key` },
  { typeOfSearch: "similar", mediaType: "tv", mediaId: 456, expectedURL: `https://api.test.com/tv/456/similar?api_key=test_api_key` },
  { typeOfSearch: "cast", mediaType: "movie", mediaId: 789, expectedURL: `https://api.test.com/movie/789/credits?api_key=test_api_key&language=en-US&page=1` },
  { typeOfSearch: "reviews", mediaType: "tv", mediaId: 101, expectedURL: `https://api.test.com/tv/101/reviews?api_key=test_api_key` },
];

describe("resolveFetchURL", () => {
  test.each(tests)("should return correct URL for $typeOfSearch search", ({ typeOfSearch, mediaType, mediaId, expectedURL }) => {
    expect(resolveFetchURL(typeOfSearch, mediaType, mediaId)).toBe(expectedURL);
  });
});
