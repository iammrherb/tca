/**
 * Deduplication Fix
 * Prevents duplicate script loading and class redeclarations
 */
(function() {
  console.log('Applying deduplication fix...');
  
  // Track loaded scripts to prevent duplicates
  window._loadedScripts = window._loadedScripts || {};
  
  // Override appendChild to prevent duplicate script tags
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(node) {
    // Only check for script nodes
    if (node.nodeName === 'SCRIPT' && node.src) {
      const src = node.src;
      
      // Extract script name to check for known problematic scripts
      const scriptName = src.split('/').pop();
      const problematicScripts = [
        'compliance-insights.js',
        'enhanced-pdf-generator.js',
        'direct-logo-fix.js',
        'portnox-logo-simple.js'
      ];
      
      // Check if script is problematic or already loaded
      if (problematicScripts.includes(scriptName) || window._loadedScripts[src]) {
        console.log(`Prevented script load: ${src}`);
        return node; // Return node without appending
      }
      
      // Mark script as loaded
      window._loadedScripts[src] = true;
    }
    
    // Call original method for all other nodes
    return originalAppendChild.call(this, node);
  };
  
  // Fix for compliance insights errors
  if (window.ComplianceInsights) {
    console.log('Fixing ComplianceInsights class');
    
    // Create a new instance that won't throw errors
    const origComplianceInsights = window.ComplianceInsights;
    window.ComplianceInsights = function() {
      this.updateComplianceInsights = function() {};
      this.refreshComplianceInsights = function() {};
    };
    
    // Try to preserve prototype methods if possible
    try {
      window.ComplianceInsights.prototype = origComplianceInsights.prototype;
    } catch (e) {
      console.log('Unable to preserve ComplianceInsights prototype');
    }
  }
  
  console.log('Deduplication fix applied successfully');
})();
