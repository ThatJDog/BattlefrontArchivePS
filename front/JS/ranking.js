// === GLOBAL CONSTANTS ===
const RANK_LB = 0;
const RANK_UB = 1000;

const RANK_DIVISOR = 3000;  // Standard divisor in match rank formula (sensitivity)

// === SCALING FACTORS ===
const MIN_SCALAR = 0.8;    // Minimum scale (for strong favorites)
const MAX_SCALAR = 1.1;    // Maximum scale (for extreme underdogs)
const EXPONENT = 1.5;      // Controls non-linearity of scaling

// === RANK RANGES ===
const SPM_LB = 250;
const SPM_UB = 450;

const KPM_LB = 0.6;
const KPM_UB = 2;

const KDR_LB = 0.6;
const KDR_UB = 1.8;

const SPM_W = 0.45;
const KPM_W = 0.35;
const KDR_W = 0.2;

// === LARGE SCALE WEIGHTS ===
const MEAN_W = 0.4;   // General performance
const MEDIAN_W = 0.3; // Typical performance (reduces outlier bias)
const LQR_W = 0.2;    // Consistency (ensures bad games aren't ignored)
const UQR_W = 0.1;    // Peak performance (minor bonus for high-skill games)

/* Consistency-Focused (Penalizes Bad Games Heavily)
    const MEAN_W = 0.3;
    const MEDIAN_W = 0.3;
    const LQR_W = 0.3;
    const UQR_W = 0.1;
*/

/* Performance-Focused (Rewards Peaks More)
    const MEAN_W = 0.3;
    const MEDIAN_W = 0.3;
    const LQR_W = 0.1;
    const UQR_W = 0.3;
*/

export function ratingToString(rank) {
    const rankLabels = ["F", "D", "C", "B", "A", "S"]; // Customize as needed

    // Clamp the rank between 0 and 1000
    rank = Math.max(RANK_LB, Math.min(rank, RANK_UB));

    const groupSize = Math.ceil((RANK_UB+1) / rankLabels.length); // Determine size of each rank group
    const index = Math.min(Math.floor(rank / groupSize), rankLabels.length - 1); // Map rank to index

    return rankLabels[index];
}

// Features
// - Team based ratings taking into account team balancing (Match Only)
// - Anomaly ratings weights reduced (Season Only)

/* Calculate the avg rank over series in a season */
export function rankPlayerSeason(db, playerName, seasonID){
    return rankPlayerMatchesLarge(db, playerName, db.select('Series', series => series.seasonID === seasonID)
        .join(db.getTable('Match'), 'INNER JOIN', 
            (series, match) => series.SeriesID === match.SeriesID)
        , seasonID)
    ;
}

export function rankPlayerMatchesLarge(db, playerName, matches, seasonID = null){
    const ratingInfo = rankPlayerMatchesEval(db, playerName, matches, seasonID);
    const weightedAvg = 
        (ratingInfo.mean * MEAN_W)      + 
        (ratingInfo.median * MEDIAN_W)  +
        (ratingInfo.lqr * LQR_W)        +
        (ratingInfo.uqr * UQR_W)        ;
    return weightedAvg;
}

/* Calculate the avg rank over games in a series */
export function rankPlayerSeries(db, playerName, seriesID, seasonID = null){
    return rankPlayerMatches(db, playerName, db.select('Match', match => match.SeriesID === seriesID),
        seasonID != null 
        ? seasonID 
        : db.select('Series', series => series.SeriesID === seriesID).getRecord(0).SeasonID)
    ;
}

export function rankPlayerMatches(db, playerName, matches, seasonID = null){
    let acc = 0;
    matches.forEachRecord(row => {
        acc += rankPlayerMatch(db, playerName, row.MatchID, seasonID)
    });
    return acc / matches.numRecords();
}

function rankPlayerMatchesEval(db, playerName, matches, seasonID = null) {
    let ratings = [];

    matches.forEachRecord(row => {
        ratings.push(rankPlayerMatch(db, playerName, row.MatchID, seasonID));
    });

    if (ratings.length === 0) return null; // Handle case with no matches

    ratings.sort((a, b) => a - b); // Sort for median and quartiles

    const mean = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    const min = ratings[0];
    const max = ratings[ratings.length - 1];
    const median = getPercentile(ratings, 50);
    const lqr = getPercentile(ratings, 25);
    const uqr = getPercentile(ratings, 75);

    return { mean, median, min, max, lqr, uqr };
}

