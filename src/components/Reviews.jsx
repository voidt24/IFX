import { useRef } from 'react';
import ReviewCard from './ReviewCard';
export const Reviews = ({ reviews }) => {
  const reviewsContainerRef = useRef(null);

  return (
    <>
      <h3 style={{ marginTop: '40px' }}>Reviews</h3>
      {reviews.length > 0 ? (
        <div className='reviews' ref={reviewsContainerRef}>
          {reviews.map((result) => {
            return <ReviewCard result={result} key={result.id}/>;
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No reviews available</p>
      )}
    </>
  );
};
