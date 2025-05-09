/**
 * Enhanced Total Cost Analyzer
 * Advanced TCO calculator with multi-year projections, industry-specific factors, and No-NAC baseline
 */
const EnhancedTcoCalculator = (function() {
    // Default cost multipliers
    const DEFAULT_COST_MULTIPLIERS = {
        hardware: 1.0,
        licensing: 1.0,
        maintenance: 1.0,
        implementation: 1.0,
        operations: 1.0,
        training: 1.0,
        downtime: 1.0
    };
    
    // Default parameters
    const DEFAULT_PARAMS = {
        deviceCount: 1000,
        legacyPercentage: 0,
        locationCount: 1,
        yearsToProject: 3, // Default to 3 years
        organizationSize: 'medium',
        industry: 'other',
        currentVendor: 'cisco'
    };
    
    // Initialize with vendor and industry data
    let vendorData = null;
    let industryData = null;
    let complianceData = null;
    let noNacBaseline = null;
    
    // Load dependent data modules
    function initializeData() {
        // Check if modules are available
        if (typeof VendorComparison !== 'undefined') {
            vendorData = VendorComparison;
        } else {
            console.error('VendorComparison module not loaded!');
        }
        
        if (typeof IndustryData !== 'undefined') {
            industryData = IndustryData;
        } else {
            console.error('IndustryData module not loaded!');
        }
        
        if (typeof ComplianceFrameworks !== 'undefined') {
            complianceData = ComplianceFrameworks;
        } else {
            console.error('ComplianceFrameworks module not loaded!');
        }
        
        if (typeof NoNacBaseline !== 'undefined') {
            noNacBaseline = NoNacBaseline;
        } else {
            console.error('NoNacBaseline module not loaded!');
        }
        
        // Return if initialization was successful
        return vendorData !== null && industryData !== null && complianceData !== null && noNacBaseline !== null;
    }
    
    // Calculate TCO for NAC solutions
    function calculateTco(params, costMultipliers = {}) {
        // Merge parameters with defaults
        const mergedParams = { ...DEFAULT_PARAMS, ...params };
        const mergedMultipliers = { ...DEFAULT_COST_MULTIPLIERS, ...costMultipliers };
        
        // Ensure that data modules are initialized
        if (!initializeData()) {
            console.error('Cannot calculate TCO: Required data modules not loaded!');
            return null;
        }
        
        // Get vendor-specific TCO data
        const vendorTcoData = vendorData.calculateVendorTcoComparison(mergedParams);
        if (!vendorTcoData) {
            console.error('Error calculating vendor TCO comparison');
            return null;
        }
        
        // Apply industry-specific factors
        const industryFactors = industryData.getIndustryTcoFactors(mergedParams.industry);
        
        // Get No-NAC baseline costs
        const noNacCosts = calculateNoNacBaseline(mergedParams);
        
        // Apply cost multipliers to vendor TCO
        const currentVendorTco = applyMultipliers(vendorTcoData.currentVendor, mergedMultipliers);
        const portnoxTco = applyMultipliers(vendorTcoData.portnox, mergedMultipliers);
        
        // Calculate ROI including No-NAC comparison
        const currentVendorRoi = calculateRoi(mergedParams, noNacCosts, currentVendorTco);
        const portnoxRoi = calculateRoi(mergedParams, noNacCosts, portnoxTco);
        
        // Calculate multi-year projections
        const yearByYearProjection = calculateMultiYearProjection(
            mergedParams, 
            vendorTcoData.yearByYearCosts,
            noNacCosts.yearlyTotals
        );
        
        // Calculate breakeven point
        const breakevenPoint = calculateBreakevenPoint(yearByYearProjection);
        
        // Return comprehensive TCO analysis
        return {
            parameters: mergedParams,
            currentVendor: {
                ...currentVendorTco,
                roi: currentVendorRoi
            },
            portnox: {
                ...portnoxTco,
                roi: portnoxRoi
            },
            noNac: noNacCosts,
            savings: {
                total: currentVendorTco.total - portnoxTco.total,
                percentage: ((currentVendorTco.total - portnoxTco.total) / currentVendorTco.total) * 100,
                comparedToNoNac: {
                    currentVendor: noNacCosts.cumulativeTotal - currentVendorTco.total,
                    portnox: noNacCosts.cumulativeTotal - portnoxTco.total,
                }
            },
            implementationComparison: vendorTcoData.implementationTimeComparison,
            yearByYearProjection,
            breakevenPoint,
            industryFactors
        };
    }
    
    // Helper function to apply cost multipliers
    function applyMultipliers(vendorTco, multipliers) {
        // Clone the vendor TCO data
        const result = JSON.parse(JSON.stringify(vendorTco));
        
        // Apply multipliers to implementation costs
        result.implementation *= multipliers.implementation;
        
        // Apply multipliers to annual costs
        if (result.annual) {
            if (result.annual.hardware) {
                result.annual.hardware *= multipliers.hardware;
            }
            if (result.annual.licensing) {
                result.annual.licensing *= multipliers.licensing;
            }
            if (result.annual.maintenance) {
                result.annual.maintenance *= multipliers.maintenance;
            }
            if (result.annual.staffing) {
                result.annual.staffing *= multipliers.operations;
            }
            if (result.annual.upgrades) {
                result.annual.upgrades *= multipliers.maintenance;
            }
            if (result.annual.infrastructure) {
                result.annual.infrastructure *= multipliers.hardware;
            }
        }
        
        // Apply multipliers to hardware refresh costs
        if (result.hardwareRefresh) {
            result.hardwareRefresh *= multipliers.hardware;
        }
        
        // Recalculate total
        result.total = result.implementation +
            (Object.values(result.annual).reduce((a, b) => a + b, 0) * params.yearsToProject) +
            (result.hardwareRefresh || 0);
        
        return result;
    }
    
    // Calculate No-NAC baseline costs
    function calculateNoNacBaseline(params) {
        // Call the NoNacBaseline module to get costs of operating without NAC
        return noNacBaseline.calculateTotalCost(params);
    }
    
    // Calculate ROI based on NoNAC baseline and NAC implementation costs
    function calculateRoi(params, noNacCosts, nacCosts) {
        // ROI = (Gain from Investment - Cost of Investment) / Cost of Investment
        // Gain = NoNAC costs - NAC costs (savings from implementing NAC)
        const gain = noNacCosts.cumulativeTotal - nacCosts.total;
        const roi = gain / nacCosts.total;
        
        return {
            value: roi,
            percentage: roi * 100,
            annualValue: roi / params.yearsToProject,
            annualPercentage: (roi / params.yearsToProject) * 100
        };
    }
    
    // Calculate multi-year projection
    function calculateMultiYearProjection(params, vendorYearByYearCosts, noNacYearlyTotals) {
        const projection = [];
        
        // Cumulative totals
        let cumulativeCurrentVendor = 0;
        let cumulativePortnox = 0;
        let cumulativeNoNac = 0;
        
        // For each year in the projection
        for (let i = 0; i < params.yearsToProject; i++) {
            const year = i + 1;
            const vendorCosts = vendorYearByYearCosts[i];
            const noNacYearlyCost = noNacYearlyTotals[i];
            
            // Update cumulative totals
            cumulativeCurrentVendor += vendorCosts.currentVendor;
            cumulativePortnox += vendorCosts.portnox;
            cumulativeNoNac += noNacYearlyCost;
            
            // Calculate savings compared to No-NAC
            const currentVendorSavingsVsNoNac = noNacYearlyCost - vendorCosts.currentVendor;
            const portnoxSavingsVsNoNac = noNacYearlyCost - vendorCosts.portnox;
            
            // ROI calculations for this year
            const currentVendorRoi = ((cumulativeNoNac - cumulativeCurrentVendor) / cumulativeCurrentVendor) * 100;
            const portnoxRoi = ((cumulativeNoNac - cumulativePortnox) / cumulativePortnox) * 100;
            
            projection.push({
                year,
                currentVendor: {
                    yearly: vendorCosts.currentVendor,
                    cumulative: cumulativeCurrentVendor,
                    savingsVsNoNac: currentVendorSavingsVsNoNac,
                    cumulativeSavingsVsNoNac: cumulativeNoNac - cumulativeCurrentVendor,
                    roi: currentVendorRoi
                },
                portnox: {
                    yearly: vendorCosts.portnox,
                    cumulative: cumulativePortnox,
                    savingsVsNoNac: portnoxSavingsVsNoNac,
                    cumulativeSavingsVsNoNac: cumulativeNoNac - cumulativePortnox,
                    roi: portnoxRoi
                },
                noNac: {
                    yearly: noNacYearlyCost,
                    cumulative: cumulativeNoNac
                },
                portnoxVsCurrentVendor: {
                    savings: vendorCosts.savings,
                    savingsPercentage: vendorCosts.savingsPercentage,
                    cumulativeSavings: cumulativeCurrentVendor - cumulativePortnox,
                    cumulativeSavingsPercentage: ((cumulativeCurrentVendor - cumulativePortnox) / cumulativeCurrentVendor) * 100
                }
            });
        }
        
        return projection;
    }
    
    // Calculate breakeven point
    function calculateBreakevenPoint(yearByYearProjection) {
        // Find when cumulative savings vs No-NAC exceed the implementation cost
        const currentVendorBreakeven = findBreakeven(yearByYearProjection, 'currentVendor');
        const portnoxBreakeven = findBreakeven(yearByYearProjection, 'portnox');
        
        return {
            currentVendor: currentVendorBreakeven,
            portnox: portnoxBreakeven,
            comparisonAdvantage: currentVendorBreakeven.years - portnoxBreakeven.years
        };
    }
    
    // Helper to find breakeven point
    function findBreakeven(projection, vendorKey) {
        // Start values
        let breakevenYear = null;
        let breakevenQuarter = null;
        let breakevenValue = null;
        
        // Check if first year already breaks even
        if (projection[0][vendorKey].savingsVsNoNac > 0) {
            // Calculate how many quarters into year 1 (approximation)
            const quarterFraction = 0.25; // Assume breakeven at 1st quarter if already profitable
            
            return {
                years: 0.25,
                description: "Less than 3 months",
                value: projection[0][vendorKey].savingsVsNoNac * quarterFraction
            };
        }
        
        // Check each year
        for (let i = 1; i < projection.length; i++) {
            const prevYear = projection[i - 1];
            const currentYear = projection[i];
            
            // If cumulative savings became positive this year
            if (prevYear[vendorKey].cumulativeSavingsVsNoNac <= 0 && 
                currentYear[vendorKey].cumulativeSavingsVsNoNac > 0) {
                
                // Calculate breakeven point by interpolation
                const prevValue = prevYear[vendorKey].cumulativeSavingsVsNoNac;
                const currentValue = currentYear[vendorKey].cumulativeSavingsVsNoNac;
                
                // How far between years (0-1 represents progress through the year)
                const yearFraction = prevValue === currentValue ? 
                    0.5 : // If values are the same (unlikely), assume middle of year
                    Math.abs(prevValue) / (Math.abs(prevValue) + currentValue);
                
                breakevenYear = i; // Year index (0-based)
                breakevenQuarter = Math.ceil(yearFraction * 4); // Which quarter (approximate)
                breakevenValue = 0; // At breakeven, value is 0 by definition
                
                break;
            }
        }
        
        // If no breakeven found within projection period
        if (breakevenYear === null) {
            return {
                years: projection.length + 0.5, // Beyond projection period
                description: `Beyond ${projection.length} years`,
                value: null
            };
        }
        
        // Calculate years to breakeven (including fraction of year)
        const yearsToBreakeven = breakevenYear + (breakevenQuarter / 4);
        
        // Create description
        let description;
        if (yearsToBreakeven < 1) {
            description = `${breakevenQuarter * 3} months`;
        } else if (yearsToBreakeven === 1) {
            description = "1 year";
        } else if (Math.floor(yearsToBreakeven) === yearsToBreakeven) {
            description = `${yearsToBreakeven} years`;
        } else {
            description = `${Math.floor(yearsToBreakeven)} years, ${breakevenQuarter * 3} months`;
        }
        
        return {
            years: yearsToBreakeven,
            description,
            value: breakevenValue
        };
    }
    
    // Calculate sensitivity analysis
    function performSensitivityAnalysis(baseParams, variable, minValue, maxValue, steps, vendorId) {
        // Create parameter sets for each step
        const stepSize = (maxValue - minValue) / (steps - 1);
        const paramSets = [];
        
        for (let i = 0; i < steps; i++) {
            const value = minValue + (stepSize * i);
            const params = { ...baseParams };
            
            // Update the variable value
            params[variable] = value;
            
            // If we're analyzing a specific vendor, set it
            if (vendorId) {
                params.currentVendor = vendorId;
            }
            
            paramSets.push({
                value,
                params
            });
        }
        
        // Calculate TCO for each parameter set
        const results = paramSets.map(set => {
            const tco = calculateTco(set.params);
            return {
                value: set.value,
                currentVendor: tco.currentVendor,
                portnox: tco.portnox,
                noNac: tco.noNac,
                savings: tco.savings
            };
        });
        
        return {
            variable,
            minValue,
            maxValue,
            steps,
            vendorId,
            results
        };
    }
    
    // Get compliance requirements based on industry
    function getComplianceRequirements(industryId) {
        // Return compliance frameworks and requirements for the specified industry
        return complianceData.getNacRequirementsForIndustry(industryId);
    }
    
    // Public interface
    return {
        calculateTco,
        performSensitivityAnalysis,
        getComplianceRequirements,
        DEFAULT_PARAMS
    };
})();

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if required modules are available
    if (typeof VendorComparison === 'undefined') {
        console.error('VendorComparison module not loaded. Enhanced TCO calculator will not function properly.');
    }
    
    if (typeof IndustryData === 'undefined') {
        console.error('IndustryData module not loaded. Enhanced TCO calculator will not function properly.');
    }
    
    if (typeof ComplianceFrameworks === 'undefined') {
        console.error('ComplianceFrameworks module not loaded. Enhanced TCO calculator will not function properly.');
    }
    
    if (typeof NoNacBaseline === 'undefined') {
        console.error('NoNacBaseline module not loaded. Enhanced TCO calculator will not function properly.');
    }
    
    console.log('Enhanced Total Cost Analyzer loaded.');
});

// Export for usage in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedTcoCalculator;
}
