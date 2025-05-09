/**
 * No-NAC Cost Analysis Calculator
 * Calculates the risk and cost of not having a NAC solution
 */
const NoNacCalculator = (function() {
    // Average breach costs by industry (in USD)
    const breachCostsByIndustry = {
        healthcare: 9800000,  // $9.8 million average breach cost
        financial: 6080000,   // $6.08 million per breach
        industrial: 5560000,  // $5.56 million, with 18% increase from 2023
        retail: 4240000,      // $4.24 million
        education: 3850000,   // $3.85 million
        government: 5100000,  // $5.1 million
        technology: 4700000,  // $4.7 million
        hospitality: 3200000, // $3.2 million
        other: 4350000        // $4.35 million (general average)
    };
    
    // Breach probability factors (annual likelihood percentages)
    const breachProbabilityFactors = {
        // By industry
        industryFactors: {
            healthcare: 0.328,   // 32.8% annual breach probability
            financial: 0.297,    // 29.7%
            industrial: 0.257,   // 25.7%
            retail: 0.236,       // 23.6%
            education: 0.246,    // 24.6%
            government: 0.267,   // 26.7%
            technology: 0.277,   // 27.7%
            hospitality: 0.225,  // 22.5%
            other: 0.250         // 25.0% (general average)
        },
        
        // By organization size (employee count)
        sizeFactors: {
            small: 0.42,      // <1,000 employees: 42% higher risk
            medium: 1.0,      // 1,000-5,000 employees: baseline
            large: 1.28       // >5,000 employees: 28% higher risk
        },
        
        // Multi-location factor (increases risk)
        multiLocationFactor: 1.15,  // 15% higher risk for multi-location orgs
        
        // Legacy device factor (increases risk)
        legacyDeviceFactor: function(percentage) {
            // Each 10% of legacy devices increases risk by 7%
            return 1 + (percentage * 0.007);
        }
    };
    
    // NAC mitigation factors (how much NAC reduces certain risks)
    const nacMitigationFactors = {
        breachLikelihood: 0.25,    // NAC reduces breach likelihood by 25%
        breachScope: 0.50,         // NAC reduces breach scope by 50%
        detectionTime: 0.80,       // NAC reduces time-to-detect by 80%
        complianceRisk: 0.15       // NAC reduces compliance risk by 15%
    };
    
    // Calculate breach risk costs without NAC
    function calculateBreachRisk(params) {
        const { 
            industry, 
            organizationSize, 
            deviceCount, 
            hasMultipleLocations, 
            legacyPercentage,
            yearsToProject
        } = params;
        
        // Get base cost by industry
        const baseCost = breachCostsByIndustry[industry] || breachCostsByIndustry.other;
        
        // Calculate annual breach probability
        let probability = breachProbabilityFactors.industryFactors[industry] || breachProbabilityFactors.industryFactors.other;
        
        // Adjust for organization size
        probability *= breachProbabilityFactors.sizeFactors[organizationSize];
        
        // Adjust for multiple locations
        if (hasMultipleLocations) {
            probability *= breachProbabilityFactors.multiLocationFactor;
        }
        
        // Adjust for legacy devices
        if (legacyPercentage > 0) {
            probability *= breachProbabilityFactors.legacyDeviceFactor(legacyPercentage / 100);
        }
        
        // Scale cost based on device count (baseline is 1000 devices)
        const scaledCost = baseCost * (deviceCount / 1000) ** 0.7; // Using power function for scaling
        
        // Calculate annual expected loss
        const annualExpectedLoss = scaledCost * probability;
        
        // Project across years with 5% annual increase in both likelihood and cost
        const yearlyLosses = [];
        let cumulativeLoss = 0;
        
        for (let year = 1; year <= yearsToProject; year++) {
            const yearFactor = 1 + (0.05 * (year - 1)); // 5% increase each year
            const yearlyLoss = annualExpectedLoss * yearFactor;
            cumulativeLoss += yearlyLoss;
            yearlyLosses.push(yearlyLoss);
        }
        
        return {
            annualExpectedLoss,
            yearlyLosses,
            cumulativeLoss,
            breachProbability: probability
        };
    }
    
    // Calculate total cost of operating without NAC
    function calculateTotalCost(params) {
        // Calculate individual cost components
        const breachRisk = calculateBreachRisk(params);
        
        // Calculate total annual cost - simplified version
        const totalAnnualCost = breachRisk.annualExpectedLoss;
        
        // Calculate yearly and cumulative totals
        const yearlyTotals = [...breachRisk.yearlyLosses];
        const cumulativeTotal = breachRisk.cumulativeLoss;
        
        return {
            breachRisk,
            totalAnnualCost,
            yearlyTotals,
            cumulativeTotal,
            components: {
                breachRiskPercentage: 1.0 // 100% in this simplified version
            }
        };
    }
    
    // Calculate reduction from implementing NAC
    function calculateNacBenefit(noNacCosts) {
        return {
            breachLikelihoodReduction: noNacCosts.breachRisk.annualExpectedLoss * nacMitigationFactors.breachLikelihood,
            breachScopeReduction: noNacCosts.breachRisk.annualExpectedLoss * nacMitigationFactors.breachScope,
            totalRiskReduction: noNacCosts.breachRisk.annualExpectedLoss * (nacMitigationFactors.breachLikelihood + nacMitigationFactors.breachScope)
        };
    }

    // Public API
    return {
        calculateBreachRisk,
        calculateTotalCost,
        calculateNacBenefit,
        getMitigationFactors: function() {
            return {...nacMitigationFactors};
        }
    };
})();
