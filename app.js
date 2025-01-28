// Simple PDML parser to extract data
async function parsePDML(filePath) {
    const response = await fetch(filePath);
    const pdmlText = await response.text();

    // Convert XML-like PDML text into a DOM structure
    const parser = new DOMParser();
    const pdmlDoc = parser.parseFromString(pdmlText, "application/xml");

    // Check for parsing errors
    if (pdmlDoc.querySelector("parsererror")) {
        throw new Error("Error parsing PDML file.");
    }

    return pdmlDoc;
}

// Extract data from the PDML structure
function processSeries(pdmlDoc) {
    const seriesNode = pdmlDoc.querySelector("series");
    if (!seriesNode) {
        throw new Error("Invalid PDML: Missing <series> root element.");
    }

    // Extract series attributes
    const seriesData = {
        team1: seriesNode.getAttribute("team1"),
        team2: seriesNode.getAttribute("team2"),
        round: parseInt(seriesNode.getAttribute("round"), 10),
        index: parseInt(seriesNode.getAttribute("index"), 10),
        matches: [],
    };

    // Process matches
    seriesNode.querySelectorAll("match").forEach((matchNode) => {
        const matchData = {
            map: matchNode.getAttribute("map"),
            timeLeft: matchNode.getAttribute("timeLeft"),
            gameMode: matchNode.getAttribute("gameMode"),
            server: matchNode.getAttribute("server"),
            teamScores: [],
        };

        // Process team scores and player scores
        matchNode.querySelectorAll("teamScore").forEach((teamNode) => {
            const teamData = {
                faction: teamNode.getAttribute("faction"),
                score: parseInt(teamNode.getAttribute("score"), 10),
                players: [],
            };

            teamNode.querySelectorAll("playerScore").forEach((playerNode) => {
                const playerData = {
                    name: playerNode.getAttribute("name"),
                    score: parseInt(playerNode.getAttribute("score"), 10),
                    kills: parseInt(playerNode.getAttribute("kills"), 10),
                    deaths: parseInt(playerNode.getAttribute("deaths"), 10),
                };
                teamData.players.push(playerData);
            });

            matchData.teamScores.push(teamData);
        });

        seriesData.matches.push(matchData);
    });

    return seriesData;
}

// Render the data on the page
function renderSeriesData(seriesData) {
    const container = document.getElementById("series");

    // Render series details
    const seriesDetails = `
        <h2>Series: ${seriesData.team1} vs ${seriesData.team2}</h2>
        <p>Round: ${seriesData.round}, Index: ${seriesData.index}</p>
    `;
    container.innerHTML += seriesDetails;

    // Render matches
    seriesData.matches.forEach((match, index) => {
        const matchDetails = `
            <h3>Match ${index + 1}: ${match.map}</h3>
            <p>Game Mode: ${match.gameMode}, Server: ${match.server}, Time Left: ${match.timeLeft}</p>
            <div>
                ${match.teamScores
                    .map(
                        (team) => `
                    <h4>${team.faction} Team (Score: ${team.score})</h4>
                    <ul>
                        ${team.players
                            .map(
                                (player) => `
                        <li>${player.name}: ${player.score} points, ${player.kills} kills, ${player.deaths} deaths</li>
                    `
                            )
                            .join("")}
                    </ul>
                `
                    )
                    .join("")}
            </div>
        `;
        container.innerHTML += matchDetails;
    });
}

// Main function to load and process the PDML file
(async function main() {
    try {
        const pdmlDoc = await parsePDML("./pdml/series.pdml");
        const seriesData = processSeries(pdmlDoc);
        renderSeriesData(seriesData);
    } catch (error) {
        console.error("Error processing PDML:", error.message);
        document.getElementById("series").innerHTML = "<p>Failed to load PDML data.</p>";
    }
})();