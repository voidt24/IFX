import { useContext } from "react";
import ReviewCard from "./ReviewCard";
import { Context } from "@/context/Context";
import CollapsibleElement from "@/components/common/CollapsibleElement";
export const Reviews = ({ reviews }) => {
  const { reviewsError } = useContext(Context);

  const truncatedTextStyle = {
    WebkitLineClamp: "4",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };

  if (reviewsError) {
    return <p className="p-2">Error loading reviews </p>;
  }
  return (
    reviews && (
      <>
        <h3 style={{ marginTop: "40px" }}>Reviews</h3>
        {reviews.length > 0 ? (
          <div className="reviews">
            {reviews.map((result) => {
              return (
                <CollapsibleElement key={result.id} customClassesForParent={"review-content bg-neutral-900"} truncatedTextStyle={truncatedTextStyle}>
                  <ReviewCard result={result} />
                </CollapsibleElement>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No reviews available
          </p>
        )}
      </>
    )
  );
};
