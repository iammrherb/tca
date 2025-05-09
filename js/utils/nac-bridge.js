/**
 * NAC Architecture Designer Pro - Bridge Module
 * 
 * This module creates a compatibility layer to resolve critical errors:
 * - Prevents multiple declarations of the same module
 * - Fixes Chart.js compatibility issues
 * - Handles null references and circular DOM references
 * - Provides a safe initialization sequence
 */
(function() {
    console.log("Installing NAC Bridge Module");
    
    // Create safe namespace
    window.NACBridge = window.NACBridge || {
        modules: {},
        initialized: false,
        config: {
            debug: true,
            resourceBasePath: './',
            fallbackResources: {
                'fa-solid-900.woff2': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
                'fa-solid-900.ttf': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.ttf'
            }
        }
    };
    
    // Safe logger
    const log = function(message) {
        if (window.NACBridge.config.debug && console && console.log) {
            console.log("[NACBridge] " + message);
        }
    };
    
    const warn = function(message) {
        if (console && console.warn) {
            console.warn("[NACBridge WARNING] " + message);
        }
    };
    
    const error = function(message, err) {
        if (console && console.error) {
            console.error("[NACBridge ERROR] " + message, err || '');
        }
    };
    
    // Store original module references
    const originalModules = {
        ComplianceFrameworks: window.ComplianceFrameworks,
        ModernCharts: window.ModernCharts,
        VendorAdvantages: window.VendorAdvantages,
        RiskAnalysis: window.RiskAnalysis,
        NACDesignerApp: window.NACDesignerApp,
        ChartBuilder: window.ChartBuilder
    };
    
    // Safe module loader to prevent redeclaration errors
    window.NACBridge.loadModule = function(name, initializer) {
        if (window.NACBridge.modules[name]) {
            log("Module " + name + " already loaded, using existing instance");
            return window.NACBridge.modules[name];
        }
        
        try {
            log("Loading module: " + name);
            const original = window[name];
            window.NACBridge.modules[name] = typeof initializer === 'function' 
                ? initializer(original) 
                : (original || {});
                
            // Only assign to window if it doesn't create conflicts
            if (!window[name]) {
                window[name] = window.NACBridge.modules[name];
            }
            
            return window.NACBridge.modules[name];
        } catch (err) {
            error("Error loading module " + name, err);
            return {};
        }
    };
    
    // Fix Chart.js issues
    window.NACBridge.fixChartJs = function() {
        if (!window.Chart) {
            warn("Chart.js not found, skipping fixes");
            return;
        }
        
        log("Applying Chart.js fixes");
        
        // Fix missing forEach method on Chart.instances
        if (!window.Chart.instances.forEach) {
            window.Chart.instances.forEach = function(callback) {
                if (Array.isArray(window.Chart.instances)) {
                    window.Chart.instances.forEach(callback);
                } else {
                    // For Chart.js v3+, instances is an object
                    Array.from(Object.values(window.Chart.instances)).forEach(callback);
                }
            };
            log("Added forEach method to Chart.instances");
        }
        
        // Add safe Chart.getChart if it doesn't exist (for older Chart.js versions)
        if (!window.Chart.getChart) {
            window.Chart.getChart = function(canvas) {
                if (!canvas) return null;
                
                // Try to find the chart instance for this canvas
                let chartInstance = null;
                window.Chart.instances.forEach(function(instance) {
                    if (instance.canvas === canvas) {
                        chartInstance = instance;
                    }
                });
                
                return chartInstance;
            };
            log("Added getChart method to Chart");
        }
        
        // Safe chart initialization
        window.NACBridge.initChart = function(chartId, config) {
            try {
                const canvas = document.getElementById(chartId);
                if (!canvas) {
                    warn("Canvas element not found: " + chartId);
                    return null;
                }
                
                // Destroy existing chart if any
                const existingChart = window.Chart.getChart(canvas);
                if (existingChart) {
                    log("Destroying existing chart on canvas " + chartId);
                    existingChart.destroy();
                }
                
                // Reset canvas dimensions to prevent weird scaling issues
                const parent = canvas.parentElement;
                if (parent) {
                    canvas.width = parent.clientWidth || 300;
                    canvas.height = parent.clientHeight || 200;
                }
                
                log("Initializing chart: " + chartId);
                return new window.Chart(canvas, config);
            } catch (err) {
                error("Error initializing chart " + chartId, err);
                return null;
            }
        };
    };
    
    // Fix circular DOM references
    window.NACBridge.fixDomCircularReferences = function() {
        log("Fixing circular DOM references");
        
        const originalAppendChild = Element.prototype.appendChild;
        Element.prototype.appendChild = function(child) {
            if (this === child || (child && child.contains && child.contains(this))) {
                warn("Prevented circular DOM reference in appendChild");
                return child;
            }
            return originalAppendChild.call(this, child);
        };
        
        // Also fix insertBefore
        const originalInsertBefore = Element.prototype.insertBefore;
        Element.prototype.insertBefore = function(child, reference) {
            if (this === child || (child && child.contains && child.contains(this))) {
                warn("Prevented circular DOM reference in insertBefore");
                return child;
            }
            return originalInsertBefore.call(this, child, reference);
        };
    };
    
    // Fix duplicate element IDs
    window.NACBridge.fixDuplicateIds = function() {
        log("Fixing duplicate element IDs");
        
        const seen = {};
        document.querySelectorAll('[id]').forEach(function(element) {
            const id = element.id;
            if (seen[id]) {
                warn("Found duplicate element with ID: " + id);
                // Instead of removing, rename with a suffix
                element.id = id + '_dup_' + Math.random().toString(36).substr(2, 5);
            } else {
                seen[id] = true;
            }
        });
    };
    
    // Resource fallback system
    window.NACBridge.getResource = function(path) {
        if (!path) return null;
        
        const filename = path.split('/').pop();
        if (window.NACBridge.config.fallbackResources[filename]) {
            log("Using fallback resource for: " + filename);
            return window.NACBridge.config.fallbackResources[filename];
        }
        
        return path.startsWith('http') ? path : (window.NACBridge.config.resourceBasePath + path);
    };
    
    // Initialize the bridge
    window.NACBridge.init = function() {
        if (window.NACBridge.initialized) {
            log("Bridge already initialized");
            return;
        }
        
        log("Initializing NAC Bridge");
        
        // Apply fixes
        window.NACBridge.fixChartJs();
        window.NACBridge.fixDomCircularReferences();
        window.NACBridge.fixDuplicateIds();
        
        // Patch modernCharts for null checks
        if (window.ModernCharts) {
            const original = window.ModernCharts;
            window.NACBridge.loadModule('ModernCharts', function() {
                // Create enhanced version with null checks
                const enhanced = Object.assign({}, original);
                
                // Add null checks to critical methods
                if (enhanced.riskHeatmap) {
                    const originalHeatmap = enhanced.riskHeatmap;
                    enhanced.riskHeatmap = function(container, data, options) {
                        if (!container || !document.getElementById(container)) {
                            warn("Container not found for risk heatmap: " + container);
                            return null;
                        }
                        return originalHeatmap.call(this, container, data, options);
                    };
                }
                
                // Add similar null checks to other methods as needed
                
                return enhanced;
            });
        }
        
        // Mark as initialized
        window.NACBridge.initialized = true;
        log("NAC Bridge initialization complete");
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.NACBridge.init);
    } else {
        // DOM already loaded
        window.NACBridge.init();
    }
    
    log("NAC Bridge Module installed");
})();
