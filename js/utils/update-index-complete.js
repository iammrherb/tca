/**
 * Update Index.html
 * Add all enhancement scripts and styles
 */
const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Update page title
indexContent = indexContent.replace(/<title>.*?<\/title>/, '<title>Total Cost Analyzer</title>');

// Add main enhancement script
if (!indexContent.includes('main-enhancement.js')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <script src="js/main-enhancement.js"></script>\n</head>'
  );
  console.log('Added main-enhancement.js to index.html');
}

// Write updated content back to index.html
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated index.html');
