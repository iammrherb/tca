/**
 * Application Integrator for NAC Architecture Designer Pro
 * Integrates all components and provides navigation between features
 */

class AppIntegrator {
  constructor() {
    this.activeTab = 'calculator';
    this.tabs = {
      calculator: {
        title: 'Total Cost Analyzer',
        icon: 'ri-calculator-line'
      },
      industry: {
        title: 'Industry & Compliance',
        icon: 'ri-building-2-line'
      },
      wizard: {
        title: 'Solution Wizard',
        icon: 'ri-magic-line'
      },
      sensitivity: {
        title: 'Sensitivity Analysis',
        icon: 'ri-line-chart-line'
      }
    };
    
    // Initialize after DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initUI();
    });
  }
  
  /**
   * Initialize the UI
   */
  initUI() {
    console.log('Initializing App Integrator...');
    
    // Create tab navigation
    this.createTabNavigation();
    
    // Create app container and tab containers
    this.createAppContainer();
    
    // Load calculator content initially
    this.loadTabContent('calculator');
    
    // Check URL for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam && this.tabs[tabParam]) {
      this.switchTab(tabParam);
    }
    
    console.log('App Integrator initialized');
  }
  
  /**
   * Create tab navigation
   */
  createTabNavigation() {
    // Find app header or create one
    let appHeader = document.querySelector('.app-header');
    
    if (!appHeader) {
      appHeader = document.createElement('header');
      appHeader.className = 'app-header';
      
      // Set header HTML
      appHeader.innerHTML = `
        <div class="app-logo">
          <img src="img/logo.png" alt="NAC Designer Pro" onerror="this.src='img/logo-fallback.png'">
          <h1>Zero Trust NAC Architecture Designer Pro</h1>
        </div>
      `;
      
      // Insert at top of body
      document.body.insertBefore(appHeader, document.body.firstChild);
    }
    
    // Create tab navigation
    let tabNavigation = document.querySelector('.tab-navigation');
    
    if (!tabNavigation) {
      tabNavigation = document.createElement('nav');
      tabNavigation.className = 'tab-navigation';
      
      // Set tab HTML
      tabNavigation.innerHTML = `
        ${Object.keys(this.tabs).map(tab => `
          <div class="tab ${tab === this.activeTab ? 'active' : ''}" data-tab="${tab}">
            <i class="${this.tabs[tab].icon}"></i>
            <span>${this.tabs[tab].title}</span>
          </div>
        `).join('')}
      `;
      
      // Insert after header
      appHeader.after(tabNavigation);
      
      // Add event listeners
      tabNavigation.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.getAttribute('data-tab');
          this.switchTab(tabId);
        });
      });
    }
  }
  
  /**
   * Create app container and tab containers
   */
  createAppContainer() {
    // Find existing container or create new one
    let appContainer = document.querySelector('.app-container');
    
    if (!appContainer) {
      // Create container
      appContainer = document.createElement('div');
      appContainer.className = 'app-container';
      
      // Wrap existing content
      const existingContent = document.querySelector('.calculator-container') || 
                              document.querySelector('.main-content');
      
      if (existingContent) {
        // Insert container before existing content
        existingContent.parentNode.insertBefore(appContainer, existingContent);
        
        // Move existing content into the calculator tab
        const calculatorTab = document.createElement('div');
        calculatorTab.id = 'calculator-tab';
        calculatorTab.className = 'tab-content active';
        calculatorTab.appendChild(existingContent);
        
        appContainer.appendChild(calculatorTab);
      } else {
        // Insert after tab navigation
        const tabNavigation = document.querySelector('.tab-navigation');
        if (tabNavigation) {
          tabNavigation.after(appContainer);
        } else {
          document.body.appendChild(appContainer);
        }
        
        // Create empty tabs
        Object.keys(this.tabs).forEach(tab => {
          const tabContent = document.createElement('div');
          tabContent.id = `${tab}-tab`;
          tabContent.className = `tab-content ${tab === this.activeTab ? 'active' : ''}`;
          appContainer.appendChild(tabContent);
        });
      }
    } else {
      // Check if tab containers exist
      Object.keys(this.tabs).forEach(tab => {
        let tabContent = document.getElementById(`${tab}-tab`);
        
        if (!tabContent) {
          tabContent = document.createElement('div');
          tabContent.id = `${tab}-tab`;
          tabContent.className = `tab-content ${tab === this.activeTab ? 'active' : ''}`;
          appContainer.appendChild(tabContent);
        }
      });
    }
  }
  
  /**
   * Switch to a specific tab
   * @param {string} tabId - Tab ID to switch to
   */
  switchTab(tabId) {
    if (!this.tabs[tabId]) {
      console.warn(`Invalid tab: ${tabId}`);
      return;
    }
    
    // Update active tab
    this.activeTab = tabId;
    
    // Update tab elements
    document.querySelectorAll('.tab').forEach(tab => {
      const id = tab.getAttribute('data-tab');
      tab.classList.toggle('active', id === tabId);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${tabId}-tab`);
    });
    
    // Load tab content if empty
    this.loadTabContent(tabId);
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    
    // Replace URL without refreshing
    window.history.replaceState({}, '', url);
  }
  
  /**
   * Load content for a specific tab
   * @param {string} tabId - Tab ID to load content for
   */
  loadTabContent(tabId) {
    const tabContent = document.getElementById(`${tabId}-tab`);
    
    if (!tabContent) {
      console.warn(`Tab content element for ${tabId} not found`);
      return;
    }
    
    // Check if content is already loaded
    if (tabContent.querySelector('*')) {
      return;
    }
    
    console.log(`Loading content for ${tabId} tab`);
    
    // Show loading indicator
    this.showLoadingIndicator(tabContent);
    
    // Load content based on tab
    switch (tabId) {
      case 'calculator':
        this.loadCalculatorContent(tabContent);
        break;
      case 'industry':
        this.loadIndustryContent(tabContent);
        break;
      case 'wizard':
        this.loadWizardContent(tabContent);
        break;
      case 'sensitivity':
        this.loadSensitivityContent(tabContent);
        break;
    }
  }
  
  /**
   * Show loading indicator in container
   * @param {HTMLElement} container - Container to show loading in
   */
  showLoadingIndicator(container) {
    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">Loading...</div>
    `;
    
    // Clear container and add loading indicator
    container.innerHTML = '';
    container.appendChild(loadingIndicator);
  }
  
  /**
   * Load calculator content
   * @param {HTMLElement} container - Container to load content into
   */
  loadCalculatorContent(container) {
    // Check if calculator container already exists
    const calculatorContainer = document.querySelector('.calculator-container');
    
    if (calculatorContainer) {
      // Clear container and move calculator content
      container.innerHTML = '';
      container.appendChild(calculatorContainer);
      
      // Initialize calculator if needed
      if (window.calculator && typeof window.calculator.init === 'function') {
        window.calculator.init();
      }
    } else {
      // Display message that calculator content is not found
      container.innerHTML = `
        <div class="error-message">
          <h3>Calculator content not found</h3>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>
      `;
    }
  }
  
  /**
   * Load industry & compliance content
   * @param {HTMLElement} container - Container to load content into
   */
  loadIndustryContent(container) {
    // Create industry & compliance container
    const industryContainer = document.createElement('div');
    industryContainer.className = 'industry-compliance-container';
    
    // Clear container and add industry container
    container.innerHTML = '';
    container.appendChild(industryContainer);
    
    // Initialize industry & compliance manager if available
    if (window.industryComplianceManager) {
      // Trigger re-initialization
      window.industryComplianceManager.initUI();
    } else {
      // Create and initialize manager
      this.loadScript('js/features/industry-compliance/industry-compliance.js', () => {
        // After script is loaded, initialize if needed
        if (window.industryComplianceManager) {
          window.industryComplianceManager.initUI();
        }
      });
    }
  }
  
  /**
   * Load wizard content
   * @param {HTMLElement} container - Container to load content into
   */
  loadWizardContent(container) {
    // Create wizard container
    const wizardContainer = document.createElement('div');
    wizardContainer.id = 'wizard-container';
    wizardContainer.className = 'wizard-container';
    
    // Clear container and add wizard container
    container.innerHTML = '';
    container.appendChild(wizardContainer);
    
    // Initialize wizard if available
    if (window.enhancedWizard) {
      // Trigger re-initialization
      window.enhancedWizard.initUI();
    } else {
      // Create and initialize wizard
      this.loadScript('js/features/wizard/enhanced-wizard.js', () => {
        // After script is loaded, initialize if needed
        if (window.enhancedWizard) {
          window.enhancedWizard.initUI();
        }
      });
    }
  }
  
  /**
   * Load sensitivity analysis content
   * @param {HTMLElement} container - Container to load content into
   */
  loadSensitivityContent(container) {
    // Check if sensitivity.html exists and use iframe
    fetch('sensitivity.html')
      .then(response => {
        if (response.ok) {
          // Create iframe for sensitivity analysis
          const iframe = document.createElement('iframe');
          iframe.className = 'sensitivity-iframe';
          iframe.src = 'sensitivity.html';
          iframe.frameBorder = '0';
          iframe.width = '100%';
          iframe.height = '800px';
          
          // Clear container and add iframe
          container.innerHTML = '';
          container.appendChild(iframe);
        } else {
          throw new Error('Sensitivity analysis page not found');
        }
      })
      .catch(error => {
        // Create standalone sensitivity analysis content
        container.innerHTML = `
          <div class="sensitivity-container">
            <div class="section-header">
              <h2 class="section-title">Sensitivity Analysis</h2>
              <p class="section-description">
                Analyze how changing different variables affects the Total Cost of Ownership
              </p>
            </div>
            
            <div class="sensitivity-controls">
              <div class="sensitivity-parameter-section">
                <h3>Select Parameter to Analyze</h3>
                <div class="parameter-buttons">
                  <button class="parameter-button active" data-param="deviceCount">Device Count</button>
                  <button class="parameter-button" data-param="remotePercent">Remote %</button>
                  <button class="parameter-button" data-param="legacyPercent">Legacy Device %</button>
                  <button class="parameter-button" data-param="iotPercent">IoT Device %</button>
                </div>
              </div>
              
              <div class="sensitivity-range-section">
                <h3>Parameter Range</h3>
                <div class="range-controls">
                  <div class="range-control">
                    <label for="param-min">Minimum</label>
                    <input type="number" id="param-min" class="range-input" value="100">
                  </div>
                  <div class="range-control">
                    <label for="param-max">Maximum</label>
                    <input type="number" id="param-max" class="range-input" value="5000">
                  </div>
                  <div class="range-control">
                    <label for="param-step">Step</label>
                    <input type="number" id="param-step" class="range-input" value="500">
                  </div>
                </div>
              </div>
              
              <div class="sensitivity-vendor-section">
                <h3>Select Vendors to Compare</h3>
                <div class="vendor-checkboxes">
                  <label class="vendor-checkbox">
                    <input type="checkbox" checked data-vendor="portnox">
                    <span>Portnox Cloud</span>
                  </label>
                  <label class="vendor-checkbox">
                    <input type="checkbox" checked data-vendor="cisco">
                    <span>Cisco ISE</span>
                  </label>
                  <label class="vendor-checkbox">
                    <input type="checkbox" data-vendor="aruba">
                    <span>Aruba ClearPass</span>
                  </label>
                  <label class="vendor-checkbox">
                    <input type="checkbox" data-vendor="forescout">
                    <span>Forescout</span>
                  </label>
                </div>
              </div>
              
              <button id="run-analysis" class="run-analysis-btn">
                <i class="ri-play-line"></i> Run Analysis
              </button>
            </div>
            
            <div class="sensitivity-results">
              <div class="chart-container">
                <h3>Sensitivity Analysis Results</h3>
                <div class="chart-wrapper">
                  <canvas id="enhanced-sensitivity-chart"></canvas>
                </div>
              </div>
              
              <div class="insights-container">
                <h3>Analysis Insights</h3>
                <div class="insights-card">
                  <h4>Device Count Sensitivity</h4>
                  <p>As device count increases, Portnox Cloud shows a linear cost increase while traditional solutions show exponential growth due to hardware scaling requirements.</p>
                  <div class="key-insight">
                    <i class="ri-lightbulb-line"></i>
                    <div class="insight-text">
                      <strong>Key Insight:</strong> At 10,000+ devices, Portnox Cloud costs 40% less than traditional solutions, saving over $1M in 3-year TCO.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Initialize sensitivity chart if chartBuilder is available
        if (window.chartBuilder && typeof window.chartBuilder.initEnhancedSensitivityChart === 'function') {
          window.chartBuilder.initEnhancedSensitivityChart();
        }
      });
  }
  
  /**
   * Load a script dynamically
   * @param {string} src - Script source
   * @param {Function} callback - Callback function when script is loaded
   */
  loadScript(src, callback) {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      if (callback) callback();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    // Set callback
    if (callback) {
      script.onload = callback;
    }
    
    // Add to document
    document.body.appendChild(script);
  }
}

// Initialize and make it available globally
window.appIntegrator = new AppIntegrator();

console.log('App Integrator initialized and available as window.appIntegrator');
