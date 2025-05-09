/**
 * Total Cost Analyzer - Main UI Script
 * Complete UI overhaul with streamlined layout
 */
(function() {
  console.log("Initializing Total Cost Analyzer");
  
  // Wait for DOM to be loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Update page title
    document.title = "Total Cost Analyzer";
    
    // Update logo text
    const logoText = document.querySelector('.logo h1');
    if (logoText) {
      logoText.textContent = "Total Cost Analyzer";
    }
    
    // Restructure the UI
    restructureUI();
    
    // Initialize vendor selection
    initVendorSelection();
    
    // Initialize tab navigation
    initTabs();
    
    console.log("Total Cost Analyzer initialization complete");
  });
  
  // Restructure the UI
  function restructureUI() {
    console.log("Restructuring UI...");
    
    // Get calculator container
    const calculatorContainer = document.querySelector('.calculator-container');
    if (!calculatorContainer) {
      console.error("Calculator container not found");
      return;
    }
    
    // Show results container
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
    } else {
      console.warn("Results container not found");
    }
    
    // Create vendor selection area
    const vendorSelectionArea = document.createElement('div');
    vendorSelectionArea.className = 'vendor-selection-area';
    vendorSelectionArea.innerHTML = `
      <h2>Select Your NAC Solution</h2>
      <div class="vendor-cards-grid"></div>
      <div class="vendor-info-panel" style="display: none;"></div>
    `;
    
    // Insert vendor selection at the top
    calculatorContainer.insertBefore(vendorSelectionArea, calculatorContainer.firstChild);
    
    // Move vendor cards to new area
    const originalVendorCards = document.querySelectorAll('.vendor-card');
    const vendorCardsGrid = vendorSelectionArea.querySelector('.vendor-cards-grid');
    
    if (originalVendorCards.length > 0 && vendorCardsGrid) {
      originalVendorCards.forEach(card => {
        vendorCardsGrid.appendChild(card.cloneNode(true));
      });
    } else {
      // Create default vendor cards if none exist
      createDefaultVendorCards(vendorCardsGrid);
    }
    
    // Make the tabs appear at the top of the results container
    const tabs = document.querySelector('.tabs');
    if (tabs && resultsContainer) {
      tabs.className = 'main-tabs';
      
      // Remove existing tabs and create new ones
      tabs.innerHTML = '';
      
      const tabDefinitions = [
        { id: 'comparison-tab', label: 'Cost Comparison' },
        { id: 'details-tab', label: 'Cost Details' },
        { id: 'implementation-tab', label: 'Implementation' },
        { id: 'features-tab', label: 'Features' },
        { id: 'roi-tab', label: 'ROI Analysis' },
        { id: 'sensitivity-tab', label: 'Sensitivity Analysis' },
        { id: 'breach-tab', label: 'Risk Analysis' }
      ];
      
      tabDefinitions.forEach(tab => {
        const tabButton = document.createElement('button');
        tabButton.className = 'tab-button';
        tabButton.setAttribute('data-tab', tab.id);
        tabButton.setAttribute('role', 'tab');
        tabButton.textContent = tab.label;
        tabs.appendChild(tabButton);
      });
    }
  }
  
  // Create default vendor cards
  function createDefaultVendorCards(container) {
    if (!container) return;
    
    const vendors = [
      { id: 'cisco', name: 'Cisco ISE', logo: 'img/vendors/cisco-logo.png' },
      { id: 'aruba', name: 'Aruba ClearPass', logo: 'img/vendors/aruba-logo.png' },
      { id: 'forescout', name: 'Forescout', logo: 'img/vendors/forescout-logo.png' },
      { id: 'fortinac', name: 'FortiNAC', logo: 'img/vendors/fortinac-logo.png' },
      { id: 'nps', name: 'Microsoft NPS', logo: 'img/vendors/microsoft-logo.png' },
      { id: 'securew2', name: 'SecureW2', logo: 'img/vendors/securew2-logo.png' },
      { id: 'portnox', name: 'Portnox Cloud', logo: 'img/vendors/portnox-logo.png' }
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
      container.appendChild(card);
    });
  }
  
  // Initialize vendor selection
  function initVendorSelection() {
    // Vendor data
    const vendorData = {
      cisco: {
        name: "Cisco ISE",
        description: "Enterprise-grade on-premises NAC solution with comprehensive feature set and deep Cisco integration.",
        metrics: { implementationTime: "3-6 months", totalCost: "$350K-$500K", maintenance: "High" }
      },
      aruba: {
        name: "Aruba ClearPass",
        description: "Advanced NAC solution with strong wireless integration and multi-vendor support.",
        metrics: { implementationTime: "2-4 months", totalCost: "$300K-$450K", maintenance: "Medium-High" }
      },
      forescout: {
        name: "Forescout",
        description: "Specialized in device visibility and control with agentless operation and strong IoT support.",
        metrics: { implementationTime: "2-5 months", totalCost: "$320K-$480K", maintenance: "Medium-High" }
      },
      fortinac: {
        name: "FortiNAC",
        description: "NAC solution from Fortinet with strong security fabric integration for unified security.",
        metrics: { implementationTime: "2-4 months", totalCost: "$250K-$400K", maintenance: "Medium" }
      },
      nps: {
        name: "Microsoft NPS",
        description: "Basic Windows-based RADIUS server with limited NAC capabilities, suitable for Windows environments.",
        metrics: { implementationTime: "1-2 months", totalCost: "$150K-$250K", maintenance: "Medium" }
      },
      securew2: {
        name: "SecureW2",
        description: "Cloud-based certificate management and NAC with strong BYOD and passwordless auth support.",
        metrics: { implementationTime: "2-6 weeks", totalCost: "$200K-$350K", maintenance: "Low-Medium" }
      },
      portnox: {
        name: "Portnox Cloud",
        description: "Cloud-native NAC solution with rapid deployment and minimal infrastructure requirements.",
        metrics: { implementationTime: "1-2 weeks", totalCost: "$150K-$250K", maintenance: "Low" }
      }
    };
    
    // Get vendor cards
    const vendorCards = document.querySelectorAll('.vendor-cards-grid .vendor-card');
    const vendorInfoPanel = document.querySelector('.vendor-info-panel');
    
    // Add click event to vendor cards
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
      });
    });
    
    // Activate first vendor card by default
    if (vendorCards.length > 0) {
      vendorCards[0].click();
    }
  }
  
  // Initialize tab navigation
  function initTabs() {
    // Get tab buttons and panes
    const tabButtons = document.querySelectorAll('.main-tabs .tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Add click event to tab buttons
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get target tab
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        this.classList.add('active');
        
        const targetPane = document.getElementById(tabId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
    
    // Initialize sub-tabs
    const subTabButtons = document.querySelectorAll('.sub-tab-button');
    const subTabPanes = document.querySelectorAll('.sub-tab-pane');
    
    subTabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const subTabId = this.getAttribute('data-subtab');
        
        // Remove active class from all buttons and panes
        subTabButtons.forEach(btn => btn.classList.remove('active'));
        subTabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        this.classList.add('active');
        
        const targetPane = document.getElementById(subTabId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
    
    // Activate first tab by default
    if (tabButtons.length > 0) {
      tabButtons[0].click();
    }
    
    // Activate first sub-tab by default
    if (subTabButtons.length > 0) {
      subTabButtons[0].click();
    }
  }
})();
