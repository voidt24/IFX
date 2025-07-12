import { useContext } from "react";
import { IMediaData, MediaTypeApi } from "@/Types";
import { Context } from "@/context/Context";
import SliderCard from "../Slider/SliderCard";
import Slider from "../Slider/Slider";

export const Similar = ({ similar, mediaType }: { similar: IMediaData[]; mediaType: MediaTypeApi }) => {
  const { similarError } = useContext(Context);

  if (similarError) {
    return <p className="p-2">Error loading similar media </p>;
  }
  return (
    <div className="similar">
      {similar && similar.length > 0 ? (
        <Slider sideControls={true} expectingCards={true}>
          {similar.map((result: IMediaData, index: number) => {
            return <SliderCard key={result.id ?? index + 56356} result={result} mediaType={mediaType} />;
          })}
        </Slider>
      ) : (
        <p className="text-gray-500 text-center">No similar results available</p>
      )}
    </div>
  );
};

export default Similar;
