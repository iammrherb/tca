/**
 * Simple Chart.js fix
 * Prevents errors from multiple chart initializations
 */
(function() {
  console.log('Applying simple chart fix...');
  
  // Original Chart constructor
  const OriginalChart = window.Chart;
  
  // Override Chart constructor to prevent duplicate chart errors
  window.Chart = function(ctx, config) {
    // Check if canvas already has a chart associated
    if (ctx.canvas && ctx.canvas.chart) {
      console.log('Destroying existing chart on canvas:', ctx.canvas.id);
      ctx.canvas.chart.destroy();
    }
    
    // Create new chart
    const chart = new OriginalChart(ctx, config);
    
    // Store reference to chart on canvas
    if (ctx.canvas) {
      ctx.canvas.chart = chart;
    }
    
    return chart;
  };
  
  // Copy prototype and static properties
  window.Chart.prototype = OriginalChart.prototype;
  Object.keys(OriginalChart).forEach(key => {
    window.Chart[key] = OriginalChart[key];
  });
  
  console.log('Chart.js fix applied successfully');
})();
