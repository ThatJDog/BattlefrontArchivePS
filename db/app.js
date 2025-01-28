const express = require('express');
const fs = require('fs');
const path = require('path');
const { initializeDatabase, insertTag } = require('./db/database');
const PDMLCompiler = require('./PDMLCompiler'); // Your PDML parser implementation

const app = express();
const PORT = 3000;

// Initialize SQLite database
const db = initializeDatabase();

// Load and parse PDML files on server startup
const pdmlDir = path.join(__dirname, 'pdml');
fs.readdir(pdmlDir, (err, files) => {
    if (err) throw err;

    files.filter(file => file.endsWith('.pdml')).forEach(file => {
        const filePath = path.join(pdmlDir, file);
        const pdmlContent = fs.readFileSync(filePath, 'utf-8');

        // Parse PDML
        const compiler = new PDMLCompiler();
        const parsedData = compiler.compile(parsePDML(pdmlContent)); // Use your parser
        insertTag(db, parsedData);
    });
});

// API route to fetch data from the database
app.get('/api/tags', (req, res) => {
    db.all(`SELECT * FROM Tags`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/attributes', (req, res) => {
    db.all(`SELECT * FROM Attributes`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Serve static files (e.g., HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});