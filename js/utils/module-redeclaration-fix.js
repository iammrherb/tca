/**
 * NAC Architecture Designer Pro - Module Redeclaration Fix
 * 
 * This script prevents redeclaration of key modules by intercepting script loading
 * and wrapping declarations in safety checks
 */
(function() {
    console.log("Installing Module Redeclaration Fix");
    
    // List of modules we need to protect
    const protectedModules = [
        'ComplianceFrameworks',
        'ModernCharts',
        'VendorAdvantages',
        'RiskAnalysis',
        'NACDesignerApp',
        'ChartBuilder'
    ];
    
    // Store original module references
    const originalModules = {};
    protectedModules.forEach(function(name) {
        originalModules[name] = window[name];
    });
    
    // Create a registry for modules
    window._safeModuleRegistry = window._safeModuleRegistry || {};
    
    // Add each original module to registry
    for (const name in originalModules) {
        if (originalModules[name]) {
            window._safeModuleRegistry[name] = originalModules[name];
        }
    }
    
    // Override script loading
    function interceptScripts() {
        // Create a proxy for script elements
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            // Create the actual element
            const element = originalCreateElement.call(document, tagName);
            
            // If it's a script tag, intercept the src attribute
            if (tagName.toLowerCase() === 'script') {
                // Keep track of the original src setter
                const originalSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
                const originalSrcSetter = originalSrcDescriptor.set;
                
                // Override the src setter
                Object.defineProperty(element, 'src', {
                    get: originalSrcDescriptor.get,
                    set: function(value) {
                        // Check if this script contains one of our protected modules
                        const scriptPath = value.toString();
                        const isProtectedScript = protectedModules.some(function(module) {
                            return scriptPath.includes(module.toLowerCase()) || 
                                   scriptPath.includes(module);
                        });
                        
                        if (isProtectedScript) {
                            console.log("Intercepting protected script: " + scriptPath);
                            
                            // Create a proxy URL that will wrap the module
                            const originalSrc = value;
                            
                            // Fetch the script ourselves
                            fetch(originalSrc)
                                .then(response => response.text())
                                .then(scriptContent => {
                                    // Wrap the content in safety checks for each module
                                    let safeContent = scriptContent;
                                    
                                    for (const module of protectedModules) {
                                        // Look for module declarations
                                        const varPattern = new RegExp(`var\\s+${module}\\s*=`, 'g');
                                        const constPattern = new RegExp(`const\\s+${module}\\s*=`, 'g');
                                        const letPattern = new RegExp(`let\\s+${module}\\s*=`, 'g');
                                        
                                        // Replace with safe versions
                                        safeContent = safeContent
                                            .replace(varPattern, `window._safeModuleRegistry['${module}'] = window._safeModuleRegistry['${module}'] || {}; var ${module} = window._safeModuleRegistry['${module}']; ${module} = ${module} ||`)
                                            .replace(constPattern, `window._safeModuleRegistry['${module}'] = window._safeModuleRegistry['${module}'] || {}; const ${module} = window._safeModuleRegistry['${module}'];//`)
                                            .replace(letPattern, `window._safeModuleRegistry['${module}'] = window._safeModuleRegistry['${module}'] || {}; let ${module} = window._safeModuleRegistry['${module}'];//`);
                                    }
                                    
                                    // Create a new blob URL with our wrapped script
                                    const blob = new Blob([safeContent], { type: 'application/javascript' });
                                    const wrappedUrl = URL.createObjectURL(blob);
                                    
                                    // Set the actual src to our wrapped version
                                    originalSrcSetter.call(element, wrappedUrl);
                                })
                                .catch(error => {
                                    console.error("Error wrapping script:", error);
                                    // Fall back to original script
                                    originalSrcSetter.call(element, originalSrc);
                                });
                                
                            return;
                        }
                        
                        // Not a protected script, proceed normally
                        originalSrcSetter.call(element, value);
                    },
                    enumerable: true,
                    configurable: true
                });
            }
            
            return element;
        };
    }
    
    // Initialize interception
    interceptScripts();
    
    // Define safe getter/setter for each module
    protectedModules.forEach(function(name) {
        // Skip if already processed
        if (Object.getOwnPropertyDescriptor(window, name)?.configurable === false) {
            return;
        }
        
        // Save original value
        const originalValue = window[name];
        
        // Store in registry
        window._safeModuleRegistry[name] = window._safeModuleRegistry[name] || originalValue;
        
        // Define property with getter/setter
        Object.defineProperty(window, name, {
            get: function() {
                return window._safeModuleRegistry[name];
            },
            set: function(value) {
                console.log(`Prevented redeclaration of ${name}`);
                
                // If it's undefined, don't overwrite existing value
                if (value === undefined) {
                    return;
                }
                
                // If registry doesn't have a value yet, store it
                if (!window._safeModuleRegistry[name]) {
                    window._safeModuleRegistry[name] = value;
                    return;
                }
                
                // Otherwise, merge new properties into existing object
                if (typeof window._safeModuleRegistry[name] === 'object' && 
                    typeof value === 'object' && 
                    value !== null) {
                    Object.assign(window._safeModuleRegistry[name], value);
                }
            },
            configurable: false
        });
    });
    
    console.log("Module Redeclaration Fix installed");
})();
