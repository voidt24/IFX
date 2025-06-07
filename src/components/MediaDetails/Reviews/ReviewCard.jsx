const ReviewCard = ({ result }) => {
  return (
    <>
      <header className="flex-row-between text-content-secondary ">
        <span>
          <p className="font-semibold text-content-primary">{result.author_details.username}</p>
          <p className="text-[85%]">{result.created_at.slice(0, 10)}</p>
        </span>
        <p className="text-[85%]">Rating: {result.author_details.rating}</p>
      </header>

      <p className="mt-[0.7rem] leading-[22px] lg:leading-[26px] max-md:text-[85%] text-[90%] pb-4 ">{result.content}</p>
    </>
  );
};

export default ReviewCard;
