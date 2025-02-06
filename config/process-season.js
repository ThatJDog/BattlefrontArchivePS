function remap(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Process a single series file
async function processSeasonFile(seasonData, db) {
    if (seasonData.name.toLowerCase() !== 'season') return;

    if (!seasonData.getAttribute('seasonid')){
        console.log("Season doesn't have an ID: " + seasonData);
        return;
    }

    const seasonID = seasonData.getAttribute('seasonid');

    const minRank = 0;
    const maxRank = 1000;
    const minRankBound = seasonData.getOrDefaultAttribute('ratinglowerbound', 0);
    const maxRankBound = seasonData.getOrDefaultAttribute('ratingupperbound', 1000);

    // Insert series into the Series table
    db.insert('Season', {
        ID: seasonID,
        OrganisationName: seasonData.getOrDefaultAttribute('organisation', null),
        Name: seasonData.getOrDefaultAttribute('name', ''),
        ShortName: seasonData.getOrDefaultAttribute('shortname', seasonData.name),
        Group: seasonData.getOrDefaultAttribute('group', null),
        Index: seasonData.getOrDefaultAttribute('seasonindex', -1),
        Ranked: seasonData.getOrDefaultAttribute('ranked', false),
        Colour: seasonData.getOrDefaultAttribute('seasoncolour', null), // TODO: ADD DEFAULT COLOUR
        TournamentMode: seasonData.getOrDefaultAttribute('tournamentmode', 'tournament'),
        TeamCap: 0,
    });

    // Process matches
    seasonData.children.forEach((teamNode, matchIndex) => {
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
                Rating: remap(playerNode.getOrDefaultAttribute('rating', 0), minRankBound, maxRankBound, minRank, maxRank),
                IsCaptain: playerNode.getOrDefaultAttribute('iscaptain', false),
                IsPrimary: playerNode.getOrDefaultAttribute('isprimary', false),
            });
        });
    });
}

module.exports = {processSeasonFile};