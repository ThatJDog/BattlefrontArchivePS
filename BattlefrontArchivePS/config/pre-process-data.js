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

function saveObjectToFile(obj, filename = "data.json") {
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
        database.getTable('PlayerScore').groupBy('PlayerName', {MatchID: matchID => matchID}).join(database.getTable('Player'), 'LEFT JOIN', 
            (playerScores, players) => playerScores.PlayerName === players.Name).forEachRecord(record => {
                if (record.Name === null) {

                    let playedMatches = database.getTable('Season')
                    .join(
                        database.getTable('Series').renameColumn('Index', 'SeriesIndex')
                            .join(
                                database.getTable('Match')
                                    .filter(match => record.MatchID.includes(match.MatchID)), // Fix: Use .includes() correctly
                                'INNER JOIN', 
                                (series, match) => match.SeriesID === series.SeriesID
                            ),
                        'INNER JOIN', 
                        (season, matches) => season.ID === matches.SeasonID
                    ).keep(['SeasonID', 'Round', 'SeriesIndex', 'MatchIndex']);


                    console.error('Unkown Player: ', record.PlayerName, ' in: ', playedMatches.records);
                }
            });


        // Step 2: Re-Index all series and seasons
        console.log('PRE-PROCESSING->RE-INDEXING');
        await updateSeriesAndMatchIDs(database);

        // Step 3: Generate Elo Data for the database
        console.log('PRE-PROCESSING->GENERATING ELO');
        await generateEloTable(database);

        // Final Step: Export this Database as a JSON
        saveObjectToFile(database);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Run the main function
main();