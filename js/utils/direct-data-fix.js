/**
 * Direct Data Fix for Total Cost Analyzer
 * Creates direct calculation functions that don't rely on the existing code
 */
(function() {
  console.log('Installing Direct Data Fix...');
  
  // Define vendor data directly in the fix
  window.vendorData = {
    cisco: {
      name: "Cisco ISE",
      initialCosts: {
        hardware: 50000,
        software: 75000,
        implementation: 45000
      },
      annualCosts: {
        licensing: 35000,
        maintenance: 15000,
        support: 20000,
        personnel: 85000
      },
      // Legacy property names for backward compatibility
      initialHardware: 50000,
      initialSoftware: 75000,
      initialImplementation: 45000,
      annualLicensing: 35000,
      annualMaintenance: 15000,
      annualSupport: 20000,
      annualPersonnel: 85000
    },
    aruba: {
      name: "Aruba ClearPass",
      initialCosts: {
        hardware: 45000,
        software: 65000,
        implementation: 40000
      },
      annualCosts: {
        licensing: 30000,
        maintenance: 12000,
        support: 18000,
        personnel: 80000
      },
      initialHardware: 45000,
      initialSoftware: 65000,
      initialImplementation: 40000,
      annualLicensing: 30000,
      annualMaintenance: 12000,
      annualSupport: 18000,
      annualPersonnel: 80000
    },
    forescout: {
      name: "Forescout",
      initialCosts: {
        hardware: 55000,
        software: 70000,
        implementation: 50000
      },
      annualCosts: {
        licensing: 38000,
        maintenance: 16000,
        support: 22000,
        personnel: 90000
      },
      initialHardware: 55000,
      initialSoftware: 70000,
      initialImplementation: 50000,
      annualLicensing: 38000,
      annualMaintenance: 16000,
      annualSupport: 22000,
      annualPersonnel: 90000
    },
    nps: {
      name: "Microsoft NPS",
      initialCosts: {
        hardware: 25000,
        software: 10000,
        implementation: 35000
      },
      annualCosts: {
        licensing: 5000,
        maintenance: 8000,
        support: 12000,
        personnel: 95000
      },
      initialHardware: 25000,
      initialSoftware: 10000,
      initialImplementation: 35000,
      annualLicensing: 5000,
      annualMaintenance: 8000,
      annualSupport: 12000,
      annualPersonnel: 95000
    },
    fortinac: {
      name: "FortiNAC",
      initialCosts: {
        hardware: 40000,
        software: 60000,
        implementation: 38000
      },
      annualCosts: {
        licensing: 28000,
        maintenance: 14000,
        support: 18000,
        personnel: 82000
      },
      initialHardware: 40000,
      initialSoftware: 60000,
      initialImplementation: 38000,
      annualLicensing: 28000,
      annualMaintenance: 14000,
      annualSupport: 18000,
      annualPersonnel: 82000
    },
    securew2: {
      name: "SecureW2",
      initialCosts: {
        hardware: 15000,
        software: 50000,
        implementation: 30000
      },
      annualCosts: {
        licensing: 25000,
        maintenance: 10000,
        support: 15000,
        personnel: 75000
      },
      initialHardware: 15000,
      initialSoftware: 50000,
      initialImplementation: 30000,
      annualLicensing: 25000,
      annualMaintenance: 10000,
      annualSupport: 15000,
      annualPersonnel: 75000
    },
    portnox: {
      name: "Portnox Cloud",
      initialCosts: {
        hardware: 0,
        software: 30000,
        implementation: 15000
      },
      annualCosts: {
        licensing: 45000,
        maintenance: 0,
        support: 10000,
        personnel: 40000
      },
      initialHardware: 0,
      initialSoftware: 30000,
      initialImplementation: 15000,
      annualLicensing: 45000,
      annualMaintenance: 0,
      annualSupport: 10000,
      annualPersonnel: 40000
    }
  };
  
  // Register a direct calculate function
  window.directCalculate = function(vendor, params) {
    params = params || {};
    
    // Get vendor data
    const data = window.vendorData[vendor];
    if (!data) return { total: 0 };
    
    // Get wizard values if available
    const wizardValues = window.costWizardValues || {};
    
    // Calculate initial costs
    const initialHardware = data.initialCosts.hardware * (wizardValues.hardwareMultiplier || 1.0);
    const initialSoftware = data.initialCosts.software * (wizardValues.softwareMultiplier || 1.0);
    const initialImplementation = data.initialCosts.implementation * (wizardValues.implementationMultiplier || 1.0);
    
    const totalInitial = initialHardware + initialSoftware + initialImplementation;
    
    // Calculate annual costs
    const annualLicensing = data.annualCosts.licensing * (wizardValues.licensingMultiplier || 1.0);
    const annualMaintenance = data.annualCosts.maintenance * (wizardValues.maintenanceMultiplier || 1.0);
    const annualSupport = data.annualCosts.support * (wizardValues.supportMultiplier || 1.0);
    const annualPersonnel = data.annualCosts.personnel * (wizardValues.personnelMultiplier || 1.0);
    
    const totalAnnual = annualLicensing + annualMaintenance + annualSupport + annualPersonnel;
    
    // Calculate total for specified number of years
    const years = params.years || 1;
    const total = totalInitial + (totalAnnual * years);
    
    // Return complete result
    return {
      vendor: vendor,
      name: data.name,
      initialCosts: {
        hardware: initialHardware,
        software: initialSoftware,
        implementation: initialImplementation,
        total: totalInitial
      },
      annualCosts: {
        licensing: annualLicensing,
        maintenance: annualMaintenance,
        support: annualSupport,
        personnel: annualPersonnel,
        total: totalAnnual
      },
      totalInitial: totalInitial,
      totalAnnual: totalAnnual,
      total: total
    };
  };
  
  // Replace or patch the Calculate button functionality
  function patchCalculateButton() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', function() {
      // Show the results container
      const resultsContainer = document.getElementById('results-container');
      if (resultsContainer) {
        resultsContainer.classList.remove('hidden');
        resultsContainer.style.display = 'block';
      }
      
      // Get selected vendor
      const activeVendorCard = document.querySelector('.vendor-card.active');
      let selectedVendor = 'cisco'; // Default
      
      if (activeVendorCard) {
        selectedVendor = activeVendorCard.getAttribute('data-vendor');
      }
      
      // Get input values
      const deviceCount = parseInt(document.getElementById('device-count').value) || 300;
      const yearsToProject = parseInt(document.getElementById('years-to-project').value) || 1;
      
      // Calculate for all vendors
      const results = {};
      Object.keys(window.vendorData).forEach(function(vendor) {
        results[vendor] = window.directCalculate(vendor, {
          deviceCount: deviceCount,
          years: yearsToProject
        });
      });
      
      // Calculate comparison
      const current = results[selectedVendor];
      const portnox = results.portnox;
      
      // Calculate savings
      const savingsAmount = current.total - portnox.total;
      const savingsPercentage = current.total > 0 ? 
                              (savingsAmount / current.total) * 100 : 0;
      
      // Update UI with calculated values
      updateUI({
        results: results,
        current: current,
        portnox: portnox,
        savings: {
          amount: savingsAmount,
          percentage: savingsPercentage
        }
      });
      
      console.log('Calculation completed with direct data');
    });
  }
  
  // Function to update UI with calculated values
  function updateUI(calculationResult) {
    // Update the comparison tab
    updateComparisonTab(calculationResult);
    
    // Update the details tab
    updateDetailsTab(calculationResult);
    
    // Update Portnox spotlight
    updatePortnoxSpotlight(calculationResult);
  }
  
  // Update comparison tab
  function updateComparisonTab(result) {
    // Update key metrics
    document.getElementById('comparison-savings').textContent = formatCurrency(result.savings.amount);
    document.getElementById('comparison-implementation').textContent = '60%';
    
    // Update progress bars
    const savingsProgressBar = document.querySelector('#comparison-savings + .progress-bar .progress');
    if (savingsProgressBar) {
      savingsProgressBar.style.width = Math.min(result.savings.percentage, 100) + '%';
    }
    
    const implementationProgressBar = document.querySelector('#comparison-implementation + .progress-bar .progress');
    if (implementationProgressBar) {
      implementationProgressBar.style.width = '60%';
    }
    
    // Update progress labels
    const savingsLabel = document.querySelector('#comparison-savings + .progress-bar + .progress-labels span:last-child');
    if (savingsLabel) {
      savingsLabel.textContent = Math.round(result.savings.percentage) + '% Savings';
    }
    
    // Update TCO summary table
    const tableBody = document.getElementById('tco-summary-table-body');
    if (tableBody) {
      tableBody.innerHTML = '';
      
      // Add rows for each vendor
      Object.values(result.results).forEach(function(vendorResult) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${vendorResult.name}</td>
          <td>${formatCurrency(vendorResult.totalInitial)}</td>
          <td>${formatCurrency(vendorResult.totalAnnual)}</td>
          <td>${formatCurrency(vendorResult.totalInitial * 0.2)}</td>
          <td>${formatCurrency(vendorResult.total)}</td>
        `;
        
        // Highlight current vendor and Portnox
        if (vendorResult.vendor === result.current.vendor) {
          row.classList.add('current-vendor');
        } else if (vendorResult.vendor === 'portnox') {
          row.classList.add('portnox-vendor');
        }
        
        tableBody.appendChild(row);
      });
    }
  }
  
  // Update details tab
  function updateDetailsTab(result) {
    // Update annual costs table
    const annualCostsTable = document.getElementById('annual-costs-table-body');
    if (annualCostsTable) {
      annualCostsTable.innerHTML = '';
      
      // Add rows for different cost categories
      const categories = [
        { name: 'Licensing', current: result.current.annualCosts.licensing, portnox: result.portnox.annualCosts.licensing },
        { name: 'Maintenance', current: result.current.annualCosts.maintenance, portnox: result.portnox.annualCosts.maintenance },
        { name: 'Support', current: result.current.annualCosts.support, portnox: result.portnox.annualCosts.support },
        { name: 'Personnel', current: result.current.annualCosts.personnel, portnox: result.portnox.annualCosts.personnel }
      ];
      
      categories.forEach(function(category) {
        const savings = category.current - category.portnox;
        const savingsPercentage = category.current > 0 ? 
                                (savings / category.current) * 100 : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${category.name}</td>
          <td>${formatCurrency(category.current)}</td>
          <td>${formatCurrency(category.portnox)}</td>
          <td class="${savings > 0 ? 'positive-savings' : 'negative-savings'}">${formatCurrency(savings)} (${Math.round(savingsPercentage)}%)</td>
        `;
        
        annualCostsTable.appendChild(row);
      });
      
      // Add total row
      const totalRow = document.createElement('tr');
      totalRow.className = 'total-row';
      
      const totalSavings = result.current.annualCosts.total - result.portnox.annualCosts.total;
      const totalSavingsPercentage = result.current.annualCosts.total > 0 ? 
                                    (totalSavings / result.current.annualCosts.total) * 100 : 0;
      
      totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td><strong>${formatCurrency(result.current.annualCosts.total)}</strong></td>
        <td><strong>${formatCurrency(result.portnox.annualCosts.total)}</strong></td>
        <td class="${totalSavings > 0 ? 'positive-savings' : 'negative-savings'}"><strong>${formatCurrency(totalSavings)} (${Math.round(totalSavingsPercentage)}%)</strong></td>
      `;
      
      annualCostsTable.appendChild(totalRow);
    }
  }
  
  // Update Portnox spotlight
  function updatePortnoxSpotlight(result) {
    // Update savings amount
    document.getElementById('portnox-savings-amount').textContent = formatCurrency(result.savings.amount);
    
    // Update savings percentage
    document.getElementById('portnox-savings-percentage').textContent = Math.round(result.savings.percentage) + '%';
    
    // Update implementation time
    document.getElementById('portnox-implementation-time').textContent = '60%';
  }
  
  // Helper function to format currency
  function formatCurrency(amount) {
    return '$' + amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  
  // Initialize once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      patchCalculateButton();
    });
  } else {
    patchCalculateButton();
  }
  
  console.log('Direct Data Fix installed successfully!');
})();
