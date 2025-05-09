/**
 * Cleanup script
 * Removes duplicate event listeners and problematic elements
 */
(function() {
  console.log('Running cleanup script...');
  
  // List of duplicate script patterns to prevent
  const duplicatePatterns = [
    'compliance-insights.js',
    'chart-fix.js',
    'ui-controller-fix.js'
  ];
  
  // Remove duplicate script tags
  const scripts = document.querySelectorAll('script[src]');
  const scriptSrcs = {};
  
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    
    // Check if this script matches a duplicate pattern
    const isDuplicate = duplicatePatterns.some(pattern => src.includes(pattern));
    
    if (isDuplicate) {
      // Check if we've seen this pattern before
      const patternKey = duplicatePatterns.find(pattern => src.includes(pattern));
      
      if (scriptSrcs[patternKey]) {
        // This is a duplicate, remove it
        if (script.parentNode) {
          console.log('Removing duplicate script:', src);
          script.parentNode.removeChild(script);
        }
      } else {
        // First time seeing this pattern
        scriptSrcs[patternKey] = true;
      }
    }
  });
  
  // Replace Document.write if it's used
  const originalWrite = document.write;
  document.write = function() {
    console.warn('Document.write was called and blocked to prevent page reload');
  };
  
  console.log('Cleanup script completed');
})();
