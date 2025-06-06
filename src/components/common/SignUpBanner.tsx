import { Context } from "@/context/Context";
import { useContext } from "react";

export default function SignUpBanner() {
  const { setNoAccount, setAuthModalActive } = useContext(Context);

  return (
    <>
      <div className="w-full flex justify-center py-12 px-4">
        <div className="flex flex-col lg:flex-row items-center p-4 lg:px-10 lg:py-10 justify-between gap-6 max-w-5xl w-full bg-gradient-to-r from-brand-primary/5 to-brand-primary/15 rounded-2xl border border-zinc-700">
          <div className="flex items-center gap-4">
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,5 61,39 98,39 67,61 79,95 50,75 21,95 33,61 2,39 39,39" fill="gold" stroke="orange" stroke-width="2" />
            </svg>

            <div>
              <h2 className="text-xl xl:text-3xl font-bold text-white">Your favorites, anytime.</h2>
              <p className="text-[75%] md:text-sm text-zinc-300 mt-1">Sign up to save media to favorites and watchlists, and enjoy access to all your content.</p>
            </div>
          </div>

          <button
            className="btn-primary text-[85%] md:text-sm"
            onClick={() => {
              setNoAccount(true);
              setAuthModalActive(true);
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  );
}
