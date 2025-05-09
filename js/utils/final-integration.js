/**
 * NAC Architecture Designer Pro - Final Integration
 * 
 * This script integrates all final fixes for the NAC Designer application
 */
(function() {
    console.log("NAC Architecture Designer Pro - Final Integration Starting");
    
    // Helper function to load a script
    function loadScript(url, callback) {
        console.log("Loading fix script: " + url);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        
        script.onload = function() {
            console.log("Loaded fix script: " + url);
            if (callback) callback();
        };
        
        script.onerror = function() {
            console.error("Failed to load fix script: " + url);
            if (callback) callback();
        };
        
        document.head.appendChild(script);
    }
    
    // Load all fixes in sequence
    function loadAllFixes() {
        // First load the module fix
        loadScript('js/fixes/module-redeclaration-fix.js', function() {
            // Then the syntax error fix
            loadScript('js/fixes/syntax-error-fix.js', function() {
                // Finally the risk heatmap fix
                loadScript('js/fixes/risk-heatmap-fix.js', function() {
                    console.log("All final fixes loaded");
                    
                    // After a short delay, force a resize to update all charts
                    setTimeout(function() {
                        if (window.handleResize) {
                            console.log("Forcing chart update via resize");
                            window.handleResize();
                        }
                    }, 1000);
                });
            });
        });
    }
    
    // Start loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllFixes);
    } else {
        loadAllFixes();
    }
    
    console.log("NAC Architecture Designer Pro - Final Integration Ready");
})();
