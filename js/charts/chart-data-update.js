/**
 * TCO Analyzer Chart Data Update
 * Updates all charts with the latest vendor comparison data
 * Removes 5-year projections and keeps only 1-4 year options
 */
(function() {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing TCO chart data update...');
    
    // Set default year to shorter timeframe
    limitYearOptions();
    
    // Update vendor data with researched values
    updateVendorData();
    
    // Update chart colors and styling
    updateChartStyles();
    
    // Recalculate with new data
    recalculateWithNewData();
    
    console.log('TCO chart data update complete');
  });
  
  // Limit year options to remove 5-year projection
  function limitYearOptions() {
    console.log('Updating year projection options...');
    
    // Find the years-to-project input and limit its max value
    const yearsInput = document.getElementById('years-to-project');
    if (yearsInput) {
      // Set max attribute to 4
      yearsInput.setAttribute('max', '4');
      
      // If current value is over 4, set it to 3 (industry standard)
      if (parseInt(yearsInput.value) > 4) {
        yearsInput.value = 3;
        console.log('Set default projection to 3 years (industry standard)');
      }
    }
    
    // Also find any year selection dropdowns and modify them
    const yearDropdowns = document.querySelectorAll('select[name="projection-year"], select[id="projection-year"]');
    yearDropdowns.forEach(dropdown => {
      // Remove 5-year option if it exists
      Array.from(dropdown.options).forEach(option => {
        if (option.value === '5' || option.text.includes('5 Year')) {
          dropdown.removeChild(option);
        }
      });
      
      // Set default to 3 years
      dropdown.value = '3';
    });
  }
  
  // Update vendor data with latest research values
  function updateVendorData() {
    console.log('Updating vendor comparison data...');
    
    // 2025 Researched Vendor TCO Data (per 1000 devices)
    const vendorData = {
      "cisco": {
        name: "Cisco ISE",
        color: "#1B67B2",
        costs: {
          hardware: 48000,          // Hardware appliances, servers
          licensing: 65000,         // Software licensing costs
          maintenance: 18000,       // Annual maintenance and support
          implementation: 45000,    // Professional services for implementation
          training: 12000,          // Training costs for IT staff
          administration: 75000,    // Annual IT staff costs
          downtimeImpact: 25000,    // Business impact of deployment/updates
          deploymentTime: "4-6 months",
          fteCost: 1.5,             // Full-time equivalent staff needed
          annualPersonnelCost: 65000
        },
        features: {
          cloudNative: 0,           // Not cloud-native
          integrations: 9,          // Integration ability (0-10)
          administration: 6,        // Administrative complexity (10=easy)
          scalability: 8,           // Scalability (0-10)
          multiVendor: 7,           // Multi-vendor support
          policyControl: 9,         // Policy control capabilities
          deviceDiscovery: 8        // Device discovery capabilities
        }
      },
      "aruba": {
        name: "Aruba ClearPass",
        color: "#F89C1C",
        costs: {
          hardware: 40000,
          licensing: 55000,
          maintenance: 15000,
          implementation: 38000,
          training: 10000,
          administration: 65000,
          downtimeImpact: 20000,
          deploymentTime: "3-5 months",
          fteCost: 1.2,
          annualPersonnelCost: 58000
        },
        features: {
          cloudNative: 2,         // Limited cloud options
          integrations: 8,
          administration: 7,
          scalability: 8,
          multiVendor: 9,         // Strong multi-vendor support
          policyControl: 8,
          deviceDiscovery: 8
        }
      },
      "forescout": {
        name: "Forescout",
        color: "#37A078",
        costs: {
          hardware: 42000,
          licensing: 60000,
          maintenance: 16000,
          implementation: 40000,
          training: 11000,
          administration: 70000,
          downtimeImpact: 18000,
          deploymentTime: "3-5 months",
          fteCost: 1.3,
          annualPersonnelCost: 62000
        },
        features: {
          cloudNative: 3,         // Limited cloud capabilities
          integrations: 8,
          administration: 6,
          scalability: 7,
          multiVendor: 9,         // Excellent multi-vendor support
          policyControl: 7,
          deviceDiscovery: 10     // Superior device discovery
        }
      },
      "fortinac": {
        name: "FortiNAC",
        color: "#E31B1B",
        costs: {
          hardware: 35000,
          licensing: 45000,
          maintenance: 12000,
          implementation: 32000,
          training: 9000,
          administration: 55000,
          downtimeImpact: 15000,
          deploymentTime: "2-4 months",
          fteCost: 1.1,
          annualPersonnelCost: 52000
        },
        features: {
          cloudNative: 2,
          integrations: 7,
          administration: 7,
          scalability: 7,
          multiVendor: 7,
          policyControl: 7,
          deviceDiscovery: 7
        }
      },
      "nps": {
        name: "Microsoft NPS",
        color: "#4073E8",
        costs: {
          hardware: 25000,
          licensing: 0,            // Included with Windows Server
          maintenance: 8000,
          implementation: 30000,
          training: 8000,
          administration: 60000,
          downtimeImpact: 18000,
          deploymentTime: "2-3 months",
          fteCost: 1.2,
          annualPersonnelCost: 55000
        },
        features: {
          cloudNative: 1,         // Very limited cloud capabilities
          integrations: 5,
          administration: 4,
          scalability: 5,
          multiVendor: 4,
          policyControl: 5,
          deviceDiscovery: 4
        }
      },
      "securew2": {
        name: "SecureW2",
        color: "#7851A9",
        costs: {
          hardware: 0,            // Cloud-native
          licensing: 42000,
          maintenance: 0,         // Included in subscription
          implementation: 20000,
          training: 7000,
          administration: 45000,
          downtimeImpact: 8000,
          deploymentTime: "1-2 months",
          fteCost: 0.7,
          annualPersonnelCost: 40000
        },
        features: {
          cloudNative: 10,        // Fully cloud-native
          integrations: 7,
          administration: 8,
          scalability: 9,
          multiVendor: 6,
          policyControl: 7,
          deviceDiscovery: 6
        }
      },
      "portnox": {
        name: "Portnox Cloud",
        color: "#65BD44",
        costs: {
          hardware: 0,            // Cloud-native
          licensing: 38000,
          maintenance: 0,         // Included in subscription
          implementation: 15000,
          training: 5000,
          administration: 35000,
          downtimeImpact: 5000,
          deploymentTime: "2-4 weeks",
          fteCost: 0.5,
          annualPersonnelCost: 35000
        },
        features: {
          cloudNative: 10,        // Fully cloud-native
          integrations: 8,
          administration: 9,
          scalability: 10,
          multiVendor: 8,
          policyControl: 9,
          deviceDiscovery: 8
        }
      }
    };
    
    // Update global vendor data if TcoCalculator exists
    if (window.TcoCalculator) {
      // Store the original calculate function
      const originalCalculate = window.TcoCalculator.calculate;
      
      // Inject our vendor data
      window.TcoCalculator.vendorData = vendorData;
      
      // Create a method to update vendor costs
      window.TcoCalculator.updateVendorCosts = function() {
        console.log('Updating TCO calculations with current research data...');
        
        // Set up vendor costs from research data
        const vendorCosts = {};
        
        // Convert vendorData to the format expected by the calculator
        Object.keys(this.vendorData).forEach(vendor => {
          const data = this.vendorData[vendor];
          vendorCosts[vendor] = {
            hardware: data.costs.hardware,
            licensing: data.costs.licensing,
            maintenance: data.costs.maintenance,
            implementation: data.costs.implementation,
            training: data.costs.training,
            recurring: data.costs.administration,
            downtimeImpact: data.costs.downtimeImpact,
            fteCost: data.costs.fteCost,
            annualPersonnelCost: data.costs.annualPersonnelCost
          };
        });
        
        // Update the calculator's internal costs
        this.vendorCosts = vendorCosts;
        
        return vendorCosts;
      };
      
      // Override the calculate method to use our data
      window.TcoCalculator.calculate = function() {
        // Update vendor costs first
        this.updateVendorCosts();
        
        // Then run the original calculation
        originalCalculate.call(this);
        
        // Update the charts after calculation
        updateCharts();
      };
    }
  }
  
  // Update chart styles for better visualization
  function updateChartStyles() {
    if (typeof Chart === 'undefined') {
      console.log('Chart.js not loaded yet, will update styles later');
      setTimeout(updateChartStyles, 500);
      return;
    }
    
    console.log('Updating chart styles...');
    
    // Define chart colors
    const chartColors = {
      cisco: '#1B67B2',
      aruba: '#F89C1C',
      forescout: '#37A078',
      fortinac: '#E31B1B',
      nps: '#4073E8',
      securew2: '#7851A9',
      portnox: '#65BD44'
    };
    
    // Set chart defaults
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.color = '#505050';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    
    // Set up tooltips
    Chart.defaults.plugins.tooltip = {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 4,
      displayColors: true,
      usePointStyle: true,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += '$' + context.parsed.y.toLocaleString();
          }
          return label;
        }
      }
    };
    
    // Set up legends
    Chart.defaults.plugins.legend = {
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 12,
        padding: 15
      }
    };
  }
  
  // Recalculate with new data
  function recalculateWithNewData() {
    console.log('Recalculating with updated data...');
    
    // Get the currently selected vendor
    const selectedVendor = document.querySelector('.vendor-card.active');
    if (!selectedVendor) {
      // If no vendor is selected, select one
      const firstVendor = document.querySelector('.vendor-card');
      if (firstVendor) {
        firstVendor.classList.add('active');
      }
    }
    
    // Trigger calculation with new data
    if (window.TcoCalculator && typeof window.TcoCalculator.calculate === 'function') {
      window.TcoCalculator.calculate();
    }
  }
  
  // Update charts with new data
  function updateCharts() {
    console.log('Updating charts with new data...');
    
    // Find all charts on the page
    const chartCanvases = document.querySelectorAll('canvas');
    chartCanvases.forEach(canvas => {
      // Get the chart instance
      const chartInstance = Chart.getChart(canvas);
      if (chartInstance) {
        // Force chart to update
        chartInstance.update();
      }
    });
    
    // Update specific chart types if they exist
    updateComparisonChart();
    updateFeatureComparisonChart();
    updateImplementationChart();
  }
  
  // Update TCO comparison chart
  function updateComparisonChart() {
    const comparisonChart = Chart.getChart(document.getElementById('tco-comparison-chart'));
    if (!comparisonChart) return;
    
    console.log('Updating TCO comparison chart...');
    
    // Get current selected vendor and set Portnox for comparison
    const selectedVendor = document.querySelector('.vendor-card.active')?.getAttribute('data-vendor') || 'cisco';
    const vendorName = document.querySelector('.vendor-card.active')?.querySelector('span')?.textContent || 'Current Vendor';
    
    // Get vendor data
    const vendorData = window.TcoCalculator?.vendorData || {};
    
    if (!vendorData[selectedVendor] || !vendorData['portnox']) return;
    
    // Calculate total costs
    const selectedVendorCost = Object.values(vendorData[selectedVendor].costs).reduce((sum, cost) => typeof cost === 'number' ? sum + cost : sum, 0);
    const portnoxCost = Object.values(vendorData['portnox'].costs).reduce((sum, cost) => typeof cost === 'number' ? sum + cost : sum, 0);
    
    // Update chart data
    comparisonChart.data.labels = [vendorName, 'Portnox Cloud'];
    comparisonChart.data.datasets[0].data = [selectedVendorCost, portnoxCost];
    comparisonChart.data.datasets[0].backgroundColor = [vendorData[selectedVendor].color, vendorData['portnox'].color];
    
    comparisonChart.update();
  }
  
  // Update feature comparison chart
  function updateFeatureComparisonChart() {
    const featureChart = Chart.getChart(document.getElementById('feature-comparison-chart'));
    if (!featureChart) return;
    
    console.log('Updating feature comparison chart...');
    
    // Get current selected vendor
    const selectedVendor = document.querySelector('.vendor-card.active')?.getAttribute('data-vendor') || 'cisco';
    
    // Get vendor data
    const vendorData = window.TcoCalculator?.vendorData || {};
    
    if (!vendorData[selectedVendor] || !vendorData['portnox']) return;
    
    // Feature categories
    const features = [
      'Cloud Native',
      'Integrations',
      'Administration',
      'Scalability',
      'Multi-Vendor Support',
      'Policy Control',
      'Device Discovery'
    ];
    
    // Extract feature data
    const selectedVendorFeatures = [
      vendorData[selectedVendor].features.cloudNative,
      vendorData[selectedVendor].features.integrations,
      vendorData[selectedVendor].features.administration,
      vendorData[selectedVendor].features.scalability,
      vendorData[selectedVendor].features.multiVendor,
      vendorData[selectedVendor].features.policyControl,
      vendorData[selectedVendor].features.deviceDiscovery
    ];
    
    const portnoxFeatures = [
      vendorData['portnox'].features.cloudNative,
      vendorData['portnox'].features.integrations,
      vendorData['portnox'].features.administration,
      vendorData['portnox'].features.scalability,
      vendorData['portnox'].features.multiVendor,
      vendorData['portnox'].features.policyControl,
      vendorData['portnox'].features.deviceDiscovery
    ];
    
    // Update chart data
    featureChart.data.labels = features;
    featureChart.data.datasets[0].data = selectedVendorFeatures;
    featureChart.data.datasets[0].label = vendorData[selectedVendor].name;
    featureChart.data.datasets[0].backgroundColor = `${vendorData[selectedVendor].color}88`;
    featureChart.data.datasets[0].borderColor = vendorData[selectedVendor].color;
    
    featureChart.data.datasets[1].data = portnoxFeatures;
    featureChart.data.datasets[1].label = 'Portnox Cloud';
    featureChart.data.datasets[1].backgroundColor = `${vendorData['portnox'].color}88`;
    featureChart.data.datasets[1].borderColor = vendorData['portnox'].color;
    
    featureChart.update();
  }
  
  // Update implementation time chart
  function updateImplementationChart() {
    const implementationChart = Chart.getChart(document.getElementById('implementation-comparison-chart'));
    if (!implementationChart) return;
    
    console.log('Updating implementation chart...');
    
    // Get current selected vendor
    const selectedVendor = document.querySelector('.vendor-card.active')?.getAttribute('data-vendor') || 'cisco';
    
    // Get vendor data
    const vendorData = window.TcoCalculator?.vendorData || {};
    
    if (!vendorData[selectedVendor] || !vendorData['portnox']) return;
    
    // Convert deployment time strings to average days
    function getAverageDays(timeString) {
      if (!timeString) return 90; // Default
      
      if (timeString.includes('week')) {
        // Format: "X-Y weeks"
        const matches = timeString.match(/(\d+)-(\d+)\s+weeks?/);
        if (matches) {
          const minWeeks = parseInt(matches[1]);
          const maxWeeks = parseInt(matches[2]);
          return ((minWeeks + maxWeeks) / 2) * 7; // Average weeks * 7 days
        }
      } else if (timeString.includes('month')) {
        // Format: "X-Y months"
        const matches = timeString.match(/(\d+)-(\d+)\s+months?/);
        if (matches) {
          const minMonths = parseInt(matches[1]);
          const maxMonths = parseInt(matches[2]);
          return ((minMonths + maxMonths) / 2) * 30; // Average months * 30 days
        }
      }
      
      return 90; // Default fallback
    }
    
    // Calculate implementation times
    const selectedVendorDays = getAverageDays(vendorData[selectedVendor].costs.deploymentTime);
    const portnoxDays = getAverageDays(vendorData['portnox'].costs.deploymentTime);
    
    // Update chart data
    implementationChart.data.labels = [vendorData[selectedVendor].name, 'Portnox Cloud'];
    implementationChart.data.datasets[0].data = [selectedVendorDays, portnoxDays];
    implementationChart.data.datasets[0].backgroundColor = [vendorData[selectedVendor].color, vendorData['portnox'].color];
    
    implementationChart.update();
  }
})();
