const fs = require("fs");
const path = require("path");

function parseSeasonFile(input, originalFilePath) {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
    let output = "";
    let currentSeason = {};
    let currentTeam = null;
    let currentPlayer = null;
    let teams = [];
    let players = [];

    for (let line of lines) {
        if (line.startsWith("//")) {
            continue;
        } else if (line.startsWith("!")) {
            if (Object.keys(currentSeason).length) {
                output += formatSeason(currentSeason, teams);
                teams = [];
            }
            currentSeason = {};
        } else if (line.startsWith("#")) {
            if (currentTeam) {
                teams.push({ ...currentTeam, players });
                players = [];
            }
            currentTeam = { name: line.slice(1).trim(), attributes: {} };
        } else if (line.startsWith("[")) {
            const match = line.match(/\[([^\]]+)\]\s*=?\s*"?([^"]*)"?/);
            
            if (match && (currentPlayer || currentTeam || currentSeason)) {
                const [key, value] = match.slice(1, 3);
                if (key == "CountryCode") continue;
                
                var parsedKey = key.charAt(0).toLowerCase() + key.slice(1);
                var parsedVal = isNaN(value) && value.toLowerCase() !== "true" && value.toLowerCase() !== "false" ? `"${value}"` : value;

                if (currentPlayer) {
                    currentPlayer.attributes[parsedKey] = parsedVal;
                } else if (currentTeam) {
                    currentTeam.attributes[parsedKey] = parsedVal;
                } else {
                    currentSeason[parsedKey] = parsedVal;
                }
            } else {
                console.error("Invalid input format:", line);
            }
        } else if (line.startsWith("@")) {
            line = line.replace(/\@[^\@]*\.\@\?\./, "");
            const match = line.match(/([^\.]*)\s*\.\[(.*?)\]\s*=?\s*"(.*)"/);
            
            if (match) {
                const [ , playerName, attrKey, attrValue] = match;
                let parsedKey = attrKey.charAt(0).toLowerCase() + attrKey.slice(1);
                let parsedVal = isNaN(attrValue) && attrValue.toLowerCase() !== "true" && attrValue.toLowerCase() !== "false" ? `"${attrValue}"` : attrValue;
                
                let player = players.find(p => p.name === playerName) || teams.flatMap(team => team.players).find(p => p.name === playerName);
                
                if (!player) {
                    console.error("Unknown player:", line);
                } else {
                    player.attributes[parsedKey] = parsedVal;
                }
            } else {
                console.error("Invalid input format:", line);
            }
        } else if (line) {
            if (currentPlayer) players.push(currentPlayer);
            currentPlayer = { name: line.trim(), attributes: {} };
        }
    }
    if (currentPlayer) players.push(currentPlayer);
    if (currentTeam) teams.push({ ...currentTeam, players });
    
    let cardData = [];
    processPlayerAttributes(teams, cardData);
    output += formatSeason(currentSeason, teams);
    saveCardDataFile(originalFilePath, cardData, currentSeason);
    return output;
}

function saveCardDataFile(originalFilePath, cardData, season) {
    if (cardData.length === 0) return;
    let seasonID = season.seasonID || "";
    let cardDataContent = `<cardData SeasonID="${seasonID}">\n\t${cardData.join("\n\t")}\n</cardData>`;
    let fileName = path.basename(originalFilePath, path.extname(originalFilePath)) + "_cards.pdml";
    let cardFilePath = path.join(path.dirname(originalFilePath), fileName);
    fs.writeFileSync(cardFilePath, cardDataContent);
    console.log(`Card data file saved to: ${cardFilePath}`);
}

function formatSeason(season, teams) {
    let seasonAttrs = Object.entries(season).map(([key, value]) => `${key}=${value}`).join(" ");
    let teamXml = teams.map(team => formatTeam(team)).join("\n");
    return `<season ${seasonAttrs}>\n${teamXml}\n</season>\n`;
}

function formatTeam(team) {
    let teamAttrs = Object.entries(team.attributes).map(([key, value]) => `${key}=${value}`).join(" ");
    let playerXml = team.players.map(player => formatPlayer(player)).join("\n");
    return `\t<team name="${team.name}" ${teamAttrs}>\n${playerXml}\n\t</team>`;
}

function formatPlayer(player) {
    let playerAttrs = Object.entries(player.attributes).map(([key, value]) => `${key}=${value}`).join(" ");
    return `\t\t<player-entry name="${player.name}" ${playerAttrs}/>`;
}

function formatPlayer(player) {
    let playerAttrs = Object.entries(player.attributes).map(([key, value]) => `${key}=${value}`).join(" ");
    return `\t\t<player-entry name="${player.name}" ${playerAttrs}/>`;
}

function processPlayerAttributes(teams, cardData) {
    for (let team of teams) {
        team.players = team.players.filter(player => {
            let extractedAttributes = {};
            ["imperialSkin", "rebelSkin", "cardRating", "cardStats", "playerPosition"].forEach(attr => {
                if (attr in player.attributes) {
                    extractedAttributes[attr] = player.attributes[attr];
                    delete player.attributes[attr];
                }
            });
            
            if (Object.keys(extractedAttributes).length > 0) {
                cardData.push(formatCardInfo(player.name, extractedAttributes));
                return true;
            }
            return true;
        });
    }
}

function formatCardInfo(playerName, attributes) {
    const cardStats = attributes.cardStats || '"off: 0, def: 0, obj: 0, pos: 0, int: 0, kdr: 0"';
    let cardStatsString = convertStatsString("" + cardStats);
    return `<cardInfo playerName="${playerName}" imperialSkin=${attributes.imperialSkin || '""'} rebelSkin=${attributes.rebelSkin || '""'} cardRating=${attributes.cardRating || "00"} cardStats=${cardStatsString} imperialSkin=${attributes.playerPosition || ""}/>`;
}

function convertStatsString(statsString) {
    return `{` + statsString
        .replace(/"/g, '') // Remove quotes
        .split(', ') // Split by comma and space
        .map(stat => {
            let [key, value] = stat.split(': ').map(s => s.trim()); // Split key-value and trim spaces
            return `${key}=${value}`; // Format as key=value
        })
        .join(' ') + `}`;
}

function convertFile(inputPath) {
    const inputText = fs.readFileSync(inputPath, "utf8");
    const outputText = parseSeasonFile(inputText, inputPath);
    const outputPath = inputPath.replace(/\.si$/, ".pdml");
    fs.writeFileSync(outputPath, outputText);
    console.log(`Converted file saved to: ${outputPath}`);
}

module.exports = { convertFile };