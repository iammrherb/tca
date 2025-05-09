/**
 * Force Initialization
 * Forces initialization of all components
 */
(function() {
  console.log('Installing Force Initialization System');
  
  // Define initialization function
  function forceInitialization() {
    console.log('Forcing initialization of all components');
    
    // Show loading indicator
    showLoading();
    
    // Step 1: Fix Chart.js issues
    fixChartJsIssues()
      .then(() => {
        // Step 2: Initialize charts
        return initializeCharts();
      })
      .then(() => {
        // Step 3: Set up event handlers
        return setupEventHandlers();
      })
      .then(() => {
        // Step 4: Initialize UI
        return initializeUI();
      })
      .then(() => {
        // Step 5: Hide loading indicator
        hideLoading();
        
        console.log('Forced initialization complete');
      })
      .catch(error => {
        console.error('Error during forced initialization:', error);
        hideLoading();
      });
  }
  
  // Function to show loading indicator
  function showLoading() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.id = 'loading-overlay';
      loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;
      
      const loadingContent = document.createElement('div');
      loadingContent.style.cssText = `
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        text-align: center;
      `;
      
      const spinner = document.createElement('div');
      spinner.style.cssText = `
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
        margin: 0 auto 10px;
      `;
      
      const loadingText = document.createElement('div');
      loadingText.textContent = 'Re-initializing Application...';
      loadingText.style.cssText = `
        font-weight: bold;
      `;
      
      // Add spinner animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      
      loadingContent.appendChild(spinner);
      loadingContent.appendChild(loadingText);
      loadingOverlay.appendChild(loadingContent);
      document.body.appendChild(loadingOverlay);
    } else {
      document.getElementById('loading-overlay').style.display = 'flex';
    }
  }
  
  // Function to hide loading indicator
  function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  }
  
  // Function to fix Chart.js issues
  function fixChartJsIssues() {
    return new Promise((resolve) => {
      console.log('Fixing Chart.js issues');
      
      try {
        // Destroy all Chart.js instances
        if (window.Chart) {
          // Find all canvases
          const canvases = document.querySelectorAll('canvas');
          console.log(`Found ${canvases.length} canvases`);
          
          // Try to destroy charts on each canvas
          canvases.forEach(canvas => {
            try {
              // Different approaches for different Chart.js versions
              if (typeof Chart.getChart === 'function') {
                // Chart.js v3.x+
                const chart = Chart.getChart(canvas);
                if (chart) {
                  chart.destroy();
                  console.log(`Destroyed Chart.js v3.x+ chart on canvas ${canvas.id}`);
                }
              } else if (canvas.__chartjs__) {
                // Chart.js v2.x
                if (canvas.__chartjs__.chart) {
                  canvas.__chartjs__.chart.destroy();
                  console.log(`Destroyed Chart.js v2.x chart on canvas ${canvas.id}`);
                }
              }
              
              // Reset canvas
              const ctx = canvas.getContext('2d');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              console.log(`Reset canvas ${canvas.id}`);
            } catch (error) {
              console.warn(`Error destroying chart on canvas ${canvas.id}:`, error);
            }
          });
        }
        
        // Fix Chart.instances
        if (window.Chart && !window.Chart.instances) {
          window.Chart.instances = {};
          console.log('Created Chart.instances for compatibility');
        }
        
        // Fix Chart.instances.forEach
        if (window.Chart && window.Chart.instances && !Array.isArray(window.Chart.instances)) {
          const originalInstances = window.Chart.instances;
          
          // Add forEach method
          window.Chart.instances.forEach = function(callback) {
            Object.values(originalInstances).forEach(callback);
          };
          
          console.log('Added forEach method to Chart.instances');
        }
        
        console.log('Chart.js issues fixed');
      } catch (error) {
        console.error('Error fixing Chart.js issues:', error);
      }
      
      // Resolve after a short delay to ensure all changes are applied
      setTimeout(resolve, 500);
    });
  }
  
  // Function to initialize charts
  function initializeCharts() {
    return new Promise((resolve) => {
      console.log('Initializing charts');
      
      try {
        // Try different initialization approaches
        
        // Approach 1: SimpleCharts
        if (window.SimpleCharts) {
          const vendorId = getSelectedVendor();
          
          // Initialize TCO comparison chart
          if (document.getElementById('tco-comparison-chart')) {
            window.SimpleCharts.createTCOComparisonChart('tco-comparison-chart', {
              vendorId: vendorId
            });
          }
          
          // Initialize cumulative cost chart
          if (document.getElementById('cumulative-cost-chart')) {
            window.SimpleCharts.createCumulativeCostChart('cumulative-cost-chart', {
              vendorId: vendorId,
              currentVendorName: getVendorName(vendorId)
            });
          }
          
          // Initialize cost breakdown charts
          if (document.getElementById('current-breakdown-chart')) {
            window.SimpleCharts.createCostBreakdownChart('current-breakdown-chart', {});
          }
          
          if (document.getElementById('alternative-breakdown-chart')) {
            window.SimpleCharts.createCostBreakdownChart('alternative-breakdown-chart', {
              labels: ['Implementation', 'Licensing', 'Support', 'Personnel'],
              values: [20000, 80000, 20000, 30000]
            });
          }
          
          // Initialize feature comparison chart
          if (document.getElementById('feature-comparison-chart')) {
            window.SimpleCharts.createFeatureComparisonChart('feature-comparison-chart', {
              vendorId: vendorId,
              currentVendorName: getVendorName(vendorId)
            });
          }
          
          // Initialize implementation comparison chart
          if (document.getElementById('implementation-comparison-chart')) {
            window.SimpleCharts.createImplementationComparisonChart('implementation-comparison-chart', {
              vendorId: vendorId,
              currentVendorName: getVendorName(vendorId)
            });
          }
          
          // Initialize ROI chart
          if (document.getElementById('roi-chart')) {
            window.SimpleCharts.createROIChart('roi-chart', {
              vendorId: vendorId,
              currentVendorName: getVendorName(vendorId)
            });
          }
          
          console.log('Initialized charts using SimpleCharts');
        }
        
        // Approach 2: initializeCharts function
        else if (typeof window.initializeCharts === 'function') {
          window.initializeCharts();
          console.log('Called window.initializeCharts()');
        }
        
        // Approach 3: ChartBuilder
        else if (window.ChartBuilder && typeof window.ChartBuilder.initCharts === 'function') {
          window.ChartBuilder.initCharts();
          console.log('Called ChartBuilder.initCharts()');
        }
        
        console.log('Chart initialization complete');
      } catch (error) {
        console.error('Error initializing charts:', error);
      }
      
      // Resolve after a short delay to ensure all charts are initialized
      setTimeout(resolve, 500);
    });
  }
  
  // Function to set up event handlers
  function setupEventHandlers() {
    return new Promise((resolve) => {
      console.log('Setting up event handlers');
      
      try {
        // Set up vendor card click handlers
        const vendorCards = document.querySelectorAll('.vendor-card');
        vendorCards.forEach(card => {
          card.addEventListener('click', function() {
            // Remove active class from all cards
            vendorCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Update charts
            updateChartsForVendor(this.dataset.vendor);
          });
        });
        
        // Set up tab click handlers
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
          button.addEventListener('click', function() {
            // Get tab ID
            const tabId = this.dataset.tab;
            if (!tabId) return;
            
            // Remove active class from all tab buttons
            tabButtons.forEach(b => {
              b.classList.remove('active');
              b.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Hide all tab panes
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Show selected tab pane
            const selectedPane = document.getElementById(tabId);
            if (selectedPane) selectedPane.classList.add('active');
          });
        });
        
        // Set up view results button
        const viewResultsButton = document.getElementById('view-results');
        if (viewResultsButton) {
          viewResultsButton.addEventListener('click', function() {
            // Show results container
            const resultsContainer = document.getElementById('results-container');
            if (resultsContainer) {
              resultsContainer.classList.remove('hidden');
              resultsContainer.scrollIntoView({ behavior: 'smooth' });
              
              // Update charts
              updateChartsForVendor(getSelectedVendor());
            }
          });
        }
        
        console.log('Event handlers set up');
      } catch (error) {
        console.error('Error setting up event handlers:', error);
      }
      
      resolve();
    });
  }
  
  // Function to initialize UI
  function initializeUI() {
    return new Promise((resolve) => {
      console.log('Initializing UI');
      
      try {
        // Set default vendor if none selected
        const vendorCards = document.querySelectorAll('.vendor-card');
        let hasActiveVendor = false;
        
        vendorCards.forEach(card => {
          if (card.classList.contains('active')) {
            hasActiveVendor = true;
          }
        });
        
        if (!hasActiveVendor && vendorCards.length > 0) {
          vendorCards[0].classList.add('active');
          console.log(`Set default vendor: ${vendorCards[0].dataset.vendor}`);
        }
        
        console.log('UI initialization complete');
      } catch (error) {
        console.error('Error initializing UI:', error);
      }
      
      resolve();
    });
  }
  
  // Helper: Get selected vendor
  function getSelectedVendor() {
    const activeCard = document.querySelector('.vendor-card.active');
    return activeCard ? activeCard.dataset.vendor : 'cisco';
  }
  
  // Helper: Get vendor name
  function getVendorName(vendorId) {
    const vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      fortinac: 'FortiNAC',
      nps: 'Microsoft NPS',
      securew2: 'SecureW2',
      noNac: 'No NAC Solution'
    };
    
    return vendorNames[vendorId] || 'Current Solution';
  }
  
  // Helper: Update charts for vendor
  function updateChartsForVendor(vendorId) {
    console.log(`Updating charts for vendor: ${vendorId}`);
    
    try {
      // Update charts using SimpleCharts
      if (window.SimpleCharts) {
        // Update TCO comparison chart
        if (document.getElementById('tco-comparison-chart')) {
          window.SimpleCharts.createTCOComparisonChart('tco-comparison-chart', {
            vendorId: vendorId
          });
        }
        
        // Update cumulative cost chart
        if (document.getElementById('cumulative-cost-chart')) {
          window.SimpleCharts.createCumulativeCostChart('cumulative-cost-chart', {
            vendorId: vendorId,
            currentVendorName: getVendorName(vendorId)
          });
        }
        
        // Update feature comparison chart
        if (document.getElementById('feature-comparison-chart')) {
          window.SimpleCharts.createFeatureComparisonChart('feature-comparison-chart', {
            vendorId: vendorId,
            currentVendorName: getVendorName(vendorId)
          });
        }
        
        // Update implementation comparison chart
        if (document.getElementById('implementation-comparison-chart')) {
          window.SimpleCharts.createImplementationComparisonChart('implementation-comparison-chart', {
            vendorId: vendorId,
            currentVendorName: getVendorName(vendorId)
          });
        }
        
        // Update ROI chart
        if (document.getElementById('roi-chart')) {
          window.SimpleCharts.createROIChart('roi-chart', {
            vendorId: vendorId,
            currentVendorName: getVendorName(vendorId)
          });
        }
      }
    } catch (error) {
      console.error('Error updating charts for vendor:', error);
    }
  }
  
  // Add initialization button
  function addInitButton() {
    // Create button
    const initButton = document.createElement('button');
    initButton.id = 'force-init-button';
    initButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 15px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    `;
    initButton.textContent = 'Fix Application';
    
    // Add click event
    initButton.addEventListener('click', forceInitialization);
    
    // Add to DOM
    document.body.appendChild(initButton);
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', addInitButton);
  } else {
    addInitButton();
  }
  
  // Expose force initialization function
  window.forceInitialization = forceInitialization;
  
  console.log('Force Initialization System installed');
})();
