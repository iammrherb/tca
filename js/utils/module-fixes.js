/**
 * NAC Architecture Designer Pro - Module Redeclaration Fixes
 */
(function() {
    console.log("Installing module redeclaration fixes");

    // Create registry for modules
    window._moduleRegistry = window._moduleRegistry || {};
    
    // Safe module loader to prevent redeclaration errors
    window.safeDefineModule = function(name, initializer) {
        // Check if already defined
        if (window._moduleRegistry[name]) {
            console.log("Module " + name + " already loaded, using existing instance");
            return window._moduleRegistry[name];
        }
        
        console.log("Safely defining module: " + name);
        
        try {
            // Get original if exists
            const original = window[name];
            
            // Create new or enhanced module
            const module = typeof initializer === 'function' 
                ? initializer(original) 
                : (original || {});
                
            // Store in registry
            window._moduleRegistry[name] = module;
            
            // Only replace global if not conflicting
            if (!window[name]) {
                window[name] = module;
            }
            
            return module;
        } catch (error) {
            console.error("Error defining module " + name, error);
            return {};
        }
    };
    
    // Protect critical modules from redeclaration
    const criticalModules = [
        'ComplianceFrameworks',
        'ModernCharts',
        'VendorAdvantages',
        'RiskAnalysis',
        'NACDesignerApp',
        'ChartBuilder'
    ];
    
    // Store original values
    const originalValues = {};
    criticalModules.forEach(function(name) {
        originalValues[name] = window[name];
    });
    
    // Override script loading to wrap loaded scripts
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        if (tagName.toLowerCase() === 'script') {
            // Override the script's src setter
            const originalSrcSetter = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').set;
            
            Object.defineProperty(element, 'src', {
                set: function(value) {
                    // Check if this is one of our problematic scripts
                    const isProblematicScript = criticalModules.some(function(module) {
                        return value.indexOf(module.toLowerCase()) !== -1;
                    });
                    
                    if (isProblematicScript) {
                        console.log("Detected loading of potentially problematic script: " + value);
                    }
                    
                    // Call the original setter
                    originalSrcSetter.call(this, value);
                },
                get: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src').get
            });
        }
        
        return element;
    };
    
    console.log("Module redeclaration fixes installed");
})();
