/**
 * NAC Architecture Designer Pro - Main Application
 * Fixed and enhanced implementation
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing NAC Architecture Designer Pro...');
  
  // Application state
  const state = {
    currentStep: 1,
    totalSteps: 5,
    selectedVendor: 'cisco', // Default vendor
    selectedIndustry: null,
    deviceCount: 1000,
    yearsToProject: 3,
    multipleLocations: false,
    locationCount: 1,
    legacyDevices: false,
    legacyPercentage: 30,
    darkMode: false
  };
  
  // Element cache
  const elements = {};
  
  // Initialize the application
  function init() {
    // Cache DOM elements
    cacheElements();
    
    // Set up event handlers
    setupEventHandlers();
    
    // Initialize vendor selection
    initializeVendorSelection();
    
    console.log('NAC Architecture Designer Pro initialized successfully');
  }
  
  // Cache DOM elements
  function cacheElements() {
    // Vendor selection
    elements.vendorCards = document.querySelectorAll('.vendor-card');
    elements.vendorInfo = document.getElementById('vendor-info');
    
    // Buttons
    elements.nextButton = document.getElementById('next-step');
    elements.prevButton = document.getElementById('prev-step');
    elements.viewResults = document.getElementById('view-results');
    
    // Tabs
    elements.tabButtons = document.querySelectorAll('.tab-button');
    elements.tabPanes = document.querySelectorAll('.tab-pane');
    
    // Results elements
    elements.resultsContainer = document.getElementById('results-container');
    
    // Charts
    elements.tcoComparisonChart = document.getElementById('tco-comparison-chart');
    elements.cumulativeCostChart = document.getElementById('cumulative-cost-chart');
    elements.currentBreakdownChart = document.getElementById('current-breakdown-chart');
    elements.alternativeBreakdownChart = document.getElementById('alternative-breakdown-chart');
    elements.featureComparisonChart = document.getElementById('feature-comparison-chart');
    elements.implementationComparisonChart = document.getElementById('implementation-comparison-chart');
    elements.roiChart = document.getElementById('roi-chart');
  }
  
  // Set up event handlers
  function setupEventHandlers() {
    // Vendor selection
    if (elements.vendorCards) {
      elements.vendorCards.forEach(card => {
        card.addEventListener('click', function() {
          const vendorId = this.dataset.vendor;
          selectVendor(vendorId);
        });
      });
    }
    
    // View results button
    if (elements.viewResults) {
      elements.viewResults.addEventListener('click', function() {
        showResults();
      });
    }
    
    // Tab buttons
    if (elements.tabButtons) {
      elements.tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          const tabId = this.dataset.tab;
          showTab(tabId);
        });
      });
    }
    
    // Window resize
    window.addEventListener('resize', function() {
      // Debounce resize handler
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(function() {
        handleResize();
      }, 200);
    });
  }
  
  // Initialize vendor selection
  function initializeVendorSelection() {
    // Select default vendor
    selectVendor(state.selectedVendor);
  }
  
  // Select vendor
  function selectVendor(vendorId) {
    // Update state
    state.selectedVendor = vendorId;
    
    // Update UI
    if (elements.vendorCards) {
      elements.vendorCards.forEach(card => {
        if (card.dataset.vendor === vendorId) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }
    
    // Show vendor info
    showVendorInfo(vendorId);
    
    // Update charts if already visible
    if (elements.resultsContainer && !elements.resultsContainer.classList.contains('hidden')) {
      updateChartsForVendor(vendorId);
    }
  }
  
  // Show vendor info
  function showVendorInfo(vendorId) {
    if (!elements.vendorInfo) return;
    
    // Get vendor info
    const vendorData = getVendorData(vendorId);
    
    // Set vendor info title and description
    const titleElement = elements.vendorInfo.querySelector('#vendor-info-title');
    const descriptionElement = elements.vendorInfo.querySelector('#vendor-info-description');
    
    if (titleElement) titleElement.textContent = vendorData.name;
    if (descriptionElement) descriptionElement.textContent = vendorData.description;
    
    // Show vendor info
    elements.vendorInfo.classList.remove('hidden');
  }
  
  // Show results
  function showResults() {
    if (!elements.resultsContainer) return;
    
    // Show results container
    elements.resultsContainer.classList.remove('hidden');
    
    // Update charts
    updateChartsForVendor(state.selectedVendor);
    
    // Show first tab
    showTab('comparison-tab');
    
    // Scroll to results
    elements.resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Show tab
  function showTab(tabId) {
    if (!elements.tabButtons || !elements.tabPanes) return;
    
    // Update tab buttons
    elements.tabButtons.forEach(button => {
      if (button.dataset.tab === tabId) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      }
    });
    
    // Update tab panes
    elements.tabPanes.forEach(pane => {
      if (pane.id === tabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }
  
  // Update charts for vendor
  function updateChartsForVendor(vendorId) {
    console.log(`Updating charts for vendor: ${vendorId}`);
    
    // Only update if ModernCharts is available
    if (!window.ModernCharts) {
      console.warn('ModernCharts not available');
      return;
    }
    
    try {
      // Get vendor data
      const vendorData = getVendorData(vendorId);
      
      // Update TCO comparison chart
      if (elements.tcoComparisonChart && window.ModernCharts.charts.tcoComparison) {
        window.ModernCharts.charts.tcoComparison(elements.tcoComparisonChart.id, {
          labels: [vendorData.name, 'Portnox Cloud'],
          values: [300000, 150000],
          currentVendor: vendorId
        });
      }
      
      // Update cumulative cost chart
      if (elements.cumulativeCostChart && window.ModernCharts.charts.cumulativeCost) {
        window.ModernCharts.charts.cumulativeCost(elements.cumulativeCostChart.id, {
          currentVendor: vendorId,
          currentVendorName: vendorData.name,
          currentValues: [100000, 200000, 300000, 400000],
          portnoxValues: [45000, 90000, 135000, 180000]
        });
      }
      
      // Update cost breakdown charts
      if (elements.currentBreakdownChart && window.ModernCharts.charts.costBreakdown) {
        window.ModernCharts.charts.costBreakdown(elements.currentBreakdownChart.id, {
          labels: ['Hardware', 'Software', 'Implementation', 'Licensing', 'Maintenance', 'Support', 'Personnel'],
          values: [50000, 75000, 45000, 35000, 15000, 20000, 85000],
          isPortnox: false
        });
      }
      
      if (elements.alternativeBreakdownChart && window.ModernCharts.charts.costBreakdown) {
        window.ModernCharts.charts.costBreakdown(elements.alternativeBreakdownChart.id, {
          labels: ['Implementation', 'Licensing', 'Support', 'Personnel'],
          values: [20000, 80000, 20000, 30000],
          isPortnox: true
        });
      }
      
      // Update feature comparison chart
      if (elements.featureComparisonChart && window.ModernCharts.charts.featureComparison) {
        window.ModernCharts.charts.featureComparison(elements.featureComparisonChart.id, {
          currentVendor: vendorId,
          currentVendorName: vendorData.name,
          currentValues: [70, 60, 50, 40, 80, 75, 55],
          portnoxValues: [90, 85, 95, 90, 85, 90, 95]
        });
      }
      
      // Update implementation comparison chart
      if (elements.implementationComparisonChart && window.ModernCharts.charts.implementationComparison) {
        window.ModernCharts.charts.implementationComparison(elements.implementationComparisonChart.id, {
          currentVendor: vendorId,
          currentVendorName: vendorData.name,
          currentValues: [15, 10, 25, 20, 20, 10],
          portnoxValues: [3, 1, 4, 5, 3, 2]
        });
      }
      
      // Update ROI chart
      if (elements.roiChart && window.ModernCharts.charts.roi) {
        window.ModernCharts.charts.roi(elements.roiChart.id, {
          currentVendor: vendorId,
          currentVendorName: vendorData.name,
          currentValues: [-170000, -120000, -70000, -20000, 30000, 80000],
          portnoxValues: [-45000, 10000, 65000, 120000, 175000, 230000]
        });
      }
      
      console.log('Charts updated successfully');
    } catch (error) {
      console.error('Error updating charts:', error);
    }
  }
  
  // Handle resize
  function handleResize() {
    // Update charts on resize
    if (state.selectedVendor && elements.resultsContainer && !elements.resultsContainer.classList.contains('hidden')) {
      console.log('Resizing charts');
      updateChartsForVendor(state.selectedVendor);
    }
  }
  
  // Get vendor data
  function getVendorData(vendorId) {
    const vendorData = {
      cisco: {
        name: 'Cisco ISE',
        description: 'Enterprise-grade on-premises NAC solution with extensive features for large organizations.',
        type: 'On-premises',
        deploymentTime: '90-120 days',
        implementationComplexity: 'High'
      },
      aruba: {
        name: 'Aruba ClearPass',
        description: 'Multi-vendor NAC solution with strong wireless capabilities and identity-based controls.',
        type: 'On-premises',
        deploymentTime: '60-90 days',
        implementationComplexity: 'Medium-High'
      },
      forescout: {
        name: 'Forescout',
        description: 'Agentless NAC solution focusing on device visibility and control across diverse environments.',
        type: 'On-premises',
        deploymentTime: '60-100 days',
        implementationComplexity: 'High'
      },
      fortinac: {
        name: 'FortiNAC',
        description: 'NAC solution integrated with Fortinet security fabric for comprehensive network protection.',
        type: 'On-premises',
        deploymentTime: '60-90 days',
        implementationComplexity: 'Medium-High'
      },
      nps: {
        name: 'Microsoft NPS',
        description: 'Basic RADIUS server included in Windows Server with limited NAC capabilities.',
        type: 'On-premises',
        deploymentTime: '30-60 days',
        implementationComplexity: 'Medium'
      },
      securew2: {
        name: 'SecureW2',
        description: 'Cloud-based certificate management solution with JoinNow onboarding capabilities.',
        type: 'Cloud/Hybrid',
        deploymentTime: '30-45 days',
        implementationComplexity: 'Medium'
      },
      noNac: {
        name: 'No NAC Solution',
        description: 'Operating without any network access control solution, relying on basic network security.',
        type: 'None',
        deploymentTime: 'N/A',
        implementationComplexity: 'N/A'
      }
    };
    
    return vendorData[vendorId] || {
      name: 'Unknown Vendor',
      description: 'No information available.',
      type: 'Unknown',
      deploymentTime: 'Unknown',
      implementationComplexity: 'Unknown'
    };
  }
  
  // Initialize the application
  init();
});
