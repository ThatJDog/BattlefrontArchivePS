// import { PDMLBody, PDMLNumber } from '../PDML/PDMLCompiler.js';

function parseTimeToMinutes(timeString) {
    // Split the string into minutes and seconds
    const parts = timeString.split(":");

    // Parse the minutes and seconds
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    // Convert total time to minutes
    // Negate seconds if minutes are negative
    return minutes + Math.sign(minutes) * (seconds / 60);
}

// Process a single series file
async function processSeriesFile(seriesData, db) {
    if (seriesData.name.toLowerCase() !== 'series') return;

    // Unique SeriesID generator
    const seriesCount = db.numRecords('Series');
    const seriesID = seriesCount > 0 ? db.getLast('Series').SeriesID + 1 : 0;
    const teamNames = seriesData.getOrDefaultAttribute('teams', []);

    // Insert series into the Series table
    db.insert('Series', {
        SeriesID: seriesID,
        SeasonID: seriesData.getAttribute('season'),
        Index: seriesData.getOrDefaultAttribute('index', 0),
        Round: seriesData.getOrDefaultAttribute('round', 0),
        Teams: teamNames,
    });

    // Process matches
    seriesData.children.forEach((matchNode, matchIndex) => {
        if (matchNode.name.toLowerCase() !== 'match') return;

        // Unique MatchID generator
        const matchCount = db.numRecords('Match');
        const matchID = matchCount > 0 ? db.getLast('Match').MatchID + 1  : 0;

        const gamemodeTimeLimit = 15; // ASSUMES ALL MATCHES HAVE A MAX TIMER OF 15 MINS
        const matchDuration = matchNode.hasAttribute('timeleft') ?
            gamemodeTimeLimit - parseTimeToMinutes(matchNode.getAttribute('timeleft')) : 
            0;

        // Insert match into the Match table
        db.insert('Match', {
            MatchID: matchID,
            SeriesID: seriesID,
            MatchIndex: matchIndex + 1, // Indexes from 1
            GameMode: matchNode.getOrDefaultAttribute('gamemode', null),
            Map: matchNode.getOrDefaultAttribute('map', null),
            Server: matchNode.getOrDefaultAttribute('server', null),
            Duration: matchDuration,
        });

        // Process team scores
        matchNode.children.forEach((teamNode, teamIndex) => {
            if (teamNode.name !== 'teamscore') return;

            var teamName;
            if (teamNames && teamNames.length > teamIndex) teamName = teamNames[teamIndex].value;
            else teamName = '';

            // Insert team score into the TeamScore table
            db.insert('TeamScore', {
                MatchID: matchID,
                TeamName: teamName,
                IsHome: teamIndex == 0, // Home Team always first
                Faction: teamNode.getOrDefaultAttribute('faction', ''),
                Score: teamNode.getOrDefaultAttribute('score', 0),
            });

            // Process player scores within the team
            teamNode.children.forEach((playerNode) => {
                if (playerNode.name !== 'playerscore') return;

                let playerDuration;
                if (playerNode.hasAttribute('time'))
                    playerDuration = gamemodeTimeLimit - parseTimeToMinutes(playerNode.getAttribute('time'));
                else
                    playerDuration = matchDuration;

                // Insert player score into the PlayerScore table
                db.insert('PlayerScore', {
                    MatchID: matchID,
                    PlayerName: playerNode.getOrDefaultAttribute('name', ''),
                    TeamName: teamName,
                    Score: playerNode.getOrDefaultAttribute('score', 0),
                    Kills: playerNode.getOrDefaultAttribute('kills', 0),
                    Deaths: playerNode.getOrDefaultAttribute('deaths', 0),
                    Duration: playerDuration
                });
            });
        });
    });
}

module.exports = {processSeriesFile};