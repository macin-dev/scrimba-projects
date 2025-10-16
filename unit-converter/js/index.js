// Variables
const pElArray = document.getElementsByClassName("value-conversion");
const unitEl = document.getElementById("unitValue");
const btnEl = document.querySelector(".convert-btn");

const feet = 3.28084;
const gallon = 0.264172;
const pound = 2.20462;

// Add event listeners
document.addEventListener("DOMContentLoaded", renderUnitConversions);
btnEl.addEventListener("click", renderUnitConversions);

// Convert any unit into its equivalent opposite value
function converterUnit(unitA, unitB) {
  const multiplication = unitA * unitB;
  const division = unitA / unitB;

  // Round down to three decimal places
  return {
    multiplication: multiplication.toFixed(3),
    division: division.toFixed(3),
  };
}

// Render out each unit conversion
function renderUnitConversions() {
  const inputValue = Number(unitEl.value);
  // (Meter/Feet)
  const length = converterUnit(inputValue, feet);

  // (Liters/Gallons)
  const volume = converterUnit(inputValue, gallon);

  // (Kilograms/pounds)
  const mass = converterUnit(inputValue, pound);

  pElArray[0].textContent = `${inputValue} meters = ${length.multiplication} feet | ${inputValue} feet = ${length.division} meters`;
  pElArray[1].textContent = `${inputValue} liters = ${volume.multiplication} gallons | ${inputValue} gallons = ${volume.division} liters`;
  pElArray[2].textContent = `${inputValue} kilos = ${mass.multiplication} pounds | ${inputValue} pounds = ${mass.division} kilos`;
}
