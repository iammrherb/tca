/**
 * Enhanced Chart Manager
 * Resolves chart initialization and redraw issues by properly tracking and destroying instances
 */
(function() {
  console.log('Initializing Enhanced Chart Manager...');
  
  // Store chart instances by canvas ID
  const chartInstances = {};
  
  // Safely destroy a chart if it exists
  function safelyDestroyChart(canvasId) {
    try {
      if (chartInstances[canvasId]) {
        console.log(`Destroying chart instance for canvas: ${canvasId}`);
        chartInstances[canvasId].destroy();
        delete chartInstances[canvasId];
        return true;
      }
    } catch (error) {
      console.warn(`Error destroying chart on canvas ${canvasId}:`, error);
    }
    return false;
  }
  
  // Create or update a chart
  function createChart(canvasId, type, data, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.warn(`Canvas element not found: ${canvasId}`);
      return null;
    }
    
    // Destroy existing chart on this canvas
    safelyDestroyChart(canvasId);
    
    // Create new chart
    try {
      const ctx = canvas.getContext('2d');
      const chart = new Chart(ctx, {
        type: type,
        data: data,
        options: options || {}
      });
      
      // Store the chart instance
      chartInstances[canvasId] = chart;
      
      return chart;
    } catch (error) {
      console.error(`Error creating chart on canvas ${canvasId}:`, error);
      return null;
    }
  }
  
  // Get a chart instance by canvas ID
  function getChartInstance(canvasId) {
    return chartInstances[canvasId];
  }
  
  // Destroy all charts
  function destroyAllCharts() {
    for (const canvasId in chartInstances) {
      safelyDestroyChart(canvasId);
    }
  }
  
  // Create or ensure canvas element exists
  function ensureCanvas(canvasId, containerSelector) {
    let canvas = document.getElementById(canvasId);
    
    if (!canvas) {
      const container = containerSelector ? 
        document.querySelector(containerSelector) : 
        document.querySelector('.chart-container');
      
      if (container) {
        console.log(`Creating canvas element with id: ${canvasId}`);
        canvas = document.createElement('canvas');
        canvas.id = canvasId;
        container.appendChild(canvas);
      } else {
        console.warn(`Container not found for canvas: ${canvasId}`);
        return null;
      }
    }
    
    return canvas;
  }
  
  // Initialize Chart Manager
  function init() {
    // Find and track existing chart instances
    const existingCanvases = document.querySelectorAll('canvas');
    existingCanvases.forEach(canvas => {
      if (canvas.id && canvas.chart) {
        chartInstances[canvas.id] = canvas.chart;
      }
    });
    
    // Patch global Chart creation if Chart.js is available
    if (window.Chart) {
      const originalInit = Chart.prototype.initialize;
      
      Chart.prototype.initialize = function() {
        // Call original initialization
        originalInit.apply(this, arguments);
        
        // Store reference to this chart if canvas has ID
        if (this.canvas && this.canvas.id) {
          chartInstances[this.canvas.id] = this;
        }
      };
      
      console.log('Chart.js patched for improved instance management');
    }
  }
  
  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose the API
  window.ChartManager = {
    createChart: createChart,
    getChartInstance: getChartInstance,
    destroyChart: safelyDestroyChart,
    destroyAllCharts: destroyAllCharts,
    ensureCanvas: ensureCanvas
  };
  
  console.log('Enhanced Chart Manager initialized');
})();
