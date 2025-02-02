var matchInfo;
var team1Info;
var team2Info;
var team1Players;
var team2Players;

async function loadData(db, matchID) {
    try {
      matchInfo = db.select("Match", row => row.MatchID === matchID).getRecord(0); // Select The Match

      const playerScores = db.select("PlayerScore", row => row.MatchID === matchID).drop('MatchID'); // Select The Match
      const teamScores = db.select("TeamScore", row => row.MatchID === matchID).drop('MatchID'); // Select The Match

      // Only handle two teams
      team1Info = teamScores.getRecord(0);
      team2Info = teamScores.getRecord(1);

      const playerSplit = playerScores.renameRecord('PlayerName', 'Player').split('TeamName');
      team1Players = playerSplit[0].drop(['TeamName', 'Duration']); // Camt always assume order is correct
      team2Players = playerSplit[1].drop(['TeamName', 'Duration']);

      console.log(team1Players);
  
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
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
    records.forEach(player => {
        const row = document.createElement("tr");
        player.forEach(data => {
            const td = document.createElement("td");
            td.textContent = data;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append table to container
    container.innerHTML = "";
    container.appendChild(table);
}

function update() {
    const matchID = 50; //getQueryParam("matchID");
    loadData(window.db, matchID);

    generateScoreboard("home scoreboard-container", "Team 1", true, team1Players.records);
    generateScoreboard("away scoreboard-container", "Team 2", false, team2Players.records);
}

document.addEventListener("DOMContentLoaded", async () => {
});

document.addEventListener("DatabaseReady", () => {
    update();
});