import MediaDetails from "@/components/MediaDetails";
import { fetchDetailsData } from "@/helpers/fetchDetailsData";
type Params = {
  id: string;
};
export async function generateMetadata({ params }: { params: Params }) {
  const { id } = params;
  let tvTitle = "TV Details";

  try {
    const tvDetails = await fetchDetailsData("byId", "tv", id);
    if ((tvDetails && tvDetails.name) || tvDetails.original_name) {
      tvTitle = tvDetails.name || tvDetails.original_name;
    }
  } catch (error) {
    console.error("Error fetching title:", error);
  }

  return {
    title: tvTitle + " - Prods",
  };
}
const Media = () => {
  return <MediaDetails mediaType={"tv"} />;
};

export default Media;
