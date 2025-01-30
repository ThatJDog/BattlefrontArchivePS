
export async function processSeasonFile(parsedData, db) {
    if (parsedData.name.toLowerCase() !== 'season') return;

    // Root element: <series>
    const seriesAttributes = parsedData.attributes; //parseAttributes(parsedData);

    // Unique SeriesID generator
    const seriesID = 1;
    /*
    var seriesIndex;
    var roundIndex;
    const roundParts = input.split(".");
    if (roundParts.length === 2) {
        // Case: "3.4" -> roundIndex = 3, seriesIndex = 4
        roundIndex = parseInt(roundParts[0], 10);
        seriesIndex = parseInt(roundParts[1], 10);
    } else {
        // Case: "5" -> roundIndex = 0, seriesIndex = 5
        roundIndex = 0;
        seriesIndex = parseInt(roundParts[0], 10)
    }
*/

    // Insert series into the Series table
    db.insert('Series', {
        SeriesID: seriesID,
        Index: seriesAttributes['index'].value,
        Round: seriesAttributes['round'].value,
    });

    // Process matches
    parsedData.children.forEach((matchNode, matchIndex) => {
        if (matchNode.name.toLowerCase() !== 'match') return;

        const matchAttributes = matchNode.attributes;

        // Unique MatchID generator
        const matchID = 1;
        const matchDuration = parseTimeToMinutes(matchAttributes['timeleft'].value);

        // Insert match into the Match table
        db.insert('Match', {
            MatchID: matchID,
            SeriesID: seriesID,
            MatchIndex: matchIndex + 1, // Indexes from 1
            GameMode: matchAttributes['gamemode'].value,
            Map: matchAttributes['map'].value,
            Server: matchAttributes['server'].value,
            Duration: matchDuration,
        });

        // Process team scores
        matchNode.children.forEach((teamNode, teamIndex) => {
            if (teamNode.name !== 'teamscore') return;

            const teamAttributes = teamNode.attributes;

            // Insert team score into the TeamScore table
            db.insert('TeamScore', {
                MatchID: matchID,
                TeamName: seriesAttributes['teams'].elements[teamIndex],
                Faction: teamAttributes['faction'].value,
                Score: teamAttributes['score'].value,
            });

            // Process player scores within the team
            teamNode.children.forEach((playerNode) => {
                if (playerNode.name !== 'playerscore') return;

                const playerAttributes =  playerNode.attributes;

                let playerDuration;
                if (playerAttributes['time'])
                    playerDuration = parseTimeToMinutes(playerAttributes['time'].value);
                else
                    playerDuration = matchDuration;

                // Insert player score into the PlayerScore table
                db.insert('PlayerScore', {
                    MatchID: matchID,
                    PlayerName: playerAttributes['name'].value,
                    Score: playerAttributes['score'].value,
                    Kills: playerAttributes['kills'].value,
                    Deaths: playerAttributes['deaths'].value,
                    Duration: playerDuration
                });
            });
        });
    });
}