import { render, screen, waitFor } from "@testing-library/react";
import MediaCard from "@/components/MediaCard/MediaCard";
import { IMediaData } from "@/Types";

function createMock(mediaType: "movie" | "tv", isReleased: boolean = true) {
  const mock = {
    id: Math.random() + 8723,
    media_type: mediaType,
    backdrop_path: "backdrop-img.jpg",
    ...(mediaType === "movie"
      ? {
          title: `${mediaType} title`,
          original_title: `${mediaType} original_title`,
          release_date: isReleased ? "2022" : "2028",
          name: undefined,
          original_name: undefined,
          first_air_date: undefined,
        }
      : {
          name: `${mediaType} name`, //show 1st for TV
          original_name: `${mediaType} original_name`,
          first_air_date: isReleased ? "2017" : "2028",
          title: undefined,
          original_title: undefined,
          release_date: undefined,
        }),
    overview: `my ${mediaType} description`,
    poster_path: "poster-img.jpg",
    vote_average: 75,
  };

  return mock;
}
const cases = [
  { label: "editable movie", data: createMock("movie"), editable: true, expectType: "movie", expectComingSoon: false },
  { label: "non-editable movie", data: createMock("movie"), editable: false, expectType: null, expectComingSoon: false },
  { label: "not released movie", data: createMock("movie", false), editable: false, expectType: null, expectComingSoon: true },
  { label: "editable TV", data: createMock("tv"), editable: true, expectType: "tv", expectComingSoon: false },
  { label: "non-editable TV", data: createMock("tv"), editable: false, expectType: null, expectComingSoon: false },
];

function renderMediaCard(data: IMediaData, editable: boolean) {
  render(<MediaCard result={data} poster={data.poster_path || ""} vote={data.vote_average?.toString()} canBeEdited={editable} />);
}

describe("MediaCard test", () => {
  test.each(cases)(`should render $label MediaCard`, (data) => {
    const { release_date, first_air_date, vote_average, media_type } = data.data;
    const { expectComingSoon, editable } = data;
    const date = `${media_type === "movie" ? release_date?.toString() : first_air_date?.toString()}` || "";

    renderMediaCard(data.data, editable);

    waitFor(() => {
      expect(screen.getByText(date)).toBeInTheDocument();

      expect(screen.getByText(vote_average?.toString() || "0")).toBeInTheDocument();

      editable ? expect(screen.queryByText(media_type)).toBeInTheDocument() : expect(screen.queryByText(media_type)).not.toBeInTheDocument();

      expectComingSoon ? expect(screen.getByText("coming soon")).toBeInTheDocument() : expect(screen.getByText("coming soon")).not.toBeInTheDocument();
    });
  });
});
