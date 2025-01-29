import InputStream from './InputStream.js';
import CharStream from './CharStream.js';

/**
 * This is a browser-compatible FileStream implementation.
 * It uses FileReader for local files or fetch for remote files.
 */
export default class FileStream extends InputStream {
    /**
     * Reads a file from an <input type="file"> element and creates an InputStream.
     * @param {File} file - The file object selected in an <input> element.
     * @param {boolean} decodeToUnicodeCodePoints - Whether to decode to Unicode code points.
     * @param {Function} callback - A callback function with (error, InputStream).
     */
    static fromFile(file, decodeToUnicodeCodePoints, callback) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = event.target.result;
            const charStream = new CharStream(data, decodeToUnicodeCodePoints);
            callback(null, charStream);
        };
        reader.onerror = function (event) {
            callback(event.target.error, null);
        };
        reader.readAsText(file);
    }

    /**
     * Fetches a file from a URL and creates an InputStream.
     * @param {string} url - The URL to fetch the file from.
     * @param {boolean} decodeToUnicodeCodePoints - Whether to decode to Unicode code points.
     * @param {Function} callback - A callback function with (error, InputStream).
     */
    static fromURL(url, decodeToUnicodeCodePoints, callback) {
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch file: ${response.statusText}`);
                }
                return response.text();
            })
            .then((data) => {
                const charStream = new CharStream(data, decodeToUnicodeCodePoints);
                callback(null, charStream);
            })
            .catch((error) => {
                callback(error, null);
            });
    }
}