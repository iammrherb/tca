/**
 * Basic UI Controller for NAC Calculator
 * This is a simplified implementation that replaces the problematic enhanced-ui-controller.js
 */
class BasicUIController {
  constructor() {
    console.log("BasicUIController initializing...");
    
    // DOM cache for frequently accessed elements
    this.domCache = {
      calculator: document.getElementById('calculator-form'),
      deviceCount: document.getElementById('device-count'),
      organizationSize: document.getElementById('organization-size'),
      yearsToProject: document.getElementById('years-to-project'),
      currentVendor: null, // Will be set when a vendor is selected
      resultsContainer: document.getElementById('results-container'),
      loadingOverlay: document.getElementById('loading-overlay'),
      messageContainer: document.getElementById('message-container')
    };
    
    // State management
    this.state = {
      currentVendor: null,
      organizationSize: 'medium',
      deviceCount: 300,
      yearsToProject: 1,
      industry: null,
      hasAdvancedOptions: false,
      advancedOptions: {
        multipleLocations: false,
        locationCount: 2,
        complexAuthentication: false,
        legacyDevices: false,
        legacyPercentage: 10,
        cloudIntegration: false,
        customPolicies: false,
        policyComplexity: 'medium'
      },
      calculationResults: null,
      activeTab: 'comparison-tab',
      isCalculating: false
    };
    
    // Initialize UI
    this.initializeUI();
    
    console.log("BasicUIController initialized");
  }
  
  /**
   * Initialize UI elements and event listeners
   */
  initializeUI() {
    console.log("Initializing UI elements...");
    
    // Initialize vendor selection
    this._initializeVendorSelection();
    
    // Initialize calculator form
    this._initializeCalculatorForm();
    
    // Initialize tabs
    this._initializeTabs();
    
    // Initialize export options
    this._initializeExportOptions();
    
    // Initialize advanced options
    this._initializeAdvancedOptions();
    
    // Initialize industry selector if available
    this._initializeIndustrySelector();
    
    // Initial input validation
    this._validateInputs();
  }
  
