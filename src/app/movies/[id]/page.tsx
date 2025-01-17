import MediaDetails from "@/components/MediaDetails";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
type Params = {
  id: string;
};
export async function generateMetadata({ params }: { params: Params }) {
  const { id } = params;
  let movieTitle = "Movie Details";

  try {
    const movieDetails = await fetchDetailsData("byId", "movie", id);
    if ((movieDetails && movieDetails.title) || movieDetails.original_title) {
      movieTitle = movieDetails.title || movieDetails.original_title;
    }
  } catch (error) {
    console.error("Error fetching title:", error);
  }

  return {
    title: movieTitle + " - Prods",
  };
}

const Media = () => {
  return <MediaDetails mediaType={"movie"} />;
};

export default Media;
