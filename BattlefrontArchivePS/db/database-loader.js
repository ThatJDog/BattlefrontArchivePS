import { Database } from "./database.js"; // Ensure this path is correct

document.addEventListener("DOMContentLoaded", async () => {
    try {
        if (!window.db) {  // Check if the database is already loaded
            const jsonUrl = `${window.location.origin}/data.json`;
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
});