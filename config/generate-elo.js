// === GLOBAL CONSTANTS ===
const BASE_ELO = 0; // Default Elo for new players
const K_FACTOR = 30;       // Base Elo change for balanced teams
const ELO_DIVISOR = 1000;   // Standard divisor in Elo formula

// === SCALING FACTORS ===
const MIN_SCALAR = 0.1;    // Minimum scale (for strong favorites)
const MAX_SCALAR = 2.0;    // Maximum scale (for extreme underdogs)
const EXPONENT = 1.5;      // Controls non-linearity of scaling

// === PLAYER ELO DATABASE ===
let playerElo = { };

// === FUNCTION: Compute Expected Win Probability ===
function getExpectedScore(eloA, eloB) {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / ELO_DIVISOR));
}

// === FUNCTION: Remap Probability to Scaling Factor ===
function remapProbabilityToScale(p) {
    let distanceFromEven = Math.abs(p - 0.5) * 2; // Distance from 50%, normalized to 0-1
    // console.log("P Dist from Even:", distanceFromEven);

    let scalar = Math.pow(distanceFromEven, EXPONENT); // Exponential scaling
    // console.log("Dist Scalar:", scalar);

    let scaledValue = 1 + (p < 0.5 ? (MAX_SCALAR - 1) * scalar : (1 - MIN_SCALAR) * -scalar);
    
    // Clamp value between MIN_SCALAR and MAX_SCALAR
    scaledValue = Math.max(MIN_SCALAR, Math.min(MAX_SCALAR, scaledValue));
    
    // console.log("KScale:", scaledValue);
    return scaledValue;
}

// === FUNCTION: Update Elo Based on Match Result ===
function updateElo(db, winningTeam, losingTeam) {

    if (!Array.isArray(winningTeam)) {
        console.error("Error: winningTeam is not an array!", winningTeam);
        return;
    }
    
    if (!Array.isArray(losingTeam)) {
        console.error("Error: losingTeam is not an array!", losingTeam);
        return;
    }

    // Compute total team Elo
    let totalWinElo = winningTeam.reduce((sum, player) => {
        if (!(player.PlayerName in playerElo)) {
            playerElo[player.PlayerName] = BASE_ELO; // Initialize missing players
        }
        return sum + playerElo[player.PlayerName];
    }, 0);

    let totalLoseElo = losingTeam.reduce((sum, player) => {
        if (!(player.PlayerName in playerElo)) {
            playerElo[player.PlayerName] = BASE_ELO; // Initialize missing players
        }
        return sum + playerElo[player.PlayerName];
    }, 0);

    // Compute expected win probability
    let expectedWin = getExpectedScore(totalWinElo, totalLoseElo);
    // console.log("Win P:", expectedWin);

    // Get dynamically adjusted K-factor
    let kScale = remapProbabilityToScale(expectedWin);
    let scaledK = K_FACTOR * kScale;
    // console.log("KScale:", kScale);

    // Calculate Elo changes
    let eloGain = Math.max(scaledK, 0); // Ensure gain is non-negative
    let eloLoss = Math.min(-scaledK, 0); // Ensure loss is non-positive

    // Apply FULL Elo change to all players in the team
    winningTeam.forEach(player => {
        playerElo[player.PlayerName] += eloGain;
        // Log results
        db.insert('Ranked', {
            PlayerName: player.PlayerName,
            MatchID: player.MatchID,
            Elo: eloGain
        });
    });
    losingTeam.forEach(player => {
        playerElo[player.PlayerName] += eloLoss;
        // Log results
        db.insert('Ranked', {
            PlayerName: player.PlayerName,
            MatchID: player.MatchID,
            Elo: eloLoss
        });
    });

    // Log results
    // console.log("Match Results:");
    // console.log(`Winning Team (${winningTeam.join(", ")}): +${eloGain.toFixed(2)} Elo each`);
    // console.log(`Losing Team (${losingTeam.join(", ")}): ${eloLoss.toFixed(2)} Elo each`);
    // console.log("Updated Player Elo:", JSON.stringify(playerElo, null, 2));
}

// === TEST MATCHES ===
async function generateEloTable(db){

    // Step 1: Select all matches in ranked seasons (Assume ordered by time)
    // The output table will be tuples of seriesID and matchID
    const rankedMatchData = db
    .select('Season', season => season.Ranked == true)
    .join(db.select('Series'), "INNER JOIN", (season, series) => season.ID === series.SeasonID)
    .keep(['SeriesID'])
    .join(db.select("Match").keep(['MatchID', 'SeriesID']), "INNER JOIN", (series, match) => series.SeriesID === match.SeriesID)
    .join(db.select("PlayerScore").renameRecord("Score", "PlayerScore"), "INNER JOIN", (match, player) => match.MatchID === player.MatchID)
    .join(db.select("TeamScore").renameRecord("Score", "TeamScore"), "INNER JOIN", (player, team) => player.MatchID === team.MatchID)
    .select(record => record);

    // Group players into winning and losing teams
    const groupedMatches = {};

    rankedMatchData.records.forEach(record => {
        if (!groupedMatches[record.MatchID]) {
            groupedMatches[record.MatchID] = { 
                winningTeam: [], 
                losingTeam: [], 
                maxScore: -Infinity, 
                minScore: Infinity 
            };
        }

        const match = groupedMatches[record.MatchID];

        // Track max and min scores for determining winning and losing teams
        match.maxScore = Math.max(match.maxScore, record.TeamScore);
        match.minScore = Math.min(match.minScore, record.TeamScore);

        // Player structure to store in the arrays
        const playerData = {
            PlayerName: record.PlayerName,
            MatchID: record.MatchID,
            Score: record.PlayerScore,  // Using renamed column
            Kills: record.Kills,
            Deaths: record.Deaths,
            Duration: record.Duration
        };

        if (record.TeamScore === match.maxScore) {
            match.winningTeam.push(playerData);
        } else {
            match.losingTeam.push(playerData);
        }
    });

    // Call updateElo for each match
    Object.values(groupedMatches).forEach(({ winningTeam, losingTeam }) => {
        updateElo(db, winningTeam, losingTeam);
    });
    console.log(db.getTable('Ranked'));
    console.log(playerElo);
}

// Export the function for use in other files
module.exports = { generateEloTable };