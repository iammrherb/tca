/**
 * Total Cost Analyzer Fix Installer
 * Loads the comprehensive enhancement script
 */
(function() {
    console.log('Installing Total Cost Analyzer Fix...');
    
    // Clean up any conflicting scripts
    function cleanupConflictingScripts() {
        const conflictPatterns = [
            'compliance-insights.js',
            'chart-fix.js',
            'improved-fix.js',
            'direct-calculation-fix.js',
            'enhanced-calculator-fix.js'
        ];
        
        // Remove scripts that match patterns
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
    
    // Load the comprehensive enhancement script
    function loadEnhancementScript() {
        // Create script element
        const script = document.createElement('script');
        script.src = 'js/fixes/comprehensive-enhancement.js?' + Date.now(); // Add cache-busting parameter
        
        // Add to document
        document.head.appendChild(script);
        
        console.log('Comprehensive enhancement script loaded');
    }
    
    // Clean up conflicting scripts
    cleanupConflictingScripts();
    
    // Load enhancement script
    loadEnhancementScript();
    
    console.log('Total Cost Analyzer Fix installed successfully');
})();
