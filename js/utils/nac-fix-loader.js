/**
 * NAC Architecture Designer Pro - Fix Loader
 * This script loads and applies all fixes to resolve issues
 */
(function() {
    console.log("NAC Architecture Designer Pro - Fix Loader");
    
    // Helper function to load a script
    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        
        script.onload = function() {
            console.log("Loaded script: " + url);
            if (callback) callback();
        };
        
        script.onerror = function() {
            console.error("Failed to load script: " + url);
        };
        
        document.head.appendChild(script);
    }
    
    // Load scripts in sequence
    function loadScriptsSequentially(scripts, index) {
        if (index >= scripts.length) {
            console.log("All fix scripts loaded!");
            return;
        }
        
        loadScript(scripts[index], function() {
            loadScriptsSequentially(scripts, index + 1);
        });
    }
    
    // Fix CSS resource paths
    function fixCssResourcePaths() {
        document.querySelectorAll('link[rel="stylesheet"]').forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && href.indexOf('http') !== 0) {
                link.setAttribute('href', 'https://iammrherb.github.io/UaXtXo/' + href);
            }
        });
    }
    
    // Apply DOM fixes
    function applyDomFixes() {
        // Remove duplicate elements
        const seen = {};
        document.querySelectorAll('[id]').forEach(function(element) {
            const id = element.id;
            if (seen[id]) {
                console.log("Removing duplicate element with id: " + id);
                element.parentNode.removeChild(element);
            } else {
                seen[id] = true;
            }
        });
    }
    
    // The fix process
    function applyFixes() {
        console.log("Applying NAC Designer Pro fixes");
        
        // Fix CSS first
        fixCssResourcePaths();
        
        // Load bridge module first
        loadScript('js/fixes/nac-bridge.js', function() {
            // Clean up DOM
            applyDomFixes();
            
            // Load other fixes in sequence
            const fixScripts = [
                'js/fixes/force-init.js'
            ];
            
            loadScriptsSequentially(fixScripts, 0);
        });
    }
    
    // Apply fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFixes);
    } else {
        applyFixes();
    }
})();
