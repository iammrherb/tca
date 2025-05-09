/**
 * No NAC Baseline - Cost of Inadequate Network Access Control
 * Based on industry research and real-world breach data
 */
const NoNacBaseline = (function() {
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
    
    // Compliance violation costs by framework
    const complianceViolationCosts = {
        hipaa: {
            min: 100,            // per violation, per day
            max: 5100000,        // max $5.1M for willful neglect
            average: 1750000     // average settlement
        },
        pci: {
            min: 5000,           // $5,000 per month
            max: 100000,         // $100,000 per month
            perRecord: 18.5      // $18.50 per compromised card
        },
        gdpr: {
            min: 10000000,       // €10M or 2% annual revenue
            max: 20000000,       // €20M or 4% annual revenue
            average: 1400000     // average fine
        },
        cmmc: {
            contractLoss: true,  // Loss of defense contracts
            averageImpact: 1200000  // estimated average financial impact
        },
        glba: {
            perViolation: 100000   // up to $100,000 per violation
        }
    };
    
    // NAC mitigation factors (how much NAC reduces certain risks)
    const nacMitigationFactors = {
        breachLikelihood: 0.75,    // NAC reduces breach likelihood by 25%
        breachScope: 0.50,         // NAC reduces breach scope by 50%
        detectionTime: 0.20,       // NAC reduces time-to-detect by 80%
        complianceRisk: 0.85       // NAC reduces compliance risk by 15%
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
    
    // Calculate compliance violation risks without NAC
    function calculateComplianceRisk(params) {
        const { 
            industry, 
            frameworks, 
            deviceCount, 
            yearsToProject 
        } = params;
        
        // Get compliance frameworks based on industry if not specified
        const relevantFrameworks = frameworks || getDefaultFrameworks(industry);
        
        // Calculate annual compliance risk per framework
        const frameworkRisks = {};
        let totalAnnualRisk = 0;
        
        relevantFrameworks.forEach(framework => {
            if (complianceViolationCosts[framework]) {
                const costs = complianceViolationCosts[framework];
                const averageCost = costs.average || (costs.min + costs.max) / 2;
                
                // Calculate violation probability (simplified)
                let violationProbability = 0;
                
                switch (framework) {
                    case 'hipaa':
                        violationProbability = industry === 'healthcare' ? 0.22 : 0.05;
                        break;
                    case 'pci':
                        violationProbability = industry === 'retail' || industry === 'financial' ? 0.18 : 0.04;
                        break;
                    case 'gdpr':
                        violationProbability = 0.15; // Applies to all industries more evenly
                        break;
                    case 'cmmc':
                        violationProbability = industry === 'government' ? 0.25 : 0.03;
                        break;
                    case 'glba':
                        violationProbability = industry === 'financial' ? 0.20 : 0.02;
                        break;
                    default:
                        violationProbability = 0.10;
                }
                
                // Scale based on device count
                const scaleFactor = Math.log10(deviceCount / 100) * 0.5;
                violationProbability *= (1 + scaleFactor);
                
                // Calculate framework annual risk
                const frameworkAnnualRisk = averageCost * violationProbability;
                totalAnnualRisk += frameworkAnnualRisk;
                
                frameworkRisks[framework] = {
                    annualRisk: frameworkAnnualRisk,
                    probability: violationProbability,
                    averageCost
                };
            }
        });
        
        // Project across years with 10% annual increase in compliance risk
        const yearlyRisks = [];
        let cumulativeRisk = 0;
        
        for (let year = 1; year <= yearsToProject; year++) {
            const yearFactor = 1 + (0.10 * (year - 1)); // 10% increase each year
            const yearlyRisk = totalAnnualRisk * yearFactor;
            cumulativeRisk += yearlyRisk;
            yearlyRisks.push(yearlyRisk);
        }
        
        return {
            frameworkRisks,
            totalAnnualRisk,
            yearlyRisks,
            cumulativeRisk
        };
    }
    
    // Get default compliance frameworks based on industry
    function getDefaultFrameworks(industry) {
        switch (industry) {
            case 'healthcare':
                return ['hipaa', 'pci'];
            case 'financial':
                return ['pci', 'glba', 'gdpr'];
            case 'retail':
                return ['pci', 'gdpr'];
            case 'government':
                return ['cmmc', 'gdpr'];
            default:
                return ['pci', 'gdpr'];
        }
    }
    
    // Calculate operational inefficiencies without NAC
    function calculateOperationalInefficiency(params) {
        const {
            deviceCount,
            organizationSize,
            hasMultipleLocations,
            locationCount,
            yearsToProject
        } = params;
        
        // Base annual inefficiency cost (IT staff hours) per device
        let baseInefficiencyCostPerDevice = 0;
        
        switch (organizationSize) {
            case 'small':
                baseInefficiencyCostPerDevice = 45; // $45 per device annual inefficiency
                break;
            case 'medium':
                baseInefficiencyCostPerDevice = 35; // $35 per device
                break;
            case 'large':
                baseInefficiencyCostPerDevice = 28; // $28 per device (economies of scale)
                break;
            default:
                baseInefficiencyCostPerDevice = 35;
        }
        
        // Multiple locations increase inefficiency
        let locationFactor = 1;
        if (hasMultipleLocations) {
            // More locations create exponentially more inefficiency
            locationFactor = 1 + Math.log10(locationCount) * 0.5;
        }
        
        // Calculate annual operational inefficiency
        const annualInefficiency = deviceCount * baseInefficiencyCostPerDevice * locationFactor;
        
        // Project across years with 3% annual increase in inefficiency costs
        const yearlyInefficiencies = [];
        let cumulativeInefficiency = 0;
        
        for (let year = 1; year <= yearsToProject; year++) {
            const yearFactor = 1 + (0.03 * (year - 1)); // 3% increase each year
            const yearlyInefficiency = annualInefficiency * yearFactor;
            cumulativeInefficiency += yearlyInefficiency;
            yearlyInefficiencies.push(yearlyInefficiency);
        }
        
        return {
            annualInefficiency,
            yearlyInefficiencies,
            cumulativeInefficiency
        };
    }
    
    // Calculate additional staffing costs without NAC
    function calculateStaffingCosts(params) {
        const {
            deviceCount,
            organizationSize,
            hasMultipleLocations,
            locationCount,
            yearsToProject
        } = params;
        
        // Calculate FTE requirements without NAC
        let fteWithoutNac = 0;
        
        // Base FTE calculation per 1000 devices
        switch (organizationSize) {
            case 'small':
                fteWithoutNac = deviceCount / 1000 * 0.4; // 0.4 FTE per 1000 devices
                break;
            case 'medium':
                fteWithoutNac = deviceCount / 1000 * 0.35; // 0.35 FTE per 1000 devices
                break;
            case 'large':
                fteWithoutNac = deviceCount / 1000 * 0.3; // 0.3 FTE per 1000 devices (efficiency)
                break;
            default:
                fteWithoutNac = deviceCount / 1000 * 0.35;
        }
        
        // Multiple locations increase FTE requirements
        if (hasMultipleLocations) {
            fteWithoutNac *= (1 + (locationCount * 0.05)); // 5% increase per location
        }
        
        // Average annual fully-loaded IT security staff cost
        const annualFteCost = 140000; // $140,000 per FTE
        
        // Calculate annual staffing cost without NAC
        const annualStaffingCost = fteWithoutNac * annualFteCost;
        
        // Project across years with 3.5% annual increase in staffing costs
        const yearlyStaffingCosts = [];
        let cumulativeStaffingCost = 0;
        
        for (let year = 1; year <= yearsToProject; year++) {
            const yearFactor = 1 + (0.035 * (year - 1)); // 3.5% increase each year
            const yearlyStaffingCost = annualStaffingCost * yearFactor;
            cumulativeStaffingCost += yearlyStaffingCost;
            yearlyStaffingCosts.push(yearlyStaffingCost);
        }
        
        return {
            fteWithoutNac,
            annualStaffingCost,
            yearlyStaffingCosts,
            cumulativeStaffingCost
        };
    }
    
    // Calculate total cost of operating without NAC
    function calculateTotalCost(params) {
        // Calculate individual cost components
        const breachRisk = calculateBreachRisk(params);
        const complianceRisk = calculateComplianceRisk(params);
        const operationalInefficiency = calculateOperationalInefficiency(params);
        const staffingCosts = calculateStaffingCosts(params);
        
        // Calculate total annual cost
        const totalAnnualCost = 
            breachRisk.annualExpectedLoss + 
            complianceRisk.totalAnnualRisk + 
            operationalInefficiency.annualInefficiency +
            staffingCosts.annualStaffingCost;
        
        // Calculate yearly and cumulative totals
        const yearlyTotals = [];
        let cumulativeTotal = 0;
        
        for (let year = 1; year <= params.yearsToProject; year++) {
            const yearlyTotal = 
                breachRisk.yearlyLosses[year - 1] + 
                complianceRisk.yearlyRisks[year - 1] + 
                operationalInefficiency.yearlyInefficiencies[year - 1] +
                staffingCosts.yearlyStaffingCosts[year - 1];
            
            cumulativeTotal += yearlyTotal;
            yearlyTotals.push(yearlyTotal);
        }
        
        return {
            breachRisk,
            complianceRisk,
            operationalInefficiency,
            staffingCosts,
            totalAnnualCost,
            yearlyTotals,
            cumulativeTotal,
            components: {
                branchRiskPercentage: breachRisk.annualExpectedLoss / totalAnnualCost,
                complianceRiskPercentage: complianceRisk.totalAnnualRisk / totalAnnualCost,
                operationalInefficiencyPercentage: operationalInefficiency.annualInefficiency / totalAnnualCost,
                staffingCostsPercentage: staffingCosts.annualStaffingCost / totalAnnualCost
            }
        };
    }
    
    // Public interface
    return {
        calculateBreachRisk,
        calculateComplianceRisk,
        calculateOperationalInefficiency,
        calculateStaffingCosts,
        calculateTotalCost,
        getMitigationFactors: function() {
            return {...nacMitigationFactors};
        }
    };
})();

// Export for usage in Node.js environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NoNacBaseline;
}
