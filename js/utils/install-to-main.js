// First remove any existing broken fixes
const existingFixes = [
  'chart-fix-simple.js',
  'deduplication-fix.js',
  'cleanup.js',
  'chart-fix.js',
  'portnox-logo-fix.js',
  'compliance-duplicate-fix.js',
  'title-fix.js',
  'direct-logo-fix.js',
  'master-fix.js',
  'combined-specific-fixes.js',
  'combined-fixes.js',
  'portnox-logo-simple.js',
  'combined.js',
  'reset_charts.js'
];

// Remove duplicate scripts
document.querySelectorAll('script').forEach(script => {
  if (script.src) {
    const scriptName = script.src.split('/').pop();
    if (existingFixes.includes(scriptName)) {
      script.remove();
    }
  }
});

// Remove any duplicate styles
document.querySelectorAll('style').forEach(style => {
  if (style.textContent.includes('.chart-container') ||
      style.textContent.includes('.logo img') ||
      style.textContent.includes('.loading-overlay')) {
    style.remove();
  }
});

// Load the ultimate master fix
const script = document.createElement('script');
script.src = 'fixes/ultimate-master-fix.js';
document.head.appendChild(script);

console.log('TCO Analyzer Optimization Complete: All fixes have been applied');
