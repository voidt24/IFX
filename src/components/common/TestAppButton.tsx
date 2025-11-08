import { APP_NAME } from "@/helpers/api.config";
import { setTestingInitialized } from "@/store/slices/authSlice";
import { Tooltip } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";

function TestAppButton() {
  const dispatch = useDispatch();

  return (
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
  );
}

export default TestAppButton;
