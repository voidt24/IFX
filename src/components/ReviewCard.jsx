"use client";
import { useState, useRef, useEffect } from "react";

const truncatedTextStyle = {
  WebkitLineClamp: "5",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  display: "-webkit-box",
};

const ReviewCard = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(true);

  useEffect(() => {
    setShowReadMoreButton(ref.current.scrollHeight !== ref.current.clientHeight);
  }, []);

  const ref = useRef();
  return (
    <div>
      <div className="review-content bg-neutral-900">
        <span className="fixed" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span id="author">
            {result.author_details.username}
            <p className="text-[85%] text-white/50 font-normal">{result.created_at.slice(0, 10)}</p>
          </span>
          <p className="text-[85%] ">Rating: {result.author_details.rating}</p>
        </span>

        <p style={isOpen ? null : truncatedTextStyle} className="review-text max-md:text-[85%] text-[90%]" ref={ref}>
          {result.content}
        </p>

        {showReadMoreButton && (
          <p
            className="show-more-btn"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? "Show less" : "Read more"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
