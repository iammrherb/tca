/**
 * Robust chart fix to prevent initialization errors and ensure consistent loading
 */
(function() {
  console.log('Applying robust chart fix...');
  
  // Wait for Chart to be available
  function waitForChart(callback) {
    if (window.Chart) {
      callback();
    } else {
      setTimeout(function() { waitForChart(callback); }, 100);
    }
  }
  
  waitForChart(function() {
    // Store original Chart constructor
    const OrigChart = window.Chart;
    
    // Keep track of charts by canvas ID
    window._chartInstances = window._chartInstances || {};
    
    // Override Chart constructor
    function CustomChart(ctx, config) {
      // Get canvas ID
      const canvasId = ctx.canvas ? ctx.canvas.id : null;
      
      // If we have a canvas ID, check if a chart already exists for it
      if (canvasId && window._chartInstances[canvasId]) {
        console.log(`Destroying existing chart on canvas: ${canvasId}`);
        window._chartInstances[canvasId].destroy();
        delete window._chartInstances[canvasId];
      }
      
      // Create new chart
      let chart;
      try {
        chart = new OrigChart(ctx, config);
        
        // Store reference if we have a canvas ID
        if (canvasId) {
          window._chartInstances[canvasId] = chart;
        }
      } catch (error) {
        console.error('Error creating chart:', error);
        // Try clearing canvas manually and creating again
        try {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          chart = new OrigChart(ctx, config);
          
          if (canvasId) {
            window._chartInstances[canvasId] = chart;
          }
        } catch (retryError) {
          console.error('Failed to create chart even after clearing canvas:', retryError);
          throw retryError;
        }
      }
      
      return chart;
    }
    
    // Copy prototype and static properties
    CustomChart.prototype = OrigChart.prototype;
    Object.keys(OrigChart).forEach(key => {
      CustomChart[key] = OrigChart[key];
    });
    
    // Replace Chart with custom version
    window.Chart = CustomChart;
    
    console.log('Chart fix applied successfully');
  });
  
  // If ChartBuilder exists, override initCharts method to ensure charts are destroyed first
  function patchChartBuilder() {
    if (window.ChartBuilder && window.ChartBuilder.prototype.initCharts) {
      console.log('Patching ChartBuilder.initCharts...');
      
      // Store original method
      const origInitCharts = window.ChartBuilder.prototype.initCharts;
      
      // Override method
      window.ChartBuilder.prototype.initCharts = function() {
        // Destroy existing charts
        if (this.charts) {
          Object.keys(this.charts).forEach(key => {
            if (this.charts[key] && typeof this.charts[key].destroy === 'function') {
              console.log(`Destroying chart: ${key}`);
              this.charts[key].destroy();
              this.charts[key] = null;
            }
          });
        }
        
        // Reset charts object
        this.charts = {};
        
        // Call original method
        try {
          return origInitCharts.apply(this, arguments);
        } catch (error) {
          console.error('Error in initCharts:', error);
          
          // Try individual chart initialization
          console.log('Attempting individual chart initialization...');
          
          // Ensure canvas elements exist
          ensureChartCanvases();
          
          try { this.initTCOComparisonChart(); } catch (e) { console.error(e); }
          try { this.initCumulativeCostChart(); } catch (e) { console.error(e); }
          try { this.initBreakdownCharts('cisco', 'portnox'); } catch (e) { console.error(e); }
          try { this.initFeatureComparisonChart(); } catch (e) { console.error(e); }
          try { this.initImplementationComparisonChart(); } catch (e) { console.error(e); }
          try { this.initROIChart(); } catch (e) { console.error(e); }
        }
      };
      
      console.log('ChartBuilder patched successfully');
    }
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
    
    console.log('All chart canvases verified');
  }
  
  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(patchChartBuilder, 500);
      setTimeout(ensureChartCanvases, 1000);
    });
  } else {
    setTimeout(patchChartBuilder, 500);
    setTimeout(ensureChartCanvases, 1000);
  }
})();
