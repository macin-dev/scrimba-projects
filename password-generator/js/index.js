// Variables
const rangeSliderEL = document.getElementById("range-slider");
const rangeSliderValueEl = document.querySelector(".range-slider__value");
const outputPassEl = document.getElementById("password");
const generateBtnEl = document.querySelector(".btn-generate");
const togglesEl = document.getElementsByClassName("toggle");
const strengthmeterEl = document.querySelector(".strengthmeter");
const copyBtnEl = document.querySelector(".btn-copy");
const popUpEl = document.querySelector(".popup");
const barsMeter = document.getElementsByClassName("barmeter");
const listRecordEl = document.querySelector(".record-list");

// State of password
const passwordHistory = [];
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
  copyToClipboard(copyPass);
  passwordHistory.push(copyPass);
  renderPasswords();
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

// Copy to clipboard
function copyToClipboard(copyPass) {
  navigator.clipboard
    .writeText(copyPass)
    .then(() => {
      popUpEl.classList.remove("popup-hide");
      popUpEl.classList.add("popup-show");

      // Remove it after a certain time
      setTimeout(() => {
        popUpEl.classList.remove("popup-show");
        popUpEl.classList.add("popup-hide");
      }, 3000);
    })
    .catch((err) => console.log(err));
}

// Render password strength indicator
function renderPassStrengthIndicator() {
  const totalLevel = 4;
  let levels = 0;

  if (passLength < 8) {
    levels = 1;
  } else if (passLength < 11) {
    levels = 2;
  } else if (passLength < 13) {
    levels = 3;
  } else {
    levels = 4;
  }

  for (let i = 0; i < totalLevel; i++) {
    if (totalLevel - levels <= i) {
      barsMeter[i].style.backgroundColor = "#ff003c";
    } else {
      barsMeter[i].style.backgroundColor = "#00f0ff";
    }
  }
}

// Render out the record list of passwords
function renderPasswords() {
  // Remove previous nodes
  removeChildElements();

  for (let i = passwordHistory.length - 1; i >= 0; i--) {
    createPasswordElement(passwordHistory[i]);
  }
}

// Create the structure of the HTML for each recorded password
function createPasswordElement(copiedPassword) {
  // Create the structure of the HTML
  const liEl = document.createElement("li");
  const spanEL = document.createElement("span");
  const buttonEl = document.createElement("button");
  const imgEl = document.createElement("img");

  // Add attributes
  liEl.classList.add("list-recorded");
  spanEL.classList.add("password-value");
  buttonEl.type = "button";
  imgEl.src = "/icons/copy-icon.svg";
  imgEl.alt = "copy icon";
  spanEL.textContent = copiedPassword;

  // Append elements
  buttonEl.appendChild(imgEl);
  liEl.appendChild(spanEL);
  liEl.appendChild(buttonEl);
  listRecordEl.append(liEl);
}

// Remove previous child elements
function removeChildElements() {
  // As long as there's a child, it will remove it from the DOM
  while (listRecordEl.lastChild) {
    listRecordEl.removeChild(listRecordEl.lastChild);
  }
}