// Function to get percentile value
function getPercentile(sortedArr, percentile) {
    const index = (percentile / 100) * (sortedArr.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);

    if (lower === upper) return sortedArr[lower];

    // Interpolate if between indices
    return sortedArr[lower] + (sortedArr[upper] - sortedArr[lower]) * (index - lower);
}


/* Ranking a player based on other players in the match */
export function rankPlayerMatch(db, playerName, matchID, seasonID = null) {
    // Get season ID if not provided
    if (seasonID === null)
        seasonID = getSeasonIDFromMatchID(db, matchID);

    // Get sign-up from all players in the match
    const playerScores = db.select('PlayerScore', ps => ps.MatchID === matchID)
        .join(db.getTable('PlayedFor'), 'INNER JOIN',
            (ps, pf) => pf.SeasonID === seasonID && ps.PlayerName === pf.PlayerName);

    console.log('PlayerScores: ', playerScores);

    // Get this player's score and team
    const thisScore = playerScores.select(row => row.PlayerName === playerName).getRecord(0);
    const thisTeam = thisScore.TeamName;

    // Get team power which is avg of signup rank
    const teamPowers = playerScores.groupBy('TeamName',
        { Rating: ratings => ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length });

    // Get team avg ratings
    const thisTeamPower = teamPowers.select(row => row.TeamName === thisTeam).getRecord(0).Rating;
    const otherTeamPower = teamPowers.select(row => row.TeamName !== thisTeam).getRecord(0).Rating;

    // Compute scaling factor based on player rating and team rating
    const ratingDif = thisScore.Rating - thisTeamPower;

    // Compute expected win probability
    const expectedWin = getExpectedScore(thisTeamPower, otherTeamPower);
    console.log("Win P:", expectedWin);

    // Get dynamically adjusted K-factor
    let balancingScalar = remapProbabilityToScale(expectedWin);
    console.log("KScale (Before Adj):", balancingScalar);

    // Adjust balancingScalar based on ratingDif (if negative, push towards 1)
    if (ratingDif < 0) {
        const adjustmentFactor = (Math.abs(ratingDif) - RANK_LB) / (RANK_UB - RANK_LB);
        balancingScalar = 1 + (balancingScalar - 1) * (1 - adjustmentFactor);
    }

    console.log("KScale (After Adj):", balancingScalar);

    // Calculate rating scaled with balancing k-factor
    const rating = rankPlayer(thisScore.Score, thisScore.Kills, thisScore.Deaths, thisScore.Duration);
    const scaledRating = rating * balancingScalar;
    return scaledRating;
}

function getSeasonIDFromMatchID(db, matchID){
    return db.select('Match', match => match.MatchID === matchID)
    .join(db.getTable('Series', 'INNER JOIN', (match, series) => match.SeriesID === series.SeriesID))
    .getRecord(0).SeasonID;
}

/* Ranking a player purley off their stats and nothing else */
export function rankPlayer(score, kills, deaths, duration){
    if (duration === 0) return 0;

    const spm = score / duration;
    const kpm = kills / duration;
    const kdr = kills / deaths;

    const rating = 
        mapStat(spm, SPM_LB, SPM_UB, SPM_W) + 
        mapStat(kpm, KPM_LB, KPM_UB, KPM_W) +
        mapStat(kdr, KDR_LB, KDR_UB, KDR_W) ;
    return rating;
}

function mapStat(val, min, max, weight){
    return remap(val, min, max, RANK_LB, RANK_UB) * weight;
}

// === FUNCTION: Compute Expected Win Probability ===
function getExpectedScore(eloA, eloB) {
    return 1 / (1 + Math.pow(10, (eloB - eloA) / RANK_DIVISOR));
}

// === FUNCTION: Remap Probability to Scaling Factor ===
function remapProbabilityToScale(p) {
    let distanceFromEven = Math.abs(p - 0.5) * 2; // Distance from 50%, normalized to 0-1
    let scalar = Math.pow(distanceFromEven, EXPONENT); // Exponential scaling
    let scaledValue = 1 + (p < 0.5 ? (MAX_SCALAR - 1) * scalar : (1 - MIN_SCALAR) * -scalar);
    
    // Clamp value between MIN_SCALAR and MAX_SCALAR
    scaledValue = Math.max(MIN_SCALAR, Math.min(MAX_SCALAR, scaledValue));
    return scaledValue;
}

function remap(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}