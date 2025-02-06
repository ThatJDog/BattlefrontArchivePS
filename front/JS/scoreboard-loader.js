var matchInfo;
var team1Info;
var team2Info;
var team1Players;
var team2Players;

async function loadData(db, matchID) {
    try {
        matchInfo = db.select("Match", row => row.MatchID == matchID).getRecord(0); // Select The Match

        let playerScores = db.select("PlayerScore", row => row.MatchID === matchID).drop('MatchID'); // Select The Match
        const teamScores = db.select("TeamScore", row => row.MatchID === matchID).drop('MatchID'); // Select The Match

        // Only handle two teams
        team1Info = teamScores.getRecord(0);
        team2Info = teamScores.getRecord(1);


        playerScores = playerScores.addComputedColumn("ObjScore", (record) => {
            return (parseFloat(record.Score - (record.Kills * 100)) * 0.95).toFixed(0); // ObjScore - buffer
        });
        playerScores = playerScores.addComputedColumn("KDR", (record) => {
            return record.Deaths > 0 
            ? (record.Kills / record.Deaths).toFixed(2) // Ensure fixed decimal format
            : "0.00"; // Keep consistent format for zero deaths
        });
        playerScores = playerScores.addComputedColumn("KPM", (record) => {
            return record.Duration > 0 
            ? (record.Kills / record.Duration).toFixed(2)
            : "0.00";
        });
        playerScores = playerScores.addComputedColumn("SPM", (record) => {
            return record.Duration > 0 
            ? (record.Score / record.Duration).toFixed(2)
            : "0.00";
        });
        playerScores = playerScores.addComputedColumn("OSPM", (record) => {
            return record.Duration > 0 
            ? (record.ObjScore / record.Duration).toFixed(2)
            : "0.00";
        });
        playerScores = playerScores.addComputedColumn("Rank", (record) => {
            return 'A';
        });
        playerScores = playerScores.drop(['Duration', 'ObjScore', 'SPM', 'OSPM'])
        .reorderColumns(["PlayerName", "Rank", "Score", "Kills"]);

        const playerSplit = playerScores.renameColumn('PlayerName', 'Player').split('TeamName');
        team1Players = playerSplit[0].drop('TeamName'); // Cant always assume order is correct
        team2Players = playerSplit[1].drop('TeamName');

        console.log(matchInfo);
  
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    return urlParams.get(param);
}

function generateScoreboard(containerId, teamName, homeTeam, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create table element
    const tableParent = document.createElement("div");
    tableParent.className = ""

    const table = document.createElement("table");

    // Extract column headers from first player entry
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const records = data.map(player => columns.map(column => player[column]));

    // Create thead
    const thead = document.createElement("thead");
    const teamRow = document.createElement("tr");
    teamRow.className = "team-header " + (homeTeam ? 'friendly' : 'enemy');
    const teamHeader = document.createElement("th");
    teamHeader.colSpan = columns.length;
    teamHeader.textContent = teamName;
    teamRow.appendChild(teamHeader);
    thead.appendChild(teamRow);

    const headerRow = document.createElement("tr");
    columns.forEach(column => {
        const th = document.createElement("th");
        th.textContent = column;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create tbody
    const tbody = document.createElement("tbody");
    const targetPlayers = 6; // Target number of rows (players)

    records.forEach(player => {
        const row = document.createElement("tr");
        player.forEach(data => {
            const td = document.createElement("td");
            td.textContent = data;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });

    // Pad with empty rows if necessary
    const currentRowCount = records.length;
    if (currentRowCount < targetPlayers) {
        const emptyRowsNeeded = targetPlayers - currentRowCount;

        for (let i = 0; i < emptyRowsNeeded; i++) {
            const emptyRow = document.createElement("tr");
            emptyRow.className = "empty";

            // Assuming all rows have the same number of columns
            const columnCount = records[0]?.length || 0;

            for (let j = 0; j < columnCount; j++) {
                const emptyCell = document.createElement("td");
                emptyCell.textContent = ""; // Leave empty placeholder
                emptyRow.appendChild(emptyCell);
            }
            tbody.appendChild(emptyRow);
        }
    }

    table.appendChild(tbody);

    // Append table to container
    container.innerHTML = "";
    container.appendChild(table);
}

function update() {
    const matchID = parseFloat(getQueryParam("matchID"));

    loadData(window.db, matchID);


    const mapImg = document.getElementById('map-img'); // Select <img> by ID
    mapImg.src = `/Assets/Maps/${matchInfo.Map}.png`; // Update image source

    generateScoreboard("home scoreboard-container", "Imperial", true, team1Players.records);
    generateScoreboard("away scoreboard-container", "Rebel", false, team2Players.records);

    let team1Won = team1Info.Score > team2Info.Score;

    document.getElementById("left-winloss").textContent = team1Won ? "Victory" : "Defeat";
    document.getElementById("right-winloss").textContent = team1Won ? "Defeat" : "Victory";

    document.getElementById("left-score-txt").textContent = team1Info.Score;
    document.getElementById("right-score-txt").textContent = team2Info.Score;


    document.getElementById("left-score-img").src = "/Files/source/DZ-Seg-Blue-" + Math.min(team1Info.Score, 5) + ".png";
    document.getElementById("right-score-img").src = "/Files/source/DZ-Seg-Red-" + Math.min(team2Info.Score, 5) + ".png";

    // I want time left for the timer so assume it is 15 min match
    const matchTimeLimit = 15.0;
    const timeLeft = matchTimeLimit - matchInfo.Duration;
    document.getElementById("timer-text").textContent = formatMinutesToTime(timeLeft);

    // Example usage: Update progress to 75%
    const timerPercent = Math.max(timeLeft / matchTimeLimit, 0);
    setProgress(timerPercent, true);
}

function formatMinutesToTime(minutes) {
    const totalSeconds = Math.round(minutes * 60); // Convert to total seconds
    const mins = Math.floor(totalSeconds / 60); // Get whole minutes
    const secs = totalSeconds % 60; // Get remaining seconds
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`; // Format as MM:SS
}

function setProgress(percent, clockwise = true) {
    const progressCircle = document.querySelector(".progress");
    const radius = 45; // Same as r attribute in the SVG
    const circumference = 2 * Math.PI * radius;

    // Calculate offset for the progress
    const offset = clockwise
        ? circumference * -(1 - percent)    // Clockwise: reduce offset
        : circumference * +(1 - percent);   // Counterclockwise: increase offset

    progressCircle.style.strokeDashoffset = offset;
}


document.addEventListener("DOMContentLoaded", async () => {
});

document.addEventListener("DatabaseReady", () => {
    update();
});