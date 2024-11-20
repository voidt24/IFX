const ReviewCard = ({ result }) => {
  return (
    <>
      <span className="fixed flex justify-between items-center bg-neutral-900 rounded-full">
        <span id="author">
          {result.author_details.username}
          <p className="text-[85%] font-normal text-zinc-400">{result.created_at.slice(0, 10)}</p>
        </span>
        <p className="text-[85%] text-zinc-300">Rating: {result.author_details.rating}</p>
      </span>

      <p className="review-text max-md:text-[85%] text-[90%] pb-4 text-zinc-300">{result.content}</p>
    </>
  );
};

export default ReviewCard;
