import SignUpBannerSkeleton from "./SignUpBannerSkeleton";
import SliderCardSkeleton from "./SliderCardSkeleton";

export default function AllMediaDataSkeleton() {
  return (
    <div className="wrapper relative animate-pulse">
      <div className="flex flex-col gap-6 relative mt-16 sm:mt-32 z-50">
        <div className=" w-[20%] h-3 rounded-full bg-surface-modal"></div>
        <div className="title-style "></div>

        <div className="lists flex flex-col items-center gap-4 text-center animate-pulse ">
          <div className="media-lists flex flex-col gap-4 xl:max-w-[1400px] w-full px-4 ">
            {Array.from({ length: 20 }).map((_, index) => (
              <SliderCardSkeleton key={index} />
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <nav className="flex items-center justify-center w-full px-4">
            <ul className="flex text-[60%] md:text-[70%] self-center bg-surface-modal rounded-full">
              <li>
                <div className="flex items-center justify-center max-md:px-2 px-4 h-8 bg-surface-modal border border-zinc-500 rounded-s-full w-12"></div>
              </li>
              {Array.from({ length: 8 }).map((_, index) => (
                <li key={index}>
                  <div className="flex items-center justify-center max-md:px-2.5 px-4 h-8 bg-surface-modal border border-zinc-500 w-8"></div>
                </li>
              ))}
              <li>
                <div className="flex items-center justify-center max-md:px-2 px-4 h-8 bg-surface-modal border border-zinc-500 rounded-e-full w-12"></div>
              </li>
            </ul>
          </nav>
        </div>

        <SignUpBannerSkeleton />
      </div>
    </div>
  );
}
