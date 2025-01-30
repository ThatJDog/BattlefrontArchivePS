import { Database } from './database.js';

export const SWBF_DB = new Database({
    Organisation: ['Name'],
    Season: [
        'ID',
        'OrganisationName',
        'Name',
        'ShortName',
        'Group',
        'Colour',
        'TournamentMode',
        'TeamCap',
    ],
    Team: ['Name', 'ShortName', 'PrimColour', 'SecColour'],
    PlayedFor: [
        'TeamName',
        'SeasonID',
        'PlayerName',
        'Rating',
        'IsCaptain',
        'IsPrimary',
        'RebelImage',
        'ImperialImage',
        'CardStatsID',
    ],
    Player: ['Name', 'Nationality', 'AlterEgos'],
    Series: ['SeriesID', 'Index', 'Round'],
    Match: [
        'MatchID',
        'SeriesID',
        'MatchIndex',
        'GameMode',
        'Map',
        'Server',
        'Duration',
    ],
    PlayerScore: [
        'MatchID',
        'PlayerName',
        'Score',
        'Kills',
        'Deaths',
        'Duration',
    ],
    TeamScore: [
        'MatchID',
        'TeamName',
        'Faction',
        'Score',
    ],
    SeriesIn: ['SeasonID', 'SeriesID'],
    Award: [
        'SeasonID',
        'SeriesIndex',
        'PlayerName',
        'AwardType',
        'CardStats',
        'RebImage',
        'ImpImage',
    ],
    CardStats: [
        'CardStatsID',
        'CardRating',
        'Offence',
        'Defence',
        'KDR',
        'Objective',
        'Positioning',
        'Intelligence',
    ],
});