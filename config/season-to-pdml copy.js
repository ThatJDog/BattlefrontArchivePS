const fs = require("fs");
const path = require("path");

function parseSeasonFile(input) {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
    let output = "";
    let currentSeason = false;
    let currentTeam = false;
    let currentPlayer = false;

    let teamHeader = false;
    let seasonHeader = false;

    for (let line of lines) {
        if (line.startsWith("//")) {
            // output += line + "\n";
            continue;
        } else if (line.startsWith("!")) {
            if (currentPlayer) output += "/>";
            if (currentTeam) output += "\n\t</team>";
            if (currentSeason) output += "\n</season>";

            output += "\n<season name=\"" + line.slice(1).trim()+"\"";

            currentPlayer = false;
            currentTeam = false;
            currentSeason = true;

            seasonHeader = true;

        } else if (line.startsWith("#")) {
            if (seasonHeader) output += ">";
            if (teamHeader) output += ">";
            if (currentPlayer) output += "/>";
            if (currentTeam) output += "\n\t</team>";
            
            output += "\n\t<team name=\"" + line.slice(1).trim()+"\"";

            currentPlayer = false;
            currentTeam = true;

            seasonHeader = false;
            teamHeader = true;

        } else if (line.startsWith("[")) {

            const match = line.match(/\[([^\]]+)\]\s*=?\s*"?([^"]*)"?/);
            if (match && (currentPlayer || currentTeam || currentSeason)) {
                const [key, value] = match.slice(1, 3);
                var parsedKey = key.charAt(0).toLowerCase() + key.slice(1);
                var parsedVal = value.trim();
                console.log(value);
                if (isNaN(value) && value.toLowerCase() !== "true" && value.toLowerCase() !== "false") {
                    parsedVal = `"${value}"`;
                }

                output += " " + parsedKey + "=" + parsedVal;
            } else {
                console.error("Invalid input format:", line);
            }
        } else if (line.startsWith("@")) {
        
        } else if (line) {
            if (teamHeader) output += ">";
            if (currentPlayer) output += "/>";
            
            output += "\n\t\t<player-entry name=\"" + line.trim() + "\"";

            teamHeader = false;

            currentPlayer = true;
        }
    }
    if (seasonHeader || teamHeader) output += ">";
    if (currentPlayer) output += "/>";
    if (currentTeam) output += "\n\t</season>";
    if (currentSeason) output += "\n</season>";
    
    return output;
}

function formatSeason(season, teams) {
    let seasonAttrs = Object.entries(season).map(([key, value]) => `${key}="${value}"`).join(" ");
    let teamXml = teams.map(team => formatTeam(team)).join("\n");
    return `<season ${seasonAttrs}>\n${teamXml}\n</season>\n`;
}

function formatTeam(team) {
    let teamAttrs = Object.entries(team.attributes).map(([key, value]) => `${key}="${value}"`).join(" ");
    let playerXml = team.players.map(player => formatPlayer(player)).join("\n");
    return `\t<team name="${team.name}" ${teamAttrs}>\n${playerXml}\n\t</team>`;
}

function formatPlayer(player) {
    let playerAttrs = Object.entries(player.attributes).map(([key, value]) => `${key}="${value}"`).join(" ");
    return `\t\t<player-entry name="${player.name}" ${playerAttrs}/>`;
}

function convertFile(inputPath) {
    const inputText = fs.readFileSync(inputPath, "utf8");
    const outputText = parseSeasonFile(inputText);
    const outputPath = inputPath.replace(/\.si$/, ".pdml");
    fs.writeFileSync(outputPath, outputText);
    console.log(`Converted file saved to: ${outputPath}`);
}

module.exports = { convertFile };