/**
 * Chart reset utility
 * Forces proper cleanup and reinitialization of charts to avoid errors
 */
(function() {
  console.log('Applying chart reset utility...');
  
  // Function to properly reset all charts
  window.resetAllCharts = function() {
    console.log('Resetting all charts...');
    
    // First destroy any existing charts
    if (window.chartBuilder && window.chartBuilder.charts) {
      Object.keys(window.chartBuilder.charts).forEach(key => {
        if (window.chartBuilder.charts[key] && typeof window.chartBuilder.charts[key].destroy === 'function') {
          console.log(`Destroying chart: ${key}`);
          window.chartBuilder.charts[key].destroy();
          window.chartBuilder.charts[key] = null;
        }
      });
    }
    
    // Reset charts object
    if (window.chartBuilder) {
      window.chartBuilder.charts = {};
      
      // Reinitialize charts
      setTimeout(function() {
        try {
          window.chartBuilder.initCharts();
          console.log('Charts reinitialized successfully');
        } catch (error) {
          console.error('Error reinitializing charts:', error);
        }
      }, 100);
    }
  };
  
  // Add reset button to the UI for debugging
  function addResetButton() {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('reset-charts-btn')) {
      const resetButton = document.createElement('button');
      resetButton.id = 'reset-charts-btn';
      resetButton.className = 'btn btn-outline btn-sm';
      resetButton.innerHTML = '<i class="fas fa-sync"></i> Reset Charts';
      resetButton.addEventListener('click', window.resetAllCharts);
      headerActions.appendChild(resetButton);
    }
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addResetButton);
  } else {
    addResetButton();
  }
  
  // Automatically reset charts once after page load
  setTimeout(window.resetAllCharts, 1500);
})();
