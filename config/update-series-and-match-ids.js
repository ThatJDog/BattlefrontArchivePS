function updateSeriesAndMatchIDs(db) {
 
    // Step 1: Join Series with Season using renamed 'Index' to 'SeasonIndex', keeping only necessary columns
    const seriesOrdered = db.getTable('Series')
        .join(db.getTable('Season').renameColumn('Index', 'SeasonIndex'), "INNER JOIN", (series, season) => series.SeasonID === season.ID)
        .keep(['SeasonIndex', 'SeasonID', 'SeriesID', 'Round', 'Index', 'Teams'])
        .sortBy(["SeasonIndex", "Round", "Index"]).drop('SeasonIndex').alignSchema(db.getTable('Series')); // Align columns

    db.setTable('Series', seriesOrdered);
    
    // Step 2: Re-index SeriesID and update references in Match table
    let i = 0;
    db.reIndex(
        'Series', 'SeriesID',
        _ => i++, // Sequential indexing from 0
        [['Match', 'SeriesID']]
    );
    
    // Step 3: Sort Matches by updated SeriesID and existing MatchIndex order
    const sortedMatches = db.getTable('Match').sortBy(["SeriesID", "MatchIndex"]);
    db.setTable('Match', sortedMatches);
    
    // Step 4: Re-index MatchID and update references in PlayerScore and TeamScore tables
    let j = 0;
    db.reIndex(
        'Match', 'MatchID',
        _ => j++, // Sequential indexing from 0
        [['PlayerScore', 'MatchID'], ['TeamScore', 'MatchID']]
    );

    db.setTable('PlayerScore', db.getTable('PlayerScore').sortBy(['MatchID']))
    db.setTable('TeamScore', db.getTable('TeamScore').sortBy(['MatchID']))
}

module.exports = { updateSeriesAndMatchIDs };