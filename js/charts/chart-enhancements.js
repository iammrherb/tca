/**
 * Chart enhancement functions for the NAC Total Cost Analyzer
 * Ensures all charts are properly initialized and rendered
 */
document.addEventListener('DOMContentLoaded', function() {
  // Fix for chart canvas elements not being found
  function ensureChartCanvases() {
    // List of required chart canvas IDs
    const requiredCharts = [
      'tco-comparison-chart',
      'cumulative-cost-chart',
      'current-breakdown-chart',
      'alternative-breakdown-chart',
      'feature-comparison-chart',
      'implementation-comparison-chart',
      'roi-chart'
    ];
    
    // Check each canvas and create if missing
    requiredCharts.forEach(chartId => {
      if (!document.getElementById(chartId)) {
        console.log(`Creating missing chart canvas: ${chartId}`);
        
        // Find container - if not found, create a container in the results section
        let container = document.querySelector(`.chart-container:has(#${chartId})`);
        if (!container) {
          // Find a parent container to append to
          const resultsSection = document.querySelector('.results-grid') || document.querySelector('.results-container');
          if (!resultsSection) return;
          
          // Create a new result card
          const card = document.createElement('div');
          card.className = 'result-card';
          
          // Create title based on chart ID
          const title = document.createElement('h3');
          title.textContent = chartId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace('Chart', '');
          
          // Create chart container
          container = document.createElement('div');
          container.className = 'chart-container';
          
          // Assemble card
          card.appendChild(title);
          card.appendChild(container);
          
          // Add to results section
          resultsSection.appendChild(card);
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = chartId;
        container.appendChild(canvas);
      }
    });
    
    console.log('All chart canvases are available');
  }
  
  // Fix for ROI chart specifically
  function ensureROIChart() {
    const chartBuilder = window.chartBuilder;
    if (!chartBuilder) return;
    
    if (!chartBuilder.charts.roi) {
      // Try to initialize ROI chart
      try {
        chartBuilder.initROIChart();
        console.log('ROI chart initialized');
      } catch (e) {
        console.error('Error initializing ROI chart:', e);
      }
    }
  }
  
  // Wait for chart builder to be initialized
  function waitForChartBuilder(callback, attempts = 0) {
    if (window.chartBuilder) {
      callback();
    } else if (attempts < 10) {
      setTimeout(() => waitForChartBuilder(callback, attempts + 1), 500);
    } else {
      console.error('Chart builder not available after multiple attempts');
    }
  }
  
  // Run chart fixes
  waitForChartBuilder(() => {
    ensureChartCanvases();
    ensureROIChart();
    
    // Update charts if results are available
    if (window.calculator && window.calculator.resultsAvailable) {
      const results = window.calculator.results;
      const activeVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      window.chartBuilder.updateTCOComparisonChart(results);
      window.chartBuilder.updateCumulativeCostChart(results);
      window.chartBuilder.updateBreakdownCharts(activeVendor, 'portnox');
      window.chartBuilder.updateFeatureComparisonChart(activeVendor);
      window.chartBuilder.updateImplementationComparisonChart(results);
      window.chartBuilder.updateROIChart(results);
    }
  });
});
