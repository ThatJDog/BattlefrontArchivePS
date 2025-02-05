// === GLOBAL CONSTANTS ===
const BASE_ELO = 400;      // Default Elo for new players (NEEDS TO BE UPDATED ON GRAPH MANUALLY FOR NOW)
const K_FACTOR = 30;       // Base Elo change for balanced teams
const ELO_DIVISOR = 3000;  // Standard divisor in Elo formula (sensitivity)

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
        let elo = playerElo[player.PlayerName];
        return sum + elo;
    }, 0);
    // totalWinElo /= winningTeam.length;
    
    let totalLoseElo = losingTeam.reduce((sum, player) => {
        if (!(player.PlayerName in playerElo)) {
            playerElo[player.PlayerName] = BASE_ELO; // Initialize missing players
        }
        let elo = playerElo[player.PlayerName];
        return sum
         + elo;
    }, 0);
    // totalLoseElo /= losingTeam.length;

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
    const rankedMatches = db
    .select("Season", season => season.Ranked === true)
    .join(db.select("Series"), "INNER JOIN", (season, series) => season.ID === series.SeasonID)
    .keep(["SeriesID"])

    // Join matches for a list of all ranked matches with the series it belongs to
    .join(db.select("Match").keep(["MatchID", "SeriesID"]), "INNER JOIN", (series, match) => series.SeriesID === match.SeriesID);

    // Step 2: Join player scores and the team score
    // Join player scores with the team they signed up on
    const playerWithTeams = db.select('PlayerScore').renameColumn('Score', 'PlayerScore')

    // Join the team score onto the player score (on team name and match id)
    .join(db.select('TeamScore').renameColumn('Score', 'TeamScore'), "INNER JOIN", 
    /* ON */ (player, team) => player.TeamName === team.TeamName && player.MatchID === team.MatchID)
    .keep(['TeamName', 'TeamScore', 'PlayerName', 'MatchID', 'PlayerScore', 'Kills', 'Deaths', 'Duration']);

    const rankedMatchData = rankedMatches.join(playerWithTeams, "INNER JOIN", (a, b) => a.MatchID === b.MatchID);

    // Group players into winning and losing teams
    /* Expecting the following Schema:
        TeamName, TeamScore, PlayerName, MatchID, PlayerScore, Kills, Deaths, Duration
    */

    // Group all records by MatchID
    const groupedMatches = {};

    rankedMatchData.records.forEach(record => {
        if (!groupedMatches[record.MatchID]) {
            groupedMatches[record.MatchID] = [];
        }
        groupedMatches[record.MatchID].push(record);
    });

    // Call updateElo for each match
    Object.values(groupedMatches).forEach(matchRecords => {
        const winningTeam = matchRecords.filter(record => record.TeamScore === Math.max(...matchRecords.map(r => r.TeamScore)));
        const losingTeam = matchRecords.filter(record => record.TeamScore !== Math.max(...matchRecords.map(r => r.TeamScore)));
        updateElo(db, winningTeam, losingTeam);
    });

    // console.log(db.getTable('Ranked'));
    // console.log(playerElo);
}

/**
 * Retrieves the `SeasonID` for a given `MatchID`.
 * @param {Table} db - The database instance.
 * @param {string|number} matchID - The `MatchID` to look up.
 * @returns {string|null} - The `SeasonID` if found, otherwise `null`.
 */
function getSeasonIDFromMatchID(db, matchID) {
    // Get the match record
    const match = db.select("Match", row => row.MatchID === matchID).getRecord(0);
    if (!match) return null;  // MatchID not found

    // Get the series record using SeriesID from the match
    const series = db.select("Series", row => row.SeriesID === match.SeriesID).getRecord(0);
    if (!series) return null;  // SeriesID not found

    return series.SeasonID; // Return SeasonID from the series
}


// Export the function for use in other files
module.exports = { generateEloTable };


/*

const playerWithTeams = db.select('PlayerScore').renameRecord('Score', 'PlayerScore')
    .join(db.select("PlayedFor"), "INNER JOIN", (playerScore, playedFor) =>
        playerScore.PlayerName === playedFor.PlayerName &&
        getSeasonIDFromMatchID(db, playerScore.MatchID) === playedFor.SeasonID // Ensure season matches
    )
    // Join the team score onto the player score (on team name and match id)
    .join(db.select('TeamScore').renameRecord('Score', 'TeamScore'), "INNER JOIN", (player, team) => player.TeamName === team.TeamName && player.MatchID === team.MatchID)
    .keep(['TeamName', 'TeamScore', 'PlayerName', 'MatchID', 'PlayerScore', 'Kills', 'Deaths', 'Duration']);

*/