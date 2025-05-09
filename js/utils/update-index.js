/**
 * Update Index.html
 * Adds the fix injector script to index.html
 */
const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Check if fix injector is already included
if (indexContent.includes('fix-injector.js')) {
    console.log('Fix injector already included in index.html');
} else {
    // Add fix injector script before closing head tag
    indexContent = indexContent.replace(
        '</head>',
        '    <script src="js/fix-injector.js"></script>\n</head>'
    );
    
    // Write updated content back to index.html
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('Fix injector added to index.html');
}
