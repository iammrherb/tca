/**
 * Total Cost Analyzer Class
 * Enhanced implementation with proper class declaration to avoid redeclaration issues
 */
// Check if Calculator class already exists to prevent redeclaration
if (typeof Calculator === 'undefined') {
  class Calculator {
    constructor() {
      this.results = null;
      this.resultsAvailable = false;
    }
    
    /**
     * Calculate TCO for all vendors
     */
    calculate() {
      try {
        // Show loading indicator
        if (window.loadingManager) {
          window.loadingManager.show('results-container', 'Calculating TCO...');
        }
        
        // Validate inputs
        if (!this.validateInputs()) {
          // Hide loading indicator
          if (window.loadingManager) {
            window.loadingManager.hide('results-container');
          }
          
          if (window.notificationManager) {
            window.notificationManager.error('Please check the input values and try again.');
          }
          
          return false;
        }
        
        // Get values from form
        const deviceCount = parseInt(document.getElementById('device-count').value) || 1000;
        const orgSize = document.getElementById('organization-size').value;
        const yearsToProject = parseInt(document.getElementById('years-to-project').value) || 3;
        const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
        
        // Calculate TCO for all vendors
        const results = {
          deviceCount,
          orgSize,
          yearsToProject,
          multipleLocations: document.getElementById('multiple-locations').checked,
          locationCount: parseInt(document.getElementById('location-count').value) || 1,
          complexAuthentication: document.getElementById('complex-authentication').checked,
          legacyDevices: document.getElementById('legacy-devices').checked,
          legacyPercentage: parseInt(document.getElementById('legacy-percentage').value) || 0,
          cloudIntegration: document.getElementById('cloud-integration').checked,
          customPolicies: document.getElementById('custom-policies').checked,
          policyComplexity: document.getElementById('policy-complexity').value
        };
        
        // Calculate vendor TCOs
        Object.keys(window.vendorData).forEach(vendor => {
          const vendorResult = this.calculateVendorTCO(vendor, currentVendor, orgSize, deviceCount, yearsToProject);
          vendorResult.vendorName = window.vendorData[vendor].name;
          results[vendor] = vendorResult;
        });
        
        // Calculate implementation times
        const implementationResults = {};
        Object.keys(window.vendorData).forEach(vendor => {
          const vendorData = window.vendorData[vendor];
          if (vendorData[orgSize] && vendorData[orgSize].implementationTimeline) {
            const timeline = vendorData[orgSize].implementationTimeline;
            implementationResults[vendor] = Object.values(timeline).reduce((a, b) => a + b, 0);
          }
        });
        results.implementationResults = implementationResults;
        
        // Store results
        this.results = results;
        this.resultsAvailable = true;
        
        // Hide loading indicator
        if (window.loadingManager) {
          window.loadingManager.hide('results-container');
        }
        
        // Update UI
        if (window.uiController) {
          window.uiController.updateResults(results);
        }
        
        // Update charts
        if (window.chartBuilder) {
          window.chartBuilder.updateTCOComparisonChart(results);
          window.chartBuilder.updateCumulativeCostChart(results);
          window.chartBuilder.updateBreakdownCharts(currentVendor, 'portnox');
          window.chartBuilder.updateFeatureComparisonChart(currentVendor);
          window.chartBuilder.updateImplementationComparisonChart(results);
          window.chartBuilder.updateROIChart(results);
        }
        
        // Update benefit cards
        this.updateBenefitCards(results);
        
        // Show success notification
        if (window.notificationManager) {
          window.notificationManager.success('TCO calculation completed successfully');
        }
        
        return true;
      } catch (error) {
        console.error('Error calculating TCO:', error);
        
        // Hide loading indicator
        if (window.loadingManager) {
          window.loadingManager.hide('results-container');
        }
        
        // Show error notification
        if (window.notificationManager) {
          window.notificationManager.error('Error calculating TCO: ' + error.message);
        } else {
          alert('Error calculating TCO: ' + error.message);
        }
        
        return false;
      }
    }
    
    /**
     * Validate form inputs
     */
    validateInputs() {
      // Check if validation manager is available
      if (window.validationManager) {
        return window.validationManager.validateAll();
      }
      
      // Simple validation if validation manager is not available
      let isValid = true;
      
      const deviceCount = document.getElementById('device-count');
      if (!deviceCount || isNaN(deviceCount.value) || deviceCount.value <= 0) {
        console.error('Invalid device count');
        isValid = false;
      }
      
      const yearsToProject = document.getElementById('years-to-project');
      if (!yearsToProject || isNaN(yearsToProject.value) || yearsToProject.value <= 0 || yearsToProject.value > 10) {
        console.error('Invalid years to project');
        isValid = false;
      }
      
      // Check location count if multiple locations is selected
      const multipleLocations = document.getElementById('multiple-locations');
      const locationCount = document.getElementById('location-count');
      if (multipleLocations && multipleLocations.checked && locationCount) {
        if (isNaN(locationCount.value) || locationCount.value < 2) {
          console.error('Invalid location count');
          isValid = false;
        }
      }
      
      return isValid;
    }
    
    /**
     * Calculate TCO for a specific vendor
     */
    calculateVendorTCO(vendor, currentVendor, orgSize, deviceCount, yearsToProject) {
      try {
        if (!window.vendorData[vendor] || !window.vendorData[vendor][orgSize]) {
          console.error(`Invalid vendor or organization size: ${vendor}, ${orgSize}`);
          return {
            totalTCO: 0,
            totalInitialCosts: 0,
            annualCosts: 0,
            migrationCost: 0,
            totalSavings: 0,
            savingsPercentage: 0,
            annualSavings: 0,
            costBreakdown: {
              hardware: 0,
              networkRedesign: 0,
              implementation: 0,
              training: 0,
              maintenance: 0,
              licensing: 0,
              personnel: 0,
              downtime: 0
            }
          };
        }
        
        const vendorInfo = window.vendorData[vendor][orgSize];
        const complexityMultiplier = window.calculateComplexityMultiplier(vendor, window.vendorData[vendor].cloudBased);
        
        // Get cost multipliers from custom settings if available
        const customHardwareMultiplier = parseFloat(document.getElementById('custom-hardware-cost')?.value) || 1.0;
        const customLicensingMultiplier = parseFloat(document.getElementById('custom-licensing-cost')?.value) || 1.0;
        const customMaintenanceMultiplier = parseFloat(document.getElementById('custom-maintenance-cost')?.value) || 1.0;
        const customImplementationMultiplier = parseFloat(document.getElementById('custom-implementation-cost')?.value) || 1.0;
        const customTrainingMultiplier = parseFloat(document.getElementById('training-cost-multiplier')?.value) || 1.0;
        
        // Get custom FTE costs if available
        const customNetworkAdminSalary = parseFloat(document.getElementById('network-admin-salary')?.value) || 120000;
        const customSecurityAdminSalary = parseFloat(document.getElementById('security-admin-salary')?.value) || 135000;
        const customSystemAdminSalary = parseFloat(document.getElementById('system-admin-salary')?.value) || 110000;
        const customHelpdeskSalary = parseFloat(document.getElementById('helpdesk-salary')?.value) || 75000;
        
        // Get custom downtime cost if available
        const customDowntimeCost = parseFloat(document.getElementById('downtime-cost')?.value) || 5000;
        
        // Calculate initial costs with custom multipliers
        const initialHardware = vendorInfo.initialHardware * customHardwareMultiplier;
        const networkRedesign = vendorInfo.networkRedesign;
        const implementation = vendorInfo.implementation * customImplementationMultiplier;
        const training = vendorInfo.training * customTrainingMultiplier;
        
        const totalInitialCosts = (initialHardware + networkRedesign + implementation + training) * complexityMultiplier;
        
        // Calculate annual costs with custom multipliers
        const annualMaintenance = vendorInfo.annualMaintenance * customMaintenanceMultiplier;
        const annualLicensing = vendorInfo.annualLicensing * customLicensingMultiplier;
        
        // Use custom FTE costs for calculation
        const fteCosts = {
          networkAdmin: customNetworkAdminSalary,
          securityAdmin: customSecurityAdminSalary,
          systemAdmin: customSystemAdminSalary,
          helpDesk: customHelpdeskSalary
        };
        
        let fteCost = 0;
        for (const [role, amount] of Object.entries(vendorInfo.fteAllocation)) {
          fteCost += fteCosts[role] * amount;
        }
        
        const downtimeCost = vendorInfo.annualDowntime * customDowntimeCost;
        
        const annualCosts = (annualMaintenance + annualLicensing + fteCost + downtimeCost) * complexityMultiplier;
        
        // Calculate TCO
        const totalTCO = totalInitialCosts + (annualCosts * yearsToProject);
        
        // Calculate migration cost (if different from current vendor)
        let migrationCost = 0;
        if (vendor !== currentVendor) {
          const migrationFactor = this.getMigrationFactor(currentVendor, vendor);
          migrationCost = implementation * complexityMultiplier * migrationFactor;
        }
        
        // Calculate savings vs current solution
        let totalSavings = 0;
        let savingsPercentage = 0;
        let annualSavings = 0;
        
        if (vendor !== currentVendor) {
          const currentVendorInfo = window.vendorData[currentVendor][orgSize];
          const currentComplexity = window.calculateComplexityMultiplier(currentVendor, window.vendorData[currentVendor].cloudBased);
          
          // Apply the same custom multipliers to current vendor for fair comparison
          const currentInitialHardware = currentVendorInfo.initialHardware * customHardwareMultiplier;
          const currentNetworkRedesign = currentVendorInfo.networkRedesign;
          const currentImplementation = currentVendorInfo.implementation * customImplementationMultiplier;
          const currentTraining = currentVendorInfo.training * customTrainingMultiplier;
          
          const currentInitial = (currentInitialHardware + currentNetworkRedesign + 
                                currentImplementation + currentTraining) * currentComplexity;
          
          const currentAnnualMaintenance = currentVendorInfo.annualMaintenance * customMaintenanceMultiplier;
          const currentAnnualLicensing = currentVendorInfo.annualLicensing * customLicensingMultiplier;
          
          // Calculate current FTE cost with custom salaries
          let currentFteCost = 0;
          for (const [role, amount] of Object.entries(currentVendorInfo.fteAllocation)) {
            currentFteCost += fteCosts[role] * amount;
          }
          
          const currentDowntimeCost = currentVendorInfo.annualDowntime * customDowntimeCost;
          
          const currentAnnual = (currentAnnualMaintenance + currentAnnualLicensing + 
                                currentFteCost + currentDowntimeCost) * currentComplexity;
          
          const currentTCO = currentInitial + (currentAnnual * yearsToProject);
          
          totalSavings = currentTCO - totalTCO - migrationCost;
          savingsPercentage = currentTCO > 0 ? (totalSavings / currentTCO) * 100 : 0;
          annualSavings = currentAnnual - annualCosts;
        }
        
        // Create cost breakdown
        const costBreakdown = {
          hardware: initialHardware * complexityMultiplier,
          networkRedesign: networkRedesign * complexityMultiplier,
          implementation: implementation * complexityMultiplier,
          training: training * complexityMultiplier,
          maintenance: annualMaintenance * yearsToProject * complexityMultiplier,
          licensing: annualLicensing * yearsToProject * complexityMultiplier,
          personnel: fteCost * yearsToProject * complexityMultiplier,
          downtime: downtimeCost * yearsToProject * complexityMultiplier
        };
        
        return {
          totalTCO,
          totalInitialCosts,
          annualCosts,
          migrationCost,
          totalSavings,
          savingsPercentage,
          annualSavings,
          costBreakdown,
          hardwareCost: initialHardware * complexityMultiplier,
          networkRedesignCost: networkRedesign * complexityMultiplier,
          implementationCost: implementation * complexityMultiplier,
          trainingCost: training * complexityMultiplier,
          migrationCost,
          maintenanceCost: annualMaintenance * complexityMultiplier,
          licensingCost: annualLicensing * complexityMultiplier,
          fteCost: fteCost * complexityMultiplier,
          annualDowntimeCost: downtimeCost * complexityMultiplier,
          totalCosts: totalTCO + migrationCost,
          // Add benefit indicators for on-prem vs cloud comparison
          cloudBenefits: {
            hardwareElimination: window.vendorData[vendor].cloudBased ? 100 : 0,
            maintenanceReduction: window.vendorData[vendor].cloudBased ? 75 : 0,
            deploymentSpeed: window.vendorData[vendor].cloudBased ? 4 : 1,
            scalabilityScore: window.vendorData[vendor].cloudBased ? 5 : 2,
            updatesScore: window.vendorData[vendor].cloudBased ? 5 : 2,
            remoteAccessScore: window.vendorData[vendor].cloudBased ? 5 : 3
          }
        };
      } catch (error) {
        console.error(`Error calculating TCO for vendor ${vendor}:`, error);
        return {
          totalTCO: 0,
          totalInitialCosts: 0,
          annualCosts: 0,
          migrationCost: 0,
          totalSavings: 0,
          savingsPercentage: 0,
          annualSavings: 0,
          costBreakdown: {
            hardware: 0,
            networkRedesign: 0,
            implementation: 0,
            training: 0,
            maintenance: 0,
            licensing: 0,
            personnel: 0,
            downtime: 0
          }
        };
      }
    }
    
    /**
     * Get migration factor between vendors
     */
    getMigrationFactor(fromVendor, toVendor) {
      if (!fromVendor || !toVendor) return 0.5;
      
      if (window.migrationFactors && 
          window.migrationFactors[fromVendor] && 
          window.migrationFactors[fromVendor][toVendor]) {
        return window.migrationFactors[fromVendor][toVendor];
      }
      
      return 0.5; // Default factor
    }
    
    /**
     * Update benefit cards in UI
     */
    updateBenefitCards(results) {
      if (!window.portnoxBenefits || !results) return;
      
      const benefitsGrid = document.querySelector('.benefits-grid');
      if (!benefitsGrid) return;
      
      benefitsGrid.innerHTML = '';
      
      window.portnoxBenefits.forEach(benefit => {
        const card = document.createElement('div');
        card.className = 'benefit-card';
        
        const icon = document.createElement('div');
        icon.className = 'benefit-icon';
        icon.innerHTML = `<i class="fas fa-${benefit.icon}"></i>`;
        
        const content = document.createElement('div');
        content.className = 'benefit-content';
        
        const title = document.createElement('h5');
        title.textContent = benefit.title;
        
        const description = document.createElement('p');
        description.textContent = benefit.description;
        
        const metric = document.createElement('div');
        metric.className = 'benefit-metric';
        metric.textContent = benefit.metric;
        
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(metric);
        
        card.appendChild(icon);
        card.appendChild(content);
        
        benefitsGrid.appendChild(card);
      });
    }
  }
  
  // Assign the Calculator class to the window
  window.Calculator = Calculator;
}
