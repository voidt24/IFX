"use client";
import { useRef, useState, useEffect, useContext } from "react";
import { moveSlider } from "../helpers/moveSlider";
import { Context } from "../context/Context";

export const Slider = ({ header = null, controls = false, sideControls = false, expectingCards = false, children }) => {
  const { openTrailer } = useContext(Context);
  const sliderRef = useRef();

  return (
    <div className={`${expectingCards ? "slider-with-cards" : "slider"}  relative ${sideControls && "lg:px-4"}`}>
      {header && (
        <div className="slider__header">
          <h2>{header}</h2>

          {controls && (
            <div className="controls ">
              <i
                className="bi bi-chevron-left left text-gray-500 hover:text-gray-200 max-lg:hidden"
                onClick={(event) => {
                  moveSlider(event, sliderRef);
                }}
              ></i>
              <i
                className="bi bi-chevron-right right text-gray-500 hover:text-gray-200 max-lg:hidden"
                onClick={(event) => {
                  moveSlider(event, sliderRef);
                }}
              ></i>
            </div>
          )}
        </div>
      )}

      {sideControls && (
        <>
          <i
            className="bi bi-chevron-left left text-gray-400 hover:text-gray-200 absolute left-0  max-lg:hidden text-2xl -mx-2"
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>

          <i
            className="bi bi-chevron-right right text-gray-400 hover:text-gray-200 absolute right-0 max-lg:hidden text-2xl -mx-2"
            onClick={(event) => {
              moveSlider(event, sliderRef, expectingCards);
            }}
          ></i>
        </>
      )}

      <div className={`grid ${expectingCards ? "slider-with-cards__content" : "slider__content"}   ${openTrailer && "on-trailer"}`} ref={sliderRef}>
        {children}
      </div>
    </div>
  );
};

export default Slider;
