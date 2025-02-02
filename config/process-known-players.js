
// Process a single series file
async function processPlayers(parsedData, db) {

    return; // Doesnt work right now


    if (parsedData.name.toLowerCase() !== 'knownplayers') return;

    // Process matches
    parsedData.children.forEach((playerNode) => {
        if (playerNode.name.toLowerCase() !== 'player-info') return;

        const playerAttributes = playerNode.attributes;

        // Insert match into the Match table
        db.insert('Player', {
            Name: playerAttributes['name'].value,
            Nationality: playerAttributes['country'].value,
            AlterEgos: playerAttributes['alteregos'].elements,
        });

    });
}

module.exports = {processPlayers};