import { useContext } from "react";
import { Context } from "../context/Context";
import SliderCard from "./SliderCard";
import Slider from "./Slider";
import { ISliderData } from "@/helpers/api.config";

export const Similar = ({ similar }: { similar: (ISliderData)[] }) => {
  const { similarError, currentMediaType } = useContext(Context);

  if (similarError) {
    return <p className="p-2">Error loading similar media </p>;
  }
  return (
    <div className="similar">
      <h3>Similar</h3>
      {similar && similar.length > 0 ? (
        <Slider sideControls={true} expectingCards={true}>
          {similar.map((result: ISliderData, index: number) => {
            return <SliderCard result={result} key={result.id ?? index + 56356} mediaType={currentMediaType} />;
          })}
        </Slider>
      ) : (
        <p className="text-gray-500 text-center">No similar results available</p>
      )}
    </div>
  );
};

export default Similar;
