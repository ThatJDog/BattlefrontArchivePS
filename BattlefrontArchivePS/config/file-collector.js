const fs = require("fs");
const path = require("path");

// Root directory to scan
const rootDirectory = path.join(__dirname, "../Files/Data");
const outputJson = path.join(__dirname, "../Files/source/file-structure.json");

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

// Generate the nested JSON structure
const pdmlData = getPDMLFilesRecursive(rootDirectory);

// Save the result as a JSON file
try {
    fs.writeFileSync(outputJson, JSON.stringify(pdmlData, null, 2));
    console.log(`Saved PDML file structure to ${outputJson}`);
} catch (error) {
    console.error("Error writing JSON file:", error);
}