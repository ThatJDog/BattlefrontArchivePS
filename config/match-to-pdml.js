const fs = require("fs");
const path = require("path");

function parsePDML(input) {
    const lines = input.split("\n").map(line => line.trim()).filter(line => line);
    let output = "";
    let currentMatch = null;
    let currentTeam = null;
    
    for (let line of lines) {
        if (line.startsWith("!")) {
            if (currentMatch) output += "\t</match>\n";
            
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
            
            output += `\t\t\t<playerScore name="${name}" score=${score} kills=${kills} deaths=${deaths}/>\n`;
        }
    }
    if (currentTeam) output += "\t\t</teamScore>\n";
    if (currentMatch) output += "\t</match>\n";
    
    return output;
}

function convertFile(inputPath) {
    const fileName = path.basename(inputPath, ".pdml");
    const [season, seasonRound, team1, vs, team2] = fileName.split("_");
    
    let round = 0;
    let roundIndex = 0;
    if (seasonRound.includes(".")) {
        [round, roundIndex] = seasonRound.split(".").map(Number);
    } else {
        roundIndex = parseInt(seasonRound, 10);
    }
    
    const inputText = fs.readFileSync(inputPath, "utf8");
    const outputText = parsePDML(inputText);
    
    const finalOutput = `<series team1="${team1}" team2="${team2}" round=${round} index=${roundIndex}>\n${outputText}</series>`;
    
    const outputPath = inputPath.replace(/\.sri$/, ".pdml");
    fs.writeFileSync(outputPath, finalOutput);
    console.log(`Converted file saved to: ${outputPath}`);
}

const inputFilePath = "./Files/Data/SX_10_Super Dude_vs_Whatever's Clever.sri";
convertFile(inputFilePath);