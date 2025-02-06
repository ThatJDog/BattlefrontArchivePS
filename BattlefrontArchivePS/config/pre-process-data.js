const promises = require('fs').promises;
const fs = require("fs");
const path = require('path');

const { parseData } = require("./process-data.js");
const { generateEloTable } = require("./generate-elo-rankbased.js");
const { updateSeriesAndMatchIDs } = require("./update-series-and-match-ids.js");

async function loadDatabase(schema) {
    const module = await import('../db/database.js'); // ✅ Dynamically import
    return new module.Database(schema); // ✅ Correct way to instantiate
}

function saveObjectToFile(obj, filename) {
    //const jsonStr = JSON.stringify(obj, null, 2); // Pretty format with 2 spaces
    const jsonStr = JSON.stringify(obj);
    fs.writeFileSync(filename, jsonStr, "utf8");
    console.log(`✅ Object saved to ${filename}`);
}

async function main() {
    try {
        const filePath = path.join(__dirname, './swbf-schema.json'); // ✅ Correct file path
        const fileContent = await promises.readFile(filePath, 'utf8'); // ✅ Read file
        const schema = JSON.parse(fileContent); // ✅ Parse JSON

        const database = await loadDatabase(schema);

        // Step 1: Parse Data directly into database
        console.log('PRE-PROCESSING->PARSING DATA');
        await parseData(database);

        // Step 1.5: Validate Players
        validatePlayers(database, false);
        validateSeriesAndTeams(database);

        // Also validate map names, team names, season names, servers etc

        // Merge Matches that are draws or re-hosts

        // Store common tables for each page.
        // This will include the entire match, season, series tables
        // Then filters remove entries from the static table

        // Other js like generating elo leaderboard need to be run async
        // Design a loading icon / frame for all pages

        // Step 2: Re-Index all series and seasons
        console.log('PRE-PROCESSING->RE-INDEXING');
        await updateSeriesAndMatchIDs(database);

        // Step 3: Generate Elo Data for the database
        console.log('PRE-PROCESSING->GENERATING ELO');
        await generateEloTable(database);

        // Final Step: Export this Database as a JSON
        saveObjectToFile(database, "data.json");
        saveObjectToFile(database, "BattlefrontArchivePS/data.json");

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Run the main function
main();

function validatePlayers(database, showUnsignedPlayers) {
    // Group players from PlayerScore by their PlayerName and MatchID
    const playerScores = database
        .getTable("PlayerScore")
        .groupBy("PlayerName", { MatchID: (matchIDs) => [...new Set(matchIDs)] }); // Collect unique MatchIDs for each player

    // Join with Player table to identify unknown players
    playerScores.forEachRecord((record) => {
        const isUnknownPlayer = database
            .getTable("Player")
            .filter((player) => player.Name === record.PlayerName).records.length === 0;

        if (isUnknownPlayer) {
            // Case 1: Unknown Player
            const playedMatches = database
                .getTable("Season")
                .join(
                        database.getTable("Series")
                        .renameColumn("Index", "SeriesIndex")
                        .join(
                                database.getTable("Match").select((match) =>
                                    record.MatchID.includes(match.MatchID) // Check if the MatchID is part of the player's matches
                                ),
                            "INNER JOIN",
                            (series, match) => match.SeriesID === series.SeriesID
                        ),
                    "INNER JOIN",
                    (season, matches) => season.ID === matches.SeasonID
                )
                .keep(["SeasonID", "Round", "SeriesIndex", "MatchIndex"]);

            console.error("Unknown Player:", record.PlayerName, "in matches:", playedMatches.records);
        } else if (showUnsignedPlayers){
            // Case 2: Known Player but not signed up
            const playedMatches = database
                .getTable("Season")
                .join(
                    database
                        .getTable("Series")
                        .renameColumn("Index", "SeriesIndex")
                        .join(
                            database.getTable("Match").filter((match) =>
                                record.MatchID.includes(match.MatchID) // Check if the MatchID is part of the player's matches
                            ),
                            "INNER JOIN",
                            (series, match) => match.SeriesID === series.SeriesID
                        ),
                    "INNER JOIN",
                    (season, matches) => season.ID === matches.SeasonID
                )
                .keep(["SeasonID", "Round", "SeriesIndex", "MatchIndex"]);

            // Check if the player is signed up in the corresponding season
            const isSignedUp = database
                .getTable("PlayedFor")
                .filter(
                    (team) =>
                        team.SeasonID === playedMatches.records[0]?.SeasonID &&
                        team.PlayerName === record.PlayerName
                ).records.length > 0;

            if (!isSignedUp) {
                console.warn(
                    "Player played in a season they were not signed up in:",
                    record.PlayerName,
                    database
                .getTable("PlayedFor")
                .filter(
                    (team) =>
                        team.SeasonID === playedMatches.records[0]?.SeasonID &&
                        team.PlayerName === record.PlayerName
                ).records,
                    "in matches:",
                    playedMatches.records
                );
            }
        }
    });
}

function validateSeriesAndTeams(database) {
    // Get all series
    const seriesTable = database.getTable("Series");

    seriesTable.forEachRecord((series) => {
        const seasonID = series.SeasonID;

        // Check if the season exists and join the necessary data
        const seasonDetails = database
            .getTable("Season")
            .join(
                database.getTable("Series").renameColumn("Index", "SeriesIndex"),
                "INNER JOIN",
                (season, seriesRecord) => season.ID === seriesRecord.SeasonID
            )
            .filter((record) => record.SeriesID === series.SeriesID)
            .keep(["SeasonID", "Round", "SeriesIndex"]);

        if (seasonDetails.records.length === 0) {
            console.error(`Season with ID ${seasonID} does not exist for Series with Round: ${series.Round}, SeriesIndex: ${series.Index}`);
            return; // Skip further checks for this series if season doesn't exist
        }

        // Get the teams in the series
        const teams = series.Teams; // Assume "Teams" is an array of team names
        if (!teams || teams.length === 0) {
            console.warn(`No teams found in Series with Round: ${series.Round}, SeriesIndex: ${series.Index}, SeasonID: ${seasonID}`);
            return;
        }

        // Check if all teams in the series are signed up for the season
        const unsignedTeams = teams.filter((teamName) => {
            return database
                .getTable("PlayedFor")
                .filter((record) => record.SeasonID === seasonID && record.TeamName === teamName).records.length === 0;
        });

        if (unsignedTeams.length > 0) {
            console.warn(
                `The following teams in Series with Round: ${series.Round}, SeriesIndex: ${series.Index}, SeasonID: ${seasonID} are not signed up:`,
                unsignedTeams
            );
        } else {
            return;
            console.log(
                `All teams in Series with Round: ${series.Round}, SeriesIndex: ${series.Index}, SeasonID: ${seasonID} are correctly signed up.`
            );
        }
    });
}