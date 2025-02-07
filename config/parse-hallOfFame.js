const fs = require("fs");
const path = require('path');

const filePath = path.join(process.cwd(), "/hof.json");

// Process a single series file
async function processHOFFile(hallOfFamePDML) {
    try {
        // Write updated version back to file
        fs.writeFileSync(filePath, JSON.stringify(hallOfFamePDML.toJSON()), "utf8");
        console.log(`✅ JSON saved to ${filePath}`);

    } catch (error) {
        console.error("Failed to write to hof.json", error);
    }
}

module.exports = {processHOFFile};