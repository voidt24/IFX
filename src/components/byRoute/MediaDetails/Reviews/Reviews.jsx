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
        {reviews.length > 0 ? (
          <div className="flex-col-center gap-12 md:w-[80%] md:mx-auto xl:w-[70%] xxl:w-[60%] 4k:w-[45%]">
            {reviews.map((result) => {
              return (
                <CollapsibleElement key={result.id} customClassesForParent={"review-content bg-surface-modal rounded-lg max-md:p-4 px-8 py-2"} truncatedTextStyle={truncatedTextStyle}>
                  <ReviewCard result={result} />
                </CollapsibleElement>
              );
            })}
          </div>
        ) : (
          <p className="text-content-muted text-center">No reviews available</p>
        )}
      </>
    )
  );
};
