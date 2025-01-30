import { processSeriesFile } from './process-series.js';
import { processPlayers } from './process-known-players.js';
import { SWBF_DB } from './swbf-schema.js';
import PDMLCompiler, { PDMLBody, PDMLNumber } from '../PDML/PDMLCompiler.js';
const compiler = new PDMLCompiler();

async function fetchFileStructure() {
    const response = await fetch('../Files/source/file-structure.json');
    if (!response.ok) {
        throw new Error(`Failed to fetch file structure: ${response.statusText}`);
    }
    return response.json();
}

function getPDMLFiles(fileTree) {
    let pdmlFiles = [];
    for (const key in fileTree) {
        if (typeof fileTree[key] === 'object' && !fileTree[key].fullPath) {
            pdmlFiles = pdmlFiles.concat(getPDMLFiles(fileTree[key]));
        } else if (fileTree[key].extension === '.pdml') {
            pdmlFiles.push(fileTree[key].relativePath);
        }
    }
    return pdmlFiles;
}

export async function parseData() {
    try {
        const fileStructure = await fetchFileStructure();
        const pdmlFiles = getPDMLFiles(fileStructure);
        
        for (const filePath of pdmlFiles) {
            // console.log(`Processing file: ${filePath}`);
            
            // Read the file content
            const response = await fetch(`./Files/Data/${filePath}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
            }
            const pdmlContent = await response.text();
            const parsedData = compiler.compile(pdmlContent);
                        
            switch (parsedData.name) {
                case 'series':
                    processSeriesFile(parsedData, SWBF_DB);
                    break;
                case 'knownplayers':
                    processPlayers(parsedData, SWBF_DB);
                    break;
                // Add more cases here for different PDML types
                default:
                    console.warn(`Unhandled PDML type: ${parsedData.name}`);
                    break;
            }
        }
    } catch (error) {
        console.error(`Error processing PDML files: ${error.message}`);
    }

    console.log(SWBF_DB);
}

/*
console.log('Database content:', {
    Match: SWBF_DB.select('Match'),
    TeamScore: SWBF_DB.select('TeamScore'),
    PlayerScore: SWBF_DB.select('PlayerScore'),
});
*/