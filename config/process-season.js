
// Process a single series file
async function processSeasonFile(seriesData, db) {
    if (seriesData.name.toLowerCase() !== 'season') return;

    if (!seriesData.getAttribute('seasonid')){
        console.log("Season doesn't have an ID: " + seriesData);
        return;
    }

    const seasonID = seriesData.getAttribute('seasonid');

    // Insert series into the Series table
    db.insert('Season', {
        ID: seasonID,
        OrganisationName: seriesData.getOrDefaultAttribute('org', null),
        Name: seriesData.getOrDefaultAttribute('name', ''),
        ShortName: seriesData.getOrDefaultAttribute('shortname', seriesData.name),
        Group: seriesData.getOrDefaultAttribute('group', null),
        Ranked: true,
        Colour: seriesData.getOrDefaultAttribute('seasoncolour', null), // TODO: ADD DEFAULT COLOUR
        TournamentMode: seriesData.getOrDefaultAttribute('tournamentmode', 'tournament'),
        TeamCap: 0,
    });

    // Process matches
    seriesData.children.forEach((teamNode, matchIndex) => {
        if (teamNode.name.toLowerCase() !== 'team') return;

        // Insert match into the Match table
        const teamName = teamNode.getOrDefaultAttribute('name', '');

        db.insert('Team', {
            SeasonID: seasonID,
            Name: teamName,
            ShortName: teamNode.getOrDefaultAttribute('shortname', teamName),
            PrimColour: teamNode.getOrDefaultAttribute('primarycolour', ''), // TODO: ADD DEFAULT COLOUR
            SecColour: teamNode.getOrDefaultAttribute('secondarycolour', ''), // TODO: ADD DEFAULT COLOUR
        });

        // Process team scores
        teamNode.children.forEach((playerNode) => {
            if (playerNode.name !== 'player-entry') return;

            // Insert team score into the TeamScore table
            db.insert('PlayedFor', {
                SeasonID: seasonID,
                TeamName: teamName,
                PlayerName: playerNode.getOrDefaultAttribute('name', ''),
                Rating: playerNode.getOrDefaultAttribute('rating', null),
                IsCaptain: playerNode.getOrDefaultAttribute('iscaptain', false),
                IsPrimary: playerNode.getOrDefaultAttribute('isprimary', false),
            });
        });
    });
}

module.exports = {processSeasonFile};