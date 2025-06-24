const maxbet = 16;
let currentSawIndex = 8;
let roundBet = 1;
let tickSpacing
window.onload = function() {
  tickSpacing = getTickSpacing();
  setBet(roundBet);
  renderSaw();
};

function getBet(){
  let currentBet = document.getElementById("currentBet").value;
  return parseInt(currentBet) || 0;
}
function setBet(x){
  document.getElementById("currentBet").value = x;
  document.getElementById('betDisplay').textContent = "Current Bet: " + x;
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

  splash.classList.add("active");

}

function moveSaw(directionStr) {
  const saw = getSaw();
  const betCurrent = parseInt(document.getElementById("currentBet").value) || 0;
  const direction = directionStr === "1" ? 1 : -1;

  currentSawIndex = Math.max(0, Math.min(maxbet, currentSawIndex + direction * betCurrent));

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
}