  /**
   * Initialize vendor selection
   */
  _initializeVendorSelection() {
    // Get all vendor cards
    const vendorCards = document.querySelectorAll('.vendor-card');
    
    // Add click event to each vendor card
    vendorCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all vendor cards
        vendorCards.forEach(c => c.classList.remove('active'));
        
        // Add active class to selected vendor card
        card.classList.add('active');
        
        // Update current vendor
        const vendorId = card.getAttribute('data-vendor');
        this.state.currentVendor = vendorId;
        this.domCache.currentVendor = card;
        
        // Update aria-checked attributes for accessibility
        vendorCards.forEach(c => c.setAttribute('aria-checked', 'false'));
        card.setAttribute('aria-checked', 'true');
        
        // Validate inputs
        this._validateInputs();
        
        // Show message to calculate TCO
        this._showMessage('Vendor selected. Click "Calculate TCO" to see results.', 'info');
      });
      
      // Add keyboard handling for accessibility
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
    });
  }
  
  /**
   * Initialize calculator form
   */
  _initializeCalculatorForm() {
    // Get calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Add click event to calculate button
    if (calculateBtn) {
      calculateBtn.addEventListener('click', () => {
        this._handleCalculate();
      });
    }
    
    // Add input event listeners for form fields
    const deviceCount = document.getElementById('device-count');
    const organizationSize = document.getElementById('organization-size');
    const yearsToProject = document.getElementById('years-to-project');
    
    if (deviceCount) {
      deviceCount.addEventListener('input', () => {
        this.state.deviceCount = parseInt(deviceCount.value) || 300;
        this._validateInputs();
      });
    }
    
    if (organizationSize) {
      organizationSize.addEventListener('change', () => {
        this.state.organizationSize = organizationSize.value;
        this._validateInputs();
      });
    }
    
    if (yearsToProject) {
      yearsToProject.addEventListener('input', () => {
        this.state.yearsToProject = parseInt(yearsToProject.value) || 1;
        this._validateInputs();
      });
    }
  }
  
  /**
   * Initialize tabs
   */
  _initializeTabs() {
    // Get all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    
    // Add click event to each tab button
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Get tab id
        const tabId = button.getAttribute('data-tab');
        
        // Set active tab
        this._setActiveTab(tabId);
      });
      
      // Add keyboard handling for accessibility
      button.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          button.click();
        }
      });
    });
    
    // Activate first tab by default
    if (tabButtons.length > 0) {
      const firstTabId = tabButtons[0].getAttribute('data-tab');
      this._setActiveTab(firstTabId);
    }
    
    // Initialize sub-tabs if present
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    
    // Add click event to each sub-tab button
    subTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Get sub-tab id
        const subTabId = button.getAttribute('data-subtab');
        
        // Set active sub-tab
        this._setActiveSubTab(subTabId);
      });
    });
  }
  
  /**
   * Initialize export options
   */
  _initializeExportOptions() {
    // Get export buttons
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    
    // Add click event to export CSV button
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        this._handleExportCSV();
      });
    }
    
    // Add click event to export PDF button
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this._handleExportPDF();
      });
    }
  }
  
  /**
   * Initialize advanced options
   */
  _initializeAdvancedOptions() {
    // Get advanced options toggle
    const advancedOptionsToggle = document.querySelector('.advanced-options-toggle button');
    const advancedOptionsPanel = document.getElementById('advanced-options-panel');
    
    // Add click event to advanced options toggle
    if (advancedOptionsToggle && advancedOptionsPanel) {
      advancedOptionsToggle.addEventListener('click', () => {
        // Toggle advanced options panel
        const isVisible = !advancedOptionsPanel.classList.contains('hidden');
        
        if (isVisible) {
          advancedOptionsPanel.classList.add('hidden');
          advancedOptionsToggle.setAttribute('aria-expanded', 'false');
          this.state.hasAdvancedOptions = false;
        } else {
          advancedOptionsPanel.classList.remove('hidden');
          advancedOptionsToggle.setAttribute('aria-expanded', 'true');
          this.state.hasAdvancedOptions = true;
        }
      });
    }
    
    // Initialize advanced option controls
    this._initializeAdvancedOptionControls();
  }
  
  /**
   * Initialize advanced option controls
   */
  _initializeAdvancedOptionControls() {
    // Multiple locations
    const multipleLocations = document.getElementById('multiple-locations');
    const locationCount = document.getElementById('location-count');
    const locationCountContainer = document.getElementById('location-count-container');
    
    if (multipleLocations && locationCount && locationCountContainer) {
      multipleLocations.addEventListener('change', () => {
        this.state.advancedOptions.multipleLocations = multipleLocations.checked;
        
        if (multipleLocations.checked) {
          locationCountContainer.classList.remove('hidden');
        } else {
          locationCountContainer.classList.add('hidden');
        }
      });
      
      locationCount.addEventListener('input', () => {
        this.state.advancedOptions.locationCount = parseInt(locationCount.value) || 2;
      });
    }
    
    // Complex authentication
    const complexAuthentication = document.getElementById('complex-authentication');
    
    if (complexAuthentication) {
      complexAuthentication.addEventListener('change', () => {
        this.state.advancedOptions.complexAuthentication = complexAuthentication.checked;
      });
    }
    
    // Legacy devices
    const legacyDevices = document.getElementById('legacy-devices');
    const legacyPercentage = document.getElementById('legacy-percentage');
    const legacyPercentageValue = document.getElementById('legacy-percentage-value');
    const legacyPercentageContainer = document.getElementById('legacy-percentage-container');
    
    if (legacyDevices && legacyPercentage && legacyPercentageValue && legacyPercentageContainer) {
      legacyDevices.addEventListener('change', () => {
        this.state.advancedOptions.legacyDevices = legacyDevices.checked;
        
        if (legacyDevices.checked) {
          legacyPercentageContainer.classList.remove('hidden');
        } else {
          legacyPercentageContainer.classList.add('hidden');
        }
      });
      
      legacyPercentage.addEventListener('input', () => {
        const value = parseInt(legacyPercentage.value) || 0;
        this.state.advancedOptions.legacyPercentage = value;
        legacyPercentageValue.textContent = value + "%";
        legacyPercentage.setAttribute('aria-valuenow', value);
      });
    }
    
    // Cloud integration
    const cloudIntegration = document.getElementById('cloud-integration');
    
    if (cloudIntegration) {
      cloudIntegration.addEventListener('change', () => {
        this.state.advancedOptions.cloudIntegration = cloudIntegration.checked;
      });
    }
    
    // Custom policies
    const customPolicies = document.getElementById('custom-policies');
    const policyComplexity = document.getElementById('policy-complexity');
    const policyComplexityContainer = document.getElementById('policy-complexity-container');
    
    if (customPolicies && policyComplexity && policyComplexityContainer) {
      customPolicies.addEventListener('change', () => {
        this.state.advancedOptions.customPolicies = customPolicies.checked;
        
        if (customPolicies.checked) {
          policyComplexityContainer.classList.remove('hidden');
        } else {
          policyComplexityContainer.classList.add('hidden');
        }
      });
      
      policyComplexity.addEventListener('change', () => {
        this.state.advancedOptions.policyComplexity = policyComplexity.value;
      });
    }
  }
  
  /**
   * Initialize industry selector
   */
  _initializeIndustrySelector() {
    // Get industry selector
    const industrySelector = document.getElementById('industry-selector');
    
    if (industrySelector) {
      // Add change event to industry selector
      industrySelector.addEventListener('change', () => {
        this.state.industry = industrySelector.value === 'none' ? null : industrySelector.value;
        
        // Update industry-specific sections if available
        this._updateIndustrySpecificSections();
      });
    }
  }
  
  /**
   * Update industry-specific sections
   */
  _updateIndustrySpecificSections() {
    // Implementation can be added later if needed
    console.log("Industry changed to:", this.state.industry);
  }
  
  /**
   * Validate inputs and update UI accordingly
   */
  _validateInputs() {
    // Get calculate button
    const calculateBtn = document.getElementById('calculate-btn');
    
    // Check if all required inputs are valid
    const isValid = (
      this.state.currentVendor && 
      this.state.deviceCount > 0 && 
      this.state.yearsToProject > 0
    );
    
    // Update calculate button
    if (calculateBtn) {
      if (isValid) {
        calculateBtn.disabled = false;
        calculateBtn.classList.remove('disabled');
      } else {
        calculateBtn.disabled = true;
        calculateBtn.classList.add('disabled');
      }
    }
    
    return isValid;
  }
  
  /**
   * Handle calculate button click
   */
  _handleCalculate() {
    // Validate inputs
    if (!this._validateInputs()) {
      this._showMessage('Please select a vendor and provide valid input values.', 'error');
      return;
    }
    
    // Show loading overlay
    this._showLoading(true);
    
    // Clear any previous messages
    this._clearMessage();
    
    // Calculate TCO
    setTimeout(() => {
      try {
        // Check if enhanced calculator is available
        if (window.enhancedCalculator) {
          console.log("Using enhanced calculator");
          // Calculate TCO for all vendors
          const results = window.enhancedCalculator.calculateAllVendors({
            currentVendor: this.state.currentVendor,
            organizationSize: this.state.organizationSize,
            deviceCount: this.state.deviceCount,
            yearsToProject: this.state.yearsToProject,
            industry: this.state.industry,
            hasAdvancedOptions: this.state.hasAdvancedOptions,
            advancedOptions: this.state.advancedOptions
          });
          
          // Store results
          this.state.calculationResults = results;
          
          // Update UI with results
          this._updateResultsUI(results);
          
          // Show results container
          this._showResults(true);
          
          // Hide loading overlay
          this._showLoading(false);
        } else if (window.calculateAllVendors) {
          console.log("Using legacy calculator");
          // Fall back to legacy calculator
          const results = window.calculateAllVendors(
            this.state.currentVendor,
            this.state.organizationSize,
            this.state.deviceCount,
            this.state.yearsToProject
          );
          
          // Store results
          this.state.calculationResults = results;
          
          // Update UI with results
          this._updateResultsUI(results);
          
          // Show results container
          this._showResults(true);
          
          // Hide loading overlay
          this._showLoading(false);
        } else {
          console.error("No calculator found");
          throw new Error('Calculator not available');
        }
      } catch (error) {
        console.error('Calculation error:', error);
        
        // Hide loading overlay
        this._showLoading(false);
        
        // Show error message
        this._showMessage('Error calculating TCO: ' + error.message, 'error');
      }
    }, 500);
  }
  
  /**
   * Handle export to CSV
   */
  _handleExportCSV() {
    // Check if results are available
    if (!this.state.calculationResults) {
      this._showMessage('No results to export. Please calculate TCO first.', 'warning');
      return;
    }
    
    try {
      // Get results
      const results = this.state.calculationResults;
      const comparison = results.comparison;
      
      if (!comparison) {
        throw new Error('Comparison data not available');
      }
      
      const currentVendor = results[comparison.vendorComparison.currentVendor];
      const portnox = results.portnox;
      
      // Create CSV content
      let csv = 'Category,Metric,Current Vendor,Portnox Cloud,Difference\n';
      
      // Add TCO data
      csv += 'TCO,"Total Cost (' + this.state.yearsToProject + ' years)"';
      csv += ',' + currentVendor.totalTCO + ',' + portnox.totalTCO + ',' + comparison.costSavings + '\n';
      
      // Add initial costs
      csv += 'Initial Costs,Hardware';
      csv += ',' + currentVendor.initialCosts.initialHardware + ',' + portnox.initialCosts.initialHardware + ',' + (currentVendor.initialCosts.initialHardware - portnox.initialCosts.initialHardware) + '\n';
      
      csv += 'Initial Costs,Network Redesign';
      csv += ',' + currentVendor.initialCosts.networkRedesign + ',' + portnox.initialCosts.networkRedesign + ',' + (currentVendor.initialCosts.networkRedesign - portnox.initialCosts.networkRedesign) + '\n';
      
      csv += 'Initial Costs,Implementation';
      csv += ',' + currentVendor.initialCosts.implementation + ',' + portnox.initialCosts.implementation + ',' + (currentVendor.initialCosts.implementation - portnox.initialCosts.implementation) + '\n';
      
      csv += 'Initial Costs,Training';
      csv += ',' + currentVendor.initialCosts.training + ',' + portnox.initialCosts.training + ',' + (currentVendor.initialCosts.training - portnox.initialCosts.training) + '\n';
      
      csv += 'Initial Costs,Migration';
      csv += ',0,' + portnox.migrationCosts + ',' + (-portnox.migrationCosts) + '\n';
      
      csv += 'Initial Costs,Total Initial';
      csv += ',' + currentVendor.initialCosts.total + ',' + (portnox.initialCosts.total + portnox.migrationCosts) + ',' + (currentVendor.initialCosts.total - (portnox.initialCosts.total + portnox.migrationCosts)) + '\n';
      
      // Add annual costs
      csv += 'Annual Costs,Maintenance';
      csv += ',' + currentVendor.annualCosts.annualMaintenance + ',' + portnox.annualCosts.annualMaintenance + ',' + (currentVendor.annualCosts.annualMaintenance - portnox.annualCosts.annualMaintenance) + '\n';
      
      csv += 'Annual Costs,Licensing';
      csv += ',' + currentVendor.annualCosts.annualLicensing + ',' + portnox.annualCosts.annualLicensing + ',' + (currentVendor.annualCosts.annualLicensing - portnox.annualCosts.annualLicensing) + '\n';
      
      csv += 'Annual Costs,Downtime Costs';
      csv += ',' + currentVendor.annualCosts.downtimeCost + ',' + portnox.annualCosts.downtimeCost + ',' + (currentVendor.annualCosts.downtimeCost - portnox.annualCosts.downtimeCost) + '\n';
      
      csv += 'Annual Costs,IT Personnel';
      csv += ',' + currentVendor.annualCosts.fteCosts + ',' + portnox.annualCosts.fteCosts + ',' + (currentVendor.annualCosts.fteCosts - portnox.annualCosts.fteCosts) + '\n';
      
      csv += 'Annual Costs,Total Annual';
      csv += ',' + currentVendor.annualCosts.total + ',' + portnox.annualCosts.total + ',' + (currentVendor.annualCosts.total - portnox.annualCosts.total) + '\n';
      
      // Add implementation timeline
      csv += 'Implementation,Total Days';
      csv += ',' + currentVendor.totalImplementationDays + ',' + portnox.totalImplementationDays + ',' + comparison.implementationReduction + '\n';
      
      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'nac_tco_comparison.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      this._showMessage('CSV file exported successfully.', 'success');
    } catch (error) {
      console.error('Export error:', error);
      
      // Show error message
      this._showMessage('Error exporting to CSV: ' + error.message, 'error');
    }
  }
  
  /**
   * Handle export to PDF
   */
  _handleExportPDF() {
    // Check if results are available
    if (!this.state.calculationResults) {
      this._showMessage('No results to export. Please calculate TCO first.', 'warning');
      return;
    }
    
    this._showMessage('PDF export will be implemented in a future update.', 'info');
  }
  
  /**
   * Show/hide loading overlay
   * @param {boolean} show - Whether to show or hide loading overlay
   */
  _showLoading(show) {
    // Update state
    this.state.isCalculating = show;
    
    // Get loading overlay
    const loadingOverlay = this.domCache.loadingOverlay || document.getElementById('loading-overlay');
    
    // Create loading overlay if not exists
    if (!loadingOverlay && show) {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.className = 'loading-overlay';
      
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      
      const text = document.createElement('div');
      text.className = 'loading-text';
      text.textContent = 'Calculating...';
      
      overlay.appendChild(spinner);
      overlay.appendChild(text);
      document.body.appendChild(overlay);
      
      // Cache loading overlay
      this.domCache.loadingOverlay = overlay;
    } else if (loadingOverlay) {
      // Show/hide loading overlay
      if (show) {
        loadingOverlay.style.display = 'flex';
      } else {
        loadingOverlay.style.display = 'none';
      }
    }
  }
  
  /**
   * Show/hide results container
   * @param {boolean} show - Whether to show or hide results container
   */
  _showResults(show) {
    // Get results container
    const resultsContainer = this.domCache.resultsContainer || document.getElementById('results-container');
    
    if (resultsContainer) {
      // Show/hide results container
      if (show) {
        resultsContainer.classList.remove('hidden');
        resultsContainer.setAttribute('aria-hidden', 'false');
        
        // Scroll to results container
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Set focus to results container for accessibility
        resultsContainer.focus();
      } else {
        resultsContainer.classList.add('hidden');
        resultsContainer.setAttribute('aria-hidden', 'true');
      }
    }
  }
  
  /**
   * Set active tab
   * @param {string} tabId - ID of tab to activate
   */
  _setActiveTab(tabId) {
    // Get all tab buttons and panes
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all buttons and panes
    tabButtons.forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
      button.tabIndex = -1;
    });
    
    tabPanes.forEach(pane => {
      pane.classList.remove('active');
      pane.setAttribute('aria-hidden', 'true');
    });
    
    // Add active class to selected button and pane
    const selectedButton = document.querySelector('.tab-button[data-tab="' + tabId + '"]');
    const selectedPane = document.getElementById(tabId);
    
    if (selectedButton) {
      selectedButton.classList.add('active');
      selectedButton.setAttribute('aria-selected', 'true');
      selectedButton.tabIndex = 0;
    }
    
    if (selectedPane) {
      selectedPane.classList.add('active');
      selectedPane.setAttribute('aria-hidden', 'false');
    }
    
    // Update state
    this.state.activeTab = tabId;
  }
  
  /**
   * Set active sub-tab
   * @param {string} subTabId - ID of sub-tab to activate
   */
  _setActiveSubTab(subTabId) {
    // Get all sub-tab buttons and panes
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');
    
    // Remove active class from all buttons and panes
    subTabButtons.forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
      button.tabIndex = -1;
    });
    
    subTabPanes.forEach(pane => {
      pane.classList.remove('active');
      pane.setAttribute('aria-hidden', 'true');
    });
    
    // Add active class to selected button and pane
    const selectedButton = document.querySelector('.sub-tab-button[data-subtab="' + subTabId + '"]');
    const selectedPane = document.getElementById(subTabId);
    
    if (selectedButton) {
      selectedButton.classList.add('active');
      selectedButton.setAttribute('aria-selected', 'true');
      selectedButton.tabIndex = 0;
    }
    
    if (selectedPane) {
      selectedPane.classList.add('active');
      selectedPane.setAttribute('aria-hidden', 'false');
    }
  }
  
  /**
   * Show message to user
   * @param {string} message - Message to show
   * @param {string} type - Message type (success, error, warning, info)
   */
  _showMessage(message, type = 'info') {
    // Get message container
    const messageContainer = this.domCache.messageContainer || document.getElementById('message-container');
    
    if (messageContainer) {
      // Clear any existing messages
      messageContainer.innerHTML = '';
      
      // Create message element
      const messageElement = document.createElement('div');
      messageElement.className = 'message message-' + type;
      messageElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
      
      // Add icon based on message type
      const iconElement = document.createElement('i');
      
      switch (type) {
        case 'success':
          iconElement.className = 'fas fa-check-circle';
          break;
        case 'error':
          iconElement.className = 'fas fa-exclamation-circle';
          break;
        case 'warning':
          iconElement.className = 'fas fa-exclamation-triangle';
          break;
        case 'info':
        default:
          iconElement.className = 'fas fa-info-circle';
          break;
      }
      
      messageElement.appendChild(iconElement);
      
      // Add message text
      const textElement = document.createElement('span');
      textElement.textContent = message;
      messageElement.appendChild(textElement);
      
      // Add close button
      const closeButton = document.createElement('button');
      closeButton.className = 'message-close';
      closeButton.setAttribute('aria-label', 'Dismiss message');
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', () => {
        messageContainer.removeChild(messageElement);
      });
      
      messageElement.appendChild(closeButton);
      
      // Add message to container
      messageContainer.appendChild(messageElement);
      
      // Auto-dismiss success and info messages after 5 seconds
      if (type === 'success' || type === 'info') {
        setTimeout(() => {
          if (messageContainer.contains(messageElement)) {
            messageContainer.removeChild(messageElement);
          }
        }, 5000);
      }
    }
  }
  
  /**
   * Clear all messages
   */
  _clearMessage() {
    // Get message container
    const messageContainer = this.domCache.messageContainer || document.getElementById('message-container');
    
    if (messageContainer) {
      // Clear any existing messages
      messageContainer.innerHTML = '';
    }
  }
  
  /**
   * Update results UI with calculation results
   * @param {object} results - Calculation results
   */
  _updateResultsUI(results) {
    console.log("Updating UI with calculation results:", results);
    
    // Ensure we have comparison data
    if (!results.comparison) {
      this._showMessage('No comparison data available in the results.', 'error');
      return;
    }
    
    // Update comparison metrics
    this._updateComparisonMetrics(results);
    
    // Update tables
    this._updateTables(results);
    
    // Update vendor name placeholders
    if (results[results.comparison.vendorComparison.currentVendor]) {
      this._updateVendorNamePlaceholders(results[results.comparison.vendorComparison.currentVendor].name);
    }
    
    // Update charts if Chart.js is available
    if (typeof Chart !== 'undefined') {
      try {
        this._updateCharts(results);
      } catch (error) {
        console.error("Error updating charts:", error);
        this._showMessage('Error updating charts: ' + error.message, 'warning');
      }
    } else {
      console.warn("Chart.js not available, skipping chart updates");
    }
  }
  
  /**
   * Update comparison metrics
   * @param {object} results - Calculation results
   */
  _updateComparisonMetrics(results) {
    const comparison = results.comparison;
    if (!comparison) {
      return;
    }
    
    // Update comparison metrics
    const comparisonSavings = document.getElementById('comparison-savings');
    const comparisonImplementation = document.getElementById('comparison-implementation');
    
    if (comparisonSavings) {
      comparisonSavings.textContent = '$' + this._formatNumber(comparison.costSavings);
      
      // Update progress bar
      const progressBar = comparisonSavings.parentElement.querySelector('.progress');
      if (progressBar) {
        const width = Math.min(comparison.savingsPercentage, 100);
        progressBar.style.width = width + '%';
        
        // Update aria attributes
        const progressBarContainer = progressBar.parentElement;
        if (progressBarContainer) {
          progressBarContainer.setAttribute('aria-valuenow', Math.round(width));
        }
      }
      
      // Update progress label
      const progressLabel = comparisonSavings.parentElement.querySelector('.progress-labels span:last-child');
      if (progressLabel) {
        progressLabel.textContent = Math.round(comparison.savingsPercentage) + '% Savings';
      }
    }
    
    if (comparisonImplementation) {
      comparisonImplementation.textContent = Math.round(comparison.implementationPercentage) + '%';
      
      // Update progress bar
      const progressBar = comparisonImplementation.parentElement.querySelector('.progress');
      if (progressBar) {
        const width = Math.min(comparison.implementationPercentage, 100);
        progressBar.style.width = width + '%';
        
        // Update aria attributes
        const progressBarContainer = progressBar.parentElement;
        if (progressBarContainer) {
          progressBarContainer.setAttribute('aria-valuenow', Math.round(width));
        }
      }
      
      // Update progress label
      const progressLabel = comparisonImplementation.parentElement.querySelector('.progress-labels span:last-child');
      if (progressLabel) {
        progressLabel.textContent = Math.round(comparison.implementationPercentage) + '% Faster';
      }
    }
  }
  
  /**
   * Update tables with calculation results
   * @param {object} results - Calculation results
   */
  _updateTables(results) {
    const comparison = results.comparison;
    if (!comparison) {
      return;
    }
    
    // Get current vendor and Portnox data
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results.portnox;
    
    // Update TCO summary table
    this._updateTCOSummaryTable(results);
    
    // Update annual costs table
    this._updateAnnualCostsTable(currentVendor, portnox);
  }
  
  /**
   * Update TCO summary table
   * @param {object} results - Calculation results
   */
  _updateTCOSummaryTable(results) {
    const tableBody = document.getElementById('tco-summary-table-body');
    if (!tableBody) {
      return;
    }
    
    // Clear table body
    tableBody.innerHTML = '';
    
    // Get vendors to include in table
    const currentVendor = results[results.comparison.vendorComparison.currentVendor];
    const portnox = results.portnox;
    
    if (!currentVendor || !portnox) {
      return;
    }
    
    // Add row for current vendor
    const currentVendorRow = document.createElement('tr');
    
    const currentVendorCell = document.createElement('td');
    currentVendorCell.textContent = currentVendor.vendor;
    currentVendorRow.appendChild(currentVendorCell);
    
    const currentInitialCell = document.createElement('td');
    currentInitialCell.textContent = '$' + this._formatNumber(currentVendor.initialCosts.total);
    currentVendorRow.appendChild(currentInitialCell);
    
    const currentAnnualCell = document.createElement('td');
    currentAnnualCell.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total);
    currentVendorRow.appendChild(currentAnnualCell);
    
    const currentMigrationCell = document.createElement('td');
    currentMigrationCell.textContent = '$0';
    currentVendorRow.appendChild(currentMigrationCell);
    
    const currentTotalCell = document.createElement('td');
    currentTotalCell.textContent = '$' + this._formatNumber(currentVendor.totalTCO);
    currentVendorRow.appendChild(currentTotalCell);
    
    tableBody.appendChild(currentVendorRow);
    
    // Add row for Portnox
    const portnoxRow = document.createElement('tr');
    
    const portnoxNameCell = document.createElement('td');
    portnoxNameCell.textContent = portnox.vendor;
    portnoxRow.appendChild(portnoxNameCell);
    
    const portnoxInitialCell = document.createElement('td');
    portnoxInitialCell.textContent = '$' + this._formatNumber(portnox.initialCosts.total);
    portnoxRow.appendChild(portnoxInitialCell);
    
    const portnoxAnnualCell = document.createElement('td');
    portnoxAnnualCell.textContent = '$' + this._formatNumber(portnox.annualCosts.total);
    portnoxRow.appendChild(portnoxAnnualCell);
    
    const portnoxMigrationCell = document.createElement('td');
    portnoxMigrationCell.textContent = '$' + this._formatNumber(portnox.migrationCosts);
    portnoxRow.appendChild(portnoxMigrationCell);
    
    const portnoxTotalCell = document.createElement('td');
    portnoxTotalCell.textContent = '$' + this._formatNumber(portnox.totalTCO);
    portnoxRow.appendChild(portnoxTotalCell);
    
    tableBody.appendChild(portnoxRow);
    
    // Add savings row
    const savingsRow = document.createElement('tr');
    savingsRow.classList.add('savings-row');
    
    const savingsLabel = document.createElement('td');
    savingsLabel.textContent = 'Savings with Portnox Cloud';
    savingsLabel.style.fontWeight = 'bold';
    savingsRow.appendChild(savingsLabel);
    
    const initialSavings = document.createElement('td');
    initialSavings.textContent = '$' + this._formatNumber(currentVendor.initialCosts.total - portnox.initialCosts.total);
    savingsRow.appendChild(initialSavings);
    
    const annualSavings = document.createElement('td');
    annualSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total - portnox.annualCosts.total);
    savingsRow.appendChild(annualSavings);
    
    const migrationSavings = document.createElement('td');
    migrationSavings.textContent = '-$' + this._formatNumber(portnox.migrationCosts);
    savingsRow.appendChild(migrationSavings);
    
    const totalSavings = document.createElement('td');
    totalSavings.textContent = '$' + this._formatNumber(currentVendor.totalTCO - portnox.totalTCO);
    totalSavings.style.fontWeight = 'bold';
    savingsRow.appendChild(totalSavings);
    
    tableBody.appendChild(savingsRow);
  }
  
  /**
   * Update annual costs table
   * @param {object} currentVendor - Current vendor data
   * @param {object} portnox - Portnox data
   */
  _updateAnnualCostsTable(currentVendor, portnox) {
    const tableBody = document.getElementById('annual-costs-table-body');
    if (!tableBody) {
      return;
    }
    
    // Clear table body
    tableBody.innerHTML = '';
    
    // Add maintenance row
    const maintenanceRow = document.createElement('tr');
    
    const maintenanceLabel = document.createElement('td');
    maintenanceLabel.textContent = 'Maintenance and Support';
    maintenanceRow.appendChild(maintenanceLabel);
    
    const maintenanceCurrent = document.createElement('td');
    maintenanceCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualMaintenance);
    maintenanceRow.appendChild(maintenanceCurrent);
    
    const maintenancePortnox = document.createElement('td');
    maintenancePortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.annualMaintenance);
    maintenanceRow.appendChild(maintenancePortnox);
    
    const maintenanceSavings = document.createElement('td');
    maintenanceSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualMaintenance - portnox.annualCosts.annualMaintenance);
    maintenanceRow.appendChild(maintenanceSavings);
    
    tableBody.appendChild(maintenanceRow);
    
    // Add licensing row
    const licensingRow = document.createElement('tr');
    
    const licensingLabel = document.createElement('td');
    licensingLabel.textContent = 'Licensing and Subscriptions';
    licensingRow.appendChild(licensingLabel);
    
    const licensingCurrent = document.createElement('td');
    licensingCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualLicensing);
    licensingRow.appendChild(licensingCurrent);
    
    const licensingPortnox = document.createElement('td');
    licensingPortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.annualLicensing);
    licensingRow.appendChild(licensingPortnox);
    
    const licensingSavings = document.createElement('td');
    licensingSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.annualLicensing - portnox.annualCosts.annualLicensing);
    licensingRow.appendChild(licensingSavings);
    
    tableBody.appendChild(licensingRow);
    
    // Add downtime row
    const downtimeRow = document.createElement('tr');
    
    const downtimeLabel = document.createElement('td');
    downtimeLabel.textContent = 'Downtime Costs';
    downtimeRow.appendChild(downtimeLabel);
    
    const downtimeCurrent = document.createElement('td');
    downtimeCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.downtimeCost);
    downtimeRow.appendChild(downtimeCurrent);
    
    const downtimePortnox = document.createElement('td');
    downtimePortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.downtimeCost);
    downtimeRow.appendChild(downtimePortnox);
    
    const downtimeSavings = document.createElement('td');
    downtimeSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.downtimeCost - portnox.annualCosts.downtimeCost);
    downtimeRow.appendChild(downtimeSavings);
    
    tableBody.appendChild(downtimeRow);
    
    // Add IT personnel row
    const personnelRow = document.createElement('tr');
    
    const personnelLabel = document.createElement('td');
    personnelLabel.textContent = 'IT Personnel Costs';
    personnelRow.appendChild(personnelLabel);
    
    const personnelCurrent = document.createElement('td');
    personnelCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.fteCosts);
    personnelRow.appendChild(personnelCurrent);
    
    const personnelPortnox = document.createElement('td');
    personnelPortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.fteCosts);
    personnelRow.appendChild(personnelPortnox);
    
    const personnelSavings = document.createElement('td');
    personnelSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.fteCosts - portnox.annualCosts.fteCosts);
    personnelRow.appendChild(personnelSavings);
    
    tableBody.appendChild(personnelRow);
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.classList.add('total-row');
    
    const totalLabel = document.createElement('td');
    totalLabel.textContent = 'Total Annual Costs';
    totalLabel.style.fontWeight = 'bold';
    totalRow.appendChild(totalLabel);
    
    const totalCurrent = document.createElement('td');
    totalCurrent.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total);
    totalCurrent.style.fontWeight = 'bold';
    totalRow.appendChild(totalCurrent);
    
    const totalPortnox = document.createElement('td');
    totalPortnox.textContent = '$' + this._formatNumber(portnox.annualCosts.total);
    totalPortnox.style.fontWeight = 'bold';
    totalRow.appendChild(totalPortnox);
    
    const totalSavings = document.createElement('td');
    totalSavings.textContent = '$' + this._formatNumber(currentVendor.annualCosts.total - portnox.annualCosts.total);
    totalSavings.style.fontWeight = 'bold';
    totalRow.appendChild(totalSavings);
    
    tableBody.appendChild(totalRow);
  }
  
  /**
   * Update vendor name placeholders
   * @param {string} vendorName - Vendor name
   */
  _updateVendorNamePlaceholders(vendorName) {
    const placeholders = document.querySelectorAll('.vendor-name-placeholder');
    
    placeholders.forEach(placeholder => {
      placeholder.textContent = vendorName;
    });
    
    // Update table headers
    const tcoComparisonVendor = document.getElementById('tco-comparison-vendor');
    if (tcoComparisonVendor) {
      tcoComparisonVendor.textContent = vendorName;
    }
    
    const annualComparisonVendor = document.getElementById('annual-comparison-vendor');
    if (annualComparisonVendor) {
      annualComparisonVendor.textContent = vendorName;
    }
    
    const implementationComparisonVendor = document.getElementById('implementation-comparison-vendor');
    if (implementationComparisonVendor) {
      implementationComparisonVendor.textContent = vendorName;
    }
  }
  
  /**
   * Update charts with calculation results
   * @param {object} results - Calculation results
   */
  _updateCharts(results) {
    const comparison = results.comparison;
    if (!comparison) {
      return;
    }
    
    // Get current vendor and Portnox data
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results.portnox;
    
    // Update TCO comparison chart
    this._updateTCOComparisonChart(currentVendor, portnox);
    
    // Update cumulative cost chart
    this._updateCumulativeCostChart(currentVendor, portnox);
  }
  
  /**
   * Update TCO comparison chart
   * @param {object} currentVendor - Current vendor data
   * @param {object} portnox - Portnox data
   */
  _updateTCOComparisonChart(currentVendor, portnox) {
    const chartCanvas = document.getElementById('tco-comparison-chart');
    if (!chartCanvas) {
      return;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available');
      return;
    }
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart && Chart.getChart(chartCanvas);
    if (existingChart) {
      existingChart.destroy();
    }
    
    // Create chart data
    const chartData = {
      labels: [currentVendor.vendor, 'Portnox Cloud'],
      datasets: [
        {
          label: 'Annual Costs',
          data: [
            currentVendor.annualCosts.total * this.state.yearsToProject,
            portnox.annualCosts.total * this.state.yearsToProject
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        },
        {
          label: 'Initial Costs',
          data: [
            currentVendor.initialCosts.total,
            portnox.initialCosts.total + portnox.migrationCosts
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.7)'
        }
      ]
    };
    
    // Create chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.raw.toLocaleString();
            },
            footer: function(tooltipItems) {
              let total = 0;
              tooltipItems.forEach(item => {
                total += item.parsed.y;
              });
              return 'Total: $' + total.toLocaleString();
            }
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    };
    
    // Create chart
    new Chart(chartCanvas, {
      type: 'bar',
      data: chartData,
      options: chartOptions
    });
  }
  
  /**
   * Update cumulative cost chart
   * @param {object} currentVendor - Current vendor data
   * @param {object} portnox - Portnox data
   */
  _updateCumulativeCostChart(currentVendor, portnox) {
    const chartCanvas = document.getElementById('cumulative-cost-chart');
    if (!chartCanvas) {
      return;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not available');
      return;
    }
    
    // Destroy existing chart if any
    const existingChart = Chart.getChart && Chart.getChart(chartCanvas);
    if (existingChart) {
      existingChart.destroy();
    }
    
    // Calculate cumulative costs
    const labels = ['Initial'];
    const currentVendorData = [currentVendor.initialCosts.total];
    const portnoxData = [portnox.initialCosts.total + portnox.migrationCosts];
    
    for (let year = 1; year <= this.state.yearsToProject; year++) {
      labels.push('Year ' + year);
      currentVendorData.push(currentVendor.initialCosts.total + currentVendor.annualCosts.total * year);
      portnoxData.push((portnox.initialCosts.total + portnox.migrationCosts) + portnox.annualCosts.total * year);
    }
    
    // Create chart data
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: currentVendor.vendor,
          data: currentVendorData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.1
        },
        {
          label: 'Portnox Cloud',
          data: portnoxData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.1
        }
      ]
    };
    
    // Create chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': $' + context.raw.toLocaleString();
            }
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    };
    
    // Create chart
    new Chart(chartCanvas, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }
  
  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// Make BasicUIController available as both BasicUIController and EnhancedUIController
window.EnhancedUIController = BasicUIController;
