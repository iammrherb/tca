/**
 * NAC Architecture Designer Pro - Risk Heatmap Fix
 * 
 * This fix addresses the "Cannot read properties of null (reading 'getBoundingClientRect')" error
 * in the ModernCharts.riskHeatmap function
 */
(function() {
    console.log("Installing Risk Heatmap Fix");
    
    // Function to safely patch the ModernCharts object
    function patchModernCharts() {
        if (!window.ModernCharts) {
            console.warn("ModernCharts not found, will retry later");
            setTimeout(patchModernCharts, 500);
            return;
        }
        
        console.log("Patching ModernCharts.riskHeatmap");
        
        // Store the original function if it exists
        const originalRiskHeatmap = window.ModernCharts.riskHeatmap;
        
        // Create a safer version of the function
        window.ModernCharts.riskHeatmap = function(containerId, data, options) {
            console.log("Safe riskHeatmap called for container: " + containerId);
            
            // Check if container exists
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn("Risk heatmap container not found: " + containerId);
                return null;
            }
            
            try {
                // Add safety for getBoundingClientRect
                const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
                Element.prototype.getBoundingClientRect = function() {
                    if (!this || !this.parentElement) {
                        console.warn("Prevented getBoundingClientRect on detached element");
                        return {
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: 0,
                            height: 0
                        };
                    }
                    return originalGetBoundingClientRect.call(this);
                };
                
                // Call original or create fallback
                let result;
                if (typeof originalRiskHeatmap === 'function') {
                    result = originalRiskHeatmap.call(window.ModernCharts, containerId, data, options);
                } else {
                    console.warn("Original riskHeatmap function not found, using fallback");
                    // Simple fallback visualization
                    container.innerHTML = '<div style="padding: 20px; background: #f8f8f8; border: 1px solid #ddd;">' +
                        '<h3>Risk Heatmap</h3>' +
                        '<p>Simplified visualization due to error in original function.</p>' +
                        '</div>';
                    result = { fallback: true };
                }
                
                // Restore original function
                Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
                
                return result;
            } catch (error) {
                console.error("Error in risk heatmap creation:", error);
                
                // Provide a fallback visualization
                container.innerHTML = '<div style="padding: 20px; background: #f8f8f8; border: 1px solid #ddd;">' +
                    '<h3>Risk Heatmap</h3>' +
                    '<p>Error: ' + error.message + '</p>' +
                    '</div>';
                
                return null;
            }
        };
        
        console.log("ModernCharts.riskHeatmap patched successfully");
    }
    
    // Create a safe patch for main.js updateRiskAnalysis function
    function patchUpdateRiskAnalysis() {
        if (!window.updateRiskAnalysis && !window.NACDesignerApp) {
            console.warn("updateRiskAnalysis function not found directly, will try to patch caller");
            // Try to patch the caller instead
            patchUpdateChartsForVendor();
            return;
        }
        
        const targetFunc = window.updateRiskAnalysis || 
                          (window.NACDesignerApp && window.NACDesignerApp.updateRiskAnalysis);
        
        if (!targetFunc) {
            console.warn("Could not find updateRiskAnalysis function to patch");
            return;
        }
        
        console.log("Patching updateRiskAnalysis function");
        
        // Create safer version
        const safeUpdateRiskAnalysis = function(vendor) {
            console.log("Safe updateRiskAnalysis called for vendor: " + vendor);
            
            try {
                // Check if risk container exists
                const riskContainer = document.getElementById('risk-heatmap-container');
                if (!riskContainer) {
                    console.warn("Risk heatmap container not found, skipping updateRiskAnalysis");
                    return;
                }
                
                // Original function call
                return targetFunc.call(this, vendor);
            } catch (error) {
                console.error("Error in updateRiskAnalysis:", error);
            }
        };
        
        // Apply patch
        if (window.updateRiskAnalysis) {
            window.updateRiskAnalysis = safeUpdateRiskAnalysis;
        } else if (window.NACDesignerApp && window.NACDesignerApp.updateRiskAnalysis) {
            window.NACDesignerApp.updateRiskAnalysis = safeUpdateRiskAnalysis;
        }
        
        console.log("updateRiskAnalysis patched successfully");
    }
    
    // Patch the updateChartsForVendor function
    function patchUpdateChartsForVendor() {
        if (!window.updateChartsForVendor && !window.NACDesignerApp) {
            console.warn("updateChartsForVendor function not found, cannot patch");
            return;
        }
        
        const targetFunc = window.updateChartsForVendor || 
                          (window.NACDesignerApp && window.NACDesignerApp.updateChartsForVendor);
        
        if (!targetFunc) {
            console.warn("Could not find updateChartsForVendor function to patch");
            return;
        }
        
        console.log("Patching updateChartsForVendor function");
        
        // Create safer version
        const safeUpdateChartsForVendor = function(vendor) {
            console.log("Safe updateChartsForVendor called for vendor: " + vendor);
            
            try {
                // Call any update functions we know are safe
                if (window.updateTCOChart) {
                    window.updateTCOChart(vendor);
                }
                
                if (window.updateCumulativeCostChart) {
                    window.updateCumulativeCostChart(vendor);
                }
                
                if (window.updateCostBreakdownCharts) {
                    window.updateCostBreakdownCharts(vendor);
                }
                
                if (window.updateFeatureComparisonChart) {
                    window.updateFeatureComparisonChart(vendor);
                }
                
                if (window.updateImplementationComparisonChart) {
                    window.updateImplementationComparisonChart(vendor);
                }
                
                if (window.updateROIChart) {
                    window.updateROIChart(vendor);
                }
                
                // Safely call risk analysis
                try {
                    if (window.updateRiskAnalysis) {
                        window.updateRiskAnalysis(vendor);
                    } else if (window.NACDesignerApp && window.NACDesignerApp.updateRiskAnalysis) {
                        window.NACDesignerApp.updateRiskAnalysis(vendor);
                    }
                } catch (riskError) {
                    console.warn("Error updating risk analysis:", riskError);
                }
                
                return true;
            } catch (error) {
                console.error("Error in updateChartsForVendor:", error);
                return false;
            }
        };
        
        // Apply patch
        if (window.updateChartsForVendor) {
            window.updateChartsForVendor = safeUpdateChartsForVendor;
        } else if (window.NACDesignerApp && window.NACDesignerApp.updateChartsForVendor) {
            window.NACDesignerApp.updateChartsForVendor = safeUpdateChartsForVendor;
        }
        
        console.log("updateChartsForVendor patched successfully");
    }
    
    // Patch handleResize to avoid calling problematic functions
    function patchHandleResize() {
        if (!window.handleResize && !window.NACDesignerApp) {
            console.warn("handleResize function not found, cannot patch");
            return;
        }
        
        const targetFunc = window.handleResize || 
                          (window.NACDesignerApp && window.NACDesignerApp.handleResize);
        
        if (!targetFunc) {
            console.warn("Could not find handleResize function to patch");
            return;
        }
        
        console.log("Patching handleResize function");
        
        // Create safer version
        const safeHandleResize = function() {
            console.log("Safe handleResize called");
            
            try {
                // Get current vendor selection
                const vendorSelect = document.querySelector('.vendor-card.selected') || 
                                    document.querySelector('[data-vendor="cisco"]');
                
                const vendor = vendorSelect ? vendorSelect.getAttribute('data-vendor') : 'cisco';
                
                // Use our safe update charts function
                if (window.updateChartsForVendor) {
                    window.updateChartsForVendor(vendor);
                } else if (window.NACDesignerApp && window.NACDesignerApp.updateChartsForVendor) {
                    window.NACDesignerApp.updateChartsForVendor(vendor);
                }
                
                return true;
            } catch (error) {
                console.error("Error in handleResize:", error);
                return false;
            }
        };
        
        // Apply patch
        if (window.handleResize) {
            window.handleResize = safeHandleResize;
        } else if (window.NACDesignerApp && window.NACDesignerApp.handleResize) {
            window.NACDesignerApp.handleResize = safeHandleResize;
        }
        
        console.log("handleResize patched successfully");
    }
    
    // Patch everything when DOM is ready
    function applyPatches() {
        patchModernCharts();
        patchUpdateRiskAnalysis();
        patchUpdateChartsForVendor();
        patchHandleResize();
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPatches);
    } else {
        // DOM already loaded
        applyPatches();
    }
    
    // Also patch after window load to ensure everything is available
    window.addEventListener('load', applyPatches);
    
    console.log("Risk Heatmap Fix installed");
})();
