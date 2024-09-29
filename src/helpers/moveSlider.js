export function moveSlider(event, sliderRef) {
  if (event.target.matches(".right")) {
    sliderRef.current.scrollBy(window.innerWidth / 2, 0);
  } else {
    sliderRef.current.scrollBy(-(window.innerWidth / 2), 0);
  }
}
