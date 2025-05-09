/**
 * ChartBuilder Compatibility Layer
 * Creates a ChartBuilder class if not defined to prevent initialization errors
 */

// Check if ChartBuilder is defined, if not create a compatibility class
if (typeof ChartBuilder === 'undefined') {
  console.log('Creating ChartBuilder compatibility layer');
  
  class ChartBuilder {
    constructor() {
      this.charts = {};
      this.chartColors = {
        cisco: 'rgba(0, 133, 202, 1)',      // Cisco blue
        aruba: 'rgba(255, 122, 0, 1)',      // Aruba orange
        forescout: 'rgba(0, 79, 159, 1)',   // Forescout blue
        nps: 'rgba(0, 164, 239, 1)',        // Microsoft blue
        fortinac: 'rgba(238, 49, 36, 1)',   // FortiNAC red
        securew2: 'rgba(139, 197, 63, 1)',  // SecureW2 green
        portnox: 'rgba(43, 210, 91, 1)',    // Portnox green
        neutral: 'rgba(136, 136, 136, 1)'   // Neutral gray
      };
      
      this.chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            enabled: true
          },
          title: {
            display: false
          }
        }
      };
      
      console.log('ChartBuilder compatibility layer initialized');
    }
    
    // Add basic chart initialization methods
    initCharts() {
      console.log('ChartBuilder.initCharts called from compatibility layer');
      // Forward to non-conflict chart handler if available
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.initAllCharts === 'function') {
        window.nonConflictChartHandler.initAllCharts();
      }
    }
    
    // Add other required methods for compatibility
    updateTCOComparisonChart(results) {
      console.log('ChartBuilder.updateTCOComparisonChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateTCOComparisonChart === 'function') {
        window.nonConflictChartHandler.updateTCOComparisonChart(results);
      }
    }
    
    updateCumulativeCostChart(results) {
      console.log('ChartBuilder.updateCumulativeCostChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateCumulativeCostChart === 'function') {
        window.nonConflictChartHandler.updateCumulativeCostChart(results);
      }
    }
    
    updateCostBreakdownCharts(results) {
      console.log('ChartBuilder.updateCostBreakdownCharts called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateCostBreakdownCharts === 'function') {
        window.nonConflictChartHandler.updateCostBreakdownCharts(results);
      }
    }
    
    updateFeatureComparisonChart(currentVendor) {
      console.log('ChartBuilder.updateFeatureComparisonChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateFeatureComparisonChart === 'function') {
        window.nonConflictChartHandler.updateFeatureComparisonChart(currentVendor);
      }
    }
    
    updateImplementationComparisonChart(data) {
      console.log('ChartBuilder.updateImplementationComparisonChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateImplementationComparisonChart === 'function') {
        window.nonConflictChartHandler.updateImplementationComparisonChart(data);
      }
    }
    
    updateROIChart(results) {
      console.log('ChartBuilder.updateROIChart called from compatibility layer');
      if (window.nonConflictChartHandler && typeof window.nonConflictChartHandler.updateROIChart === 'function') {
        window.nonConflictChartHandler.updateROIChart(results);
      }
    }
  }
  
  // Create global instance
  window.chartBuilder = new ChartBuilder();
}
