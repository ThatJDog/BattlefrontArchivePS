/*import { Database } from "./database.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (!window.db) {  // Check if the database is already loaded
            const jsonUrl = `${window.location.origin}/BattlefrontArchivePS/data.json`;
            window.db = await Database.fromFile(jsonUrl); // Load database
            console.log("Loaded database:", window.db);
        } else {
            console.log("Database was already loaded.");
        }

        // Immediately dispatch event if it hasn't been fired
        document.dispatchEvent(new Event("DatabaseReady"));
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
});*/

import { Database } from "./database.js"; // Ensure this path is correct

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const dbKey = "battlefront_db_cache"; // Local storage key for the database
        const versionKey = "battlefront_db_version"; // Local storage key for versioning
        const jsonUrl = `${window.location.origin}/data.json`;
        const versionUrl = `${window.location.origin}/version.txt`;

        // Fetch the latest version from version.txt
        const response = await fetch(versionUrl);
        const latestVersion = await response.text();

        // Get stored version
        const cachedVersion = localStorage.getItem(versionKey);
        const cachedData = localStorage.getItem(dbKey);

        if (cachedVersion === latestVersion && cachedData) {
            console.log("Database version unchanged. Loading from Local Storage...");
            window.db = await Database.fromJSON(JSON.parse(cachedData));
        } else {
            console.log("Database version changed or missing. Fetching new data...");

            // Load database from URL
            window.db = await Database.fromFile(jsonUrl);

            // Cache new version and data
            localStorage.setItem(versionKey, latestVersion);
            localStorage.setItem(dbKey, JSON.stringify(window.db));

            console.log("New database version cached.");
        }

        console.log("Loaded database:", window.db);

        // Dispatch event if it hasn't been fired
        document.dispatchEvent(new Event("DatabaseReady"));
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
});


async function updateVersion() {
    try {
        const response = await fetch("/update-version", { method: "POST" });
        const result = await response.text();
        console.log("Server response:", result);
    } catch (error) {
        console.error("Failed to update version:", error);
    }
}