/**
 * Chart Initialization Fix - Ensures charts are properly initialized only once
 */
(function() {
  console.log('Applying chart initialization fixes...');
  
  // Track initialized charts to prevent duplicate initialization
  const initializedCharts = new Set();
  
  // Wait for window load to ensure all scripts are loaded
  window.addEventListener('load', function() {
    // Create a unified chart initialization function
    window.initializeAllCharts = function() {
      console.log('Unified chart initialization starting...');
      
      // Attempt to clean up any existing charts first
      function cleanupExistingCharts() {
        const chartIds = [
          'tco-comparison-chart',
          'cumulative-cost-chart',
          'current-breakdown-chart',
          'alternative-breakdown-chart',
          'feature-comparison-chart',
          'implementation-comparison-chart',
          'roi-chart',
          'sensitivity-chart',
          'savings-impact-chart',
          'industry-comparison-chart',
          'compliance-framework-chart'
        ];
        
        chartIds.forEach(id => {
          if (initializedCharts.has(id)) {
            console.log(`Chart ${id} already initialized, skipping`);
            return;
          }
          
          const canvas = document.getElementById(id);
          if (!canvas) return;
          
          // Check if there's a Chart.js instance associated with this canvas
          const chartInstance = canvas._chartjs ? canvas._chartjs.chart : null;
          
          // If chart exists, destroy it before reinitializing
          if (chartInstance) {
            console.log(`Destroying existing chart: ${id}`);
            chartInstance.destroy();
          }
        });
      }
      
      // Clean up first
      cleanupExistingCharts();
      
      // Initialize charts using available builder
      if (window.chartBuilder && typeof window.chartBuilder.initCharts === 'function') {
        console.log('Using enhanced chart builder to initialize charts');
        window.chartBuilder.initCharts();
        
        // If enhanced builder has extended charts, initialize those too
        if (typeof window.chartBuilder.initExtendedCharts === 'function') {
          window.chartBuilder.initExtendedCharts();
        }
      } else if (window.simpleChartBuilder && typeof window.simpleChartBuilder.initCharts === 'function') {
        console.log('Using simple chart builder to initialize charts');
        window.simpleChartBuilder.initCharts();
      }
      
      // Mark all charts as initialized
      document.querySelectorAll('canvas[id$="-chart"]').forEach(canvas => {
        initializedCharts.add(canvas.id);
      });
      
      console.log('Unified chart initialization complete');
    };
    
    // Run the initialization after a short delay
    setTimeout(window.initializeAllCharts, 500);
  });
})();
