const { convertFile } = require('./match-to-pdml.js');

const fs = require("fs");
const path = require("path");

// Function to recursively scan directories and process .sri files
async function processDirectory(dirPath) {
    try {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                // Recursively process subdirectories
                await processDirectory(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.sri')) {
                // Process .sri files
                try{
                    convertFile(fullPath);
                } catch (err) {
                    console.error(`Error processing file ${fullPath}: ${err.message}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error processing directory ${dirPath}: ${err.message}`);
    }
}

// Start processing from the base directory
const directoryPath = "./BattlefrontArchivePS/Files/Data"; // Base directory
processDirectory(directoryPath);