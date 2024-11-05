import {  useContext, useRef } from "react";
import { Context } from "../context/Context";
import SliderCard from "./SliderCard";
import CollapsibleElement from "./common/CollapsibleElement";

export const Similar = ({ similar }) => {
  const { currentMediaType, similarError } = useContext(Context);

  const similarContainerRef = useRef(null);

  if (similarError) {
    return <p className="p-2">Error loading similar media </p>;
  }
  return (
    <>
      <h3>Similar</h3>
      {similar && similar.length > 0 ? (
        <CollapsibleElement customClassesForParent={"similar"} ref={similarContainerRef} parentStyle={{ height: "350px", position: "relative", zIndex: "1" }}>
          {similar.map((result) => {
            return <SliderCard result={result} changeMediaType={currentMediaType == "movies" ? "movie" : "tv"} key={result.id + 56356} />;
          })}
        </CollapsibleElement>
      ) : (
        <p className="text-gray-500 text-center">
          No similar results available
        </p>
      )}
    </>
  );
};

export default Similar;
