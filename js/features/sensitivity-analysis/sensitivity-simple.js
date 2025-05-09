/**
 * Simplified sensitivity analysis
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing simplified sensitivity analysis...');
  
  // Only run on sensitivity page
  if (window.location.href.indexOf('sensitivity.html') === -1) {
    return;
  }
  
  // Initialize charts
  initCharts();
  
  // Add event listeners
  const sensitivityBtn = document.getElementById('sensitivity-btn');
  if (sensitivityBtn) {
    sensitivityBtn.addEventListener('click', runAnalysis);
  }
  
  const variableSelect = document.getElementById('param-variable');
  if (variableSelect) {
    variableSelect.addEventListener('change', function() {
      updateRangeDefaults(variableSelect.value);
    });
    
    // Set initial defaults
    updateRangeDefaults(variableSelect.value);
  }
  
  // Return to calculator button
  const returnBtn = document.getElementById('return-to-calculator');
  if (returnBtn) {
    returnBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  /**
   * Initialize charts
   */
  function initCharts() {
    // Initialize sensitivity chart
    const sensChart = document.getElementById('sensitivity-chart');
    if (sensChart) {
      try {
        // Create simple placeholder chart
        window.sensitivityChart = new Chart(sensChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['Run analysis to see data'],
            datasets: [{
              label: 'No data available',
              data: [0],
              backgroundColor: '#05547C',
              borderColor: '#05547C'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (e) {
        console.error('Error initializing sensitivity chart:', e);
      }
    }
    
    // Initialize savings chart
    const savingsChart = document.getElementById('savings-impact-chart');
    if (savingsChart) {
      try {
        // Create simple placeholder chart
        window.savingsChart = new Chart(savingsChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['Run analysis to see data'],
            datasets: [{
              label: 'No data available',
              data: [0],
              backgroundColor: '#65BD44',
              borderColor: '#65BD44'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (e) {
        console.error('Error initializing savings chart:', e);
      }
    }
  }
  
  /**
   * Update range defaults based on selected variable
   */
  function updateRangeDefaults(variable) {
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    const description = document.getElementById('parameter-description');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    switch (variable) {
      case 'deviceCount':
        minInput.value = '500';
        maxInput.value = '2000';
        stepsInput.value = '10';
        if (description) {
          description.textContent = 'Analyze how changes in the total number of devices affect TCO and relative savings.';
        }
        break;
      case 'legacyPercentage':
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '11';
        if (description) {
          description.textContent = 'Evaluate the impact of legacy device percentages on overall costs.';
        }
        break;
      case 'locationCount':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        if (description) {
          description.textContent = 'Assess how distributed deployments across multiple locations affect total costs.';
        }
        break;
      case 'yearsToProject':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        if (description) {
          description.textContent = 'Compare short-term vs. long-term TCO projections.';
        }
        break;
      default:
        minInput.value = '0.5';
        maxInput.value = '2.0';
        stepsInput.value = '7';
        if (description) {
          description.textContent = 'Analyze how changes in this parameter affect the total cost of ownership.';
        }
    }
  }
  
  /**
   * Run sensitivity analysis
   */
  function runAnalysis() {
    // Show loading
    showLoading();
    
    // Get parameters
    const variable = document.getElementById('param-variable').value;
    const vendor = document.getElementById('param-vendor').value;
    const min = parseFloat(document.getElementById('param-min').value);
    const max = parseFloat(document.getElementById('param-max').value);
    const steps = parseInt(document.getElementById('param-steps').value);
    
    // Generate dummy data for demonstration
    const data = generateDummyData(variable, vendor, min, max, steps);
    
    // Slight delay to show loading animation
    setTimeout(function() {
      // Update charts
      updateCharts(data);
      
      // Update table
      updateTable(data);
      
      // Hide loading
      hideLoading();
      
      // Show success message
      showMessage('Analysis completed successfully', 'success');
    }, 1500);
  }
  
  /**
   * Generate dummy data for demonstration
   */
  function generateDummyData(variable, vendor, min, max, steps) {
    const vendors = vendor === 'all' ? 
      ['cisco', 'aruba', 'forescout', 'nps', 'fortinac', 'securew2', 'portnox'] : 
      [vendor, 'portnox'];
    
    const uniqueVendors = [...new Set(vendors)];
    const labels = [];
    const dataPoints = {};
    const savingsPoints = {};
    const stepSize = (max - min) / (steps - 1);
    
    // Set up data structures
    uniqueVendors.forEach(v => {
      dataPoints[v] = [];
      
      if (v !== 'portnox') {
        savingsPoints[v] = [];
      }
    });
    
    // Generate data
    for (let i = 0; i < steps; i++) {
      const x = min + (stepSize * i);
      labels.push(formatValue(variable, x));
      
      uniqueVendors.forEach(v => {
        // Base value affected by variable
        let multiplier = 1;
        if (variable === 'deviceCount') {
          multiplier = x / 1000;
        } else if (variable === 'legacyPercentage') {
          multiplier = 1 + (x / 100);
        } else if (variable === 'locationCount') {
          multiplier = 1 + (x / 10);
        } else if (variable === 'yearsToProject') {
          multiplier = x / 3;
        } else {
          multiplier = x;
        }
        
        // Different base costs for different vendors
        let baseCost = 0;
        if (v === 'cisco') baseCost = 1000000;
        else if (v === 'aruba') baseCost = 950000;
        else if (v === 'forescout') baseCost = 900000;
        else if (v === 'nps') baseCost = 400000;
        else if (v === 'fortinac') baseCost = 850000;
        else if (v === 'securew2') baseCost = 600000;
        else if (v === 'portnox') baseCost = 400000;
        
        // Calculate value
        const value = baseCost * multiplier;
        dataPoints[v].push(value);
        
        // Calculate savings
        if (v !== 'portnox' && uniqueVendors.includes('portnox')) {
          const portnoxValue = baseCost * 0.4 * multiplier;
          const savings = ((value - portnoxValue) / value) * 100;
          savingsPoints[v].push(savings);
        }
      });
    }
    
    return {
      variable,
      vendor,
      labels,
      dataPoints,
      savingsPoints
    };
  }
  
  /**
   * Update charts with new data
   */
  function updateCharts(data) {
    // Update sensitivity chart
    if (window.sensitivityChart) {
      // Create datasets
      const datasets = [];
      Object.keys(data.dataPoints).forEach(vendor => {
        datasets.push({
          label: getVendorName(vendor),
          data: data.dataPoints[vendor],
          backgroundColor: getVendorColor(vendor),
          borderColor: getVendorColor(vendor),
          borderWidth: 2,
          fill: false
        });
      });
      
      // Update chart
      window.sensitivityChart.data.labels = data.labels;
      window.sensitivityChart.data.datasets = datasets;
      window.sensitivityChart.options.scales.y.title = {
        display: true,
        text: 'Total Cost of Ownership ($)'
      };
      window.sensitivityChart.options.plugins.title = {
        display: true,
        text: `TCO Sensitivity to ${getVariableLabel(data.variable)}`
      };
      window.sensitivityChart.update();
    }
    
    // Update savings chart
    if (window.savingsChart && data.savingsPoints && Object.keys(data.savingsPoints).length > 0) {
      // Create datasets
      const datasets = [];
      Object.keys(data.savingsPoints).forEach(vendor => {
        datasets.push({
          label: `Savings vs. ${getVendorName(vendor)}`,
          data: data.savingsPoints[vendor],
          backgroundColor: getVendorColor(vendor),
          borderColor: getVendorColor(vendor),
          borderWidth: 2,
          fill: false
        });
      });
      
      // Update chart
      window.savingsChart.data.labels = data.labels;
      window.savingsChart.data.datasets = datasets;
      window.savingsChart.options.scales.y.title = {
        display: true,
        text: 'Savings Percentage (%)'
      };
      window.savingsChart.options.plugins.title = {
        display: true,
        text: `Portnox Savings Impact by ${getVariableLabel(data.variable)}`
      };
      window.savingsChart.update();
    }
  }
  
  /**
   * Update data table
   */
  function updateTable(data) {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) return;
    
    // Clear existing table
    tableHeader.innerHTML = `<th scope="col">${getVariableLabel(data.variable)}</th>`;
    tableBody.innerHTML = '';
    
    // Add vendor columns to header
    const vendors = Object.keys(data.dataPoints);
    vendors.forEach(vendor => {
      tableHeader.innerHTML += `<th scope="col">${getVendorName(vendor)}</th>`;
      
      // Add savings column
      if (vendor !== 'portnox' && vendors.includes('portnox')) {
        tableHeader.innerHTML += `<th scope="col">Savings vs. ${getVendorName(vendor)}</th>`;
      }
    });
    
    // Add rows
    for (let i = 0; i < data.labels.length; i++) {
      const row = document.createElement('tr');
      
      // Add value column
      row.innerHTML = `<td>${data.labels[i]}</td>`;
      
      // Add vendor columns
      vendors.forEach(vendor => {
        const value = data.dataPoints[vendor][i];
        row.innerHTML += `<td>$${Math.round(value).toLocaleString()}</td>`;
        
        // Add savings column
        if (vendor !== 'portnox' && vendors.includes('portnox')) {
          const savings = data.savingsPoints[vendor][i];
          row.innerHTML += `<td>${savings.toFixed(1)}%</td>`;
        }
      });
      
      tableBody.appendChild(row);
    }
  }
  
  /**
   * Show loading indicator
   */
  function showLoading() {
    const container = document.querySelector('.results-container');
    if (!container) return;
    
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">Running sensitivity analysis...</div>
    `;
    
    container.appendChild(overlay);
  }
  
  /**
   * Hide loading indicator
   */
  function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.parentNode.removeChild(overlay);
    }
  }
  
  /**
   * Show message
   */
  function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="${type}-message-box">
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
        <button class="close-message"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    // Add close button event
    const closeBtn = container.querySelector('.close-message');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        container.innerHTML = '';
      });
    }
    
    // Auto-clear after 5 seconds
    setTimeout(function() {
      if (container.querySelector(`.${type}-message-box`)) {
        container.innerHTML = '';
      }
    }, 5000);
  }
  
  /**
   * Format value based on variable type
   */
  function formatValue(variable, value) {
    switch (variable) {
      case 'deviceCount':
        return Math.round(value) + ' devices';
      case 'legacyPercentage':
        return value + '%';
      case 'locationCount':
        return Math.round(value) + ' locations';
      case 'yearsToProject':
        return Math.round(value) + ' years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return value.toFixed(1) + 'x';
      case 'downtimeCost':
        return '$' + Math.round(value) + '/hour';
      default:
        return value.toString();
    }
  }
  
  /**
   * Get variable label
   */
  function getVariableLabel(variable) {
    switch (variable) {
      case 'deviceCount': return 'Device Count';
      case 'legacyPercentage': return 'Legacy Device Percentage';
      case 'locationCount': return 'Number of Locations';
      case 'yearsToProject': return 'Years to Project';
      case 'hardwareCost': return 'Hardware Cost Multiplier';
      case 'licensingCost': return 'Licensing Cost Multiplier';
      case 'maintenanceCost': return 'Maintenance Cost Multiplier';
      case 'fteCost': return 'Personnel Cost Multiplier';
      case 'implementationCost': return 'Implementation Cost Multiplier';
      case 'downtimeCost': return 'Downtime Cost';
      default: return variable;
    }
  }
  
  /**
   * Get vendor name
   */
  function getVendorName(vendor) {
    const vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      nps: 'Microsoft NPS',
      fortinac: 'FortiNAC',
      securew2: 'SecureW2',
      portnox: 'Portnox Cloud'
    };
    
    return vendorNames[vendor] || vendor;
  }
  
  /**
   * Get vendor color
   */
  function getVendorColor(vendor) {
    const vendorColors = {
      cisco: '#049fd9',
      aruba: '#ff8300',
      forescout: '#005daa',
      nps: '#00a4ef',
      fortinac: '#ee3124',
      securew2: '#8bc53f',
      portnox: '#65BD44',
      neutral: '#888888'
    };
    
    return vendorColors[vendor] || vendorColors.neutral;
  }
});
