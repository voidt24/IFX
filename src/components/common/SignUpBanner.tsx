import { Context } from "@/context/Context";
import { useContext } from "react";

export default function SignUpBanner() {
  const { setAuthModalActive } = useContext(Context);

  return (
    <div className="border border-zinc-800 my-6 md:my-10 w-full  md:w-[85%] lg:w-[80%] py-6  mx-auto relative isolate overflow-hidden bg-gray-950 px-6 md:px-10 shadow-2xl rounded-3xl  lg:flex  lg:px-20 2xl:px-32 4k:w-[70%]">
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
        aria-hidden="true"
      >
        <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
        <defs>
          <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
            <stop stopColor="#7775D6" />
            <stop offset="1" stopColor="#E935C1" />
          </radialGradient>
        </defs>
      </svg>
      <div className="mx-auto lg:text-left flex items-center justify-center w-full">
        <div className=" flex flex-col items-start justify-start lg:justify-start w-[95%] sm:w-[75%]">
          <h2 className="text-xl  xl:text-3xl font-semibold tracking-tight text-white">Save what you like.</h2>
          <p className="mt-6 text-pretty text-[75%] md:text-sm text-zinc-300 max-w-[90%] md:max-w-[70%]">Sign up to save movies and tv shows to favorites, watchlists and any other custom list.</p>

          <button
            className="mt-6 px-6 py-2.5 text-[75%] md:text-sm font-semibold btn-primary"
            onClick={() => {
              setAuthModalActive(true);
            }}
          >
            Sign up
          </button>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row md:gap-2 w-[40%] md:w-[25%] lg:w-[200px] pointer-events-none">
          <img src="/logo-mascot.png" className="" alt="" />
        </div>
      </div>
    </div>
  );
}
