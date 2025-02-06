
export function ratingToString(rank) {
    const rankLabels = ["F", "D", "C", "B", "A", "S"]; // Customize as needed

    // Clamp the rank between 0 and 1000
    rank = Math.max(0, Math.min(rank, 1000));

    const groupSize = Math.ceil(1001 / rankLabels.length); // Determine size of each rank group
    const index = Math.min(Math.floor(rank / groupSize), rankLabels.length - 1); // Map rank to index

    return rankLabels[index];
}

export function rankPlayerSeason(){

}

export function rankPlayerSeries(){

}

export function rankPlayerMatch(){

}

export function rankPlayer(){

}