/**
 * Chart Initialization
 * Safely initializes all charts in the Total Cost Analyzer
 */
console.log('Initializing Chart System...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing charts...');
    
    // Initialize chart defaults if Chart.js is available
    if (window.Chart) {
        console.log('Chart.js detected, setting defaults...');
        
        // Set global chart defaults
        Chart.defaults.font.family = "'Segoe UI', 'Helvetica Neue', sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#505050';
    } else {
        console.warn('Chart.js not found, charts will not be initialized');
    }
    
    // Initialize all charts if the builder is available
    if (window.EnhancedChartBuilder && typeof window.EnhancedChartBuilder.init === 'function') {
        console.log('Initializing Enhanced Chart Builder...');
        window.EnhancedChartBuilder.init();
    } else if (window.chartBuilder && typeof window.chartBuilder.initCharts === 'function') {
        console.log('Initializing Chart Builder...');
        window.chartBuilder.initCharts();
    } else {
        console.warn('No chart builder found, charts will not be initialized');
    }
    
    console.log('Chart initialization complete');
});
