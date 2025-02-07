import {ratingToString, rankPlayerSeason} from './ranking.js';

export function getPlayerSummary(db, seasonId){

    return db.select("Series", row => seasonId == null || row.SeasonID === seasonId)
        .join(db.select("Match"), "INNER JOIN", (series, match) => series.SeriesID === match.SeriesID)
        .join(db.select("PlayerScore"), "INNER JOIN", (match, playerScore) => match.MatchID === playerScore.MatchID)
        .groupBy(["PlayerName"], {
            Score: (values) => values.reduce((sum, value) => sum + value, 0),
            Kills: (values) => values.reduce((sum, value) => sum + value, 0),
            Deaths: (values) => values.reduce((sum, value) => sum + value, 0),
            Duration: (values) => values.reduce((sum, value) => sum + value, 0),
            MatchID: (values) => values.length
        })
        .renameColumn('MatchID', 'Matches')

        // Get Registration for the player
        .join(
            // Rename PlayerName to Player to stop auto overwritting in hash map
            db.select("PlayedFor", (row) => seasonId != null ? row.SeasonID === seasonId : false)
                .keep(['PlayerName', 'TeamName'])
                .renameColumn('PlayerName', 'Player')
            ,
            'LEFT JOIN',
            (score, pf) => score.PlayerName === pf.Player
        )
        .drop('Player')
        .fillIfNull('TeamName', 'Unregistered')

        // Compute columns
       .addComputedColumn("ObjScore", (record) => {
            return (parseFloat(record.Score - (record.Kills * 100)) * 0.95).toFixed(0); // ObjScore - buffer
        })
        .addComputedColumn("KDR", (record) => {
            return record.Deaths > 0 
            ? (record.Kills / record.Deaths).toFixed(2)
            : "0.00";
        })
        .addComputedColumn("KPM", (record) => {
            return record.Duration > 0 
            ? (record.Kills / record.Duration).toFixed(2)
            : "0.00";
        })
        .addComputedColumn("SPM", (record) => {
            return record.Duration > 0 
            ? (record.Score / record.Duration).toFixed(2)
            : "0.00";
        })
        .addComputedColumn("OSPM", (record) => {
            return record.Duration > 0 
            ? (record.ObjScore / record.Duration).toFixed(2)
            : "0.00";
        })
        .addComputedColumn("KPG", (record) => {
            return record.Matches > 0 
            ? (record.Kills / record.Matches).toFixed(2)
            : "0.00";
        })
        .addComputedColumn("SPG", (record) => {
            return record.Matches > 0 
            ? Math.round(record.Score / record.Matches)
            : "0.00";
        })
        .addComputedColumn('Rank', record => ratingToString(rankPlayerSeason(db, record.PlayerName, seasonId)))
        .drop(['Duration', 'ObjScore'])
        .sortBy(["SPM desc", "PlayerName asc"])
        .renameColumn('PlayerName', 'Name')
        .renameColumn('TeamName', 'Team')
        .reorderColumns(['Name', 'Team', 'Rank', 'Score', 'Kills', 'Deaths', 'KDR', 'KPM', 'SPM', 'OSPM', 'KPG', 'SPG', 'Matches'])
        .sortBy(['Rank', 'Kills desc', 'Score desc', 'Name'])
    ;





    // Step 1: Get Series IDs for the season
    const playerScoresInMatches =
        db.select("Series", row => seasonId == null || row.SeasonID === seasonId)
        .join(db.select("Match"), "INNER JOIN", (series, match) => series.SeriesID === match.SeriesID)
        .join(db.select("PlayerScore"), "INNER JOIN", (match, playerScore) => match.MatchID === playerScore.MatchID);

    console.log(playerScoresInMatches);

    // Step 4: Group PlayerScores by PlayerName and aggregate stats
    const aggregatedScores = playerScoresInMatches.groupBy(["PlayerName"], {
        Score: (values) => values.reduce((sum, value) => sum + value, 0),
        Kills: (values) => values.reduce((sum, value) => sum + value, 0),
        Deaths: (values) => values.reduce((sum, value) => sum + value, 0),
        Duration: (values) => values.reduce((sum, value) => sum + value, 0),
    });

    // Step 5: Get team registration for players in the season
    const playedForSeason = db.select("PlayedFor", (row) => row.SeasonID === "bs-s1-pro");

    // Step 6: Join aggregated scores with team registration
    const playerScoresWithTeam = aggregatedScores.join(
        playedForSeason,
        "LEFT JOIN", // Include players even if they don't have a registered team
        (score, team) => score.PlayerName === team.PlayerName
    );

    let table = playerScoresWithTeam;
    
    table = table.keep(['PlayerName', 'TeamName', 'Score', 'Kills', 'Deaths', 'Duration']);
    table = table.fillIfNull('TeamName', 'Unregistered');

    playerScores = playerScores.addComputedColumn("ObjScore", (record) => {
        return (parseFloat(record.Score - (record.Kills * 100)) * 0.95).toFixed(0); // ObjScore - buffer
    });
    playerScores = playerScores.addComputedColumn("KDR", (record) => {
        return record.Deaths > 0 
        ? (record.Kills / record.Deaths).toFixed(2) // Ensure fixed decimal format
        : "0.00"; // Keep consistent format for zero deaths
    });
    playerScores = playerScores.addComputedColumn("KPM", (record) => {
        return record.Duration > 0 
        ? (record.Kills / record.Duration).toFixed(2)
        : "0.00";
    });
    playerScores = playerScores.addComputedColumn("SPM", (record) => {
        return record.Duration > 0 
        ? (record.Score / record.Duration).toFixed(2)
        : "0.00";
    });
    playerScores = playerScores.addComputedColumn("OSPM", (record) => {
        return record.Duration > 0 
        ? (record.ObjScore / record.Duration).toFixed(2)
        : "0.00";
    });

    // Round duration after adding other columns
    // table = table.applyToColumn("Duration", (value) => parseFloat(value.toFixed(2)));
    table = table.drop('Duration');
    table = table.sortBy(["SPM desc", "PlayerName asc"]);
}