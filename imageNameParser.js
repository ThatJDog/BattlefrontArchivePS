


// imageNameParser.js
function getValueFromImageName(imageName, key) {
    // Replacing the '=' and '&' separators appropriately for URLSearchParams
    const params = new URLSearchParams(imageName);

    // Retrieve the value for the given key
    const value = params.get(key);

    // Return the value or a message if the key is not found
    return value ? value : `Key "${key}" not found`;
}

// Function to sort images by a given key (e.g., "name", "rating", etc.)
function sortImagesByKey(imagePaths, key, order = 'ascending') {
    return imagePaths.sort((a, b) => {
        // Extract the values for the given key from both image names
        const valueA = getValueFromImageName(a, key);
        const valueB = getValueFromImageName(b, key);

        // Compare the values for sorting (numerically or alphabetically)
        let comparison = 0;

        // If both values are numbers, compare them numerically
        if (!isNaN(valueA) && !isNaN(valueB)) {
            comparison = parseFloat(valueA) - parseFloat(valueB);
        } else {
            // Otherwise, compare them as strings (alphabetically)
            comparison = valueA.localeCompare(valueB);
        }

        // Adjust the comparison for descending order
        return order === 'descending' ? -comparison : comparison;
    });
}


// Load JSON file
function loadJsonFile(filePath) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load JSON file');
            }
            return response.json();
        });
}

// Get images using the path look-up map JSON file
function getImages(season, cardType) {
    loadJsonFile('Files/imageList.json').then(imageNameMap => {
        const key = `${season}/${cardType}`; // Create key from selected season and card type
        const srcList = []; // Initialize an array to store the image src paths

        // Load the JSON file containing image paths
        const imagePaths = imageNameMap[key]; // Get image paths from JSON based on the key

        if (imagePaths && imagePaths.length > 0) {
            imagePaths.forEach((imagePath) => {
                srcList.push(`Files/CardArchive/${key}/${imagePath}`); // Add the src string to the list
            });
            return srcList; // Return the list of image src strings
        } else {
            console.error(`No images found for ${key} using JSON file lookup:\n`, imageNameMap);
            return []; // Return an empty array if no images are found
        }
    });
}

function nicifyString(str) {
    // Use a regular expression to split on uppercase letters and keep them
    const words = str.replace(/([A-Z])/g, ' $1').trim().split(' ');
    
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    
    // Join the words with a space
    return capitalizedWords.join(' ');
}