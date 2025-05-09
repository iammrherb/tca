/**
 * NAC Architecture Designer Pro - Main Fix Loader
 */
(function() {
    console.log("NAC Architecture Designer Pro - Fix Loader");
    
    // Flag to track initialization
    let initialized = false;
    
    // Main initialization function
    function initFixes() {
        if (initialized) {
            console.log("Fixes already initialized");
            return;
        }
        
        console.log("Initializing NAC fixes");
        
        // Load fixes in correct order
        loadScript('js/fixes/module-fixes.js', function() {
            loadScript('js/fixes/dom-fixes.js', function() {
                loadScript('js/fixes/chart-fixes.js', function() {
                    loadScript('js/fixes/resource-fallbacks.js', function() {
                        console.log("All fixes loaded successfully");
                        
                        // Add a small delay before running post-init
                        setTimeout(runPostInitFixes, 500);
                    });
                });
            });
        });
        
        initialized = true;
    }
    
    // Post-initialization fixes
    function runPostInitFixes() {
        console.log("Running post-initialization fixes");
        
        // Fix chart instances if needed
        if (window.Chart && window.Chart.instances) {
            console.log("Checking Chart.js instances");
            
            // Reset all canvases to ensure clean state
            document.querySelectorAll('canvas').forEach(function(canvas) {
                if (canvas.id) {
                    console.log("Resetting canvas: " + canvas.id);
                    
                    if (window.destroyChartById) {
                        window.destroyChartById(canvas.id);
                    }
                }
            });
        }
        
        // Fix duplicate element IDs
        const seen = {};
        document.querySelectorAll('[id]').forEach(function(element) {
            const id = element.id;
            if (seen[id]) {
                const newId = id + '_fix_' + Math.random().toString(36).substring(2, 5);
                console.log("Renaming duplicate ID from '" + id + "' to '" + newId + "'");
                element.id = newId;
            } else {
                seen[id] = true;
            }
        });
        
        // Reinitialize charts if ChartBuilder is available
        if (window.ChartBuilder && typeof window.ChartBuilder.initCharts === 'function') {
            console.log("Reinitializing charts with ChartBuilder");
            try {
                window.ChartBuilder.initCharts();
            } catch (e) {
                console.error("Error reinitializing charts:", e);
            }
        }
        
        console.log("Post-initialization fixes completed");
    }
    
    // Helper function to load a script
    function loadScript(url, callback) {
        console.log("Loading script: " + url);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        
        script.onload = function() {
            console.log("Loaded script: " + url);
            if (callback) callback();
        };
        
        script.onerror = function() {
            console.error("Failed to load script: " + url);
            if (callback) callback();
        };
        
        document.head.appendChild(script);
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFixes);
    } else {
        initFixes();
    }
})();
