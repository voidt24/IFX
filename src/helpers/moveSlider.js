export function moveSlider(event, sliderRef, withCards = false) {
  let value = withCards ? 2 : 4;
  if (event.target.matches(".right")) {
    sliderRef.current.scrollBy(window.innerWidth / value, 0);
  } else {
    sliderRef.current.scrollBy(-(window.innerWidth / value), 0);
  }
}
