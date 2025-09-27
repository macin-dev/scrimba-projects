// Variables
const rangeSliderEL = document.getElementById("range-slider");
const rangeSliderValueEl = document.querySelector(".range-slider__value");

// Event listener
rangeSliderEL.addEventListener("change", renderPasswordLength);

function renderPasswordLength(event) {
  const val = event.target.value;

  // Range of two values
  const min = Number(rangeSliderEL.min);
  const max = Number(rangeSliderEL.max);

  // Track width
  const distance = rangeSliderEL.offsetWidth;

  // Normalize each data feature between 0 and 1
  const percent = (val - min) / (max - min);

  // The current width of the value label
  const valueWidth = rangeSliderValueEl.offsetWidth;

  // The position scales within the available space
  // this ensures the value label's right edge is
  // aligned at the track's width right edge
  const position = percent * (distance - valueWidth);

  rangeSliderValueEl.textContent = val;
  rangeSliderValueEl.style.left = position + "px";
}
