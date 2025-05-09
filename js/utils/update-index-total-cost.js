/**
 * Update Index.html
 * Replace old scripts with new Total Cost Analyzer files
 */
const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Insert total-cost-analyzer.css
if (!indexContent.includes('total-cost-analyzer.css')) {
    indexContent = indexContent.replace(
        /<\/head>/,
        '    <link rel="stylesheet" href="css/total-cost-analyzer.css">\n</head>'
    );
    console.log('Added total-cost-analyzer.css to index.html');
}

// Insert simple-chart-builder.js
if (!indexContent.includes('simple-chart-builder.js')) {
    indexContent = indexContent.replace(
        /<\/head>/,
        '    <script src="js/charts/simple-chart-builder.js"></script>\n</head>'
    );
    console.log('Added simple-chart-builder.js to index.html');
}

// Insert total-cost-analyzer.js
if (!indexContent.includes('total-cost-analyzer.js')) {
    indexContent = indexContent.replace(
        /<\/head>/,
        '    <script src="js/total-cost-analyzer.js"></script>\n</head>'
    );
    console.log('Added total-cost-analyzer.js to index.html');
}

// Write updated content back to index.html
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated index.html');
