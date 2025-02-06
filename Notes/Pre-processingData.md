**Pre-Process Data Script (.js)**
```javaScript
const fs = require('fs');
const path = require('path');
const PDMLCompiler = require('./PDMLCompiler'); // Your existing PDML parser

// Directory paths
const inputDir = path.join(__dirname, 'pdml');
const outputDir = path.join(__dirname, 'dist');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Process a single PDML file and save as JSON
function processPDMLFile(filePath) {
    const fileName = path.basename(filePath, '.pdml');
    const pdmlContent = fs.readFileSync(filePath, 'utf-8');

    // Parse the PDML file
    const compiler = new PDMLCompiler();
    const parsedData = compiler.compile(parsePDML(pdmlContent)); // Use your parser logic

    // Save parsed data as JSON
    const outputFilePath = path.join(outputDir, `${fileName}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(parsedData, null, 2));
    console.log(`Generated: ${outputFilePath}`);
}

// Process all PDML files in the input directory
fs.readdirSync(inputDir)
    .filter((file) => file.endsWith('.pdml'))
    .forEach((file) => {
        processPDMLFile(path.join(inputDir, file));
    });
```

**RUN THE SCRIPT WITH:**
```
node generate-static.js
```

**Folder Structure**
```
/project-root
├── /pdml                   # Raw PDML files
│   ├── series.pdml
├── /dist                   # Generated JSON files
│   ├── series.json
├── /public                 # Static website files
│   ├── index.html
│   ├── style.css           # Optional styles
│   ├── script.js           # JavaScript logic
├── PDMLCompiler.js         # Your PDML parser
├── generate-static.js      # Script to preprocess PDML files
```