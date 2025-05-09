/**
 * NAC Bridge Loader
 * This script loads the bridge module and integrates with existing fixes
 */
(function() {
    console.log("NAC Bridge Loader starting");
    
    // Load the bridge module
    function loadBridge() {
        const script = document.createElement('script');
        script.src = 'js/bridge/nac-bridge.js';
        script.onload = function() {
            console.log("NAC Bridge loaded successfully");
            
            // Force initialization after all scripts are loaded
            setTimeout(function() {
                if (window.NACBridge && !window.NACBridge.initialized) {
                    console.log("Forcing bridge initialization");
                    window.NACBridge.init();
                }
                
                // Call existing chart initialization if available
                if (window.ChartBuilder && window.ChartBuilder.initCharts) {
                    console.log("Calling ChartBuilder.initCharts via bridge");
                    try {
                        window.ChartBuilder.initCharts();
                    } catch (err) {
                        console.error("Error initializing charts", err);
                    }
                }
            }, 500);
        };
        
        script.onerror = function() {
            console.error("Failed to load NAC Bridge");
        };
        
        document.head.appendChild(script);
    }
    
    // Load the bridge when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadBridge);
    } else {
        loadBridge();
    }
})();
