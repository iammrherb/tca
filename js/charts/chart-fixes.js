/**
 * NAC Architecture Designer Pro - Chart.js Fixes
 */
(function() {
    console.log("Installing Chart.js fixes");

    // Wait for Chart.js to be available
    function waitForChart(callback) {
        if (window.Chart) {
            callback();
        } else {
            console.log("Waiting for Chart.js...");
            setTimeout(function() { waitForChart(callback); }, 100);
        }
    }

    waitForChart(function() {
        // Fix 1: Add proper forEach method to Chart.instances
        if (window.Chart.instances && !window.Chart.instances.forEach) {
            console.log("Adding forEach method to Chart.instances");
            window.Chart.instances.forEach = function(callback) {
                if (Array.isArray(this)) {
                    Array.prototype.forEach.call(this, callback);
                } else {
                    // For Chart.js v3+, instances is an object
                    Object.values(this).forEach(callback);
                }
            };
        }

        // Fix 2: Ensure getChart method exists (for Chart.js v3+)
        if (!window.Chart.getChart) {
            console.log("Adding getChart method to Chart");
            window.Chart.getChart = function(canvas) {
                if (!canvas) return null;
                
                // Try to find the chart instance for this canvas
                let chartInstance = null;
                if (typeof Chart.instances.forEach === 'function') {
                    Chart.instances.forEach(function(instance) {
                        if (instance.canvas === canvas) {
                            chartInstance = instance;
                        }
                    });
                }
                
                return chartInstance;
            };
        }

        // Fix 3: Better chart destruction
        window.destroyChartById = function(chartId) {
            console.log("Destroying chart: " + chartId);
            const canvas = document.getElementById(chartId);
            if (!canvas) {
                console.warn("Canvas not found: " + chartId);
                return false;
            }

            // Try to get chart instance
            let chartInstance = Chart.getChart ? Chart.getChart(canvas) : null;
            
            // Fallback for older Chart.js
            if (!chartInstance && Chart.instances) {
                // Try to find it in instances
                if (typeof Chart.instances.forEach === 'function') {
                    Chart.instances.forEach(function(instance) {
                        if (instance.canvas === canvas) {
                            chartInstance = instance;
                        }
                    });
                }
            }

            // Destroy if found
            if (chartInstance) {
                try {
                    chartInstance.destroy();
                    console.log("Chart destroyed: " + chartId);
                    return true;
                } catch (e) {
                    console.error("Error destroying chart: ", e);
                }
            }

            // If everything else fails, reset the canvas
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            
            // Reset size
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth || 300;
                canvas.height = parent.clientHeight || 200;
            }
            
            console.log("Canvas reset: " + chartId);
            return true;
        };

        // Fix 4: Safe chart initialization
        window.initSafeChart = function(chartId, config) {
            console.log("Safe initialization of chart: " + chartId);
            
            // First destroy any existing chart
            destroyChartById(chartId);
            
            // Get canvas
            const canvas = document.getElementById(chartId);
            if (!canvas) {
                console.warn("Canvas not found: " + chartId);
                return null;
            }
            
            // Reset canvas dimensions to prevent scaling issues
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth || 300;
                canvas.height = parent.clientHeight || 200;
            }
            
            // Create new chart
            try {
                return new Chart(canvas.getContext('2d'), config);
            } catch (e) {
                console.error("Error creating chart: ", e);
                return null;
            }
        };

        console.log("Chart.js fixes installed");
    });
})();
