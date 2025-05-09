/**
 * Sensitivity Analysis
 * - Coordinates the sensitivity analysis functionality
 */
(function() {
  // Execute on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing sensitivity analysis...');
    
    // Format currency function if not already defined
    if (!window.formatCurrency) {
      window.formatCurrency = function(value) {
        return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      };
    }
    
    // Format number function if not already defined
    if (!window.formatNumber) {
      window.formatNumber = function(value) {
        return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      };
    }
  });
})();
