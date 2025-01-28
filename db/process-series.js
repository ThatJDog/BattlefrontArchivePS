const fs = require('fs');
const PDMLCompiler = require('./PDMLCompiler'); // PDML parser
const SWBFArchive = require('./db/swbf-archive');
const schema = require('./db/swbf-schema');

// Helper function to parse attributes from a node
function parseAttributes(node) {
    const attributes = {};
    node.attributes.forEach((attr) => {
        attributes[attr.name] = attr.value;
    });
    return attributes;
}

// Process a single series file
function processSeriesFile(filePath, db) {
    const pdmlContent = fs.readFileSync(filePath, 'utf-8');

    // Parse the PDML file
    const compiler = new PDMLCompiler();
    const parsedData = compiler.compile(pdmlContent); // Parse the PDML file

    // Root element: <series>
    const seriesAttributes = parseAttributes(parsedData);
    const seriesIndex = parseInt(seriesAttributes.index, 10);

    // Insert series into the Series table
    db.insert('Series', {
        Index: seriesIndex,
        Round: parseInt(seriesAttributes.round, 10),
    });

    // Unique MatchID generator
    let matchIDCounter = 1;

    // Process matches
    parsedData.children.forEach((matchNode, matchIndex) => {
        if (matchNode.name !== 'match') return;

        const matchAttributes = parseAttributes(matchNode);
        const matchID = matchIDCounter++;

        // Insert match into the Match table
        db.insert('Match', {
            MatchID: matchID,
            SeriesIndex: seriesIndex,
            MatchIndex: matchIndex + 1, // Indexes from 1
            GameMode: matchAttributes.gameMode,
            Map: matchAttributes.map,
            Server: matchAttributes.server,
            Duration: matchAttributes.timeLeft,
        });

        // Process team scores
        matchNode.children.forEach((teamNode) => {
            if (teamNode.name !== 'teamScore') return;

            const teamAttributes = parseAttributes(teamNode);
            const faction = teamAttributes.faction;
            const teamScore = parseInt(teamAttributes.score, 10);

            // Insert team score into the TeamScore table
            db.insert('TeamScore', {
                MatchID: matchID,
                TeamName: faction,
                Fraction: faction,
                Score: teamScore,
            });

            // Process player scores within the team
            teamNode.children.forEach((playerNode) => {
                if (playerNode.name !== 'playerScore') return;

                const playerAttributes = parseAttributes(playerNode);

                // Insert player score into the PlayerScore table
                db.insert('PlayerScore', {
                    MatchID: matchID,
                    PlayerName: playerAttributes.name,
                    Score: parseInt(playerAttributes.score, 10),
                    Kills: parseInt(playerAttributes.kills, 10),
                    Deaths: parseInt(playerAttributes.deaths, 10),
                    Duration: matchAttributes.timeLeft,
                });
            });
        });
    });

    print(parsedData);
}

module.exports = { processSeriesFile };