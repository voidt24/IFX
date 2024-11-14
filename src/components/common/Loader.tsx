import { CircularProgress } from "@mui/material";
import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center">
      <CircularProgress color="inherit" size={30} />
    </div>
  );
}
