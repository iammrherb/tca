/**
 * Wizard Restoration Script
 * Run this in the browser console to restore wizard functionality
 */
(function() {
  console.log('Running Wizard Restoration Script...');
  
  // Fix vendor card selection
  function fixVendorCards() {
    const vendorCards = document.querySelectorAll('.vendor-card');
    if (!vendorCards.length) {
      console.warn('No vendor cards found');
      return;
    }
    
    vendorCards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove active class from all cards
        vendorCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        this.classList.add('active');
        
        // Get vendor data
        const vendor = this.getAttribute('data-vendor');
        if (vendor && window.uiController) {
          window.uiController.activeVendor = vendor;
        }
        
        // Update vendor info if available
        if (window.vendorData && vendor && window.vendorData[vendor]) {
          const infoBox = document.getElementById('vendor-info');
          const infoTitle = document.getElementById('vendor-info-title');
          const infoDesc = document.getElementById('vendor-info-description');
          
          if (infoBox && infoTitle && infoDesc) {
            infoBox.classList.remove('hidden');
            infoTitle.textContent = window.vendorData[vendor].name;
            infoDesc.textContent = window.vendorData[vendor].description || '';
          }
        }
      });
    });
    
    console.log('Vendor cards fixed');
  }
  
  // Fix tab navigation
  function fixTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (!tabButtons.length || !tabPanes.length) {
      console.warn('Tab elements not found');
      return;
    }
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        if (!tabId) return;
        
        // Deactivate all tabs
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
          btn.setAttribute('tabindex', '-1');
        });
        
        // Hide all panes
        tabPanes.forEach(pane => {
          pane.classList.remove('active');
        });
        
        // Activate clicked tab
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        this.setAttribute('tabindex', '0');
        
        // Show corresponding pane
        const pane = document.getElementById(tabId);
        if (pane) {
          pane.classList.add('active');
        }
      });
    });
    
    console.log('Tab navigation fixed');
  }
  
  // Fix sub-tab navigation
  function fixSubTabNavigation() {
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');
    
    if (!subTabButtons.length || !subTabPanes.length) {
      console.warn('Sub-tab elements not found');
      return;
    }
    
    subTabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const subTabId = this.getAttribute('data-subtab');
        if (!subTabId) return;
        
        // Deactivate all sub-tabs
        subTabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
          btn.setAttribute('tabindex', '-1');
        });
        
        // Hide all sub-panes
        subTabPanes.forEach(pane => {
          pane.classList.remove('active');
        });
        
        // Activate clicked sub-tab
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        this.setAttribute('tabindex', '0');
        
        // Show corresponding sub-pane
        const pane = document.getElementById(subTabId);
        if (pane) {
          pane.classList.add('active');
        }
      });
    });
    
    console.log('Sub-tab navigation fixed');
  }
  
  // Fix wizard navigation
  function fixWizardNavigation() {
    const nextButtons = document.querySelectorAll('#next-step');
    const prevButtons = document.querySelectorAll('#prev-step');
    const viewResultsButton = document.querySelector('#view-results');
    
    // Get all wizard steps
    const wizardSteps = document.querySelectorAll('.wizard-step-content');
    
    if (!wizardSteps.length) {
      console.warn('Wizard steps not found');
      return;
    }
    
    let currentStep = 0;
    
    // Next button functionality
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Hide current step
        wizardSteps[currentStep].classList.remove('active');
        
        // Move to next step
        currentStep = Math.min(currentStep + 1, wizardSteps.length - 1);
        
        // Show new step
        wizardSteps[currentStep].classList.add('active');
      });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Hide current step
        wizardSteps[currentStep].classList.remove('active');
        
        // Move to previous step
        currentStep = Math.max(currentStep - 1, 0);
        
        // Show new step
        wizardSteps[currentStep].classList.add('active');
      });
    });
    
    // View results functionality
    if (viewResultsButton) {
      viewResultsButton.addEventListener('click', function() {
        const wizardContent = document.querySelector('.wizard-content');
        const resultsContainer = document.getElementById('results-container');
        
        if (wizardContent && resultsContainer) {
          wizardContent.classList.add('hidden');
          resultsContainer.classList.remove('hidden');
          
          // Initialize charts if needed
          if (window.chartBuilder && typeof window.chartBuilder.initCharts === 'function') {
            window.chartBuilder.initCharts();
          }
        }
      });
    }
    
    console.log('Wizard navigation fixed');
  }
  
  // Initialize chart functionality
  function initializeCharts() {
    // Try to initialize charts
    if (window.chartBuilder && typeof window.chartBuilder.initCharts === 'function') {
      window.chartBuilder.initCharts();
      console.log('Charts initialized');
    } else {
      console.warn('Chart builder not available');
    }
  }
  
  // Run all fixes
  function runAllFixes() {
    fixVendorCards();
    fixTabNavigation();
    fixSubTabNavigation();
    fixWizardNavigation();
    initializeCharts();
    console.log('All wizard and chart functionality restored');
  }
  
  // Run fixes when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllFixes);
  } else {
    runAllFixes();
  }
})();
