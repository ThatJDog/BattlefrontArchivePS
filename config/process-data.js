const fs = require('fs');
// const fs = require('fs').promises; // ✅ Use fs.promises for async/await

const path = require('path');
const { processSeriesFile } = require('./process-series');
const { processSeasonFile } = require('./process-season');
const { processPlayers } = require('./process-known-players');
// const { Database } = require('./database');

async function loadPDMLCompiler() {
    const module = await import('../PDML/PDMLCompiler.js'); // ✅ Dynamically import
    return new module.PDMLCompiler(); // ✅ Correct way to instantiate
}

// Root directory to scan
const rootDirectory = path.join(__dirname, "../Files/Data");

// Recursively scans directories and structures data as nested JSON
function getPDMLFilesRecursive(dir, relativePath = "") {
    let result = {};
    
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const newRelativePath = path.join(relativePath, entry.name);

            if (entry.isDirectory()) {
                // Recursively process subdirectories
                result[entry.name] = getPDMLFilesRecursive(fullPath, newRelativePath);
            } else if (entry.isFile() && entry.name.endsWith(".pdml")) {
                // Extract file name without extension
                const fileNameWithoutExt = path.parse(entry.name).name;

                // Store file information
                result[entry.name] = {
                    fullPath: fullPath,
                    relativePath: newRelativePath,
                    fileName: fileNameWithoutExt,
                    extension: path.extname(entry.name)
                };
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
    }

    return result;
}

function getPDMLFiles(fileTree) {
    let pdmlFiles = [];
    for (const key in fileTree) {
        if (typeof fileTree[key] === 'object' && !fileTree[key].fullPath) {
            pdmlFiles = pdmlFiles.concat(getPDMLFiles(fileTree[key]));
        } else if (fileTree[key].extension === '.pdml') {
            pdmlFiles.push(fileTree[key].fullPath);
        }
    }
    return pdmlFiles;
}

/**
 * Reads and processes PDML files
 */
async function parseData(database) {
    try {
        const compiler = await loadPDMLCompiler();

        // Generate the nested JSON structure
        const pdmlData = getPDMLFilesRecursive(rootDirectory);
        const pdmlFiles = getPDMLFiles(pdmlData);
        
        for (const filePath of pdmlFiles) {
            const fullPath = filePath; // path.join(__dirname, `../Files/Data/${filePath}`);
            
            // Read PDML file content
            if (!fs.existsSync(fullPath)) {
                console.warn(`File not found: ${fullPath}`);
                continue;
            }
            
            const pdmlContent = fs.readFileSync(fullPath, 'utf8');
            const parsedData = compiler.compile(pdmlContent);

            // console.log(`Processing file: ${parsedData.name}`);
                        
            switch (parsedData.name) {
                case 'series':
                    processSeriesFile(parsedData, database);
                    break;
                case 'season':
                    processSeasonFile(parsedData, database);
                    break;
                case 'knownplayers':
                    processPlayers(parsedData, database);
                    break;
                default:
                    console.warn(`Unhandled PDML type: ${parsedData.name}`);
                    break;
            }
        }
    } catch (error) {
        console.error(`Error processing PDML files: ${error.message}`);
    }

    console.log(database);
}

// Export the function for use in other files
module.exports = { parseData };