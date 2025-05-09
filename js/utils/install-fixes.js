/**
 * Streamlined Total Cost Analyzer Fix
 * Focuses on fixing calculation issues with minimal changes
 */
(function() {
    console.log('Installing streamlined TCO calculator fix...');
    
    // Clean up existing scripts and prevent duplicates
    function cleanupExistingScripts() {
        // List of script patterns to remove
        const conflictPatterns = [
            'compliance-insights.js',
            'enhanced-pdf-generator.js',
            'chart-fix.js',
            'improved-fix.js',
            'install-fix.js',
            'install-consolidated-fix.js',
            'ultimate-script-loader.js',
            'no-nac-baseline.js',
            'industry-data.js',
            'compliance-frameworks.js',
            'vendor-comparison.js',
            'enhanced-total-cost-analyzer.js',
            'enhanced-ui-updates.js'
        ];
        
        // Remove conflicting scripts
        conflictPatterns.forEach(pattern => {
            const scripts = document.querySelectorAll(`script[src*="${pattern}"]`);
            scripts.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                    console.log(`Removed conflicting script: ${pattern}`);
                }
            });
        });
    }
    
    // Load the direct calculation fix
    function loadDirectFix() {
        // Create script element
        const script = document.createElement('script');
        script.src = 'js/fixes/direct-calculation-fix.js?' + Date.now(); // Add cache-busting parameter
        
        // Add to document
        document.head.appendChild(script);
        
        console.log('Direct calculation fix script loaded');
    }
    
    // Initialize
    function initialize() {
        // Clean up existing scripts
        cleanupExistingScripts();
        
        // Load direct fix
        loadDirectFix();
        
        console.log('Streamlined TCO calculator fix installed');
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
