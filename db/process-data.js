import { processSeriesFile } from './process-series.js';
import SWBFArchive from './db/swbf-archive.js';

// Mock file path for demonstration
const mockFilePath = 'Files/Data/series.pdml';

export async function parseData() {
    // Create a new database instance
    const db = new SWBFArchive();

    console.log('Parsing data from mock file path...');

    // Simulate processing the file
    await new Promise((resolve) => {
        setTimeout(() => {
            processSeriesFile(mockFilePath, db); // Use the mock file path
            console.log('Data parsed successfully!');
            console.log('Database content:', {
                Match: db.select('Match'),
                TeamScore: db.select('TeamScore'),
                PlayerScore: db.select('PlayerScore'),
            });
            resolve();
        }, 1000); // Simulate a delay for loading
    });
}