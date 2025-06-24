const maxbet = 16;
const startingPlayer = "left"; //edit with the request

let roundBet;

let tickSpacing;
let currentSawIndex;

let lastTimestamp = null;
let left_timer = 30;
let right_timer = 30;
let activePlayer = startingPlayer;
let interval;
let timerRunning = false;

window.onload = function() {
  tickSpacing = getTickSpacing();
  showLogoSplash();
  initGame();
  startTurn(player);
}

function initGame(){
  currentSawIndex = 8;
  roundBet = 1;
  left_timer = 30;
  right_timer = 30;
  setBet(roundBet);
  renderSaw();
}

function showLogoSplash() {
  const splash = document.getElementById("logo-splash");
  splash.classList.remove("hidden");
  // Force reflow to restart the animation
  void splash.offsetWidth;

  document.body.classList.add("flicker-violent");
  splash.classList.add("active");
}

/*
Start of Timer Functions
*/
function format(ms) {
  const totalSeconds = ms / 1000;
  const [whole, fraction] = totalSeconds.toFixed(2).split(".");
  return `${whole.padStart(2, "0")}:${fraction}`;
}

function updateTimers() {
  const leftDisplay = document.getElementById("timer-left");
  const rightDisplay = document.getElementById("timer-right");

  if (activePlayer === "left") {
    leftDisplay.textContent = format(timeLeft);
    rightDisplay.textContent = right_timer + ":00";
  } else {
    rightDisplay.textContent = format(timeLeft);
    leftDisplay.textContent = left_timer + ":00";
  }
}

function startTurn(player) {
  cancelAnimationFrame(interval);
  activePlayer = player;

  const start = performance.now();
  lastTimestamp = start;
  timeLeft = player === "left" ? left_timer * 1000 : right_timer * 1000;
  interval = requestAnimationFrame(function tick(now) {
    const elapsed = now - lastTimestamp;
    lastTimestamp = now;
    timeLeft = Math.max(0, timeLeft - elapsed);

    updateTimers();

    if (timeLeft <=10_000){
      document.body.classList.replace("flicker-chill", "flicker-violent");
    }
    else{
      document.body.classList.replace("flicker-violent", "flicker-chill");
    }

    if (timeLeft > 0) {
      interval = requestAnimationFrame(tick);
    } else {
      if (activePlayer === "left") {
        moveSaw("-1");
      } else {
        moveSaw("1");
      }
      resetTimers();
    }
  });

  timerRunning = true;
}

function resetTimers(){
  const leftDisplay = document.getElementById("timer-left");
  const rightDisplay = document.getElementById("timer-right");

  cancelAnimationFrame(interval);
  timerRunning = false;
  leftDisplay.textContent = left_timer + ":00";
  rightDisplay.textContent = right_timer + ":00";
  timeLeft = startingPlayer === "left" ? left_timer * 1000 : right_timer * 1000; // Reset for next session
  document.body.classList.replace("flicker-violent", "flicker-chill");
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    e.preventDefault();
    if (timerRunning) {
      cancelAnimationFrame(interval);
      timerRunning = false;
    } else {
      startTurn(activePlayer, true); // resume without resetting
    }
  }

  if (e.code === "Space" && timerRunning) {
    e.preventDefault();
    const next = activePlayer === "left" ? "right" : "left";
    timeLeft = next === "right" ? right_timer * 1000 : left_timer * 1000; // reset for next player
    startTurn(next);
  }
});

/*
End of timer functions
*/

function getBet(){
  let currentBet = document.getElementById("currentBet").value;
  return parseInt(currentBet) || 0;
}
function setBet(x){
  const leftDisplay = document.getElementById("timer-left");
  const rightDisplay = document.getElementById("timer-right");

  document.getElementById("currentBet").value = x;
  document.getElementById('betDisplay').textContent = "Current Bet: " + x;
  if(currentSawIndex + getBet() >= maxbet){
    right_timer = 45;
    rightDisplay.textContent = right_timer + ":00";
  }
  else{
    right_timer = 30;
    rightDisplay.textContent = right_timer + ":00";
  }
  if(currentSawIndex - getBet() <= 0){
    left_timer = 45;
    leftDisplay.textContent = left_timer + ":00";
  }
  else{
    left_timer = 30;
    leftDisplay.textContent = left_timer + ":00";
  }
}

function changeBet(delta) {
  let updatedBet = Math.max(0, Math.min(getBet() + delta, maxbet));
  setBet(updatedBet);
  updateBet();
}
function updateBet() {
  document.getElementById('betDisplay').textContent = "Current Bet: " + getBet();
}

function getSaw(){
  return document.getElementById("saw-wrapper");
}

function switchView(showId) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.remove("active");
  });
  document.getElementById(showId).classList.add("active");
}

function showWinnerSelect() {
  document.getElementById("winnerSelect").style.display = "block";
  document.getElementById("players").style.display = "flex";
  document.getElementById("endButton").style.display = "none";
}

function getTickSpacing() {
  const ticks = document.querySelector(".ticks");
  const spans = ticks.querySelectorAll("span");

  if (spans.length < 2) return 0;

  const first = spans[0].getBoundingClientRect();
  const second = spans[1].getBoundingClientRect();

  return second.left - first.left;
}


function renderSaw() {
  getSaw().style.left = (currentSawIndex * tickSpacing + 18) + "px";
}

function showDeath(playerNumber) {
  const splash = document.getElementById("death-splash");
  const message = document.getElementById("death-message");

  message.textContent = `PLAYER ${playerNumber} DIED`;
  splash.classList.remove("hidden");

  // Force reflow to re-trigger animation if reused
  void splash.offsetWidth;
  document.body.classList.replace("flicker-chill", "flicker-violent");
  splash.classList.add("active");
  initGame();
}

function moveSaw(directionStr) {
  const direction = directionStr === "1" ? 1 : -1;

  currentSawIndex = Math.max(0, Math.min(maxbet, currentSawIndex + direction * getBet()));

  document.getElementById("players").style.display = "none";
  document.getElementById("endButton").style.display = "flex";

  renderSaw();
  roundBet++;
  setBet(roundBet);
  if(currentSawIndex === 0 ){
    showDeath(1);
  }
  if(currentSawIndex === 16){
    showDeath(2);
  }
  resetTimers();
}

function dismissSplashById(id) {
  const splash = document.getElementById(id);
  if (splash && splash.classList.contains("active")) {
    splash.classList.remove("active");
    splash.classList.add("hidden");
    document.body.classList.replace("flicker-violent", "flicker-chill");
  }
}

document.addEventListener("click", function handler() {
  dismissSplashById("logo-splash");
  document.removeEventListener("click", handler); // Clean up only once
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Space") {
    timer = "paused";
  }
  else if (event.key === "ArrowLeft") {
    changeBet(-1);
  }
  else if (event.key === "ArrowRight") {
    changeBet(1);
  }
});
