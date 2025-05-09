/**
 * Update Index.html
 * Adds the Fix-All script to index.html
 */
const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Check if Fix-All script is already included
if (indexContent.includes('fix-all.js')) {
    console.log('Fix-All script already included in index.html');
} else {
    // Add Fix-All script before closing head tag
    indexContent = indexContent.replace(
        '</head>',
        '    <script src="js/fix-all.js"></script>\n</head>'
    );
    
    // Write updated content back to index.html
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('Fix-All script added to index.html');
}
