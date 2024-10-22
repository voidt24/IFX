import { useContext, useRef } from "react";
import ReviewCard from "./ReviewCard";
import { Context } from "@/context/Context";

export const Reviews = ({ reviews }) => {
  const reviewsContainerRef = useRef(null);
  const { reviewsError } = useContext(Context);

  if (reviewsError) {
    return <p className="p-2">Error loading reviews </p>;
  }
  return (
    reviews && (
      <>
        <h3 style={{ marginTop: "40px" }}>Reviews</h3>
        {reviews.length > 0 ? (
          <div className="reviews" ref={reviewsContainerRef}>
            {reviews.map((result) => {
              return <ReviewCard result={result} key={result.id} />;
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center" }} className="text-gray-500">No reviews available</p>
        )}
      </>
    )
  );
};
