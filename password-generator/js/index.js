// Variables
const rangeSliderEL = document.getElementById("range-slider");
const rangeSliderValueEl = document.querySelector(".range-slider__value");
const outputPassEl = document.getElementById("password");
const generateBtnEl = document.querySelector(".btn-generate");
const togglesEl = document.getElementsByClassName("toggle");
const strengthmeterEl = document.querySelector(".strengthmeter");
const copyBtnEl = document.querySelector(".btn-copy");

// State of password
let userParameters = [];
let usersPreference = [];
let passLength = null;
let passString = null;
let usersPreferenceCopy = [];
let selectedPreferences = [];
let includedPreferences = null;

// Event listener
copyBtnEl.addEventListener("click", function () {
  const copyPass = outputPassEl.value;

  navigator.clipboard
    .writeText(copyPass)
    .then(() => console.log("Copied!"))
    .catch((err) => console.log(err));
});
document.addEventListener("DOMContentLoaded", function () {
  calculateSliderValuePosition(rangeSliderEL.value);
  generateString();
  renderPassStrengthIndicator();
});
generateBtnEl.addEventListener("click", function () {
  generateString();
  renderPassStrengthIndicator();
});
rangeSliderEL.addEventListener("change", renderPasswordLength);

// Render the slider length value along with the thumb
function renderPasswordLength(event) {
  const val = event.target.value;

  // Calculate range slider value position
  calculateSliderValuePosition(val);
}

function calculateSliderValuePosition(value) {
  // Range of two values
  const min = Number(rangeSliderEL.min);
  const max = Number(rangeSliderEL.max);

  // Track width
  const distance = rangeSliderEL.offsetWidth;

  // Normalize each data feature between 0 and 1
  const percent = (value - min) / (max - min);

  // The current width of the value label
  const valueWidth = rangeSliderValueEl.offsetWidth;

  // The position scales within the available space
  // this ensures the value label's right edge is
  // aligned at the track's width right edge
  const position = percent * (distance - valueWidth);

  rangeSliderValueEl.textContent = value;
  rangeSliderValueEl.style.left = position + "px";
}

// Load parameters
function loadParameters() {
  userParameters = [];
  for (let i = 0; i < togglesEl.length; i++) {
    if (togglesEl[i].checked) {
      userParameters.push(togglesEl[i].id);
    }
  }
}

// Set default state
function setState() {
  // Load default state
  passString = "";
  passLength = Number(rangeSliderEL.value);
  usersPreference = userParameters;
  includedPreferences = 0;
  selectedPreferences = [];
  usersPreferenceCopy = [];
}

// Generate string for password
function generateString() {
  // Load user's preferences
  loadParameters();

  // Initialize state
  setState();

  // If no dataset selected, stop the code
  if (userParameters.length === 0) return;

  for (let i = 0; i < passLength; i++) {
    // Validation
    validateCharactersSet(i);

    // Pick an index between the user's preference
    const getIndice = getRandomIndex(0, usersPreference.length);

    // Switch statement
    switch (usersPreference[getIndice]) {
      case "uppercase-characters":
        passString += characters[getRandomIndex(0, 26)];
        break;
      case "lowercase-characters":
        passString += characters[getRandomIndex(26, 52)];
        break;
      case "numbers-characters":
        passString += characters[getRandomIndex(52, 62)];
        break;
      case "symbol-characters":
        passString += characters[getRandomIndex(62, 91)];
        break;
    }

    // Set the selected preferences
    if (!selectedPreferences[getIndice]) {
      selectedPreferences[getIndice] = usersPreference[getIndice];
      includedPreferences++;
    }
  }

  // Set the input value to be the new string
  outputPassEl.value = passString;
}

// Include all user's preferences at least once
function validateCharactersSet(i) {
  let remainingPreferences = usersPreference.length - includedPreferences;

  // Validation
  if (remainingPreferences >= passLength - i) {
    let position = 0;
    for (let j = 0; j < usersPreference.length; j++) {
      // If not included, set a new set
      if (usersPreference[j] !== selectedPreferences[j]) {
        usersPreferenceCopy[position] = usersPreference[j];
        position++;
      }
    }

    // Set the remaining preferences
    usersPreference = usersPreferenceCopy;

    // Reset all values
    usersPreferenceCopy = [];
    selectedPreferences = [];
    includedPreferences = 0;
  }
}

// Return a random number between min and max-1
function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Render password strength indicator
function renderPassStrengthIndicator() {
  const imgEl = document.createElement("img");

  if (passLength < 8) {
    imgEl.src = "/icons/strength-high.svg";
    imgEl.alt = "strengthmeter icon, level none";
  } else if (passLength < 11) {
    imgEl.src = "/icons/strength-medium.svg";
    imgEl.alt = "strengthmeter icon, level weak";
  } else if (passLength < 13) {
    imgEl.src = "/icons/strength-weak.svg";
    imgEl.alt = "strengthmeter icon, level medium";
  } else {
    imgEl.src = "/icons/strength-none.svg";
    imgEl.alt = "strengthmeter icon, level high";
  }

  // Remove the child of the target node, then renders a new one
  strengthmeterEl.removeChild(strengthmeterEl.lastElementChild);
  strengthmeterEl.appendChild(imgEl);
}
