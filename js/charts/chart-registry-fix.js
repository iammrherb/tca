/**
 * Chart Registry Fix
 * Fixes issues with Chart.js instance conflicts and provides
 * proper chart registration and destruction
 */
(function() {
  console.log('Initializing Chart Registry Fix');
  
  // Create global chart registry
  window.chartRegistry = window.chartRegistry || {};
  
  // Fix for Chart.instances - create compatibility with Chart.js v2 and v3
  if (window.Chart && !window.Chart.instances) {
    window.Chart.instances = [];
  }
  
  // Create chart registry manager
  window.ChartRegistryManager = {
    // Register a chart
    register: function(chartId, chartInstance) {
      console.log(`Registering chart: ${chartId}`);
      
      // Destroy existing chart if it exists
      this.destroy(chartId);
      
      // Store new chart instance
      window.chartRegistry[chartId] = chartInstance;
      
      return chartInstance;
    },
    
    // Get a chart by ID
    get: function(chartId) {
      return window.chartRegistry[chartId] || null;
    },
    
    // Destroy a chart by ID
    destroy: function(chartId) {
      const chart = this.get(chartId);
      
      if (chart) {
        console.log(`Destroying chart: ${chartId}`);
        
        try {
          chart.destroy();
        } catch (error) {
          console.warn(`Error destroying chart ${chartId}:`, error);
        }
        
        // Remove from registry
        delete window.chartRegistry[chartId];
      }
      
      return null;
    },
    
    // Update all charts for a specific property (like dark mode)
    updateAll: function(propertyName, value) {
      console.log(`Updating all charts for ${propertyName}: ${value}`);
      
      // Iterate through registry
      Object.values(window.chartRegistry).forEach(chart => {
        try {
          if (chart.options && chart.options[propertyName] !== undefined) {
            chart.options[propertyName] = value;
            chart.update();
          }
        } catch (error) {
          console.warn('Error updating chart:', error);
        }
      });
    }
  };
  
  // Create chart factory
  window.ChartFactory = {
    // Create a new chart
    create: function(ctx, config) {
      const canvasId = ctx.canvas ? ctx.canvas.id : (ctx.id || 'unknown-canvas');
      console.log(`Creating chart for canvas: ${canvasId}`);
      
      try {
        // Create new chart
        const chart = new Chart(ctx, config);
        
        // Register chart
        return window.ChartRegistryManager.register(canvasId, chart);
      } catch (error) {
        console.error(`Error creating chart for ${canvasId}:`, error);
        
        // Try to destroy any existing chart and retry once
        if (window.chartRegistry[canvasId]) {
          window.ChartRegistryManager.destroy(canvasId);
          
          // Retry chart creation
          try {
            const chart = new Chart(ctx, config);
            return window.ChartRegistryManager.register(canvasId, chart);
          } catch (retryError) {
            console.error(`Retry failed for ${canvasId}:`, retryError);
          }
        }
        
        return null;
      }
    }
  };
  
  console.log('Chart Registry Fix initialized');
})();
