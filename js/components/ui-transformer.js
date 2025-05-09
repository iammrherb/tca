/**
 * UI Transformer
 * Completely transforms the UI layout for the Total Cost Analyzer
 */
(function() {
  console.log("Starting UI Transformer");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Update page title
    document.title = "Total Cost Analyzer";
    
    // Update logo text
    const logoText = document.querySelector('.logo h1');
    if (logoText) {
      logoText.textContent = "Total Cost Analyzer";
    }
    
    // Apply transformations
    removeWizardSteps();
    organizeVendorSection();
    setupTabsUnderVendors();
    enhanceWizardWithVendorLogos();
    setupEventHandlers();
    
    console.log("UI transformation complete");
  });
  
  // Remove wizard steps and show results container
  function removeWizardSteps() {
    console.log("Removing wizard steps...");
    
    // Hide wizard elements
    const wizardElements = [
      '.wizard-nav',
      '.wizard-content',
      '#wizard-error-container'
    ];
    
    wizardElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.display = 'none';
      }
    });
    
    // Show results container
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      resultsContainer.style.display = 'block';
    }
  }
  
  // Organize vendor section
  function organizeVendorSection() {
    console.log("Organizing vendor section...");
    
    const calculatorContainer = document.querySelector('.calculator-container');
    if (!calculatorContainer) return;
    
    // Check if vendor selection section already exists
    let vendorSection = document.querySelector('.vendor-selection-section');
    if (!vendorSection) {
      // Create vendor selection section
      vendorSection = document.createElement('div');
      vendorSection.className = 'vendor-selection-section';
      vendorSection.innerHTML = `
        <h2>Select Your NAC Solution</h2>
        <div class="vendor-cards-grid"></div>
        <div class="vendor-info-panel" style="display:none;"></div>
      `;
      
      // Add to the top of the calculator container
      if (calculatorContainer.firstChild) {
        calculatorContainer.insertBefore(vendorSection, calculatorContainer.firstChild);
      } else {
        calculatorContainer.appendChild(vendorSection);
      }
    }
    
    // Find vendor cards
    const vendorCardsGrid = vendorSection.querySelector('.vendor-cards-grid');
    if (!vendorCardsGrid) return;
    
    // Clear existing cards
    vendorCardsGrid.innerHTML = '';
    
    // Create vendor cards
    const vendors = [
      { id: 'cisco', name: 'Cisco ISE', logo: 'img/vendors/cisco-logo.png' },
      { id: 'aruba', name: 'Aruba ClearPass', logo: 'img/vendors/aruba-logo.png' },
      { id: 'forescout', name: 'Forescout', logo: 'img/vendors/forescout-logo.png' },
      { id: 'fortinac', name: 'FortiNAC', logo: 'img/vendors/fortinac-logo.png' },
      { id: 'nps', name: 'Microsoft NPS', logo: 'img/vendors/microsoft-logo.png' },
      { id: 'securew2', name: 'SecureW2', logo: 'img/vendors/securew2-logo.png' },
      { id: 'portnox', name: 'Portnox Cloud', logo: 'img/vendors/portnox-logo.png' },
      { id: 'noNac', name: 'No NAC Solution', logo: 'img/icons/no-nac-icon.svg' }
    ];
    
    vendors.forEach(vendor => {
      const card = document.createElement('div');
      card.className = 'vendor-card';
      card.setAttribute('data-vendor', vendor.id);
      
      const img = document.createElement('img');
      img.src = vendor.logo;
      img.alt = vendor.name;
      
      const span = document.createElement('span');
      span.textContent = vendor.name;
      
      card.appendChild(img);
      card.appendChild(span);
      vendorCardsGrid.appendChild(card);
    });
  }
  
  // Setup tabs to appear directly under vendors
  function setupTabsUnderVendors() {
    console.log("Setting up tabs under vendors...");
    
    const resultsContainer = document.getElementById('results-container');
    if (!resultsContainer) return;
    
    // Move tabs right after vendor section
    const tabs = resultsContainer.querySelector('.tabs');
    if (!tabs) return;
    
    const vendorSection = document.querySelector('.vendor-selection-section');
    if (!vendorSection) return;
    
    // Insert tabs after vendor section
    vendorSection.after(tabs);
    
    // Ensure tabs have the right styling
    tabs.style.marginBottom = '0';
    tabs.style.borderRadius = '8px 8px 0 0';
    
    // Style the tab content container
    const tabContent = resultsContainer.querySelector('.tab-content');
    if (!tabContent) return;
    
    tabContent.style.borderRadius = '0 0 8px 8px';
    tabContent.style.marginTop = '0';
  }
  
  // Enhance TCO Wizard with vendor logos
  function enhanceWizardWithVendorLogos() {
    console.log("Enhancing wizard with vendor logos...");
    
    // Find the vendor selection step content
    const vendorSelectionStep = document.getElementById('step-vendor-selection');
    if (!vendorSelectionStep) return;
    
    // Find the vendor options container
    const vendorOptions = vendorSelectionStep.querySelector('.vendor-options');
    if (!vendorOptions) return;
    
    // Hide the original vendor cards
    vendorOptions.style.display = 'none';
    
    // Create new vendor selection
    const wizardVendorSelection = document.createElement('div');
    wizardVendorSelection.className = 'wizard-vendor-selection';
    
    // Vendor data with logos
    const vendors = [
      { id: 'cisco', name: 'Cisco ISE', logo: 'img/vendors/cisco-logo.png' },
      { id: 'aruba', name: 'Aruba ClearPass', logo: 'img/vendors/aruba-logo.png' },
      { id: 'forescout', name: 'Forescout', logo: 'img/vendors/forescout-logo.png' },
      { id: 'fortinac', name: 'FortiNAC', logo: 'img/vendors/fortinac-logo.png' },
      { id: 'nps', name: 'Microsoft NPS', logo: 'img/vendors/microsoft-logo.png' },
      { id: 'securew2', name: 'SecureW2', logo: 'img/vendors/securew2-logo.png' },
      { id: 'portnox', name: 'Portnox Cloud', logo: 'img/vendors/portnox-logo.png' },
      { id: 'noNac', name: 'No NAC Solution', logo: 'img/icons/no-nac-icon.svg' }
    ];
    
    // Create vendor cards
    vendors.forEach(vendor => {
      const card = document.createElement('div');
      card.className = 'wizard-vendor-card';
      card.setAttribute('data-vendor', vendor.id);
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      card.setAttribute('tabindex', '0');
      
      const img = document.createElement('img');
      img.src = vendor.logo;
      img.alt = vendor.name;
      
      const span = document.createElement('span');
      span.textContent = vendor.name;
      
      card.appendChild(img);
      card.appendChild(span);
      wizardVendorSelection.appendChild(card);
      
      // Add click event
      card.addEventListener('click', function() {
        // Select this vendor in the original select
        const originalVendorCard = vendorOptions.querySelector(`[data-vendor="${vendor.id}"]`);
        if (originalVendorCard) {
          // Simulate click on original vendor card
          originalVendorCard.click();
        }
        
        // Update wizard vendor cards
        wizardVendorSelection.querySelectorAll('.wizard-vendor-card').forEach(c => {
          c.classList.remove('selected');
          c.setAttribute('aria-checked', 'false');
        });
        
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
      });
    });
    
    // Insert new vendor selection before the vendor options
    vendorOptions.parentNode.insertBefore(wizardVendorSelection, vendorOptions);
  }
  
  // Setup event handlers
  function setupEventHandlers() {
    console.log("Setting up event handlers...");
    
    // Configure vendor cards
    setupVendorCards();
    
    // Configure tabs
    setupTabs();
    
    // Configure sub-tabs
    setupSubTabs();
  }
  
  // Setup vendor cards
  function setupVendorCards() {
    // Initialize vendor data
    const vendorData = {
      cisco: {
        name: "Cisco ISE",
        description: "Enterprise-grade on-premises NAC solution with comprehensive security features and deep Cisco integration.",
        metrics: {
          implementationTime: "3-6 months",
          totalCost: "$350K-$500K",
          maintenance: "High"
        }
      },
      aruba: {
        name: "Aruba ClearPass",
        description: "Advanced NAC solution with strong wireless integration and multi-vendor support.",
        metrics: {
          implementationTime: "2-4 months",
          totalCost: "$300K-$450K",
          maintenance: "Medium-High"
        }
      },
      forescout: {
        name: "Forescout",
        description: "Specialized in device visibility and control with agentless operation and strong IoT support.",
        metrics: {
          implementationTime: "2-5 months",
          totalCost: "$320K-$480K",
          maintenance: "Medium-High"
        }
      },
      fortinac: {
        name: "FortiNAC",
        description: "NAC solution from Fortinet with strong security fabric integration for unified security.",
        metrics: {
          implementationTime: "2-4 months",
          totalCost: "$250K-$400K",
          maintenance: "Medium"
        }
      },
      nps: {
        name: "Microsoft NPS",
        description: "Basic Windows-based RADIUS server with limited NAC capabilities, suitable for Windows environments.",
        metrics: {
          implementationTime: "1-2 months",
          totalCost: "$150K-$250K",
          maintenance: "Medium"
        }
      },
      securew2: {
        name: "SecureW2",
        description: "Cloud-based certificate management and NAC with strong BYOD and passwordless auth support.",
        metrics: {
          implementationTime: "2-6 weeks",
          totalCost: "$200K-$350K",
          maintenance: "Low-Medium"
        }
      },
      portnox: {
        name: "Portnox Cloud",
        description: "Cloud-native NAC solution with rapid deployment and minimal infrastructure requirements.",
        metrics: {
          implementationTime: "1-2 weeks",
          totalCost: "$150K-$250K",
          maintenance: "Low"
        }
      },
      noNac: {
        name: "No NAC Solution",
        description: "Operating without NAC, relying on other security controls for network protection.",
        metrics: {
          implementationTime: "N/A",
          totalCost: "$0 (direct costs)",
          maintenance: "N/A"
        }
      }
    };
// Get vendor cards and info panel
    const vendorCards = document.querySelectorAll('.vendor-card');
    const vendorInfoPanel = document.querySelector('.vendor-info-panel');

    // Add click event for vendor cards
    vendorCards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove active class from all cards
        vendorCards.forEach(c => c.classList.remove('active'));

        // Add active class to clicked card
        this.classList.add('active');

        // Get vendor ID
        const vendorId = this.getAttribute('data-vendor');

        // Update vendor info panel
        if (vendorInfoPanel && vendorData[vendorId]) {
          const vendor = vendorData[vendorId];

          vendorInfoPanel.innerHTML = `
            <img src="${this.querySelector('img').src}" alt="${vendor.name}" class="vendor-logo-large">
            <div class="vendor-details">
              <h3>${vendor.name}</h3>
              <p>${vendor.description}</p>
            </div>
            <div class="vendor-metrics">
              <div class="vendor-metric">
                <div class="vendor-metric-value">${vendor.metrics.implementationTime}</div>
                <div class="vendor-metric-label">Implementation Time</div>
              </div>
              <div class="vendor-metric">
                <div class="vendor-metric-value">${vendor.metrics.totalCost}</div>
                <div class="vendor-metric-label">Total Cost (3yr)</div>
              </div>
              <div class="vendor-metric">
                <div class="vendor-metric-value">${vendor.metrics.maintenance}</div>
                <div class="vendor-metric-label">Maintenance Level</div>
              </div>
            </div>
          `;

          vendorInfoPanel.style.display = 'flex';
        }

        // Update charts based on selected vendor
        updateChartsForVendor(vendorId);
      });
    });

    // Activate first vendor card by default
    if (vendorCards.length > 0) {
      vendorCards[0].click();
    }
  }

  // Setup tabs
  function setupTabs() {
    // Get tab buttons and panes
    const tabButtons = document.querySelectorAll('.tabs .tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Add click event to tab buttons
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get target tab
        const tabId = this.getAttribute('data-tab');

        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const targetPane = document.getElementById(tabId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });

    // Activate first tab by default
    if (tabButtons.length > 0) {
      tabButtons[0].click();
    }
  }

  // Setup sub-tabs
  function setupSubTabs() {
    // Get sub-tab buttons and panes
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');

    // Add click event to sub-tab buttons
    subTabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get target tab
        const tabId = this.getAttribute('data-subtab');

        // Remove active class from all buttons and panes
        subTabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        subTabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to clicked button and corresponding pane
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const targetPane = document.getElementById(tabId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });

    // Activate first sub-tab by default
    if (subTabButtons.length > 0) {
      subTabButtons[0].click();
    }
  }

  // Update charts based on vendor
  function updateChartsForVendor(vendor) {
    // Check if TotalCostCharts is available
    if (typeof TotalCostCharts !== 'undefined' && typeof TotalCostCharts.updateChartsForVendor === 'function') {
      // Update all charts for selected vendor
      TotalCostCharts.updateChartsForVendor(vendor);
    } else {
      console.warn("TotalCostCharts is not available for updating");
    }
  }
})();
