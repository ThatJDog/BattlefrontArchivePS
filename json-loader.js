const JsonLoader = (function () {
    let cachedData = null; // Store parsed JSON in memory

    async function loadJSON(url) {
        if (cachedData) {
            return cachedData; // Return cached version
        }

        try {
            const response = await fetch(url);
            cachedData = await response.json(); // Parse and store
            return cachedData;
        } catch (error) {
            console.error("Error loading JSON:", error);
            throw error;
        }
    }

    return {
        getJSON: loadJSON, // Expose function to fetch cached JSON
    };
})();