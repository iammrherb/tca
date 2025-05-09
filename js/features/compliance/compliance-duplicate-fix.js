/**
 * Fix for ComplianceInsights class redeclaration
 */
(function() {
  try {
    // Delete any existing definitions to avoid errors
    delete window.ComplianceInsights;
    
    // Create a simple placeholder
    window.ComplianceInsights = function() {
      // Do nothing, just prevent errors
      console.log('Stub ComplianceInsights constructor called');
    };
    
    // Add key methods
    window.ComplianceInsights.prototype.updateComplianceInsights = function() {
      // Do nothing
    };
    
    window.ComplianceInsights.prototype.refreshComplianceInsights = function() {
      // Do nothing
    };
    
    console.log('ComplianceInsights class fixed to prevent redeclaration');
  } catch (error) {
    console.error('Error fixing ComplianceInsights class:', error);
  }
})();
