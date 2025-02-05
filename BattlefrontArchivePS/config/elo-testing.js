// === GLOBAL CONSTANTS ===
const K_FACTOR = 30;       // Base Elo change for balanced teams
const ELO_DIVISOR = 1000;   // Standard divisor in Elo formula

// === SCALING FACTORS ===
const MIN_SCALAR = 0.1;    // Minimum scale (for strong favorites)
const MAX_SCALAR = 2.0;    // Maximum scale (for extreme underdogs)
const EXPONENT = 1.5;      // Controls non-linearity of scaling

// === PLAYER ELO DATABASE ===
let playerElo = {
    "Alice": 1500,
    "Bob": 400,
    "Charlie": 1500,
    "Dave": 1500
};

// === FUNCTION: Compute Expected Win Probability ===
function getExpectedScore(eloA, eloB) {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / ELO_DIVISOR));
}

// === FUNCTION: Remap Probability to Scaling Factor ===
function remapProbabilityToScale(p) {
    let distanceFromEven = Math.abs(p - 0.5) * 2; // Distance from 50%, normalized to 0-1
    console.log("P Dist from Even:", distanceFromEven);

    let scalar = Math.pow(distanceFromEven, EXPONENT); // Exponential scaling
    console.log("Dist Scalar:", scalar);

    let scaledValue = 1 + (p < 0.5 ? (MAX_SCALAR - 1) * scalar : (1 - MIN_SCALAR) * -scalar);
    
    // Clamp value between MIN_SCALAR and MAX_SCALAR
    scaledValue = Math.max(MIN_SCALAR, Math.min(MAX_SCALAR, scaledValue));
    
    console.log("KScale:", scaledValue);
    return scaledValue;
}

// === FUNCTION: Update Elo Based on Match Result ===
function updateElo(winningTeam, losingTeam) {
    // Compute total team Elo
    let totalWinElo = winningTeam.reduce((sum, player) => sum + playerElo[player], 0);
    let totalLoseElo = losingTeam.reduce((sum, player) => sum + playerElo[player], 0);

    // Compute expected win probability
    let expectedWin = getExpectedScore(totalWinElo, totalLoseElo);
    console.log("Win P:", expectedWin);

    // Get dynamically adjusted K-factor
    let kScale = remapProbabilityToScale(expectedWin);
    let scaledK = K_FACTOR * kScale;
    console.log("KScale:", kScale);

    // Calculate Elo changes
    let eloGain = Math.max(scaledK, 0); // Ensure gain is non-negative
    let eloLoss = Math.min(-scaledK, 0); // Ensure loss is non-positive

    // Apply FULL Elo change to all players in the team
    winningTeam.forEach(player => playerElo[player] += eloGain);
    losingTeam.forEach(player => playerElo[player] += eloLoss);

    // Log results
    console.log("Match Results:");
    console.log(`Winning Team (${winningTeam.join(", ")}): +${eloGain.toFixed(2)} Elo each`);
    console.log(`Losing Team (${losingTeam.join(", ")}): ${eloLoss.toFixed(2)} Elo each`);
    console.log("Updated Player Elo:", JSON.stringify(playerElo, null, 2));
}

function teamElo(team){
    return team.reduce((sum, player) => sum + playerElo[player], 0);
}

// === TEST MATCHES ===
updateElo(["Alice", "Bob"], ["Charlie", "Dave"]); // Balanced teams
// updateElo(["Alice"], ["Charlie", "Dave"]); // Underdog match