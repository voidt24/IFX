import SignUpBannerSkeleton from "./SignUpBannerSkeleton";
import SliderCardSkeleton from "./SliderCardSkeleton";

export default function AllMediaDataSkeleton() {
  return (
    <div className="pb-10 mx-auto md:w-[90%] xl:w-[80%] 4k:w-[60%] max-w-full px-2 animate-pulse">
      <div className="flex flex-col gap-6 relative mt-24 sm:mt-40 z-50">
        {/* Search bar skeleton */}
        <div className="bg-black w-full fixed z-50 py-4 top-0 sm:top-[67px] left-0">
          <div className="w-[85%] md:w-[55%] 2xl:w-[35%] mx-auto ">
            <div className="h-10 bg-gray-700 rounded-full"></div>
          </div>
        </div>
        <div className="sticky top-20 sm:top-36 w-full z-20 bg-black py-4 animate-pulse">
          <h2 className="text-center mb-6 lg:text-xl h-6 bg-gray-700 rounded w-1/4 mx-auto"></h2>
          <div className="flex gap-6">
            <nav className="flex items-center justify-center w-full px-4">
              <ul className="flex text-[60%] md:text-[70%] self-center bg-zinc-800 rounded-full">
                <li>
                  <div className="flex items-center justify-center max-md:px-2 px-4 h-8 bg-gray-600 border border-zinc-500 rounded-s-full w-12"></div>
                </li>
                {Array.from({ length: 8 }).map((_, index) => (
                  <li key={index}>
                    <div className="flex items-center justify-center max-md:px-2.5 px-4 h-8 bg-gray-600 border border-zinc-500 w-8"></div>
                  </li>
                ))}
                <li>
                  <div className="flex items-center justify-center max-md:px-2 px-4 h-8 bg-gray-600 border border-zinc-500 rounded-e-full w-12"></div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lists flex flex-col items-center gap-4 text-center animate-pulse">
          <div className="results-container flex flex-col gap-4 xl:max-w-[1400px] w-full px-4">
            <div className="results grid grid-cols-2 gap-0.3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <SliderCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>

        <SignUpBannerSkeleton />
      </div>
    </div>
  );
}
