const fs = require("fs");
const path = require("path");

function parsePDML(input) {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
    let output = "";
    let currentMatch = null;
    let currentTeam = null;
    
    for (let line of lines) {
        if (line.startsWith("!")) {
            if (currentTeam) output += "\t\t</teamScore>\n";
            if (currentMatch) output += "\t</match>\n";
            currentTeam = null; // <- Clear current team
            
            const parts = line.slice(1).split("/");
            let map = parts[0];
            let timeLeft = parts[1] || "";
            let gameMode = parts[2] || "";
            let server = parts[3] || "";
            
            output += `\t<match map="${map}" timeLeft="${timeLeft}" gameMode="${gameMode}" server="${server}">\n`;
            currentMatch = map;
        } else if (line.startsWith("#")) {
            if (currentTeam) output += "\t\t</teamScore>\n";
            
            const parts = line.slice(1).split("/");
            let teamName = parts[0];
            let faction = parts[1] === "I" ? "Imperial" : "Rebel";
            let score = parts[2] || "0";
            
            output += `\t\t<teamScore faction="${faction}" score=${score}>\n`;
            currentTeam = teamName;
        } else {
            const parts = line.split("/");
            let name = parts[0];
            let score = parts[1] || "0";
            let kills = parts[2] || "0";
            let deaths = parts[3] || "0";
            let time = parts[4] || null;
            
            output += `\t\t\t<playerScore name="${name}" score=${score} kills=${kills} deaths=${deaths}`;
            if (time)
                output += ` time="${time}"/>\n`;
            else
                output += `/>\n`;
        }
    }
    if (currentTeam) output += "\t\t</teamScore>\n";
    if (currentMatch) output += "\t</match>\n";
    
    return output;
}

function convertFile(inputPath) {
    const fileName = path.basename(inputPath, ".pdml");
    let [season, seasonRound, team1, vs, team2] = fileName.split("_");

    // Converting known seasons (short) to SeasonID
    switch (season){
        case "S6": season = "bcl-s6"; break;
        case "S7": season = "bcl-s7"; break;
        case "S8": season = "bcl-s8"; break;
        case "S9": season = "bcl-s9"; break;
        case "SX": season = "bcl-s10"; break;
        case "S11": season = "bcl-s11"; break;
        case "S12": season = "bcl-s12"; break;
        case "S13": season = "bcl-s13"; break;
        case "BS S1 Chall": season = "bs-s1-cha"; break;
        case "BS S1 Pro": season = "bs-s1-pro"; break;
        case "OPLS1 AL": season = "opl-s1-ama"; break;
        case "OPLS1 PL": season = "opl-s1-pro"; break;
        case "OPLS1 GS": season = "opl-s1-gs"; break;
        case "OPLS2 AL": season = "opl-s2-ama"; break;
        case "OPLS2 PL": season = "opl-s2-pro"; break;
    }
    
    let round = 0;
    let roundIndex = 0;
    if (seasonRound.includes(".")) {
        [round, roundIndex] = seasonRound.split(".").map(Number);
    } else {
        roundIndex = parseInt(seasonRound, 10);
    }
    
    const inputText = fs.readFileSync(inputPath, "utf8");
    const outputText = parsePDML(inputText);
    
    const finalOutput = `<series season="${season}" teams=["${team1}" "${team2.replace(/\.sri$/, "")}"] round=${round} index=${roundIndex}>\n${outputText}</series>`;
    
    const outputPath = inputPath.replace(/\.sri$/, ".pdml");
    fs.writeFileSync(outputPath, finalOutput);
    console.log(`Converted file saved to: ${outputPath}`);
}

module.exports = { convertFile };