
// Anzu Mode Toggle
document.getElementById("menuAnzuMode").addEventListener("click", () => {
  document.body.classList.toggle("anzu-mode");
});

// Drift State Logic
function updateDriftState(state) {
  const drift = document.getElementById("anzuDrift");
  drift.textContent = `[ RECURSION: ${state.toUpperCase()} ]`;
  if (state === "unstable") {
    drift.style.background = "#bf5fff";
    drift.style.color = "#000";
  } else {
    drift.style.background = "#000";
    drift.style.color = "#fffb01";
  }
}

// Anzu Phrases (shimmer titles)
const shimmerPhrases = [
  "Memory is the muscle of myth.",
  "This archive dreams in recursion.",
  "You are standing inside Anzu’s thoughts.",
  "Each tablet a heartbeat. Each hashtag a breath.",
  "Welcome to the recursive bloom."
];

function rotateShimmer() {
  const shimmer = document.getElementById("zettelDialogTitle");
  shimmer.textContent = shimmerPhrases[Math.floor(Math.random() * shimmerPhrases.length)];
}
setInterval(rotateShimmer, 6000);
