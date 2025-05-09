/**
 * Update Index.html
 * Replace old scripts with new Total Cost Analyzer files
 */
const fs = require('fs');
const path = require('path');

// Read index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// First, remove any conflicting CSS and script tags
const removePatterns = [
  /<link.*?wizard-removal\.css.*?>/g,
  /<link.*?enhanced-ui-layout\.css.*?>/g,
  /<link.*?total-cost-analyzer\.css.*?>/g,
  /<script.*?fix-injector\.js.*?><\/script>/g,
  /<script.*?fix-all\.js.*?><\/script>/g,
  /<script.*?chart-activator\.js.*?><\/script>/g,
  /<script.*?html-modifier\.js.*?><\/script>/g,
  /<script.*?enhanced-chart-builder\.js.*?><\/script>/g,
  /<script.*?enhanced-ui-layout\.js.*?><\/script>/g,
  /<script.*?enhanced-integration\.js.*?><\/script>/g,
  /<script.*?total-cost-analyzer\.js.*?><\/script>/g
];

removePatterns.forEach(pattern => {
  indexContent = indexContent.replace(pattern, '');
});

// Update page title
indexContent = indexContent.replace(/<title>.*?<\/title>/, '<title>Total Cost Analyzer</title>');

// Insert new CSS
if (!indexContent.includes('fixed-total-cost-analyzer.css')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <link rel="stylesheet" href="css/fixed-total-cost-analyzer.css">\n</head>'
  );
  console.log('Added fixed-total-cost-analyzer.css to index.html');
}

// Insert chart handler script
if (!indexContent.includes('non-conflict-chart-handler.js')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <script src="js/charts/non-conflict-chart-handler.js"></script>\n</head>'
  );
  console.log('Added non-conflict-chart-handler.js to index.html');
}

// Insert UI transformer script
if (!indexContent.includes('ui-transformer.js')) {
  indexContent = indexContent.replace(
    /<\/head>/,
    '    <script src="js/ui-transformer.js"></script>\n</head>'
  );
  console.log('Added ui-transformer.js to index.html');
}

// Write updated content back to index.html
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated index.html');
