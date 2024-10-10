"use client";
import { useContext } from "react";
import Hero from "@/components/Hero";
import Slider from "@/components/Slider";
import { Context } from "@/context/Context";
import { CircularProgress } from "@mui/material";

export default function Tvshows() {
  const { initialDataError, initialDataIsLoading } = useContext(Context);

  if (initialDataIsLoading) {
    return (
      <span className="flex items-center justify-center h-screen">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress color="inherit" size={100} />
        </div>
      </span>
    );
  }

  if (initialDataError) {
    return (
      <div className="error not-found">
        <h1>ERROR</h1>
        <p>Please try again</p>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <Slider />
    </>
  );
}
