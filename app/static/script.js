const maxbet = 16;
const startingPlayer = "left"; //edit with the request

let roundBet;

let tickSpacing;
let currentSawIndex;

let fog;

let lastTimestamp = null;
let left_timer = 30;
let right_timer = 30;
let timeLeft = 30 * 1000;
let activePlayer = startingPlayer;
let interval;
let timerRunning = false;
let firstStartOfTimer = true;

window.onload = function() {
  tickSpacing = getTickSpacing();
  showLogoSplash();
  initGame();
  //startTurn(startingPlayer);
}

function flickerLights(condition) {
  if (condition) {
    if (!document.body.classList.contains("flicker-violent")) {
      document.body.classList.remove("flicker-chill");
      document.body.classList.add("flicker-violent");
    }
  } else {
    if (!document.body.classList.contains("flicker-chill")) {
      document.body.classList.remove("flicker-violent");
      document.body.classList.add("flicker-chill");
    }
  }
}


function getLeftTimer(){
  return document.getElementById("timer-left");
}

function getRightTimer(){
  return document.getElementById("timer-right");
}

function initGame(){
  currentSawIndex = 8;
  roundBet = 1;
  left_timer = 30;
  right_timer = 30;
  fog = document.querySelector('.fog-overlay');
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
  if (activePlayer === "left") {
    getLeftTimer().textContent = format(timeLeft);
    getRightTimer().textContent = right_timer + ":00";
  } else {
    getRightTimer().textContent = format(timeLeft);
    getLeftTimer().textContent = left_timer + ":00";
  }
}

function clearFog() {
  fog.style.opacity = '0';
}

function stopTimer() {
  cancelAnimationFrame(interval);
  timerRunning = false;
}

function showFogFor(player) {
  fog.classList.remove('fog-left', 'fog-right');
  fog.classList.add(player === 'left' ? 'fog-left' : 'fog-right');
  fog.style.opacity = '1'; // trigger fade-in over 30s
}
function startTurn(player, resume = false) {
  firstStartOfTimer = false;
  cancelAnimationFrame(interval);
  activePlayer = player;
  //showFogFor(activePlayer);

  const start = performance.now();
  lastTimestamp = start;
  if (!resume || firstStartOfTimer) {
    timeLeft = player === "left" ? left_timer * 1000 : right_timer * 1000;
  }start;
  //console.log("Current player: ", player, "\nCurrent timer: ", timeLeft, "\nLeft timer: ", left_timer, "RightTimer: ", right_timer);
  interval = requestAnimationFrame(function tick(now) {
    const elapsed = now - lastTimestamp;
    lastTimestamp = now;
    timeLeft = Math.max(0, timeLeft - elapsed);

    updateTimers();

    if (timeLeft <=10_000){
      if(activePlayer === "left"){
        getLeftTimer().style.color = "red";
      }
      else{
        getRightTimer().style.color = "red";
      }
      //flickerLights(true);
    }
    else{
      getLeftTimer().style.color = "white";
      getRightTimer().style.color = "white";
      //flickerLights(false);
    }

    if (timeLeft > 0) {
      interval = requestAnimationFrame(tick);
    } else {
      if (activePlayer === "left") {
        moveSawBy("1");
      } else {
        moveSawBy("-1");
      }
      resetTimers();
    }
  });

  timerRunning = true;
}

function resetTimers(){
  cancelAnimationFrame(interval);
  //clearFog();
  timerRunning = false;
  getLeftTimer().textContent = left_timer + ":00";
  getRightTimer().textContent = right_timer + ":00";
  getLeftTimer().style.color = "white";
  getRightTimer().style.color = "white";
  timeLeft = startingPlayer === "left" ? left_timer * 1000 : right_timer * 1000; // Reset for next session
  //document.body.classList.replace("flicker-violent", "flicker-chill");
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

document.addEventListener('mousedown', function(e) {
   if (e.button === 1) { //wheel down
    e.preventDefault();
    if (timerRunning) {
      cancelAnimationFrame(interval);
      timerRunning = false;
    } else {
      startTurn(activePlayer, true); // resume without resetting
    }
  }

  if (e.button === 4 && timerRunning) {
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

  document.getElementById("currentBet").value = x;
  document.getElementById('betDisplay').textContent = "Current Bet: " + x;
}

function isDying(){
  if (currentSawIndex + getBet() >= maxbet) {
    right_timer = 45;
    if (getRightTimer().textContent === "30:00") {
      getRightTimer().textContent = right_timer + ":00";
    }
  }
  else{
    right_timer = 30;
    if (getRightTimer().textContent === "45:00"){
      getRightTimer().textContent = right_timer + ":00";
    }
  }
  if(currentSawIndex - getBet() <= 0){
    left_timer = 45;
    if(getLeftTimer().textContent === "30:00"){
      getLeftTimer().textContent = left_timer + ":00";
    }
  }
  else{
    left_timer = 30;
    if(getLeftTimer().textContent === "45:00"){
      getLeftTimer().textContent = left_timer + ":00";
    }
  }
}

function changeBet(delta) {
  let updatedBet = Math.max(0, Math.min(getBet() + delta, maxbet));
  setBet(updatedBet);
  isDying();
  updateBet();
}

function updateBet() {
  document.getElementById('betDisplay').textContent = "Current Bet: " + getBet();
  isDying();
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

function increaseRoundBet() {
  roundBet = Math.min(maxbet, roundBet + 1);
}

function decreaseRoundBet() {
  roundBet = Math.max(0, roundBet - 1);
}

function setSaw(index) {
  currentSawIndex = Math.max(0, Math.min(maxbet, index));
  checkDeath();
  isDying();
  renderSaw();
}

function checkDeath(){
  if(currentSawIndex === 0 ){
    showDeath(1);
  }
  if(currentSawIndex === 16){
    showDeath(2);
  }
}

function moveSawBy(directionStr) {
  let direction;
  switch(directionStr){
    case "-1":
      direction = -1;
      break;
    case "0":
      direction = 0;
      break;
    case "1":
      direction = 1;
      break;
  }

  setSaw(currentSawIndex + (getBet() * direction));
  document.getElementById("players").style.display = "none";
  document.getElementById("endButton").style.display = "flex";

  isDying();
  renderSaw();
  increaseRoundBet();
  setBet(roundBet);
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

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#numbers span").forEach(span => {
    span.addEventListener("click", () => {
      let number = parseInt(span.textContent);
      console.log("clicked span n: ", number);
      setSaw(number);
    });
  });
});

function bless(){
  decreaseRoundBet();
  decreaseRoundBet();
  moveSawBy(0);
  switchView('endButton');
}
