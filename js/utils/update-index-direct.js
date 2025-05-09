/**
 * Update Index.html
 * Add direct layout scripts and styles
 */
const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Remove any conflicting style and script tags
const removePatterns = [
  /<link.*?wizard-removal\.css.*?>/g,
  /<link.*?enhanced-ui-layout\.css.*?>/g,
  /<link.*?total-cost-analyzer\.css.*?>/g,
  /<link.*?fixed-total-cost-analyzer\.css.*?>/g,
  /<link.*?force-visibility\.css.*?>/g,
  /<script.*?fix-injector\.js.*?><\/script>/g,
  /<script.*?fix-all\.js.*?><\/script>/g,
  /<script.*?chart-activator\.js.*?><\/script>/g,
  /<script.*?html-modifier\.js.*?><\/script>/g,
  /<script.*?enhanced-chart-builder\.js.*?><\/script>/g,
  /<script.*?enhanced-ui-layout\.js.*?><\/script>/g,
  /<script.*?enhanced-integration\.js.*?><\/script>/g,
  /<script.*?total-cost-analyzer\.js.*?><\/script>/g,
  /<script.*?force-visibility\.js.*?><\/script>/g
];

removePatterns.forEach(pattern => {
  indexContent = indexContent.replace(pattern, '');
});

// Insert direct layout styles
if (!indexContent.includes('direct-layout.css')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <link rel="stylesheet" href="css/direct-layout.css">\n</head>'
  );
  console.log('Added direct-layout.css to index.html');
}

// Insert direct layout script
if (!indexContent.includes('direct-layout.js')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <script src="js/direct-layout.js"></script>\n</head>'
  );
  console.log('Added direct-layout.js to index.html');
}

// Insert DOM cleanup script
if (!indexContent.includes('dom-cleanup.js')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <script src="js/dom-cleanup.js"></script>\n</head>'
  );
  console.log('Added dom-cleanup.js to index.html');
}

// Write updated content back to index.html
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated index.html');
