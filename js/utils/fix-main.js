// Add script loader to main.js to load the wizard fixes
console.log('Adding wizard fixes script loader to main.js...');

// Function to append script loader to main.js
function appendScriptLoader() {
  // Read main.js
  const mainJs = fs.readFileSync('js/main.js', 'utf8');
  
  // Check if script loader is already added
  if (mainJs.includes('wizard-fixes.js')) {
    console.log('Script loader already in main.js');
    return;
  }
  
  // Append script loader
  const loader = `
// Load wizard fixes
document.addEventListener('DOMContentLoaded', function() {
  const wizardFixesScript = document.createElement('script');
  wizardFixesScript.src = 'js/fixes/wizard-fixes.js';
  document.body.appendChild(wizardFixesScript);
  console.log('Wizard fixes script loaded');
});
`;
  
  // Write updated main.js
  fs.writeFileSync('js/main.js', mainJs + loader);
  console.log('Script loader added to main.js');
}

// Call the function
appendScriptLoader();
