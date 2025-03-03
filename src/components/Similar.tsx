import { useContext } from "react";
import { Context } from "../context/Context";
import SliderCard from "./SliderCard";
import Slider from "./Slider";
import { ISliderMovieData, ISliderTVData } from "@/helpers/api.config";
import { Isearch } from "@/helpers/search";

export const Similar = ({ similar }: { similar: (ISliderMovieData | ISliderTVData | Isearch)[] }) => {
  const { similarError, currentMediaType } = useContext(Context);

  if (similarError) {
    return <p className="p-2">Error loading similar media </p>;
  }
  return (
    <div className="similar">
      <h3>Similar</h3>
      {similar && similar.length > 0 ? (
        <Slider sideControls={true} expectingCards={true}>
          {similar.map((result: ISliderMovieData | ISliderTVData | Isearch, index: number) => {
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
