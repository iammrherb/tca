/**
 * Update Index.html
 * Add visibility enforcement scripts
 */
const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Insert force-visibility.css
if (!indexContent.includes('force-visibility.css')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <link rel="stylesheet" href="css/force-visibility.css">\n</head>'
  );
  console.log('Added force-visibility.css to index.html');
}

// Insert force-visibility.js
if (!indexContent.includes('force-visibility.js')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <script src="js/force-visibility.js"></script>\n</head>'
  );
  console.log('Added force-visibility.js to index.html');
}

// Write updated content back to index.html
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated index.html');
