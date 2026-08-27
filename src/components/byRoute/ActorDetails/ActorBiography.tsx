"use client";
import { useLayoutEffect, useRef, useState } from "react";

const ActorBiography = ({ biography }: { biography: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (textRef.current) {
      setShowReadMoreButton(textRef.current.scrollHeight !== textRef.current.clientHeight);
    }
  }, [biography]);

  if (!biography) {
    return <p className="text-content-third italic">No biography available.</p>;
  }

  return (
    <div className="biography">
      <p ref={textRef} className={`${!isOpen ? "line-clamp-5" : ""} text-content-secondary whitespace-pre-line leading-relaxed`}>
        {biography}
      </p>

      {showReadMoreButton && (
        <p className="show-more-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Show less" : "Show more"}
        </p>
      )}
    </div>
  );
};

export default ActorBiography;
