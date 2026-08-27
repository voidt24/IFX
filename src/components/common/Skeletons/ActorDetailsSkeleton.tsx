const ActorDetailsSkeleton = () => {
  return (
    <div className="wrapper animate-pulse flex flex-col lg:flex-row gap-8">
      <div className="flex-col-center lg:flex-col-start gap-4 w-full lg:w-[280px] lg:shrink-0">
        <div className="w-[180px] h-[180px] lg:w-full lg:h-[320px] bg-gray-800 rounded-full lg:rounded-lg"></div>
        <div className="w-full flex flex-col gap-3">
          <div className="h-3 w-1/2 bg-gray-800 rounded mx-auto lg:mx-0"></div>
          <div className="h-3 w-2/3 bg-gray-800 rounded mx-auto lg:mx-0"></div>
          <div className="h-3 w-1/3 bg-gray-800 rounded mx-auto lg:mx-0"></div>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="h-8 w-1/2 bg-gray-800 rounded"></div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full bg-gray-800 rounded"></div>
          <div className="h-3 w-full bg-gray-800 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-800 rounded"></div>
        </div>

        <div className="h-6 w-40 bg-gray-800 rounded mt-6"></div>
        <div className="media-lists">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] w-full bg-gray-800 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActorDetailsSkeleton;
