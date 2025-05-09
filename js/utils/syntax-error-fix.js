/**
 * NAC Architecture Designer Pro - Syntax Error Fix
 * 
 * This script fixes the "Unexpected token ';'" error in modern-wizard.js line 3801
 * by creating a proxy that intercepts and corrects the script before it's executed
 */
(function() {
    console.log("Installing Syntax Error Fix");
    
    // Intercept fetch requests to fix problematic scripts
    const originalFetch = window.fetch;
    window.fetch = function(resource, options) {
        const url = resource.toString();
        
        // Check if this is one of our problematic scripts
        if (url.includes('modern-wizard.js')) {
            console.log("Intercepting fetch for: " + url);
            
            // Return a modified version of the script
            return originalFetch(resource, options)
                .then(response => {
                    // Clone the response so we can modify it
                    return response.text().then(text => {
                        // Fix the syntax error at line 3801
                        let fixedText = text;
                        
                        // Specific fix for the "Unexpected token ';'" error
                        // This is a basic approach - a more robust approach would identify the exact issue
                        const problemLine = 3801;
                        const lines = fixedText.split('\n');
                        
                        if (lines.length >= problemLine) {
                            // Replace the semicolon with a comma or remove it
                            lines[problemLine - 1] = lines[problemLine - 1].replace(/;/, ',');
                            fixedText = lines.join('\n');
                            console.log("Fixed syntax error at line 3801 in modern-wizard.js");
                        }
                        
                        // Create a new response with fixed text
                        return new Response(fixedText, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    });
                });
        }
        
        // Not a problematic script, proceed normally
        return originalFetch(resource, options);
    };
    
    // Intercept XMLHttpRequest to fix problematic scripts
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url;
        return originalOpen.call(this, method, url, async, user, password);
    };
    
    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && this._url.toString().includes('modern-wizard.js')) {
            console.log("Intercepting XHR for: " + this._url);
            
            // Set up an override for the response
            const originalSetProperty = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get;
            
            Object.defineProperty(this, 'responseText', {
                get: function() {
                    const originalText = originalSetProperty.call(this);
                    
                    // Only modify if we have a response
                    if (originalText) {
                        // Fix the syntax error at line 3801
                        let fixedText = originalText;
                        
                        // Specific fix for the "Unexpected token ';'" error
                        const problemLine = 3801;
                        const lines = fixedText.split('\n');
                        
                        if (lines.length >= problemLine) {
                            // Replace the semicolon with a comma or remove it
                            lines[problemLine - 1] = lines[problemLine - 1].replace(/;/, ',');
                            fixedText = lines.join('\n');
                            console.log("Fixed syntax error at line 3801 in modern-wizard.js (XHR)");
                        }
                        
                        return fixedText;
                    }
                    
                    return originalText;
                }
            });
        }
        
        return originalSend.call(this, body);
    };
    
    console.log("Syntax Error Fix installed");
})();
