import { APP_NAME } from "@/helpers/api.config";
import { RootState } from "@/store";
import { setTestingInitialized } from "@/store/slices/authSlice";
import { setNoAccount, setAuthModalActive } from "@/store/slices/UISlice";
import { Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
export default function SignUpBanner() {
  const dispatch = useDispatch();
  const { userLogged, testingInitialized } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <div className="w-full flex justify-center py-12 px-4">
        <div className="flex flex-col  items-center p-4 lg:px-8 lg:py-10 justify-between gap-6 max-w-5xl w-full bg-gradient-to-r from-brand-primary/5 to-brand-primary/15 rounded-2xl border border-zinc-700">
          <div className="flex items-center gap-4">
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,5 61,39 98,39 67,61 79,95 50,75 21,95 33,61 2,39 39,39" fill="gold" stroke="orange" stroke-width="2" />
            </svg>

            <div>
              <h2 className="text-xl xl:text-3xl font-bold text-white">Your favorites, anytime.</h2>
              <p className="text-[75%] md:text-sm text-zinc-300 mt-1">Sign up to save media to favorites, watchlists and viewing history — and enjoy access to all your content.</p>
            </div>
          </div>

          <div className="flex gap-4 ">
            <button
              className="btn-primary text-[75%] sm:!text-[85%]"
              onClick={() => {
                dispatch(setNoAccount(true));
                dispatch(setAuthModalActive(true));
              }}
            >
              Sign up
            </button>

            {!testingInitialized && (
              <Tooltip
                slotProps={{
                  popper: {
                    sx: { zIndex: 20000 },
                  },
                }}
                title="Save your favorites, watchlist, and viewing history without providing personal information. Data will be saved in the browser."
              >
                <button
                  className="btn-primary !bg-white/85 text-[75%] sm:!text-[85%]"
                  onClick={() => {
                    function syncTestingFeature() {
                      localStorage.setItem(`${APP_NAME}-testing-app`, "started");
                      const testingfeauture = localStorage.getItem(`${APP_NAME}-testing-app`);

                      dispatch(setTestingInitialized(testingfeauture === "started"));
                      document.cookie = `${APP_NAME}-testing-app=${APP_NAME}-testing-app; path=/; secure; samesite=strict`;
                    }

                    syncTestingFeature();
                  }}
                >
                  Test app without credentials
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
