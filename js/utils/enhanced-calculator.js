/**
 * Enhanced Total Cost Analyzer
 * Comprehensive calculator with Portnox pricing options, multi-year projection,
 * and competitive analysis
 */
const EnhancedCalculator = (function() {
    // Default values
    const defaults = {
        deviceCount: 1000,
        yearsToProject: 3,
        portnoxCostPerDevice: {
            min: 0.5,  // $0.50 per device per month
            max: 6.0,  // $6.00 per device per month
            default: 4.0 // $4.00 per device per month
        },
        portnoxDiscount: {
            min: 0,    // 0% discount
            max: 80,   // 80% maximum discount
            default: 0 // 0% default discount
        }
    };
    
    // Internal state
    let state = {
        currentVendor: null,
        industry: 'other',
        deviceCount: defaults.deviceCount,
        yearsToProject: defaults.yearsToProject,
        hasMultipleLocations: false,
        locationCount: 1,
        complexAuthentication: false,
        legacyDevices: false,
        legacyPercentage: 30,
        cloudIntegration: false,
        customPolicies: false,
        policyComplexity: 'medium',
        organizationSize: 'medium',
        portnoxCostPerDevice: defaults.portnoxCostPerDevice.default,
        portnoxDiscount: defaults.portnoxDiscount.default,
        showNoNacComparison: true
    };
    
    // Vendor-specific cost factors
    const vendorCostFactors = {
        // Traditional NAC vendors
        cisco: {
            name: "Cisco ISE",
            type: "on-premise",
            licensingCost: {
                small: 42000,
                medium: 85000,
                large: 175000
            },
            hardwareCost: {
                small: 45000,
                medium: 75000,
                large: 150000
            },
            maintenanceCost: {
                percentage: 0.20 // 20% of licensing cost annually
            },
            implementationCost: {
                small: 40000,
                medium: 85000,
                large: 160000
            },
            fteCost: {
                small: 0.5, // 0.5 FTE for ongoing management
                medium: 1.0,
                large: 2.0
            },
            implementationTime: {
                small: 8,  // weeks
                medium: 16, // weeks
                large: 24  // weeks
            }
        },
        aruba: {
            name: "Aruba ClearPass",
            type: "on-premise",
            licensingCost: {
                small: 35000,
                medium: 70000,
                large: 140000
            },
            hardwareCost: {
                small: 30000,
                medium: 60000,
                large: 120000
            },
            maintenanceCost: {
                percentage: 0.18 // 18% of licensing cost annually
            },
            implementationCost: {
                small: 30000,
                medium: 65000,
                large: 130000
            },
            fteCost: {
                small: 0.4,
                medium: 0.7,
                large: 1.5
            },
            implementationTime: {
                small: 6,  // weeks
                medium: 12, // weeks
                large: 20  // weeks
            }
        },
        forescout: {
            name: "Forescout",
            type: "on-premise",
            licensingCost: {
                small: 40000,
                medium: 80000,
                large: 160000
            },
            hardwareCost: {
                small: 35000,
                medium: 70000,
                large: 140000
            },
            maintenanceCost: {
                percentage: 0.20 // 20% of licensing cost annually
            },
            implementationCost: {
                small: 35000,
                medium: 75000,
                large: 150000
            },
            fteCost: {
                small: 0.5,
                medium: 0.8,
                large: 1.6
            },
            implementationTime: {
                small: 6,  // weeks
                medium: 14, // weeks
                large: 22  // weeks
            }
        },
        fortinac: {
            name: "FortiNAC",
            type: "on-premise",
            licensingCost: {
                small: 30000,
                medium: 60000,
                large: 120000
            },
            hardwareCost: {
                small: 25000,
                medium: 50000,
                large: 100000
            },
            maintenanceCost: {
                percentage: 0.18 // 18% of licensing cost annually
            },
            implementationCost: {
                small: 25000,
                medium: 55000,
                large: 110000
            },
            fteCost: {
                small: 0.3,
                medium: 0.6,
                large: 1.2
            },
            implementationTime: {
                small: 5,  // weeks
                medium: 10, // weeks
                large: 16  // weeks
            }
        },
        nps: {
            name: "Microsoft NPS",
            type: "on-premise",
            licensingCost: {
                small: 2500,  // Windows Server licensing
                medium: 5000,
                large: 10000
            },
            hardwareCost: {
                small: 8000,
                medium: 16000,
                large: 32000
            },
            maintenanceCost: {
                percentage: 0.15 // 15% of licensing cost annually
            },
            implementationCost: {
                small: 15000,
                medium: 30000,
                large: 60000
            },
            fteCost: {
                small: 0.2,
                medium: 0.4,
                large: 0.8
            },
            implementationTime: {
                small: 2,  // weeks
                medium: 4, // weeks
                large: 8  // weeks
            }
        },
        securew2: {
            name: "SecureW2",
            type: "cloud",
            licensingCost: {
                small: 20000,
                medium: 40000,
                large: 80000
            },
            hardwareCost: {
                small: 0,
                medium: 0,
                large: 0
            },
            maintenanceCost: {
                percentage: 0.0 // Included in subscription
            },
            implementationCost: {
                small: 10000,
                medium: 20000,
                large: 40000
            },
            fteCost: {
                small: 0.15,
                medium: 0.2,
                large: 0.4
            },
            implementationTime: {
                small: 1,  // weeks
                medium: 2, // weeks
                large: 4  // weeks
            }
        },
        noNac: {
            name: "No NAC Solution",
            type: "none",
            licensingCost: {
                small: 0,
                medium: 0,
                large: 0
            },
            hardwareCost: {
                small: 0,
                medium: 0,
                large: 0
            },
            maintenanceCost: {
                percentage: 0.0
            },
            implementationCost: {
                small: 0,
                medium: 0,
                large: 0
            },
            fteCost: {
                small: 0,
                medium: 0,
                large: 0
            },
            implementationTime: {
                small: 0,
                medium: 0,
                large: 0
            }
        }
    };
    
    // Helper function to determine organization size
    function getOrgSize(deviceCount) {
        if (deviceCount <= 500) {
            return 'small';
        } else if (deviceCount <= 5000) {
            return 'medium';
        } else {
            return 'large';
        }
    }
    
    // Calculate standard costs for a traditional vendor
    function calculateVendorCosts(vendor, params) {
        const { 
            deviceCount, 
            yearsToProject, 
            hasMultipleLocations,
            locationCount,
            complexAuthentication, 
            legacyDevices,
            legacyPercentage,
            cloudIntegration,
            customPolicies,
            policyComplexity
        } = params;
        
        const orgSize = getOrgSize(deviceCount);
        
        // If no vendor is specified, return zeros
        if (!vendor || !vendorCostFactors[vendor]) {
            return {
                licensingCost: 0,
                hardwareCost: 0,
                maintenanceCost: 0,
                implementationCost: 0,
                fteCost: 0,
                annualCost: 0,
                totalCost: 0,
                implementationTime: 0
            };
        }
        
        const vendorFactors = vendorCostFactors[vendor];
        
        // Scale costs based on device count
        const deviceScaleFactor = deviceCount / (orgSize === 'small' ? 500 : orgSize === 'medium' ? 2500 : 7500);
        
        // Base costs
        let licensingCost = vendorFactors.licensingCost[orgSize] * deviceScaleFactor;
        let hardwareCost = vendorFactors.hardwareCost[orgSize];
        let implementationCost = vendorFactors.implementationCost[orgSize];
        
        // Adjust for multiple locations
        if (hasMultipleLocations) {
            // Hardware cost increases with locations for on-prem
            if (vendorFactors.type === 'on-premise') {
                hardwareCost *= (1 + (Math.log10(locationCount) * 0.5));
            }
            
            // Implementation cost increases with locations
            implementationCost *= (1 + (Math.log10(locationCount) * 0.3));
        }
        
        // Adjust for complex authentication
        if (complexAuthentication) {
            implementationCost *= 1.2; // 20% increase
            licensingCost *= 1.1; // 10% increase for premium features
        }
        
        // Adjust for legacy devices
        if (legacyDevices && legacyPercentage > 0) {
            implementationCost *= (1 + (legacyPercentage / 100 * 0.3)); // Up to 30% increase
        }
        
        // Adjust for cloud integration
        if (cloudIntegration && vendorFactors.type === 'on-premise') {
            implementationCost *= 1.15; // 15% increase
            licensingCost *= 1.1; // 10% increase for cloud connectors
        }
        
        // Adjust for custom policies
        if (customPolicies) {
            const policyFactors = {
                'low': 1.1,    // 10% increase
                'medium': 1.2, // 20% increase
                'high': 1.35   // 35% increase
            };
            
            implementationCost *= policyFactors[policyComplexity] || 1.2;
        }
        
        // Calculate maintenance cost
        const annualMaintenanceCost = licensingCost * vendorFactors.maintenanceCost.percentage;
        const totalMaintenanceCost = annualMaintenanceCost * yearsToProject;
        
        // Calculate FTE cost
        const fteCostFactor = vendorFactors.fteCost[orgSize] * (deviceCount / (orgSize === 'small' ? 500 : orgSize === 'medium' ? 2500 : 7500));
        const annualFteCost = fteCostFactor * 140000; // $140,000 per FTE
        const totalFteCost = annualFteCost * yearsToProject;
        
        // Calculate annual cost (licensing + maintenance + FTE)
        const annualCost = licensingCost / yearsToProject + annualMaintenanceCost + annualFteCost;
        
        // Total cost over the projection period
        const totalCost = licensingCost + hardwareCost + totalMaintenanceCost + implementationCost + totalFteCost;
        
        // Implementation time adjustment
        let implementationTime = vendorFactors.implementationTime[orgSize];
        
        // Adjust implementation time based on same factors
        if (hasMultipleLocations) {
            implementationTime *= (1 + (Math.log10(locationCount) * 0.2));
        }
        
        if (complexAuthentication) {
            implementationTime *= 1.15;
        }
        
        if (legacyDevices && legacyPercentage > 0) {
            implementationTime *= (1 + (legacyPercentage / 100 * 0.2));
        }
        
        if (customPolicies) {
            const timeFactors = {
                'low': 1.05,
                'medium': 1.15,
                'high': 1.25
            };
            
            implementationTime *= timeFactors[policyComplexity] || 1.15;
        }
        
        return {
            licensingCost,
            hardwareCost,
            maintenanceCost: totalMaintenanceCost,
            implementationCost,
            fteCost: totalFteCost,
            annualCost,
            totalCost,
            implementationTime
        };
    }
    
    // Calculate Portnox cloud costs
    function calculatePortnoxCosts(params) {
        const { 
            deviceCount, 
            yearsToProject, 
            hasMultipleLocations,
            locationCount,
            complexAuthentication,
            legacyDevices,
            legacyPercentage,
            cloudIntegration,
            customPolicies,
            policyComplexity,
            portnoxCostPerDevice,
            portnoxDiscount
        } = params;
        
        const orgSize = getOrgSize(deviceCount);
        
        // Calculate base licensing cost with discount
        const discountMultiplier = 1 - (portnoxDiscount / 100);
        const monthlyPerDeviceCost = portnoxCostPerDevice * discountMultiplier;
        const annualLicensingCost = deviceCount * monthlyPerDeviceCost * 12;
        const totalLicensingCost = annualLicensingCost * yearsToProject;
        
        // Implementation cost - much lower than traditional vendors
        let implementationCost = 5000; // Base implementation cost
        
        // Scale implementation cost based on organization size
        if (orgSize === 'medium') {
            implementationCost = 10000;
        } else if (orgSize === 'large') {
            implementationCost = 20000;
        }
        
        // Adjust for complexity factors (less impact than traditional vendors)
        if (hasMultipleLocations) {
            implementationCost *= (1 + (Math.log10(locationCount) * 0.1)); // Only 10% increase vs 30%
        }
        
        if (complexAuthentication) {
            implementationCost *= 1.1; // 10% increase vs 20%
        }
        
        if (legacyDevices && legacyPercentage > 0) {
            implementationCost *= (1 + (legacyPercentage / 100 * 0.1)); // 10% max increase vs 30%
        }
        
        if (customPolicies) {
            const policyFactors = {
                'low': 1.05,    // 5% increase vs 10%
                'medium': 1.1,  // 10% increase vs 20%
                'high': 1.15    // 15% increase vs 35%
            };
            
            implementationCost *= policyFactors[policyComplexity] || 1.1;
        }
        
        // Calculate FTE cost - much lower for cloud
        const fteCostFactor = 0.1; // Base 0.1 FTE for small
        if (orgSize === 'medium') {
            fteCostFactor = 0.15;
        } else if (orgSize === 'large') {
            fteCostFactor = 0.2;
        }
        
        const deviceScaleFactor = deviceCount / (orgSize === 'small' ? 500 : orgSize === 'medium' ? 2500 : 7500);
        const annualFteCost = fteCostFactor * deviceScaleFactor * 140000; // $140,000 per FTE
        const totalFteCost = annualFteCost * yearsToProject;
        
        // Annual cost (licensing + FTE)
        const annualCost = annualLicensingCost + annualFteCost;
        
        // Total cost over the projection period
        const totalCost = totalLicensingCost + implementationCost + totalFteCost;
        
        // Implementation time - much faster than traditional
        let implementationTime = 0.5; // 0.5 weeks for small
        if (orgSize === 'medium') {
            implementationTime = 1;
        } else if (orgSize === 'large') {
            implementationTime = 2;
        }
        
        // Minor adjustments for complexity
        if (hasMultipleLocations) {
            implementationTime *= (1 + (Math.log10(locationCount) * 0.1));
        }
        
        if (complexAuthentication) {
            implementationTime *= 1.1;
        }
        
        if (customPolicies && policyComplexity === 'high') {
            implementationTime *= 1.1;
        }
        
        return {
            licensingCost: totalLicensingCost,
            hardwareCost: 0, // No hardware costs for cloud
            maintenanceCost: 0, // Included in subscription
            implementationCost,
            fteCost: totalFteCost,
            annualCost,
            totalCost,
            implementationTime,
            pricePerDevice: monthlyPerDeviceCost
        };
    }
    
    // Calculate comparison between current vendor and Portnox
    function calculateComparison() {
        // Generate parameters from current state
        const params = {
            deviceCount: state.deviceCount,
            yearsToProject: state.yearsToProject,
            hasMultipleLocations: state.hasMultipleLocations,
            locationCount: state.locationCount,
            complexAuthentication: state.complexAuthentication,
            legacyDevices: state.legacyDevices,
            legacyPercentage: state.legacyPercentage,
            cloudIntegration: state.cloudIntegration,
            customPolicies: state.customPolicies,
            policyComplexity: state.policyComplexity,
            portnoxCostPerDevice: state.portnoxCostPerDevice,
            portnoxDiscount: state.portnoxDiscount
        };
        
        // Calculate vendor costs
        const currentVendorCosts = state.currentVendor === 'portnox' 
            ? calculatePortnoxCosts(params) 
            : calculateVendorCosts(state.currentVendor, params);
        
        // Calculate Portnox costs
        const portnoxCosts = calculatePortnoxCosts(params);
        
        // Calculate No-NAC costs if applicable
        let noNacCosts = null;
        if (state.showNoNacComparison) {
            noNacCosts = NoNacCalculator.calculateTotalCost({
                industry: state.industry,
                organizationSize: state.organizationSize,
                deviceCount: state.deviceCount,
                hasMultipleLocations: state.hasMultipleLocations,
                locationCount: state.locationCount,
                legacyPercentage: state.legacyDevices ? state.legacyPercentage : 0,
                yearsToProject: state.yearsToProject
            });
        }
        
        // Calculate savings (if current vendor isn't Portnox)
        let savings = null;
        if (state.currentVendor !== 'portnox') {
            savings = {
                amount: currentVendorCosts.totalCost - portnoxCosts.totalCost,
                percentage: ((currentVendorCosts.totalCost - portnoxCosts.totalCost) / currentVendorCosts.totalCost) * 100,
                implementationTimeReduction: ((currentVendorCosts.implementationTime - portnoxCosts.implementationTime) / currentVendorCosts.implementationTime) * 100
            };
        }
        
        return {
            currentVendor: {
                id: state.currentVendor,
                name: vendorCostFactors[state.currentVendor]?.name || "Unknown Vendor",
                costs: currentVendorCosts
            },
            portnox: {
                costs: portnoxCosts
            },
            noNac: noNacCosts,
            savings,
            projectionYears: state.yearsToProject
        };
    }
    
    // Update state with new values
    function updateState(newValues) {
        state = {...state, ...newValues};
    }
    
    // Get current state
    function getState() {
        return {...state};
    }
    
    // Calculate TCO and update UI
    function calculateTCO() {
        const results = calculateComparison();
        
        // Update results in UI
        updateResultsUI(results);
        
        return results;
    }
    
    // Update the UI with calculation results
    function updateResultsUI(results) {
        // Add code to update all UI elements with results
        // This would include updating:
        // - Charts
        // - Summary metrics
        // - Detailed breakdown tables
        // - Savings highlights
        
        console.log('TCO Results:', results);
        
        // Example: Update summary metrics
        updateSummaryMetrics(results);
        
        // Example: Update comparison charts
        updateComparisonCharts(results);
        
        // Example: Update detailed tables
        updateDetailedTables(results);
        
        // Show results container
        document.getElementById('results-container').classList.remove('hidden');
    }
    
    // Update summary metrics in the UI
    function updateSummaryMetrics(results) {
        // Update savings amount
        const savingsAmountElement = document.getElementById('comparison-savings');
        if (savingsAmountElement && results.savings) {
            savingsAmountElement.textContent = `$${formatNumber(results.savings.amount)}`;
        }
        
        // Update implementation time reduction
        const implementationElement = document.getElementById('comparison-implementation');
        if (implementationElement && results.savings) {
            implementationElement.textContent = `${Math.round(results.savings.implementationTimeReduction)}%`;
        }
        
        // Update progress bars
        updateProgressBars(results);
        
        // Update Portnox spotlight section
        updatePortnoxSpotlight(results);
    }
    
    // Update progress bars
    function updateProgressBars(results) {
        if (!results.savings) return;
        
        // Update savings progress bar
        const savingsBar = document.querySelector('#comparison-savings + .progress-bar .progress');
        const savingsLabels = document.querySelector('#comparison-savings + .progress-bar + .progress-labels');
        
        if (savingsBar && savingsLabels) {
            const savingsPct = Math.round(results.savings.percentage);
            savingsBar.style.width = `${savingsPct}%`;
            savingsBar.setAttribute('aria-valuenow', savingsPct);
            
            // Update labels
            const labels = savingsLabels.querySelectorAll('span');
            if (labels.length >= 2) {
                labels[1].textContent = `${savingsPct}% Savings`;
            }
        }
        
        // Update implementation time progress bar
        const implementationBar = document.querySelector('#comparison-implementation + .progress-bar .progress');
        const implementationLabels = document.querySelector('#comparison-implementation + .progress-bar + .progress-labels');
        
        if (implementationBar && implementationLabels) {
            const implementationPct = Math.round(results.savings.implementationTimeReduction);
            implementationBar.style.width = `${implementationPct}%`;
            implementationBar.setAttribute('aria-valuenow', implementationPct);
            
            // Update labels
            const labels = implementationLabels.querySelectorAll('span');
            if (labels.length >= 2) {
                labels[1].textContent = `${implementationPct}% Faster`;
            }
        }
    }
    
    // Update Portnox spotlight section
    function updatePortnoxSpotlight(results) {
        if (!results.savings) return;
        
        // Update savings amount
        const savingsAmountElement = document.getElementById('portnox-savings-amount');
        if (savingsAmountElement) {
            savingsAmountElement.textContent = `$${formatNumber(results.savings.amount)}`;
        }
        
        // Update savings percentage
        const savingsPctElement = document.getElementById('portnox-savings-percentage');
        if (savingsPctElement) {
            savingsPctElement.textContent = `${Math.round(results.savings.percentage)}%`;
        }
        
        // Update implementation time
        const implementationElement = document.getElementById('portnox-implementation-time');
        if (implementationElement) {
            implementationElement.textContent = `${Math.round(results.savings.implementationTimeReduction)}%`;
        }
    }
    
    // Update comparison charts
    function updateComparisonCharts(results) {
        // This would call the ChartBuilder to update all charts
        // Assuming ChartBuilder is available globally
        if (typeof ChartBuilder !== 'undefined') {
            // Update TCO comparison chart
            ChartBuilder.updateTcoComparisonChart({
                labels: [results.currentVendor.name, 'Portnox Cloud'],
                values: [
                    results.currentVendor.costs.totalCost, 
                    results.portnox.costs.totalCost
                ]
            });
            
            // Update cumulative cost chart
            ChartBuilder.updateCumulativeCostChart({
                years: Array.from({length: results.projectionYears}, (_, i) => i + 1),
                currentVendorName: results.currentVendor.name,
                currentVendorCosts: calculateYearlyCumulativeCosts(results.currentVendor.costs, results.projectionYears),
                portnoxCosts: calculateYearlyCumulativeCosts(results.portnox.costs, results.projectionYears)
            });
            
            // If No-NAC comparison is enabled, update breach risk chart
            if (results.noNac) {
                ChartBuilder.updateBreachRiskChart({
                    withoutNac: results.noNac.breachRisk.cumulativeLoss,
                    withNac: results.noNac.breachRisk.cumulativeLoss * 0.375, // 75% likelihood reduction × 50% scope reduction
                    years: results.projectionYears
                });
            }
        }
    }
    
    // Calculate yearly cumulative costs
    function calculateYearlyCumulativeCosts(costs, years) {
        const { licensingCost, hardwareCost, maintenanceCost, implementationCost, fteCost } = costs;
        
        // Annual costs (maintenance, FTE)
        const annualMaintenanceCost = maintenanceCost / years;
        const annualFteCost = fteCost / years;
        
        // First year includes implementation and hardware
        const yearlyData = [];
        let cumulativeCost = 0;
        
        for (let year = 1; year <= years; year++) {
            let yearCost = 0;
            
            if (year === 1) {
                // First year includes one-time costs
                yearCost += implementationCost + hardwareCost;
            }
            
            // Add annual costs
            yearCost += (licensingCost / years) + annualMaintenanceCost + annualFteCost;
            
            // Add to cumulative
            cumulativeCost += yearCost;
            yearlyData.push(cumulativeCost);
        }
        
        return yearlyData;
    }
    
    // Update detailed tables
    function updateDetailedTables(results) {
        // Update TCO summary table
        updateTcoSummaryTable(results);
        
        // Update annual costs table
        updateAnnualCostsTable(results);
        
        // Update implementation table
        updateImplementationTable(results);
    }
    
    // Update TCO summary table
    function updateTcoSummaryTable(results) {
        const tableBody = document.getElementById('tco-summary-table-body');
        if (!tableBody) return;
        
        const { currentVendor, portnox } = results;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Current vendor row
        const currentVendorRow = document.createElement('tr');
        currentVendorRow.innerHTML = `
            <td>${currentVendor.name}</td>
            <td>$${formatNumber(currentVendor.costs.hardwareCost + currentVendor.costs.implementationCost)}</td>
            <td>$${formatNumber((currentVendor.costs.licensingCost + currentVendor.costs.maintenanceCost + currentVendor.costs.fteCost) / results.projectionYears)}</td>
            <td>$${formatNumber(0)}</td>
            <td>$${formatNumber(currentVendor.costs.totalCost)}</td>
        `;
        tableBody.appendChild(currentVendorRow);
        
        // Portnox row
        const portnoxRow = document.createElement('tr');
        portnoxRow.innerHTML = `
            <td>Portnox Cloud</td>
            <td>$${formatNumber(portnox.costs.hardwareCost + portnox.costs.implementationCost)}</td>
            <td>$${formatNumber((portnox.costs.licensingCost + portnox.costs.maintenanceCost + portnox.costs.fteCost) / results.projectionYears)}</td>
            <td>$${formatNumber(0)}</td>
            <td>$${formatNumber(portnox.costs.totalCost)}</td>
        `;
        tableBody.appendChild(portnoxRow);
        
        // Add savings row if applicable
        if (results.savings) {
            const savingsRow = document.createElement('tr');
            savingsRow.classList.add('savings-row');
            savingsRow.innerHTML = `
                <td><strong>Savings with Portnox</strong></td>
                <td>$${formatNumber((currentVendor.costs.hardwareCost + currentVendor.costs.implementationCost) - (portnox.costs.hardwareCost + portnox.costs.implementationCost))}</td>
                <td>$${formatNumber(((currentVendor.costs.licensingCost + currentVendor.costs.maintenanceCost + currentVendor.costs.fteCost) - (portnox.costs.licensingCost + portnox.costs.maintenanceCost + portnox.costs.fteCost)) / results.projectionYears)}</td>
                <td>$${formatNumber(0)}</td>
                <td><strong>$${formatNumber(results.savings.amount)}</strong> (${Math.round(results.savings.percentage)}%)</td>
            `;
            tableBody.appendChild(savingsRow);
        }
    }
    
    // Update annual costs table
    function updateAnnualCostsTable(results) {
        const tableBody = document.getElementById('annual-costs-table-body');
        if (!tableBody) return;
        
        const { currentVendor, portnox, projectionYears } = results;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Update vendor name in header
        const vendorHeader = document.getElementById('annual-comparison-vendor');
        if (vendorHeader) {
            vendorHeader.textContent = currentVendor.name;
        }
        
        // Row data
        const rows = [
            {
                category: 'Licensing',
                current: currentVendor.costs.licensingCost / projectionYears,
                portnox: portnox.costs.licensingCost / projectionYears
            },
            {
                category: 'Hardware (Amortized)',
                current: currentVendor.costs.hardwareCost / projectionYears,
                portnox: 0
            },
            {
                category: 'Maintenance',
                current: currentVendor.costs.maintenanceCost / projectionYears,
                portnox: 0
            },
            {
                category: 'Implementation (Amortized)',
                current: currentVendor.costs.implementationCost / projectionYears,
                portnox: portnox.costs.implementationCost / projectionYears
            },
            {
                category: 'IT Staff',
                current: currentVendor.costs.fteCost / projectionYears,
                portnox: portnox.costs.fteCost / projectionYears
            }
        ];
        
        // Add rows to table
        rows.forEach(row => {
            const tr = document.createElement('tr');
            const savings = row.current - row.portnox;
            const savingsClass = savings > 0 ? 'positive-savings' : savings < 0 ? 'negative-savings' : '';
            
            tr.innerHTML = `
                <td>${row.category}</td>
                <td>$${formatNumber(row.current)}</td>
                <td>$${formatNumber(row.portnox)}</td>
                <td class="${savingsClass}">$${formatNumber(savings)}</td>
            `;
            
            tableBody.appendChild(tr);
        });
        
        // Add total row
        const totalRow = document.createElement('tr');
        totalRow.classList.add('total-row');
        
        const totalCurrent = rows.reduce((sum, row) => sum + row.current, 0);
        const totalPortnox = rows.reduce((sum, row) => sum + row.portnox, 0);
        const totalSavings = totalCurrent - totalPortnox;
        const savingsClass = totalSavings > 0 ? 'positive-savings' : totalSavings < 0 ? 'negative-savings' : '';
        
        totalRow.innerHTML = `
            <td><strong>Total Annual Cost</strong></td>
            <td><strong>${formatNumber(totalCurrent)}</strong></td>
            <td><strong>${formatNumber(totalPortnox)}</strong></td>
            <td class="${savingsClass}"><strong>${formatNumber(totalSavings)}</strong></td>
        `;
        
        tableBody.appendChild(totalRow);
    }
    
    // Update implementation table
    function updateImplementationTable(results) {
        const tableBody = document.getElementById('implementation-table-body');
        if (!tableBody) return;
        
        const { currentVendor, portnox } = results;
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Update vendor name in header
        const vendorHeader = document.getElementById('implementation-comparison-vendor');
        if (vendorHeader) {
            vendorHeader.textContent = currentVendor.name;
        }
        
        // Implementation phases - simplified for UI
        const phases = [
            {
                name: 'Planning & Design',
                current: Math.round(currentVendor.costs.implementationTime * 0.25), // 25% of total time
                portnox: Math.round(portnox.costs.implementationTime * 0.20) // 20% of total time
            },
            {
                name: 'Infrastructure Setup',
                current: Math.round(currentVendor.costs.implementationTime * 0.20), // 20% of total time
                portnox: Math.round(portnox.costs.implementationTime * 0.15) // 15% of total time
            },
            {
                name: 'Installation & Configuration',
                current: Math.round(currentVendor.costs.implementationTime * 0.25), // 25% of total time
                portnox: Math.round(portnox.costs.implementationTime * 0.25) // 25% of total time
            },
            {
                name: 'Testing & Validation',
                current: Math.round(currentVendor.costs.implementationTime * 0.15), // 15% of total time
                portnox: Math.round(portnox.costs.implementationTime * 0.20) // 20% of total time
            },
            {
                name: 'Deployment',
                current: Math.round(currentVendor.costs.implementationTime * 0.15), // 15% of total time
                portnox: Math.round(portnox.costs.implementationTime * 0.20) // 20% of total time
            }
        ];
        
        // Add rows to table
        phases.forEach(phase => {
            const tr = document.createElement('tr');
            const savings = phase.current - phase.portnox;
            const savingsPct = phase.current > 0 ? (savings / phase.current * 100) : 0;
            
            tr.innerHTML = `
                <td>${phase.name}</td>
                <td>${phase.current}</td>
                <td>${phase.portnox}</td>
                <td>${savings} days (${Math.round(savingsPct)}%)</td>
            `;
            
            tableBody.appendChild(tr);
        });
        
        // Add total row
        const totalRow = document.createElement('tr');
        totalRow.classList.add('total-row');
        
        const totalCurrent = Math.round(currentVendor.costs.implementationTime);
        const totalPortnox = Math.round(portnox.costs.implementationTime);
        const totalSavings = totalCurrent - totalPortnox;
        const savingsPct = totalCurrent > 0 ? (totalSavings / totalCurrent * 100) : 0;
        
        totalRow.innerHTML = `
            <td><strong>Total Implementation Time</strong></td>
            <td><strong>${totalCurrent} days</strong></td>
            <td><strong>${totalPortnox} days</strong></td>
            <td><strong>${totalSavings} days (${Math.round(savingsPct)}%)</strong></td>
        `;
        
        tableBody.appendChild(totalRow);
    }
    
    // Format number with commas and no decimal places
    function formatNumber(num) {
        return Math.round(num).toLocaleString();
    }
    
    // Public API
    return {
        calculateTCO,
        updateState,
        getState,
        getDefaults: () => ({ ...defaults }),
        calculateComparison
    };
})();
