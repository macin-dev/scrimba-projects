// Variables
const btnStartGameEL = document.getElementById("start-game");
const scoreAEl = document.querySelector(".team-a-score");
const scoreBEl = document.querySelector(".team-b-score");
const minutesEl = document.getElementById("time-minutes");
const secondsEl = document.getElementById("time-seconds");
const scorePtsEl = document.getElementById("score-pts");
const titleEls = document.getElementsByClassName("title");
const btnPeriodEl = document.getElementById("btn-period");
const periodValueEl = document.querySelector(".period-value");
const btnEndEl = document.getElementById("end-game");

const teamPlayers = ["TBL", "Oakville"];
const totalTeams = teamPlayers.length;
let teamA = teamPlayers[0];
let teamB = teamPlayers[1];
let scoreA = 0;
let scoreB = 0;
let period = 1;
let intervalID = null;

// Event Listeners
btnStartGameEL.addEventListener("click", startGame);
scorePtsEl.addEventListener("click", scoreTeam);
btnPeriodEl.addEventListener("click", nextGame);
btnEndEl.addEventListener("click", endGame);

function scoreOnePoint(team) {
  if (team === teamA) {
    scoreA += 1;
    scoreAEl.textContent = scoreA;
    scoreAEl.classList.add("orange-count");
  } else {
    scoreB += 1;
    scoreBEl.textContent = scoreB;
    scoreBEl.classList.add("orange-count");
  }
}

function scoreTwoPts(team) {
  if (team === teamA) {
    scoreA += 2;
    scoreAEl.textContent = scoreA;
    scoreAEl.classList.add("orange-count");
  } else {
    scoreB += 2;
    scoreBEl.textContent = scoreB;
    scoreBEl.classList.add("orange-count");
  }
}

function scoreThreePts(team) {
  if (team === teamA) {
    scoreA += 3;
    scoreAEl.textContent = scoreA;
    scoreAEl.classList.add("orange-count");
  } else {
    scoreB += 3;
    scoreBEl.textContent = scoreB;
    scoreBEl.classList.add("orange-count");
  }
}

// Return a random value between min up to max - 1
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function scoreTeam() {
  // Audio score path
  const pathAudio = "/audio/game-score.mp3";
  // Pick the team
  const team = teamPlayers[getRandomInt(0, totalTeams)];
  // Score points
  const scoresPts = getRandomInt(1, 4);

  // Assign the corresponding points
  switch (scoresPts) {
    case 1:
      scoreOnePoint(team);
      soundEffect(pathAudio);
      break;
    case 2:
      scoreTwoPts(team);
      soundEffect(pathAudio);
      break;
    case 3:
      scoreThreePts(team);
      soundEffect(pathAudio);
      break;
    default:
      console.log("wrong expression");
  }

  // Highlight the winner
  if (scoreA > scoreB) {
    titleEls[1].classList.remove("text-shadow-effect");
    titleEls[0].classList.add("text-shadow-effect");
  } else if (scoreB > scoreA) {
    titleEls[0].classList.remove("text-shadow-effect");
    titleEls[1].classList.add("text-shadow-effect");
  } else {
    titleEls[1].classList.remove("text-shadow-effect");
    titleEls[0].classList.remove("text-shadow-effect");
  }
}

// Countdown from a max value to 0
function countdown(minutes) {
  const timeCycle = 60;
  let seconds = minutes * timeCycle;
  let mm = 0;
  let ss = 0;

  // Interval set for every 1 second
  intervalID = setInterval(function () {
    // Stop timer when seconds reach zero
    if (seconds === 0) {
      soundEffect("/audio/game-over.mp3");
      clearInterval(intervalID);
    }

    // Time formating
    mm = formatTime(Math.floor(seconds / 60) % 60);
    ss = formatTime(Math.floor(seconds % 60));

    // Render content to the DOM
    renderElemnts(mm, ss);

    // Subtract 1 second
    seconds = seconds - 1;
  }, 1000);
}

// Pad with 0 if the value is less than 9
function formatTime(num) {
  return num.toString().padStart(2, "0");
}

// Set sound effect
function soundEffect(url) {
  const audio = new Audio(url);
  audio.play();
}

// Triggered by a click event
function startGame() {
  const minutes = 20;

  // Initialize period count
  periodValueEl.textContent = period;
  periodValueEl.classList.add("green-count");

  // Control buttons' disabled property
  btnStartGameEL.disabled = true;
  scorePtsEl.disabled = false;
  btnPeriodEl.disabled = false;

  // Initialize countdown
  countdown(minutes);
  soundEffect("/audio/start-game.mp3");
}

function renderElemnts(mm, ss) {
  // Add a utility class to set a different color
  minutesEl.classList.add("yellow-count");
  secondsEl.classList.add("yellow-count");

  // Inserting the string to the elements
  minutesEl.textContent = mm;
  secondsEl.textContent = ss;
}

function nextGame() {
  // Reset countdown
  btnStartGameEL.removeEventListener("click", startGame);
  clearInterval(intervalID);

  // Start countdown
  countdown(20);

  // Sound Effect
  soundEffect("/audio/start-game.mp3");

  period += 1;
  periodValueEl.textContent = period;
}

function endGame() {
  location.reload();
}
