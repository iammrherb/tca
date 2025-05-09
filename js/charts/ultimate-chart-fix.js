/**
 * Ultimate Chart Fix
 * Resolves all chart loading issues, prevents duplicate initialization,
 * and handles race conditions.
 */
(function() {
  console.log('Applying Ultimate Chart Fix...');
  
  // Store all chart instances
  window._chartRegistry = window._chartRegistry || {};
  
  // Create central chart lifecycle management
  window.ChartManager = {
    // Registry of all chart instances
    charts: {},
    
    // Create/update a chart with proper cleanup
    createChart: function(canvasId, type, data, options) {
      // Get canvas element
      const canvas = document.getElementById(canvasId);
      if (!canvas) {
        console.warn(`Canvas element not found: ${canvasId}`);
        return null;
      }
      
      // Destroy existing chart if present
      this.destroyChart(canvasId);
      
      try {
        // Apply standard options if not provided
        options = options || {};
        if (options.responsive === undefined) options.responsive = true;
        if (options.maintainAspectRatio === undefined) options.maintainAspectRatio = false;
        
        // Create new chart
        console.log(`Creating chart: ${canvasId}`);
        const chart = new Chart(canvas.getContext('2d'), {
          type: type,
          data: data,
          options: options
        });
        
        // Store in registry
        this.charts[canvasId] = chart;
        
        return chart;
      } catch (error) {
        console.error(`Failed to create chart ${canvasId}: ${error.message}`);
        return null;
      }
    },
    
    // Safely destroy a chart
    destroyChart: function(canvasId) {
      if (this.charts[canvasId]) {
        try {
          console.log(`Destroying chart: ${canvasId}`);
          this.charts[canvasId].destroy();
          delete this.charts[canvasId];
        } catch (error) {
          console.warn(`Error destroying chart ${canvasId}: ${error.message}`);
          delete this.charts[canvasId];
        }
      }
    },
    
    // Destroy all charts
    destroyAllCharts: function() {
      console.log('Destroying all charts...');
      Object.keys(this.charts).forEach(id => {
        this.destroyChart(id);
      });
    },
    
    // Update a chart safely
    updateChart: function(canvasId, newData, newOptions) {
      const chart = this.charts[canvasId];
      if (!chart) {
        console.warn(`Chart not found for update: ${canvasId}`);
        return false;
      }
      
      try {
        // Update data if provided
        if (newData) {
          if (newData.datasets) chart.data.datasets = newData.datasets;
          if (newData.labels) chart.data.labels = newData.labels;
        }
        
        // Update options if provided
        if (newOptions) {
          chart.options = { ...chart.options, ...newOptions };
        }
        
        chart.update();
        return true;
      } catch (error) {
        console.error(`Error updating chart ${canvasId}: ${error.message}`);
        return false;
      }
    }
  };
  
  // Only setup Chart.js monkey patch if Chart is available
  function setupChartJsIntegration() {
    if (!window.Chart) {
      console.log('Chart.js not available yet, will retry...');
      setTimeout(setupChartJsIntegration, 500);
      return;
    }
    
    console.log('Integrating with Chart.js...');
    
    // Patch ChartBuilder if available
    if (window.ChartBuilder && window.ChartBuilder.prototype.initCharts) {
      const originalInitCharts = window.ChartBuilder.prototype.initCharts;
      
      window.ChartBuilder.prototype.initCharts = function() {
        console.log('Enhanced initCharts called');
        
        // First destroy all existing charts
        window.ChartManager.destroyAllCharts();
        
        // Reset charts object
        this.charts = {};
        
        try {
          // Call original method to initialize charts
          return originalInitCharts.apply(this, arguments);
        } catch (error) {
          console.error('Error in enhanced initCharts:', error);
          
          // Try individual chart init as fallback
          try {
            if (typeof this.initTCOComparisonChart === 'function') this.initTCOComparisonChart();
            if (typeof this.initCumulativeCostChart === 'function') this.initCumulativeCostChart();
            if (typeof this.initBreakdownCharts === 'function') this.initBreakdownCharts('cisco', 'portnox');
            if (typeof this.initFeatureComparisonChart === 'function') this.initFeatureComparisonChart();
            if (typeof this.initImplementationComparisonChart === 'function') this.initImplementationComparisonChart();
            if (typeof this.initROIChart === 'function') this.initROIChart();
          } catch (fallbackError) {
            console.error('Error in chart fallback initialization:', fallbackError);
          }
        }
      };
      
      // Patch individual chart initialization methods to use ChartManager
      const chartMethods = [
        'initTCOComparisonChart',
        'initCumulativeCostChart',
        'initBreakdownCharts',
        'initFeatureComparisonChart',
        'initImplementationComparisonChart',
        'initROIChart'
      ];
      
      chartMethods.forEach(methodName => {
        if (window.ChartBuilder.prototype[methodName]) {
          const originalMethod = window.ChartBuilder.prototype[methodName];
          
          window.ChartBuilder.prototype[methodName] = function() {
            try {
              return originalMethod.apply(this, arguments);
            } catch (error) {
              console.error(`Error in ${methodName}:`, error);
              
              // Create a placeholder chart if needed
              if (methodName === 'initTCOComparisonChart') {
                createPlaceholderChart('tco-comparison-chart', 'bar');
              } else if (methodName === 'initCumulativeCostChart') {
                createPlaceholderChart('cumulative-cost-chart', 'line');
              } else if (methodName === 'initBreakdownCharts') {
                createPlaceholderChart('current-breakdown-chart', 'pie');
                createPlaceholderChart('alternative-breakdown-chart', 'pie');
              } else if (methodName === 'initFeatureComparisonChart') {
                createPlaceholderChart('feature-comparison-chart', 'radar');
              } else if (methodName === 'initImplementationComparisonChart') {
                createPlaceholderChart('implementation-comparison-chart', 'bar');
              } else if (methodName === 'initROIChart') {
                createPlaceholderChart('roi-chart', 'line');
              }
            }
          };
        }
      });
    }
    
    // Create global update/reset functions
    window.resetAllCharts = function() {
      console.log('Global resetAllCharts called');
      window.ChartManager.destroyAllCharts();
      
      // Reinitialize via chartBuilder if available
      if (window.chartBuilder && typeof window.chartBuilder.initCharts === 'function') {
        setTimeout(() => {
          try {
            window.chartBuilder.initCharts();
          } catch (error) {
            console.error('Error reinitializing charts:', error);
          }
        }, 100);
      }
    };
    
    console.log('Chart.js integration complete');
  }
  
  // Create a placeholder chart when a real chart fails to initialize
  function createPlaceholderChart(canvasId, type) {
    if (!document.getElementById(canvasId)) return;
    
    const placeholderData = {
      labels: ['No Data Available'],
      datasets: [{
        label: 'Run calculation to see data',
        data: [0],
        backgroundColor: 'rgba(27, 103, 178, 0.2)',
        borderColor: 'rgba(27, 103, 178, 1)',
        borderWidth: 2
      }]
    };
    
    const placeholderOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Chart will update after calculation'
        }
      }
    };
    
    window.ChartManager.createChart(canvasId, type, placeholderData, placeholderOptions);
  }
  
  // Ensure all chart canvases exist
  function ensureChartCanvases() {
    const requiredCharts = [
      { id: 'tco-comparison-chart', container: '.results-grid', title: 'TCO Comparison' },
      { id: 'cumulative-cost-chart', container: '.results-grid', title: 'Cumulative Costs Over Time' },
      { id: 'current-breakdown-chart', container: '.results-grid', title: 'Current Vendor Cost Breakdown' },
      { id: 'alternative-breakdown-chart', container: '.results-grid', title: 'Portnox Cost Breakdown' },
      { id: 'feature-comparison-chart', container: '.results-grid', title: 'Feature Comparison' },
      { id: 'implementation-comparison-chart', container: '.results-grid', title: 'Implementation Time Comparison' },
      { id: 'roi-chart', container: '.results-grid', title: 'Return on Investment Analysis' }
    ];
    
    requiredCharts.forEach(chart => {
      if (!document.getElementById(chart.id)) {
        console.log(`Creating missing chart canvas: ${chart.id}`);
        
        const container = document.querySelector(chart.container);
        if (container) {
          const card = document.createElement('div');
          card.className = 'result-card';
          card.innerHTML = `
            <h3>${chart.title}</h3>
            <div class="chart-container">
              <canvas id="${chart.id}"></canvas>
            </div>
          `;
          
          container.appendChild(card);
        }
      }
    });
  }
  
  // Start integration when the page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureChartCanvases();
      setupChartJsIntegration();
    });
  } else {
    ensureChartCanvases();
    setupChartJsIntegration();
  }
  
  console.log('Ultimate Chart Fix setup complete');
})();
