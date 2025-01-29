const fs = require("fs");
const path = require("path");

// Directory to scan (change this to your target directory)
const directoryPath = path.join(__dirname, "Files/Data");
const outputJson = path.join(__dirname, "Files/source/pdml_files.json");

// Function to get all .pdml files in a directory
function getPDMLFiles(dir) {
    let files = fs.readdirSync(dir);
    let pdmlFiles = files.filter(file => file.endsWith(".pdml"));
    return { path: dir, files: pdmlFiles };
}

try {
    const pdmlData = getPDMLFiles(directoryPath);
    fs.writeFileSync(outputJson, JSON.stringify(pdmlData, null, 2));
    console.log(`Saved ${pdmlData.files.length} PDML file paths to ${outputJson}`);
} catch (error) {
    console.error("Error reading directory:", error);
}