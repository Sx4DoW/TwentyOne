const total = 16;
const saw = document.getElementById("saw");

// Posizione corrente della sega (indice tacca 0..16)
let currentSawIndex = 8;

// Funzione per cambiare bet (incrementa o decrementa)
function changeBet(id, delta) {
    const input = document.getElementById(id);
    let val = parseInt(input.value) || 0;
    val += delta;
    if (val < 0) val = 0;
    if (val > total) val = total;
    input.value = val;
    updateBet(val);
}

// Calcola spazio tra tick per linea orizzontale
function sawPosition() {
    const lineContainer = document.querySelector(".line-container");
    const width = lineContainer.clientWidth;
    return { tickSpacing: width / total };
}

// Posiziona la sega all'inizio o al resize
function initSaw() {
    const { tickSpacing } = sawPosition();
    saw.style.left = (currentSawIndex * tickSpacing - saw.width / 2) + "px";
}

window.addEventListener("load", initSaw);
window.addEventListener("resize", initSaw);

// Mostra la selezione vincitore
function showWinnerSelect() {
    document.getElementById("winnerSelect").style.display = "block";
}

// Muove la sega in base al vincitore e bet attuale
function moveSaw() {
    const winner = document.querySelector('input[name="winner"]:checked');
    if (!winner) {
        alert("Seleziona un vincitore.");
        return;
    }
    const betCurrent = parseInt(document.getElementById("currentBet").value) || 0;
    const direction = winner.value === "1" ? 1 : -1;
    const { tickSpacing } = sawPosition();

    let newPosIndex = currentSawIndex + direction * betCurrent;

    if (newPosIndex < 0) newPosIndex = 0;
    if (newPosIndex > total) newPosIndex = total;

    // Nascondi selezione vincitore subito
    document.getElementById("winnerSelect").style.display = "none";

    saw.addEventListener("transitionend", () => {
        // Aggiorna posizione corrente
        currentSawIndex = newPosIndex;

        // Aggiorna bet attuale alla bet del round (bet del round rimane invariata)
        const betRound = parseInt(document.getElementById("roundBet").value) || 0;
        document.getElementById("currentBet").value = betRound;

        // Resetta selezione radio per futuro uso
        const radios = document.querySelectorAll('input[name="winner"]');
        radios.forEach(radio => radio.checked = false);
    }, { once: true });

    saw.style.left = (newPosIndex * tickSpacing - saw.width / 2) + "px";
}

function updateBet(value) {
  document.getElementById('betDisplay').textContent = "Current Bet: " + value;
}

// Optional: Set it on page load too
window.onload = function () {
  updateBet(document.getElementById('currentBet').value);
};
