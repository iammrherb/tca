/**
 * Enhanced Wizard for NAC Architecture Designer Pro
 * Provides a modern, interactive wizard experience for guided solution selection
 */

class EnhancedWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 5;
    this.wizardData = {
      organization: {
        size: 'medium',
        industry: 'general',
        locations: 1,
        currentSolution: 'none'
      },
      infrastructure: {
        devices: 1000,
        endpoints: 800,
        networkGear: 50,
        servers: 50,
        iot: 100,
        wired: 60,
        wireless: 40
      },
      requirements: {
        security: ['802.1x', 'mfa', 'posture'],
        compliance: [],
        operational: ['cloud', 'api', 'reporting']
      },
      preferences: {
        budget: 'medium',
        timeline: 'standard',
        management: 'cloud',
        priorities: ['cost', 'security', 'ease']
      },
      recommendations: {
        primary: 'portnox',
        alternatives: ['cisco', 'forescout'],
        reasons: []
      }
    };
    
    // Initialize UI once DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initUI();
    });
  }
  
  /**
   * Initialize the wizard UI
   */
  initUI() {
    // Find wizard container
    const wizardContainer = document.getElementById('wizard-container');
    if (!wizardContainer) {
      console.warn('Wizard container not found');
      return;
    }
    
    // Create wizard structure
    this.createWizardStructure(wizardContainer);
    
    // Set up event listeners for navigation
    this.setupEventListeners();
    
    // Initialize progress indicator
    this.updateProgressIndicator();
    
    // Initialize first step
    this.showStep(1);
    
    console.log('Wizard UI initialized');
  }
  
  /**
   * Create wizard HTML structure
   * @param {HTMLElement} container - Wizard container element
   */
  createWizardStructure(container) {
    // Set container HTML
    container.innerHTML = `
      <!-- Progress indicator -->
      <div id="wizard-progress" class="wizard-progress"></div>
      
      <!-- Step 1: Organization -->
      <div id="wizard-step-1" class="wizard-step">
        <div class="wizard-step-header">
          <h2 class="wizard-step-title">Organization Profile</h2>
          <p class="wizard-step-description">Tell us about your organization to customize the analysis</p>
        </div>
        
        <div class="wizard-step-content">
          <div class="wizard-form-grid">
            <div class="wizard-form-group">
              <label for="organization-size">Organization Size</label>
              <select id="organization-size" class="wizard-select">
                <option value="small">Small (50-250 employees)</option>
                <option value="medium" selected>Medium (251-1000 employees)</option>
                <option value="large">Large (1001-5000 employees)</option>
                <option value="enterprise">Enterprise (5000+ employees)</option>
              </select>
              <span class="wizard-form-hint">Helps determine appropriate solution scale</span>
            </div>
            
            <div class="wizard-form-group">
              <label for="organization-industry">Industry</label>
              <select id="organization-industry" class="wizard-select">
                <option value="general">General</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="education">Education</option>
                <option value="government">Government</option>
                <option value="retail">Retail</option>
              </select>
              <span class="wizard-form-hint">Used for industry-specific recommendations</span>
            </div>
            
            <div class="wizard-form-group">
              <label for="organization-locations">Number of Locations</label>
              <input type="number" id="organization-locations" class="wizard-input" value="1" min="1">
              <span class="wizard-form-hint">Physical locations requiring NAC</span>
            </div>
            
            <div class="wizard-form-group">
              <label for="current-solution">Current NAC Solution</label>
              <select id="current-solution" class="wizard-select">
                <option value="none">No NAC solution</option>
                <option value="cisco">Cisco ISE</option>
                <option value="aruba">Aruba ClearPass</option>
                <option value="forescout">Forescout</option>
                <option value="nps">Microsoft NPS</option>
                <option value="fortinac">FortiNAC</option>
                <option value="securew2">SecureW2</option>
                <option value="other">Other</option>
              </select>
              <span class="wizard-form-hint">Used for comparative analysis</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 2: Infrastructure -->
      <div id="wizard-step-2" class="wizard-step">
        <div class="wizard-step-header">
          <h2 class="wizard-step-title">Infrastructure Details</h2>
          <p class="wizard-step-description">Provide information about your network infrastructure</p>
        </div>
        
        <div class="wizard-step-content">
          <div class="wizard-form-group">
            <label for="total-devices">Total Devices</label>
            <input type="number" id="total-devices" class="wizard-input wizard-input-lg" value="1000" min="1">
            <span class="wizard-form-hint">Total number of devices connecting to the network</span>
          </div>
          
          <h3 class="wizard-section-title">Device Distribution</h3>
          <div class="wizard-form-grid">
            <div class="wizard-form-group">
              <label for="endpoints">Endpoints</label>
              <input type="number" id="endpoints" class="wizard-input" value="800" min="0">
              <span class="wizard-form-hint">Laptops, desktops, mobile devices</span>
            </div>
            
            <div class="wizard-form-group">
              <label for="network-gear">Network Equipment</label>
              <input type="number" id="network-gear" class="wizard-input" value="50" min="0">
              <span class="wizard-form-hint">Switches, routers, access points</span>
            </div>
            
            <div class="wizard-form-group">
              <label for="servers">Servers</label>
              <input type="number" id="servers" class="wizard-input" value="50" min="0">
              <span class="wizard-form-hint">Physical and virtual servers</span>
            </div>
            
            <div class="wizard-form-group">
              <label for="iot-devices">IoT Devices</label>
              <input type="number" id="iot-devices" class="wizard-input" value="100" min="0">
              <span class="wizard-form-hint">Smart devices, cameras, etc.</span>
            </div>
          </div>
          
          <h3 class="wizard-section-title">Connection Types</h3>
          <div class="wizard-form-row">
            <div class="wizard-form-group">
              <label for="wired-percent">Wired (%)</label>
              <div class="wizard-range-container">
                <input type="range" id="wired-percent" class="wizard-range" value="60" min="0" max="100" step="5">
                <span class="wizard-range-value" id="wired-value">60%</span>
              </div>
            </div>
            
            <div class="wizard-form-group">
              <label for="wireless-percent">Wireless (%)</label>
              <div class="wizard-range-container">
                <input type="range" id="wireless-percent" class="wizard-range" value="40" min="0" max="100" step="5" disabled>
                <span class="wizard-range-value" id="wireless-value">40%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Requirements -->
      <div id="wizard-step-3" class="wizard-step">
        <div class="wizard-step-header">
          <h2 class="wizard-step-title">Security Requirements</h2>
          <p class="wizard-step-description">Select the security requirements that are important to your organization</p>
        </div>
        
        <div class="wizard-step-content">
          <div class="wizard-form-row">
            <div class="wizard-form-group wizard-form-group-lg">
              <h3 class="wizard-section-title">Security Features</h3>
              <div class="wizard-checkbox-group">
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-802.1x" checked>
                  <label for="req-802.1x">802.1X Authentication</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-mfa" checked>
                  <label for="req-mfa">Multi-Factor Authentication</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-posture" checked>
                  <label for="req-posture">Device Posture Assessment</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-guest">
                  <label for="req-guest">Guest Network Access</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-byod">
                  <label for="req-byod">BYOD Support</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-iot">
                  <label for="req-iot">IoT Security</label>
                </div>
              </div>
            </div>
            
            <div class="wizard-form-group wizard-form-group-lg">
              <h3 class="wizard-section-title">Compliance Requirements</h3>
              <div class="wizard-checkbox-group">
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-hipaa">
                  <label for="req-hipaa">HIPAA</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-pci">
                  <label for="req-pci">PCI DSS</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-nist">
                  <label for="req-nist">NIST 800-53</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-iso27001">
                  <label for="req-iso27001">ISO 27001</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-gdpr">
                  <label for="req-gdpr">GDPR</label>
                </div>
                <div class="wizard-checkbox">
                  <input type="checkbox" id="req-soc2">
                  <label for="req-soc2">SOC 2</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="wizard-form-group wizard-form-group-lg">
            <h3 class="wizard-section-title">Operational Requirements</h3>
            <div class="wizard-checkbox-group wizard-checkbox-grid">
              <div class="wizard-checkbox">
                <input type="checkbox" id="req-cloud" checked>
                <label for="req-cloud">Cloud Delivery Model</label>
              </div>
              <div class="wizard-checkbox">
                <input type="checkbox" id="req-onprem">
                <label for="req-onprem">On-Premises Deployment</label>
              </div>
              <div class="wizard-checkbox">
                <input type="checkbox" id="req-hybrid">
                <label for="req-hybrid">Hybrid Deployment</label>
              </div>
              <div class="wizard-checkbox">
                <input type="checkbox" id="req-api" checked>
                <label for="req-api">API Integration</label>
              </div>
              <div class="wizard-checkbox">
                <input type="checkbox" id="req-auto">
                <label for="req-auto">Automated Remediation</label>
              </div>
              <div class="wizard-checkbox">
                <input type="checkbox" id="req-reporting" checked>
                <label for="req-reporting">Compliance Reporting</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 4: Preferences -->
      <div id="wizard-step-4" class="wizard-step">
        <div class="wizard-step-header">
          <h2 class="wizard-step-title">Implementation Preferences</h2>
          <p class="wizard-step-description">Tell us about your budget, timeline, and priorities</p>
        </div>
        
        <div class="wizard-step-content">
          <div class="wizard-form-grid">
            <div class="wizard-form-group">
              <label for="budget-preference">Budget Preference</label>
              <select id="budget-preference" class="wizard-select">
                <option value="low">Minimize upfront costs</option>
                <option value="medium" selected>Balance cost and capabilities</option>
                <option value="high">Premium features, cost secondary</option>
              </select>
            </div>
            
            <div class="wizard-form-group">
              <label for="implementation-timeline">Implementation Timeline</label>
              <select id="implementation-timeline" class="wizard-select">
                <option value="fast">Fast (1-4 weeks)</option>
                <option value="standard" selected>Standard (1-3 months)</option>
                <option value="extended">Extended (3+ months)</option>
              </select>
            </div>
            
            <div class="wizard-form-group">
              <label for="management-preference">Management Preference</label>
              <select id="management-preference" class="wizard-select">
                <option value="cloud" selected>Cloud-managed</option>
                <option value="onpremises">On-premises</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
          
          <div class="wizard-form-group wizard-form-group-lg">
            <label class="priorities-label">Top Priorities (select up to 3)</label>
            <div class="wizard-checkbox-group wizard-checkbox-grid">
              <div class="wizard-checkbox wizard-checkbox-priority">
                <input type="checkbox" id="priority-cost" checked>
                <label for="priority-cost"><i class="ri-money-dollar-circle-line"></i> Cost Savings</label>
              </div>
              <div class="wizard-checkbox wizard-checkbox-priority">
                <input type="checkbox" id="priority-security" checked>
                <label for="priority-security"><i class="ri-shield-check-line"></i> Security Capabilities</label>
              </div>
              <div class="wizard-checkbox wizard-checkbox-priority">
                <input type="checkbox" id="priority-compliance">
                <label for="priority-compliance"><i class="ri-file-list-3-line"></i> Compliance</label>
              </div>
              <div class="wizard-checkbox wizard-checkbox-priority">
                <input type="checkbox" id="priority-ease" checked>
                <label for="priority-ease"><i class="ri-install-line"></i> Ease of Deployment</label>
              </div>
              <div class="wizard-checkbox wizard-checkbox-priority">
                <input type="checkbox" id="priority-fte">
                <label for="priority-fte"><i class="ri-team-line"></i> Reduce FTE Requirements</label>
              </div>
              <div class="wizard-checkbox wizard-checkbox-priority">
                <input type="checkbox" id="priority-integration">
                <label for="priority-integration"><i class="ri-link"></i> Integration Capabilities</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 5: Recommendations -->
      <div id="wizard-step-5" class="wizard-step">
        <div class="wizard-step-header">
          <h2 class="wizard-step-title">Your Personalized Recommendation</h2>
          <p class="wizard-step-description">Based on your requirements, here is our recommendation for your NAC solution</p>
        </div>
        
        <div class="wizard-step-content">
          <div id="recommendations-container">
            <!-- Will be populated by JavaScript -->
          </div>
        </div>
      </div>
      
      <!-- Wizard navigation -->
      <div class="wizard-navigation">
        <button id="wizard-prev" class="wizard-btn wizard-btn-secondary">
          <i class="ri-arrow-left-line"></i> Previous
        </button>
        <div class="wizard-step-counter">
          Step <span id="current-step">1</span> of <span id="total-steps">5</span>
        </div>
        <button id="wizard-next" class="wizard-btn wizard-btn-primary">
          Next <i class="ri-arrow-right-line"></i>
        </button>
        <button id="wizard-submit" class="wizard-btn wizard-btn-primary wizard-btn-submit">
          Generate TCO Report <i class="ri-file-chart-line"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Set up event listeners for wizard interactions
   */
  setupEventListeners() {
    // Navigation buttons
    const nextButton = document.getElementById('wizard-next');
    const prevButton = document.getElementById('wizard-prev');
    const submitButton = document.getElementById('wizard-submit');
    
    if (nextButton) {
      nextButton.addEventListener('click', () => this.nextStep());
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', () => this.prevStep());
    }
    
    if (submitButton) {
      submitButton.addEventListener('click', () => this.submitWizard());
    }
    
    // Step 2: Infrastructure fields
    const totalDevicesInput = document.getElementById('total-devices');
    const endpointsInput = document.getElementById('endpoints');
    const networkGearInput = document.getElementById('network-gear');
    const serversInput = document.getElementById('servers');
    const iotDevicesInput = document.getElementById('iot-devices');
    
    const wiredRangeInput = document.getElementById('wired-percent');
    const wirelessRangeInput = document.getElementById('wireless-percent');
    const wiredValueSpan = document.getElementById('wired-value');
    const wirelessValueSpan = document.getElementById('wireless-value');
    
    if (totalDevicesInput) {
      totalDevicesInput.addEventListener('input', (e) => {
        const totalDevices = parseInt(e.target.value) || 0;
        
        // Auto-update device distribution
        const endpoints = Math.round(totalDevices * 0.8);
        const networkGear = Math.round(totalDevices * 0.05);
        const servers = Math.round(totalDevices * 0.05);
        const iotDevices = Math.round(totalDevices * 0.1);
        
        if (endpointsInput) endpointsInput.value = endpoints;
        if (networkGearInput) networkGearInput.value = networkGear;
        if (serversInput) serversInput.value = servers;
        if (iotDevicesInput) iotDevicesInput.value = iotDevices;
      });
    }
    
    if (wiredRangeInput) {
      wiredRangeInput.addEventListener('input', (e) => {
        const wiredValue = parseInt(e.target.value) || 0;
        const wirelessValue = 100 - wiredValue;
        
        if (wiredValueSpan) wiredValueSpan.textContent = wiredValue + '%';
        if (wirelessValueSpan) wirelessValueSpan.textContent = wirelessValue + '%';
        if (wirelessRangeInput) wirelessRangeInput.value = wirelessValue;
      });
    }
    
    // Step 4: Priority checkboxes (limit to 3)
    const priorityCheckboxes = document.querySelectorAll('.wizard-checkbox-priority input[type="checkbox"]');
    if (priorityCheckboxes) {
      priorityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const checkedCount = document.querySelectorAll('.wizard-checkbox-priority input[type="checkbox"]:checked').length;
          
          if (checkedCount > 3) {
            checkbox.checked = false;
            
            // Show warning message
            this.showNotification('Please select a maximum of 3 priorities', 'warning');
          }
        });
      });
    }
  }
  
  /**
   * Update progress indicator based on current step
   */
  updateProgressIndicator() {
    const progressContainer = document.getElementById('wizard-progress');
    if (!progressContainer) return;
    
    // Clear previous indicators
    progressContainer.innerHTML = '';
    
    // Create indicator for each step
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepIndicator = document.createElement('div');
      stepIndicator.className = `wizard-progress-step ${i < this.currentStep ? 'completed' : ''} ${i === this.currentStep ? 'active' : ''}`;
      
      const stepNumber = document.createElement('div');
      stepNumber.className = 'wizard-progress-number';
      stepNumber.textContent = i;
      
      const stepLabel = document.createElement('div');
      stepLabel.className = 'wizard-progress-label';
      stepLabel.textContent = this.getStepLabel(i);
      
      stepIndicator.appendChild(stepNumber);
      stepIndicator.appendChild(stepLabel);
      progressContainer.appendChild(stepIndicator);
      
      // Add click handler to navigate to step (only for completed steps)
      if (i < this.currentStep) {
        stepIndicator.style.cursor = 'pointer';
        stepIndicator.addEventListener('click', () => {
          this.showStep(i);
        });
      }
    }
    
    // Update step counter
    const currentStepDisplay = document.getElementById('current-step');
    if (currentStepDisplay) {
      currentStepDisplay.textContent = this.currentStep;
    }
  }
  
  /**
   * Get label for a step
   * @param {number} step - Step number
   * @returns {string} Step label
   */
  getStepLabel(step) {
    switch (step) {
      case 1: return 'Organization';
      case 2: return 'Infrastructure';
      case 3: return 'Requirements';
      case 4: return 'Preferences';
      case 5: return 'Recommendations';
      default: return `Step ${step}`;
    }
  }
  
  /**
   * Show a specific wizard step
   * @param {number} step - Step to show
   */
  showStep(step) {
    // Validate step
    if (step < 1 || step > this.totalSteps) {
      console.warn(`Invalid step: ${step}`);
      return;
    }
    
    // Update current step
    this.currentStep = step;
    
    // Update progress indicator
    this.updateProgressIndicator();
    
    // Hide all steps
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(stepElement => {
      stepElement.classList.remove('active');
    });
    
    // Show current step
    const currentStep = document.getElementById(`wizard-step-${step}`);
    if (currentStep) {
      currentStep.classList.add('active');
    }
    
    // Update navigation buttons
    const prevButton = document.getElementById('wizard-prev');
    const nextButton = document.getElementById('wizard-next');
    const submitButton = document.getElementById('wizard-submit');
    
    if (prevButton) {
      prevButton.style.display = step === 1 ? 'none' : 'block';
    }
    
    if (nextButton) {
      nextButton.style.display = step === this.totalSteps ? 'none' : 'block';
    }
    
    if (submitButton) {
      submitButton.style.display = step === this.totalSteps ? 'block' : 'none';
    }
    
    // If on recommendations step, generate recommendations
    if (step === 5) {
      this.generateRecommendations();
    }
    
    // Animate entrance
    if (typeof gsap !== 'undefined') {
      gsap.from('.wizard-step.active', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        clearProps: 'all'
      });
    }
  }
  
  /**
   * Move to next step
   */
  nextStep() {
    // Validate and save current step data
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      
      // If GSAP is available, animate transition
      if (typeof gsap !== 'undefined') {
        const currentStepElement = document.getElementById(`wizard-step-${this.currentStep}`);
        
        gsap.to(currentStepElement, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            this.showStep(this.currentStep + 1);
          }
        });
      } else {
        // Without GSAP, just show next step
        this.showStep(this.currentStep + 1);
      }
    }
  }
  
  /**
   * Move to previous step
   */
  prevStep() {
    // If GSAP is available, animate transition
    if (typeof gsap !== 'undefined') {
      const currentStepElement = document.getElementById(`wizard-step-${this.currentStep}`);
      
      gsap.to(currentStepElement, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          this.showStep(this.currentStep - 1);
        }
      });
    } else {
      // Without GSAP, just show previous step
      this.showStep(this.currentStep - 1);
    }
  }
  
  /**
   * Validate current step data
   * @returns {boolean} Whether validation passed
   */
  validateCurrentStep() {
    // Step 1: Organization
    if (this.currentStep === 1) {
      const organizationSize = document.getElementById('organization-size');
      const organizationIndustry = document.getElementById('organization-industry');
      const organizationLocations = document.getElementById('organization-locations');
      
      if (organizationLocations && (parseInt(organizationLocations.value) || 0) <= 0) {
        this.showNotification('Please enter a valid number of locations', 'error');
        organizationLocations.focus();
        return false;
      }
    }
    
    // Step 2: Infrastructure
    else if (this.currentStep === 2) {
      const totalDevices = document.getElementById('total-devices');
      
      if (totalDevices && (parseInt(totalDevices.value) || 0) <= 0) {
        this.showNotification('Please enter a valid number of devices', 'error');
        totalDevices.focus();
        return false;
      }
      
      // Validate device distribution sum
      const endpoints = parseInt(document.getElementById('endpoints').value) || 0;
      const networkGear = parseInt(document.getElementById('network-gear').value) || 0;
      const servers = parseInt(document.getElementById('servers').value) || 0;
      const iotDevices = parseInt(document.getElementById('iot-devices').value) || 0;
      
      const totalDistribution = endpoints + networkGear + servers + iotDevices;
      const totalDevicesValue = parseInt(totalDevices.value) || 0;
      
      if (totalDistribution !== totalDevicesValue) {
        this.showNotification(`Device distribution sum (${totalDistribution}) does not match total devices (${totalDevicesValue})`, 'warning');
      }
    }
    
    // Step 3: Requirements
    else if (this.currentStep === 3) {
      const securityChecked = document.querySelectorAll('#wizard-step-3 .wizard-checkbox:first-child input[type="checkbox"]:checked').length;
      
      if (securityChecked === 0) {
        this.showNotification('Please select at least one security feature', 'warning');
        return false;
      }
    }
    
    // Step 4: Preferences
    else if (this.currentStep === 4) {
      const prioritiesChecked = document.querySelectorAll('.wizard-checkbox-priority input[type="checkbox"]:checked').length;
      
      if (prioritiesChecked === 0) {
        this.showNotification('Please select at least one priority', 'warning');
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Save current step data to wizardData
   */
  saveCurrentStepData() {
    // Step 1: Organization
    if (this.currentStep === 1) {
      const organizationSize = document.getElementById('organization-size');
      const organizationIndustry = document.getElementById('organization-industry');
      const organizationLocations = document.getElementById('organization-locations').value;
      const currentSolution = document.getElementById('current-solution');
      
      this.wizardData.organization = {
        size: organizationSize ? organizationSize.value : 'medium',
        industry: organizationIndustry ? organizationIndustry.value : 'general',
        locations: organizationLocations ? (parseInt(organizationLocations.value) || 1) : 1,
        currentSolution: currentSolution ? currentSolution.value : 'none'
      };
    }
    
    // Step 2: Infrastructure
    else if (this.currentStep === 2) {
      const totalDevices = document.getElementById('total-devices');
      const endpoints = document.getElementById('endpoints');
      const networkGear = document.getElementById('network-gear');
      const servers = document.getElementById('servers');
      const iotDevices = document.getElementById('iot-devices');
      const wiredPercent = document.getElementById('wired-percent');
      
      this.wizardData.infrastructure = {
        devices: totalDevices ? (parseInt(totalDevices.value) || 1000) : 1000,
        endpoints: endpoints ? (parseInt(endpoints.value) || 800) : 800,
        networkGear: networkGear ? (parseInt(networkGear.value) || 50) : 50,
        servers: servers ? (parseInt(servers.value) || 50) : 50,
        iot: iotDevices ? (parseInt(iotDevices.value) || 100) : 100,
        wired: wiredPercent ? (parseInt(wiredPercent.value) || 60) : 60,
        wireless: wiredPercent ? (100 - (parseInt(wiredPercent.value) || 60)) : 40
      };
    }
    
    // Step 3: Requirements
    else if (this.currentStep === 3) {
      // Security features
      const securityFeatures = [];
      if (document.getElementById('req-802.1x').checked) securityFeatures.push('802.1x');
      if (document.getElementById('req-mfa').checked) securityFeatures.push('mfa');
      if (document.getElementById('req-posture').checked) securityFeatures.push('posture');
      if (document.getElementById('req-guest').checked) securityFeatures.push('guest');
      if (document.getElementById('req-byod').checked) securityFeatures.push('byod');
      if (document.getElementById('req-iot').checked) securityFeatures.push('iot');
      
      // Compliance requirements
      const complianceReqs = [];
      if (document.getElementById('req-hipaa').checked) complianceReqs.push('hipaa');
      if (document.getElementById('req-pci').checked) complianceReqs.push('pci');
      if (document.getElementById('req-nist').checked) complianceReqs.push('nist');
      if (document.getElementById('req-iso27001').checked) complianceReqs.push('iso27001');
      if (document.getElementById('req-gdpr').checked) complianceReqs.push('gdpr');
      if (document.getElementById('req-soc2').checked) complianceReqs.push('soc2');
      
      // Operational requirements
      const operationalReqs = [];
      if (document.getElementById('req-cloud').checked) operationalReqs.push('cloud');
      if (document.getElementById('req-onprem').checked) operationalReqs.push('onprem');
      if (document.getElementById('req-hybrid').checked) operationalReqs.push('hybrid');
      if (document.getElementById('req-api').checked) operationalReqs.push('api');
      if (document.getElementById('req-auto').checked) operationalReqs.push('auto');
      if (document.getElementById('req-reporting').checked) operationalReqs.push('reporting');
      
      this.wizardData.requirements = {
        security: securityFeatures,
        compliance: complianceReqs,
        operational: operationalReqs
      };
    }
    
    // Step 4: Preferences
    else if (this.currentStep === 4) {
      const budgetPreference = document.getElementById('budget-preference');
      const implementationTimeline = document.getElementById('implementation-timeline');
      const managementPreference = document.getElementById('management-preference');
      
      // Priorities
      const priorities = [];
      if (document.getElementById('priority-cost').checked) priorities.push('cost');
      if (document.getElementById('priority-security').checked) priorities.push('security');
      if (document.getElementById('priority-compliance').checked) priorities.push('compliance');
      if (document.getElementById('priority-ease').checked) priorities.push('ease');
      if (document.getElementById('priority-fte').checked) priorities.push('fte');
      if (document.getElementById('priority-integration').checked) priorities.push('integration');
      
      this.wizardData.preferences = {
        budget: budgetPreference ? budgetPreference.value : 'medium',
        timeline: implementationTimeline ? implementationTimeline.value : 'standard',
        management: managementPreference ? managementPreference.value : 'cloud',
        priorities: priorities
      };
    }
    
    console.log('Saved data for step', this.currentStep, this.wizardData);
  }
  
  /**
   * Generate recommendations based on wizard data
   */
  generateRecommendations() {
    // Find recommendations container
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;
    
    // Show loading indicator
    recommendationsContainer.innerHTML = `
      <div class="wizard-loading">
        <div class="wizard-spinner"></div>
        <div class="wizard-loading-text">Analyzing your requirements and generating recommendations...</div>
      </div>
    `;
    
    // Generate recommendations (simulate delay for effect)
    setTimeout(() => {
      this.calculateRecommendations();
      this.renderRecommendations(recommendationsContainer);
    }, 1200);
  }
  
  /**
   * Calculate recommendations based on wizard data
   */
  calculateRecommendations() {
    // Set primary recommendation to Portnox
    this.wizardData.recommendations.primary = 'portnox';
    
    // Set alternatives based on industry and requirements
    const industry = this.wizardData.organization.industry;
    const currentSolution = this.wizardData.organization.currentSolution;
    const securityFeatures = this.wizardData.requirements.security;
    const complianceReqs = this.wizardData.requirements.compliance;
    const operationalReqs = this.wizardData.requirements.operational;
    
    // Select alternatives
    let alternatives = ['cisco', 'forescout'];
    
    if (industry === 'healthcare' && complianceReqs.includes('hipaa')) {
      alternatives = ['cisco', 'forescout'];
    } else if (industry === 'finance' && complianceReqs.includes('pci')) {
      alternatives = ['cisco', 'aruba'];
    } else if (industry === 'education') {
      alternatives = ['aruba', 'securew2'];
    } else if (operationalReqs.includes('onprem') && !operationalReqs.includes('cloud')) {
      alternatives = ['cisco', 'forescout'];
    }
    
    // Always include current solution if not already in alternatives
    if (currentSolution !== 'none' && currentSolution !== 'portnox' && 
        !alternatives.includes(currentSolution) && 
        currentSolution !== 'other') {
      alternatives[1] = currentSolution;
    }
    
    this.wizardData.recommendations.alternatives = alternatives;
    
    // Calculate reasons based on wizard data
    const reasons = [];
    
    // Cost reasons
    if (this.wizardData.preferences.priorities.includes('cost')) {
      reasons.push('Cloud-native architecture reduces infrastructure costs by up to 65%');
    }
    
    // FTE reasons
    if (this.wizardData.preferences.priorities.includes('fte')) {
      reasons.push('Simplified deployment and management reduces FTE requirements by up to 75%');
    }
    
    // Compliance reasons
    if (complianceReqs.length > 0) {
      reasons.push('Built-in compliance reporting streamlines audit preparation and reduces compliance overhead');
    }
    
    // Scalability reasons
    if (this.wizardData.infrastructure.devices >= 5000) {
      reasons.push('Elastic cloud scalability supports growth without additional hardware or complex clustering');
    }
    
    // Ease of deployment reasons
    if (this.wizardData.preferences.priorities.includes('ease')) {
      reasons.push('Deploy in days instead of months with no hardware procurement or complex infrastructure setup');
    }
    
    // Security reasons
    if (this.wizardData.preferences.priorities.includes('security')) {
      reasons.push('Continuous security updates and advanced threat intelligence protect against evolving threats');
    }
    
    // Implementation timeline reasons
    if (this.wizardData.preferences.timeline === 'fast') {
      reasons.push('Rapid deployment enables time-to-value in weeks rather than months');
    }
    
    // Integration reasons
    if (this.wizardData.preferences.priorities.includes('integration')) {
      reasons.push('Rich API ecosystem and pre-built integrations with leading security tools');
    }
    
    // Remote workforce reasons
    if (this.wizardData.infrastructure.wireless >= 50) {
      reasons.push('Superior support for remote and wireless devices with no VPN dependencies');
    }
    
    // Keep only top 5 reasons (or all if less than 5)
    this.wizardData.recommendations.reasons = reasons.slice(0, 5);
    
    console.log('Generated recommendations:', this.wizardData.recommendations);
  }
  
  /**
   * Render recommendations in container
   * @param {HTMLElement} container - Container element
   */
  renderRecommendations(container) {
    // Get data
    const industry = this.wizardData.organization.industry;
    const devices = this.wizardData.infrastructure.devices;
    const currentSolution = this.wizardData.organization.currentSolution;
    const primaryRec = this.wizardData.recommendations.primary;
    const alternatives = this.wizardData.recommendations.alternatives;
    const reasons = this.wizardData.recommendations.reasons;
    
    // Calculate cost estimates
    const portnoxCost = Math.round((devices * 15) + 5000);
    const currentSolutionCost = currentSolution !== 'none' && currentSolution !== 'other' ?
      Math.round((devices * 45) + 50000) : 0;
    const savings = currentSolutionCost > 0 ? currentSolutionCost - portnoxCost : 0;
    const savingsPercent = currentSolutionCost > 0 ? Math.round((savings / currentSolutionCost) * 100) : 0;
    
    // Set HTML
    container.innerHTML = `
      <div class="recommendation-primary">
        <div class="recommendation-header">
          <div class="recommendation-badges">
            <span class="recommendation-badge primary">Best Match</span>
            <span class="recommendation-badge industry">${this.getIndustryName(industry)}</span>
          </div>
          <div class="recommendation-logo">
            <img src="img/logos/portnox-logo.png" alt="Portnox Cloud" onerror="this.src='img/logos/portnox-fallback.png'">
          </div>
        </div>
        
        <div class="recommendation-content">
          <h3 class="recommendation-title">Portnox Cloud</h3>
          <p class="recommendation-desc">Cloud-delivered NAC solution with the lowest TCO and fastest time-to-value</p>
          
          <div class="recommendation-metrics">
            <div class="metric-item">
              <div class="metric-value">${savingsPercent > 0 ? savingsPercent + '%' : 'N/A'}</div>
              <div class="metric-label">Cost Savings</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">75%</div>
              <div class="metric-label">Less FTE</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">90%</div>
              <div class="metric-label">Faster Deployment</div>
            </div>
          </div>
          
          <div class="recommendation-buttons">
            <button id="generate-tco-btn" class="wizard-btn wizard-btn-primary wizard-btn-lg">
              <i class="ri-file-chart-line"></i> Generate TCO Report
            </button>
            <button id="view-demo-btn" class="wizard-btn wizard-btn-secondary wizard-btn-lg">
              <i class="ri-movie-line"></i> View Demo
            </button>
          </div>
        </div>
      </div>
      
      <div class="recommendation-details">
        <div class="reasons-section">
          <h3 class="section-title"><i class="ri-check-double-line"></i> Key Advantages</h3>
          <ul class="reasons-list">
            ${reasons.map(reason => `<li class="reason-item">${reason}</li>`).join('')}
          </ul>
        </div>
        
        <div class="alternatives-section">
          <h3 class="section-title"><i class="ri-git-branch-line"></i> Alternative Solutions</h3>
          <div class="alternatives-grid">
            ${alternatives.map(alt => {
              const altName = this.getVendorName(alt);
              return `
                <div class="alternative-card">
                  <div class="alternative-header">
                    <div class="alternative-logo">
                      <img src="img/logos/${alt}-logo.png" alt="${altName}" onerror="this.src='img/logos/vendor-fallback.png'">
                    </div>
                    <h4 class="alternative-title">${altName}</h4>
                  </div>
                  <p class="alternative-desc">${this.getVendorDescription(alt)}</p>
                  <button class="wizard-btn wizard-btn-outline alternative-btn" data-vendor="${alt}">
                    <i class="ri-exchange-line"></i> Compare with Portnox
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    const generateTCOBtn = document.getElementById('generate-tco-btn');
    if (generateTCOBtn) {
      generateTCOBtn.addEventListener('click', () => {
        this.navigateToTCO();
      });
    }
    
    const viewDemoBtn = document.getElementById('view-demo-btn');
    if (viewDemoBtn) {
      viewDemoBtn.addEventListener('click', () => {
        this.showDemo();
      });
    }
    
    const compareButtons = document.querySelectorAll('.alternative-btn');
    compareButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const vendor = btn.getAttribute('data-vendor');
        this.compareWithVendor(vendor);
      });
    });
    
    // Animate recommendations if GSAP is available
    if (typeof gsap !== 'undefined') {
      gsap.from('.recommendation-primary', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
      
      gsap.from('.reasons-section', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out'
      });
      
      gsap.from('.alternatives-section', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out'
      });
      
      gsap.from('.reason-item', {
        x: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        delay: 0.4,
        ease: 'power1.out'
      });
      
      gsap.from('.alternative-card', {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.5,
        delay: 0.6,
        ease: 'power1.out'
      });
      
      // Animate metrics with CountUp if available
      if (typeof CountUp !== 'undefined') {
        const metricValues = document.querySelectorAll('.metric-value');
        metricValues.forEach(metric => {
          const value = metric.textContent.trim();
          if (value.endsWith('%')) {
            const percentage = parseInt(value);
            if (!isNaN(percentage)) {
              metric.textContent = '0%';
              new CountUp(metric, percentage, {
                suffix: '%',
                duration: 2.5,
                useEasing: true
              }).start();
            }
          }
        });
      }
    }
  }
  
  /**
   * Navigate to TCO calculator with wizard data
   */
  navigateToTCO() {
    // Prepare data to pass to TCO calculator
    const tcoData = {
      source: 'wizard',
      organization: this.wizardData.organization,
      infrastructure: this.wizardData.infrastructure,
      requirements: this.wizardData.requirements,
      preferences: this.wizardData.preferences
    };
    
    // Save to localStorage for TCO calculator to use
    localStorage.setItem('wizardData', JSON.stringify(tcoData));
    
    // Navigate to TCO calculator
    window.location.href = 'index.html?source=wizard';
  }
  
  /**
   * Show demo (placeholder for demo functionality)
   */
  showDemo() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3>Portnox Cloud Demo</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="demo-video">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    `;
    
    // Add to DOM
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Add event listener to close button
    const closeButton = modalContent.querySelector('.modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
      });
    }
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
    
    // Animate modal if GSAP is available
    if (typeof gsap !== 'undefined') {
      gsap.from(modalContent, {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }
  
  /**
   * Compare Portnox with another vendor
   * @param {string} vendor - Vendor to compare with
   */
  compareWithVendor(vendor) {
    console.log(`Comparing Portnox with ${vendor}`);
    
    // Create comparison data
    const comparisonData = {
      source: 'wizard',
      vendors: ['portnox', vendor],
      organization: this.wizardData.organization,
      infrastructure: this.wizardData.infrastructure
    };
    
    // Save to localStorage for calculator to use
    localStorage.setItem('comparisonData', JSON.stringify(comparisonData));
    
    // Navigate to calculator with comparison
    window.location.href = `index.html?compare=${vendor}`;
  }
  
  /**
   * Submit wizard and finalize
   */
  submitWizard() {
    // Navigate to TCO calculator with data
    this.navigateToTCO();
  }
  
  /**
   * Show notification message
   * @param {string} message - Message to show
   * @param {string} type - Notification type (info, success, warning, error)
   */
  showNotification(message, type = 'info') {
    // Check if notification container exists
    let notificationContainer = document.getElementById('wizard-notifications');
    
    // Create container if it doesn't exist
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'wizard-notifications';
      notificationContainer.className = 'wizard-notifications';
      document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notificationElement = document.createElement('div');
    notificationElement.className = `wizard-notification ${type}`;
    
    // Set icon based on type
    let icon = 'ri-information-line';
    switch (type) {
      case 'success': icon = 'ri-check-line'; break;
      case 'warning': icon = 'ri-alert-line'; break;
      case 'error': icon = 'ri-error-warning-line'; break;
    }
    
    // Set content
    notificationElement.innerHTML = `
      <i class="${icon}"></i>
      <span class="notification-message">${message}</span>
      <button class="notification-close"><i class="ri-close-line"></i></button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notificationElement);
    
    // Add event listener to close button
    const closeButton = notificationElement.querySelector('.notification-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        notificationContainer.removeChild(notificationElement);
      });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notificationContainer.contains(notificationElement)) {
        
        // Fade out with GSAP if available
        if (typeof gsap !== 'undefined') {
          gsap.to(notificationElement, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            onComplete: () => {
              if (notificationContainer.contains(notificationElement)) {
                notificationContainer.removeChild(notificationElement);
              }
            }
          });
        } else {
          // Regular DOM removal
          notificationContainer.removeChild(notificationElement);
        }
      }
    }, 5000);
    
    // Animate notification with GSAP if available
    if (typeof gsap !== 'undefined') {
      gsap.from(notificationElement, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }
  
  /**
   * Get vendor display name from ID
   * @param {string} vendorId - Vendor ID
   * @returns {string} Vendor display name
   */
  getVendorName(vendorId) {
    const vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      nps: 'Microsoft NPS',
      fortinac: 'FortiNAC',
      securew2: 'SecureW2',
      portnox: 'Portnox Cloud',
      none: 'No NAC Solution',
      other: 'Other NAC Solution'
    };
    
    return vendorNames[vendorId] || vendorId;
  }
  
  /**
   * Get vendor description
   * @param {string} vendorId - Vendor ID
   * @returns {string} Vendor description
   */
  getVendorDescription(vendorId) {
    const vendorDescriptions = {
      cisco: 'Enterprise-grade on-premises NAC solution with extensive feature set and complex deployment requirements.',
      aruba: 'Network policy management platform with strong wireless integration but higher operational complexity.',
      forescout: 'Comprehensive device visibility and control platform with advanced security capabilities and higher TCO.',
      nps: 'Basic RADIUS server with limited NAC capabilities but lower cost and simpler deployment.',
      fortinac: 'Network access control solution with strong Fortinet ecosystem integration.',
      securew2: 'Cloud-based identity and certificate management with BYOD focus.',
      portnox: 'Cloud-native NAC solution with lowest TCO and fastest time-to-value.',
      none: 'No existing NAC solution',
      other: 'Current NAC solution'
    };
    
    return vendorDescriptions[vendorId] || '';
  }
  
  /**
   * Get industry name from ID
   * @param {string} industryId - Industry ID
   * @returns {string} Industry display name
   */
  getIndustryName(industryId) {
    const industryNames = {
      general: 'General',
      healthcare: 'Healthcare',
      finance: 'Finance',
      manufacturing: 'Manufacturing',
      education: 'Education',
      government: 'Government',
      retail: 'Retail'
    };
    
    return industryNames[industryId] || industryId;
  }
}

// Initialize wizard and make it available globally
window.enhancedWizard = new EnhancedWizard();

console.log('Enhanced Wizard initialized and available as window.enhancedWizard');
