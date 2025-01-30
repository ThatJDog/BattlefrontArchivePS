const promises = require('fs').promises;
const fs = require("fs");
const path = require('path');

const { parseData } = require("./process-data.js");

async function loadDatabase(schema) {
    const module = await import('../db/database.js'); // ✅ Dynamically import
    return new module.Database(schema); // ✅ Correct way to instantiate
}

function saveObjectToFile(obj, filename = "data.json") {
    const jsonStr = JSON.stringify(obj, null, 2); // Pretty format with 2 spaces
    //const jsonStr = JSON.stringify(obj);
    fs.writeFileSync(filename, jsonStr, "utf8");
    console.log(`✅ Object saved to ${filename}`);
}

async function main() {
    try {
        const filePath = path.join(__dirname, './swbf-schema.json'); // ✅ Correct file path
        const fileContent = await promises.readFile(filePath, 'utf8'); // ✅ Read file
        const schema = JSON.parse(fileContent); // ✅ Parse JSON

        const database = await loadDatabase(schema);
        // const db = new database(schema);

        await parseData(database);
        saveObjectToFile(database);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Run the main function
main();