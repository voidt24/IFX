import { useContext } from "react";
import { Context } from "../context/Context";
import SliderCard from "./SliderCard";
import Slider from "./Slider";

export const Similar = ({ similar }) => {
  const { similarError } = useContext(Context);

  if (similarError) {
    return <p className="p-2">Error loading similar media </p>;
  }
  return (
    <>
      <h3>Similar</h3>
      {similar && similar.length > 0 ? (
        <Slider sideControls={true} expectingCards={true}>
          {similar.map((result) => {
            return <SliderCard result={result} key={result.id + 56356} />;
          })}
        </Slider>
      ) : (
        <p className="text-gray-500 text-center">No similar results available</p>
      )}
    </>
  );
};

export default Similar;
