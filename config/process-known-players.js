
// Process a single series file
async function processPlayers(parsedData, db) {
    if (parsedData.name.toLowerCase() !== 'knownplayers') return;

    // Process matches
    parsedData.children.forEach((playerNode) => {
        if (playerNode.name.toLowerCase() !== 'player-info') return;

        // Insert match into the Match table
        db.insert('Player', {
            Name: playerNode.getOrDefaultAttribute('name', null),
            Nationality: playerNode.getOrDefaultAttribute('country', '##'),
            AlterEgos: playerNode.getOrDefaultAttribute('alteregos', [])
        });

    });
}

module.exports = {processPlayers};