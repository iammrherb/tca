/**
 * Chart.js Wrapper
 * Prevents errors for missing canvas elements
 */
(function() {
    // Store the original Chart constructor
    const OriginalChart = window.Chart;
    
    // Override the Chart constructor
    window.Chart = function(ctx, config) {
        // Check if the context is valid
        if (!ctx || !ctx.getContext) {
            console.warn("Invalid chart context - chart creation skipped");
            return {
                update: function() {},
                destroy: function() {},
                data: { datasets: [] },
                options: {},
                canvas: {}
            };
        }
        
        // Call the original constructor
        return new OriginalChart(ctx, config);
    };
    
    // Copy all static properties and methods
    for (const prop in OriginalChart) {
        if (OriginalChart.hasOwnProperty(prop)) {
            window.Chart[prop] = OriginalChart[prop];
        }
    }
    
    console.log("Chart.js wrapper initialized");
})();
