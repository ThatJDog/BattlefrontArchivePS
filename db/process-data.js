import { processSeriesFile } from './process-series.js';
import { SWBF_DB } from './swbf-schema.js';

// Mock file path for demonstration
const mockFilePath = 'Files/Data/series.pdml';

export async function parseData() {
    // Create a new database instance
    // const db = new Database();

    console.log('Parsing data from mock file path...');

    // Simulate processing the file
    await new Promise((resolve) => {
        processSeriesFile(mockFilePath, SWBF_DB); // Use the mock file path
        console.log('Data parsed successfully!');
        console.log('Database content:', {
            Match: SWBF_DB.select('Match'),
            TeamScore: SWBF_DB.select('TeamScore'),
            PlayerScore: SWBF_DB.select('PlayerScore'),
        });
        resolve();
    });
}